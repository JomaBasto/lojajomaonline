console.log("🔥 ESTE É O SERVER.JS CERTO");
import authRoutes from "./routes/auth.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";
import Produto from "./models/Produto.js";
import User from "./models/User.js";

// ======================
// CONFIG
// ======================

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

console.log("MONGO_URL FINAL:", process.env.MONGO_URL);

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5174",
    "http://localhost:3000",
    "https://www.jomabasto.com"
  ]
}));

app.use(express.json());
// ======================
// MONGODB
// ======================

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB ligado com sucesso"))
  .catch((err) => console.log("❌ ERRO MONGO:", err));

mongoose.connection.on("error", (err) => {
  console.log("🔥 Mongoose connection error:", err);
});

mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected event fired");
});

import bcrypt from "bcrypt";

mongoose.connection.once("open", async () => {
  try {
    const exists = await User.findOne({ email: "admin@jomabasto.pt" });

    if (exists) {
      console.log("👤 Admin já existe");
      return;
    }

    const hashedPassword = await bcrypt.hash("1234", 10);

    await User.create({
  name: "Administrador",
  email: "admin@jomabasto.pt",
  password: hashedPassword,
  role: "admin"
});

    console.log("👤 Admin criado com password encriptada");
  } catch (err) {
    console.log("❌ erro ao criar admin:", err);
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

const Encomenda = mongoose.model("Encomenda", {
  items: Array,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

// ======================
// CLIENTES
// ======================

app.post("/clientes", async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.json(cliente);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

app.get("/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar clientes" });
  }
});

// ======================
// PRODUTOS
// ======================

// ➕ criar produto
app.post("/produtos", async (req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.save();

    console.log("📦 Produto criado:", produto);

    res.status(201).json(produto);
  } catch (err) {
    console.log("❌ ERRO AO CRIAR PRODUTO:", err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

// 📥 listar produtos
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await Produto.find();

    res.json(produtos);
  } catch (err) {
    console.log("❌ ERRO AO BUSCAR PRODUTOS:", err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
});

// 🗑️ apagar produto
app.delete("/produtos/:id", async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);

    res.json({ ok: true });
  } catch (err) {
    console.log("❌ ERRO AO APAGAR PRODUTO:", err);
    res.status(500).json({ error: "Erro ao apagar produto" });
  }
});

// ✏️ editar produto
app.put("/produtos/:id", async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(produto);
  } catch (err) {
    console.log("❌ ERRO AO EDITAR PRODUTO:", err);
    res.status(500).json({ error: "Erro ao editar produto" });
  }
});

// ======================
// ENCOMENDAS
// ======================

// ➕ criar encomenda (checkout)
app.post("/encomendas", async (req, res) => {
  try {
    const { items, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio" });
    }

    // 🔥 TEMPORÁRIO (sem Stripe)
    const encomenda = {
      items,
      total,
      status: "pendente"
    };

    res.json({
      message: "Encomenda criada sem Stripe (modo debug)",
      encomenda
    });

  } catch (err) {
    console.log("❌ ERRO ENCOMENDA:", err);
    res.status(500).json({ error: "Erro no checkout" });
  }
});
// 🔥 TESTE SIMPLES DA API
app.get("/", (req, res) => {
  res.send("API OK");
});
// ======================
// START SERVER
// ======================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});