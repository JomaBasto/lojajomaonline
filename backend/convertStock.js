import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Produto from "./models/Produto.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB ligado");

    const produtos = await Produto.find();

    let contador = 0;

    for (const produto of produtos) {
      if (
        produto.sizes &&
        produto.sizes.length > 0 &&
        typeof produto.sizes[0] === "string"
      ) {
        produto.sizes = produto.sizes.map((size) => ({
          size: size.trim(),
          stock: 0,
        }));

        await produto.save();

        contador++;
        console.log("Convertido:", produto.name);
      }
    }

    console.log(`✅ CONVERSÃO TERMINADA. Produtos convertidos: ${contador}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro Mongo:", err);
    process.exit(1);
  });

mongoose
  .connect(process.env.MONGO_URL)
  .then(async () => {
    console.log("✅ MongoDB ligado");

    const produtos = await Produto.find();

    let contador = 0;

    for (const produto of produtos) {
      if (
        produto.sizes &&
        produto.sizes.length > 0 &&
        typeof produto.sizes[0] === "string"
      ) {
        produto.sizes = produto.sizes.map((size) => ({
          size: size.trim(),
          stock: 0,
        }));

        await produto.save();

        contador++;
        console.log("Convertido:", produto.name);
      }
    }

    console.log(`✅ CONVERSÃO TERMINADA. Produtos convertidos: ${contador}`);

    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erro Mongo:", err);
    process.exit(1);
  });