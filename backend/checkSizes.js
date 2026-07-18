import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Produto from "./models/Produto.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {
  const produtos = await Produto.find().limit(5);

  for (const produto of produtos) {
    console.log("PRODUTO:", produto.name);
    console.log("SIZES:", JSON.stringify(produto.sizes, null, 2));
    console.log("----------------------");
  }

  process.exit();
})
.catch(err => {
  console.error(err);
  process.exit(1);
});