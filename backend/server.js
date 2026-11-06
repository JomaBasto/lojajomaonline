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
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ======================
// CONFIG
// ======================

dotenv.config();

const diretorioBackend = path.dirname(fileURLToPath(import.meta.url));
const mapaImagensGoogle = JSON.parse(
  readFileSync(path.join(diretorioBackend, "mapa-imagens-google.json"), "utf8")
);
const substituirImagemGoogle = (url) => mapaImagensGoogle[url] || url;

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
    const jaExisteOrdem = await Produto.exists({
      ordem: { $exists: true, $ne: null }
    });
    if (jaExisteOrdem) {
      const ultimo = await Produto.findOne({
        ordem: { $type: "number" }
      }).sort({ ordem: -1 }).select("ordem");
      produto.ordem = (ultimo?.ordem ?? -1) + 1;
    }
    await produto.save();
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
});

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await Produto.find();
    const todosOrdenados = produtos.length > 0 && produtos.every(
      p => typeof p.ordem === "number" && Number.isFinite(p.ordem)
    );
    if (todosOrdenados) {
      produtos.sort((a, b) => a.ordem - b.ordem);
    }
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

// Guardar a ordem manual dos produtos (rota antes de /produtos/:id).
app.put("/produtos/ordem", verifyToken, isAdmin, async (req, res) => {
  try {
    const { ids } = req.body;

    if (
      !Array.isArray(ids) ||
      ids.some(id => typeof id !== "string") ||
      new Set(ids).size !== ids.length
    ) {
      return res.status(400).json({ error: "Lista de produtos inválida." });
    }

    const total = await Produto.countDocuments();
    if (ids.length !== total) {
      return res.status(409).json({
        error: "A lista de produtos mudou. Atualize a página e tente novamente."
      });
    }

    const encontrados = await Produto.countDocuments({ _id: { $in: ids } });
    if (encontrados !== total) {
      return res.status(400).json({ error: "Existem produtos inválidos na lista." });
    }

    await Produto.bulkWrite(ids.map((id, ordem) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { ordem } }
      }
    })));

    res.json({ success: true });
  } catch (err) {
    console.error("Erro ao guardar ordem dos produtos:", err);
    console.error("Detalhes:", err && (err.stack || err.message || err));
    res.status(500).json({ error: "Erro ao guardar ordem dos produtos." });
  }
});
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
async function calcularCupao(items, codigoCupao) {
  const codigoIntroduzido = String(codigoCupao || "").trim().toUpperCase();

  const cupoes = [
    {
      ativo: String(process.env.CUPAO_ATIVO || "false").toLowerCase() === "true",
      codigo: String(process.env.CUPAO_CODIGO || "").trim().toUpperCase(),
      percentagem: Number(process.env.CUPAO_DESCONTO_PERCENTAGEM || 0),
    },
    {
      ativo: String(process.env.CUPAO_PRIVADO_ATIVO || "false").toLowerCase() === "true",
      codigo: String(process.env.CUPAO_PRIVADO_CODIGO || "").trim().toUpperCase(),
      percentagem: Number(process.env.CUPAO_PRIVADO_DESCONTO_PERCENTAGEM || 0),
    },
  ];

  const cupao = cupoes.find(
    (c) => c.ativo && c.codigo && c.codigo === codigoIntroduzido
  );

  if (!cupao) {
    throw new Error("Código promocional inválido ou campanha inativa.");
  }

  const percentagem = cupao.percentagem;

  if (!Number.isFinite(percentagem) || percentagem <= 0 || percentagem > 100) {
    throw new Error("A percentagem do cupão está mal configurada.");
  }

  const itemsComPrecoReal = await Promise.all(items.map(async (item) => {
    const produto = await Produto.findById(item._id);

    if (!produto) throw new Error(`Produto não encontrado: ${item._id}`);

    const precoFinal =
      produto.promoPrice != null &&
      Number(produto.promoPrice) > 0 &&
      Number(produto.promoPrice) < Number(produto.price)
        ? Number(produto.promoPrice)
        : Number(produto.price);

    const quantidade = Math.max(1, Math.floor(Number(item.qty) || 1));
    const categoria = String(produto.category || "").trim().toLowerCase();

    const cupaoElegivel =
      categoria !== "outlet" &&
      categoria !== "textil-outlet" &&
      produto.promocao !== true;

    return {
      ...item,
      price: precoFinal,
      qty: quantidade,
      promoPrice: produto.promoPrice,
      promocao: produto.promocao,
      category: produto.category,
      cupaoElegivel,
    };
  }));

  const subtotalCentimos = itemsComPrecoReal.reduce(
    (sum, item) => sum + Math.round(Number(item.price) * 100) * item.qty,
    0
  );

  const subtotalElegivelCentimos = itemsComPrecoReal
    .filter((item) => item.cupaoElegivel)
    .reduce(
      (sum, item) => sum + Math.round(Number(item.price) * 100) * item.qty,
      0
    );

  const descontoCentimos = Math.round(
    subtotalElegivelCentimos * percentagem / 100
  );

  return {
    itemsComPrecoReal,
    subtotal: subtotalCentimos / 100,
    desconto: descontoCentimos / 100,
    percentagem,
    codigoCupao: String(codigoCupao).trim(),
  };
}
// MULTIBANCO PAYMENT
// ======================

app.get("/coupon-status", (req, res) => {
  const publicoAtivo =
    String(process.env.CUPAO_ATIVO || "false").toLowerCase() === "true";

  const privadoAtivo =
    String(process.env.CUPAO_PRIVADO_ATIVO || "false").toLowerCase() === "true";

  res.json({ ativo: publicoAtivo || privadoAtivo });
});
app.post("/validate-coupon", async (req, res) => {
  try {
    const { items, codigoCupao } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrinho vazio." });
    }

    const resultado = await calcularCupao(items, codigoCupao);

    res.json({
      valido: true,
      codigoCupao: resultado.codigoCupao,
      percentagem: resultado.percentagem,
      subtotal: resultado.subtotal,
      desconto: resultado.desconto,
      totalProdutos: resultado.subtotal - resultado.desconto,
    });
  } catch (err) {
    res.status(400).json({
      valido: false,
      error: err.message || "Não foi possível validar o cupão.",
    });
  }
});
app.post("/create-multibanco-order", async (req, res) => {
  try {
    const { items, cliente, shippingCost = 0, codigoCupao } = req.body;

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

    let itemsComPrecoReal = await Promise.all(
      items.map(async (item) => {
        const produto = await Produto.findById(item._id);

        if (!produto) {
          throw new Error(`Produto não encontrado: ${item._id}`);
        }

        const precoFinal =
          produto.promoPrice != null && Number(produto.promoPrice) > 0 && Number(produto.promoPrice) < Number(produto.price)
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

    let subtotal = itemsComPrecoReal.reduce(
      (sum, item) => sum + Number(item.price) * (item.qty || 1),
      0
    );

    let desconto = 0;
    let codigoCupaoAplicado = null;

    if (codigoCupao && String(codigoCupao).trim()) {
      const resultadoCupao = await calcularCupao(items, codigoCupao);
      itemsComPrecoReal = resultadoCupao.itemsComPrecoReal;
      subtotal = resultadoCupao.subtotal;
      desconto = resultadoCupao.desconto;
      codigoCupaoAplicado = resultadoCupao.codigoCupao;
    }

    const totalFinal = subtotal - desconto + Number(shippingCost || 0);

    const encomenda = new Encomenda({
      cliente,
      items: itemsComPrecoReal,
      total: totalFinal,
      codigoCupao: codigoCupaoAplicado,
      desconto,
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
    const { items, cliente, shippingCost = 0, codigoCupao } = req.body;

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
let itemsComPrecoReal = await Promise.all(
  items.map(async (item) => {
    const produto = await Produto.findById(item._id);

    if (!produto) {
      throw new Error(`Produto nÃ£o encontrado: ${item._id}`);
    }

    const precoFinal =
      produto.promoPrice != null && Number(produto.promoPrice) > 0 && Number(produto.promoPrice) < Number(produto.price)
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

let subtotal = itemsComPrecoReal.reduce(
  (sum, item) => sum + Math.round(Number(item.price) * 100) * (Math.max(1, Math.floor(Number(item.qty) || 1))),
  0
) / 100;

let desconto = 0;
let codigoCupaoAplicado = null;
let percentagemCupao = 0;

if (codigoCupao && String(codigoCupao).trim()) {
  const resultadoCupao = await calcularCupao(items, codigoCupao);
  itemsComPrecoReal = resultadoCupao.itemsComPrecoReal;
  subtotal = resultadoCupao.subtotal;
  desconto = resultadoCupao.desconto;
  codigoCupaoAplicado = resultadoCupao.codigoCupao;
  percentagemCupao = resultadoCupao.percentagem;
}

const totalFinal = subtotal - desconto + Number(shippingCost || 0);

const encomenda = new Encomenda({
  cliente,
  items: itemsComPrecoReal,
  total: totalFinal,
  codigoCupao: codigoCupaoAplicado,
  desconto,
  estado: "Pendente",
});

await encomenda.save();

const linhasComDesconto = itemsComPrecoReal.map((item, index) => {
  const quantidade = Math.max(1, Math.floor(Number(item.qty) || 1));
  const valorCentimos = Math.round(Number(item.price) * 100) * quantidade;
  return { item, index, quantidade, valorCentimos, descontoCentimos: 0, resto: 0 };
});

if (desconto > 0 && subtotal > 0) {
  const linhasElegiveis = linhasComDesconto.filter(
    (linha) => linha.item.cupaoElegivel === true
  );

  const descontoTotalCentimos = Math.round(desconto * 100);

  const subtotalElegivelCentimos = linhasElegiveis.reduce(
    (soma, linha) => soma + linha.valorCentimos,
    0
  );

  if (subtotalElegivelCentimos > 0) {
    let descontoDistribuido = 0;

    linhasElegiveis.forEach((linha) => {
      const quota = linha.valorCentimos * descontoTotalCentimos / subtotalElegivelCentimos;
      linha.descontoCentimos = Math.floor(quota);
      linha.resto = quota - linha.descontoCentimos;
      descontoDistribuido += linha.descontoCentimos;
    });

    const ordemRestos = [...linhasElegiveis].sort(
      (a, b) => b.resto - a.resto
    );

    for (let i = 0; i < descontoTotalCentimos - descontoDistribuido; i++) {
      ordemRestos[i % ordemRestos.length].descontoCentimos++;
    }
  }
}
const lineItemsStripe = linhasComDesconto.map((linha) => ({
  price_data: {
    currency: "eur",
    product_data: {
      name: `${linha.item.name} (${linha.item.size})${desconto > 0 ? " - desconto incluido" : ""}`,
    },
    unit_amount: linha.valorCentimos - linha.descontoCentimos,
  },
  quantity: 1,
}));
// Criar sessÃ£o Stripe
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  mode: "payment",

  line_items: [
    ...lineItemsStripe,

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
app.get("/facebook-outlet.xml", async (req, res) => {
  try {
    const produtos = await Produto.find().lean();

    const escapeXml = (value = "") =>
      String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const produtosOutlet = produtos.filter((produto) => {
      const price = Number(produto.price);
      const promoPrice = Number(produto.promoPrice);

      return (
        produto.category === "outlet" &&
        Number.isFinite(price) &&
        Number.isFinite(promoPrice) &&
        price > 0 &&
        promoPrice > 0 &&
        promoPrice < price
      );
    });

    const items = produtosOutlet.map((produto) => {
      const id = produto.reference || produto._id.toString();
      const title = produto.name || "";
      const description = produto.description || "";
      const link = `https://www.jomabasto.com/produto/${produto._id}`;

      const imagensValidas = (produto.images || []).filter(
        (image) =>
          typeof image === "string" &&
          image.trim() !== "" &&
          image.trim().toLowerCase() !== "null"
      );

      const imageLink = imagensValidas[0] || "";

      const additionalImages = imagensValidas
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

      return `  <item>
    <g:id>${escapeXml(id)}</g:id>
    <g:title>${escapeXml(title)}</g:title>
    <g:description>${escapeXml(description)}</g:description>
    <g:link>${escapeXml(link)}</g:link>
    <g:image_link>${escapeXml(imageLink)}</g:image_link>
${additionalImages}
    <g:availability>${availability}</g:availability>
    <g:price>${Number(produto.price).toFixed(2)} EUR</g:price>
    <g:sale_price>${Number(produto.promoPrice).toFixed(2)} EUR</g:sale_price>
    <g:brand>Joma</g:brand>
    <g:condition>new</g:condition>
  </item>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>JomaBasto Outlet</title>
    <link>https://www.jomabasto.com</link>
    <description>Produtos Outlet JomaBasto</description>
${items.join("\n")}
  </channel>
</rss>`;

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (err) {
    console.error("Erro ao gerar feed Facebook Outlet:", err);
    res.status(500).send("Erro ao gerar feed Facebook Outlet");
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
      const imagensValidas = (produto.images || [])
        .filter(
          (image) =>
            typeof image === "string" &&
            image.trim() !== "" &&
            image.trim().toLowerCase() !== "null"
        );

      const imagemOriginal = imagensValidas[0] || "";

      const imageLinkOriginal = imagemOriginal.endsWith("_large.jpg")
        ? imagemOriginal.replace("_large.jpg", ".jpg")
        : imagemOriginal;
      const imageLink = substituirImagemGoogle(imageLinkOriginal);

      const additionalImages = imagensValidas
        .slice(1)
        .map(
          (image) =>
            `    <g:additional_image_link>${escapeXml(substituirImagemGoogle(image))}</g:additional_image_link>`
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
