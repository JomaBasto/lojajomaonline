console.log("ðŸ”¥ SERVER.JS A FUNCIONAR");

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
  .then(() => console.log("âœ… MongoDB ligado com sucesso"))
  .catch((err) => console.log("âŒ ERRO MONGO:", err));

mongoose.connection.on("error", (err) => {
  console.log("ðŸ”¥ Mongoose error:", err);
});

// ======================
// ADMIN AUTOMÃTICO
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

      console.log("ðŸ‘¤ Admin criado");
    }
  } catch (err) {
    console.log("âŒ erro admin:", err);
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

app.get("/promocao", async (req, res) => {
  try {

    const produtos = await Produto.find({
      promocao: true
    }).limit(6);


    if (!produtos || produtos.length === 0) {
      return res.status(404).json({
        error: "Nenhum produto em promoÃ§Ã£o"
      });
    }


    res.json(produtos);


  } catch (err) {

    res.status(500).json({
      error: "Erro ao buscar promoÃ§Ãµes"
    });

  }
});

// EDITAR PRODUTO
app.put("/produtos/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    console.log("DADOS RECEBIDOS:", req.body);
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!produto) {
      return res.status(404).json({ error: "Produto nÃ£o encontrado" });
    }

    res.json(produto);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

app.put("/promocao/:id", verifyToken, isAdmin, async (req, res) => {
  try {

    const produtoAtual = await Produto.findById(req.params.id);

    if (!produtoAtual) {
      return res.status(404).json({
        error: "Produto nÃ£o encontrado"
      });
    }


    // Se jÃ¡ estÃ¡ em promoÃ§Ã£o, retirar
    if (produtoAtual.promocao === true) {

      produtoAtual.promocao = false;
      await produtoAtual.save();

      return res.json(produtoAtual);

    }


    // Ver quantos produtos jÃ¡ estÃ£o em promoÃ§Ã£o
    const totalPromocoes = await Produto.countDocuments({
      promocao: true
    });


    // Limite mÃ¡ximo de 6
    if (totalPromocoes >= 6) {

      return res.status(400).json({
        error: "JÃ¡ existem 6 produtos em promoÃ§Ã£o"
      });

    }


    // Adicionar novo produto Ã  promoÃ§Ã£o
    produtoAtual.promocao = true;
    await produtoAtual.save();


    res.json(produtoAtual);


  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Erro ao atualizar promoÃ§Ã£o"
    });

  }
});

// APAGAR PRODUTO
app.delete("/produtos/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);

    if (!produto) {
      return res.status(404).json({ error: "Produto nÃ£o encontrado" });
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
// MINHAS ENCOMENDAS (CLIENTE)
// ======================

app.get("/my-orders", verifyToken, async (req, res) => {
  try {
    const email = req.user.email;

    const encomendas = await Encomenda.find({
      "cliente.email": email,
    }).sort({ createdAt: -1 });

    res.json(encomendas);

  } catch (err) {
    console.error("Erro ao buscar encomendas:", err);

    res.status(500).json({
      error: "Erro ao buscar encomendas",
    });
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

// ======================
// MULTIBANCO PAYMENT
// ======================

app.post("/create-multibanco-order", async (req, res) => {
  try {
    const { items, cliente, shippingCost = 0 } = req.body;

    console.log("MULTIBANCO BODY:", JSON.stringify(req.body));
    console.log("MULTIBANCO ENTIDADE:", process.env.MULTIBANCO_ENTIDADE);
    console.log("MULTIBANCO REFERENCIA:", process.env.MULTIBANCO_REFERENCIA);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }

    if (!cliente) {
      return res.status(400).json({ error: "Dados do cliente em falta." });
    }

    console.log("MULTIBANCO: a validar produtos...");

    const itemsComPrecoReal = await Promise.all(
      items.map(async (item) => {
        const produto = await Produto.findById(item._id);

        if (!produto) {
          throw new Error(`Produto não encontrado: ${item._id}`);
        }

        const precoFinal =
          produto.promocao && produto.promoPrice
            ? Number(produto.promoPrice)
            : Number(produto.price);

        return {
          ...item,
          price: precoFinal,
          promoPrice: produto.promoPrice,
          promocao: produto.promocao,
        };
      })
    );

    const subtotal = itemsComPrecoReal.reduce(
      (sum, item) => sum + Number(item.price) * (item.qty || 1),
      0
    );

    const totalFinal = subtotal + Number(shippingCost || 0);

    const encomenda = new Encomenda({
      cliente,
      items: itemsComPrecoReal,
      total: totalFinal,
      estado: "Pendente",
      metodoPagamento: "multibanco",
    });

    await encomenda.save();

    console.log("MULTIBANCO: a enviar email para a loja...");

    await sendAdminEmail(encomenda);

    console.log("MULTIBANCO: email enviado.");

    res.json({
      success: true,
      orderId: encomenda._id.toString(),
      entidade: process.env.MULTIBANCO_ENTIDADE,
      referencia: process.env.MULTIBANCO_REFERENCIA,
      valor: totalFinal.toFixed(2),
    });

  } catch (err) {
    console.error("❌ Erro Multibanco:", err);

    res.status(500).json({
      error: err.message || "Erro ao criar encomenda Multibanco",
    });
  }
});

// STRIPE PAYMENT
// ======================

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items, cliente, shippingCost = 0 } = req.body;

    console.log("MULTIBANCO BODY:", JSON.stringify(req.body));
    console.log("MULTIBANCO ENTIDADE:", process.env.MULTIBANCO_ENTIDADE);
    console.log("MULTIBANCO REFERENCIA:", process.env.MULTIBANCO_REFERENCIA);

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }

    if (!cliente) {
      return res.status(400).json({ error: "Dados do cliente em falta." });
    }

    // Guardar a encomenda na MongoDB
const itemsComPrecoReal = await Promise.all(
  items.map(async (item) => {
    const produto = await Produto.findById(item._id);

    if (!produto) {
      throw new Error(`Produto nÃ£o encontrado: ${item._id}`);
    }

    const precoFinal =
      produto.promocao && produto.promoPrice
        ? Number(produto.promoPrice)
        : Number(produto.price);

    return {
      ...item,
      price: precoFinal,
      promoPrice: produto.promoPrice,
      promocao: produto.promocao,
    };
  })
);

const subtotal = itemsComPrecoReal.reduce(
  (sum, item) => sum + Number(item.price) * (item.qty || 1),
  0
);

const encomenda = new Encomenda({
  cliente,
  items: itemsComPrecoReal,
  total: subtotal + shippingCost,
  estado: "Pendente",
});

await encomenda.save();

// Criar sessÃ£o Stripe
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
      unit_amount: Math.round(
  (item.promocao && item.promoPrice ? item.promoPrice : item.price) * 100
),
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

    // Guardar o ID da sessÃ£o Stripe
    encomenda.stripeSessionId = session.id;
    await encomenda.save();

    res.json({
      url: session.url,
    });

  } catch (err) {
    console.log("âŒ Stripe error:", err);
    res.status(500).json({
      error: "Erro ao criar sessÃ£o Stripe",
    });
  }
});

// ======================
// TESTE API
// ======================

app.get("/produto/:id", async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).send("Produto nÃ£o encontrado");
    }

    const titulo = produto.name || "Produto JomaBasto";
    const descricao = produto.description || `Produto JomaBasto por ${produto.price} â‚¬`;
    const imagem = produto.images?.[0] || "https://www.jomabasto.com/jomabasto.png";
    const url = `https://www.jomabasto.com/produto/${produto._id}`;

    res.send(`<!doctype html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <title>${titulo} | JomaBasto Store</title>
  <meta property="og:title" content="${titulo}">
  <meta property="og:description" content="${descricao.replace(/"/g, "&quot;")}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${imagem}">
  <meta property="og:site_name" content="JomaBasto Store">
  <meta property="og:locale" content="pt_PT">
  <meta property="product:price:amount" content="${produto.promoPrice || produto.price}">
  <meta property="product:price:currency" content="EUR">
  <meta http-equiv="refresh" content="0;url=${url}">
</head>
<body>
  <p>A abrir ${titulo}...</p>
</body>
</html>`);
  } catch (err) {
    console.error("ERRO OG PRODUTO:", err);
    res.status(500).send("Erro ao carregar produto");
  }
});
app.get("/google-shopping.xml", async (req, res) => {
  try {
    const produtos = await Produto.find().lean();

    const escapeXml = (value = "") =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const items = produtos.map((produto) => {
      const id = produto.reference || produto._id.toString();
      const title = produto.name || "";
      const description = produto.description || "";
      const link = `https://www.jomabasto.com/produto/${produto._id}`;
      const imageLink = produto.images?.[0] || "";

      const additionalImages = (produto.images || [])
        .slice(1)
        .map(
          (image) =>
            `    <g:additional_image_link>${escapeXml(image)}</g:additional_image_link>`
        )
        .join("\n");

      const temTamanhos =
        Array.isArray(produto.sizes) && produto.sizes.length > 0;

      const availability = temTamanhos
        ? "in_stock"
        : "out_of_stock";

      const temPromocao =
        typeof produto.promoPrice === "number" &&
        produto.promoPrice > 0 &&
        produto.promoPrice < produto.price;

      const salePrice = temPromocao
        ? `    <g:sale_price>${produto.promoPrice.toFixed(2)} EUR</g:sale_price>`
        : "";

      return `  <item>
    <g:id>${escapeXml(id)}</g:id>
    <g:title>${escapeXml(title)}</g:title>
    <g:description>${escapeXml(description)}</g:description>
    <g:link>${escapeXml(link)}</g:link>
    <g:image_link>${escapeXml(imageLink)}</g:image_link>
${additionalImages}
    <g:availability>${availability}</g:availability>
    <g:price>${Number(produto.price || 0).toFixed(2)} EUR</g:price>
${salePrice}
    <g:brand>Joma</g:brand>
    <g:condition>new</g:condition>
  </item>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>JomaBasto</title>
    <link>https://www.jomabasto.com</link>
    <description>Produtos JomaBasto</description>
${items.join("\n")}
  </channel>
</rss>`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (err) {
    console.error("Erro ao gerar feed Google Shopping:", err);
    res.status(500).send("Erro ao gerar feed Google Shopping");
  }
});


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
      console.log("âŒ Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {

      const session = event.data.object;

      console.log("âœ… Pagamento confirmado:", session.id);

      const encomenda = await Encomenda.findOne({
        stripeSessionId: session.id,
      });

      if (!encomenda) {
        console.log("âŒ Encomenda nÃ£o encontrada");
        return res.json({ received: true });
      }

      encomenda.estado = "Paga";

      await encomenda.save();

      console.log("âœ… Encomenda atualizada para Paga");

      try {

        if (encomenda.cliente?.email) {

          console.log("EMAIL DO CLIENTE:", encomenda.cliente.email);

          await sendCustomerEmail(encomenda);

          console.log("âœ… Email enviado ao cliente");
        }

        console.log("MULTIBANCO: a enviar email para a loja...");

    await sendAdminEmail(encomenda);

    console.log("MULTIBANCO: email enviado.");

        console.log("âœ… Email enviado para a loja");

        console.log("âœ… Emails enviados");

      } catch (err) {

        console.log("âŒ Erro ao enviar emails:", err);

      }
    }

    res.json({ received: true });

  }
);

app.listen(PORT, () => {
  console.log("ðŸš€ Servidor a correr na porta", PORT);
});


