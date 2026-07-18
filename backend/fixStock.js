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

      if (!produto.sizes || produto.sizes.length === 0) continue;

      let precisaCorrigir = produto.sizes.some(
        item => item.size === undefined
      );

      if (precisaCorrigir) {

        produto.sizes = produto.sizes.map(item => {

          // transforma {"0":" ","1":"4","2":"1"} em "41"
          let tamanho = "";

          for (const key of Object.keys(item.toObject ? item.toObject() : item)) {
            if (!isNaN(key)) {
              tamanho += item[key];
            }
          }

          return {
            size: tamanho.trim(),
            stock: item.stock || 0
          };
        });

        await produto.save();

        contador++;
        console.log("Corrigido:", produto.name);
      }
    }

    console.log(`✅ CORREÇÃO TERMINADA. Produtos corrigidos: ${contador}`);

    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Erro:", err);
    process.exit(1);
  });