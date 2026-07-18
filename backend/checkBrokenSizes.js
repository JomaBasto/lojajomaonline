import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Produto from "./models/Produto.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

  const produtos = await Produto.find()
    .select("name category sizes")
    .limit(20)
    .lean();

  for (const p of produtos) {

    console.log("\n----------------");
    console.log(p.name);
    console.log("Categoria:", p.category);
    console.log("Sizes:", p.sizes);

  }

  process.exit();

})
.catch(err => {
  console.error(err);
  process.exit(1);
});