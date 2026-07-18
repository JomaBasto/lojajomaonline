console.log("🔥 SERVER.JS A FUNCIONAR");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

import authRoutes from "./routes/auth.js";
import {
  sendTestEmail,
  sendCustomerEmail,
  sendAdminEmail,
} from "./services/emailService.js";
import Produto from "./models/Produto.js";
import User from "./models/User.js";
import Encomenda from "./models/Encomenda.js";
import { verifyToken, isAdmin } from "./middleware/auth.js";
import bcrypt from "bcryptjs";

// ======================
// CONFIG
// ======================

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

dns.setServers(["8.8.8.8", "8.8.4.4"]);

console.log("MONGO_URL FINAL:", process.env.MONGO_URL);

const app = express();

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

// ======================
// CORS
// ======================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://lojajomaonline-frontend.vercel.app",
  "https://www.jomabasto.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

app.use("/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/auth", authRoutes);

// ======================
// MONGODB
// ======================

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB ligado com sucesso"))
  .catch((err) => console.log("❌ ERRO MONGO:", err));

mongoose.connection.on("error", (err) => {
  console.log("🔥 Mongoose error:", err);
});

// ======================
// ADMIN AUTOMÁTICO
// ======================

mongoose.connection.once("open", async () => {
  try {
    const exists = await User.findOne({ email: "admin@jomabasto.pt" });

    if (!exists) {
      const hashedPassword = await bcrypt.hash("1234", 10);

      await User.create({
        name: "Administrador",
        email: "admin@jomabasto.pt",
        password: hashedPassword,
        role: "admin"
      });

      console.log("👤 Admin criado");
    }
  } catch (err) {
    console.log("❌ erro admin:", err);
  }
});

// ======================
// MODELS
// ======================

const Cliente = mongoose.model("Cliente", {
  nome: String,
  morada: String,
  telemovel: String,
  nif: String,
});

// ======================
// PRODUTOS
// ======================

app.post("/produtos", verifyToken, isAdmin, async (req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.save();
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// EDITAR PRODUTO
app.put("/produtos/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(produto);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// APAGAR PRODUTO
app.delete("/produtos/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto apagado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao apagar produto" });
  }
});

// ======================
// ENCOMENDAS (GUARDAR)
// ======================

app.post("/encomendas", async (req, res) => {
  try {
    const { items, total } = req.body;

    const encomenda = new Encomenda({
      items,
      total,
      status: "pendente"
    });

    await encomenda.save();

    res.json(encomenda);
  } catch (err) {
    res.status(500).json({ error: "Erro encomenda" });
  }
});

// ======================
// LISTAR ENCOMENDAS
// ======================

app.get("/encomendas", async (req, res) => {
  try {
    const encomendas = await Encomenda.find().sort({ createdAt: -1 });

    res.json(encomendas);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Erro ao obter encomendas",
    });
  }
});

app.put("/encomendas/:id", async (req, res) => {
  try {
    const { estado } = req.body;

    const encomenda = await Encomenda.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );

    res.json(encomenda);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Erro ao atualizar encomenda",
    });
  }
});

// ======================
// STRIPE PAYMENT
// ======================

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, cliente, shippingCost = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }

    if (!cliente) {
      return res.status(400).json({ error: "Dados do cliente em falta." });
    }

    // Guardar a encomenda na MongoDB
const subtotal = items.reduce(
  (sum, item) => sum + item.price * (item.qty || 1),
  0
);

const encomenda = new Encomenda({
  cliente,
  items,
  total: subtotal + shippingCost,
  estado: "Pendente",
});

await encomenda.save();

// Criar sessão Stripe
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",

  line_items: [
  ...items.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: `${item.name} (${item.size})`,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty || 1,
  })),

  ...(shippingCost > 0
    ? [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Portes de envio",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      }]
    : []),
],

  success_url: "https://www.jomabasto.com/sucesso",
cancel_url: "https://www.jomabasto.com/checkout",

  metadata: {
    encomendaId: encomenda._id.toString(),
  },
});

    // Guardar o ID da sessão Stripe
    encomenda.stripeSessionId = session.id;
    await encomenda.save();

    res.json({
      url: session.url,
    });

  } catch (err) {
    console.log("❌ Stripe error:", err);
    res.status(500).json({
      error: "Erro ao criar sessão Stripe",
    });
  }
});

// ======================
// TESTE API
// ======================

app.get("/", (req, res) => {
  res.send("API OK");
});

app.get("/teste-email", async (req, res) => {
  await sendTestEmail();

  res.send("Email enviado!");
});

// ======================
// START SERVER
// ======================

const PORT = process.env.PORT || 3001;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {

    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log("❌ Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {

      const session = event.data.object;

      console.log("✅ Pagamento confirmado:", session.id);

      const encomenda = await Encomenda.findOne({
        stripeSessionId: session.id,
      });

      if (!encomenda) {
        console.log("❌ Encomenda não encontrada");
        return res.json({ received: true });
      }

      encomenda.estado = "Paga";

      await encomenda.save();

      console.log("✅ Encomenda atualizada para Paga");

      try {

        if (encomenda.cliente?.email) {

          console.log("EMAIL DO CLIENTE:", encomenda.cliente.email);

          await sendCustomerEmail(encomenda);

          console.log("✅ Email enviado ao cliente");
        }

        await sendAdminEmail(encomenda);

        console.log("✅ Email enviado para a loja");

        console.log("✅ Emails enviados");

      } catch (err) {

        console.log("❌ Erro ao enviar emails:", err);

      }
    }

    res.json({ received: true });

  }
);

app.listen(PORT, () => {
  console.log("🚀 Servidor a correr na porta", PORT);
});