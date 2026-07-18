import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Produto from "./models/Produto.js";
import fs from "fs";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

  console.log("MongoDB ligado");

  const produtos = await Produto.find().lean();

  fs.writeFileSync(
    "produtos_backup_atual.json",
    JSON.stringify(produtos, null, 2)
  );

  console.log(
    "Backup criado:",
    produtos.length,
    "produtos"
  );

  await mongoose.disconnect();
  process.exit();

})
.catch(err => {
  console.error("Erro Mongo:", err);
  process.exit(1);
});