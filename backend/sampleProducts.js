import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Produto from "./models/Produto.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

  const produtos = await Produto.find({
    category: {
      $in: [
        "homem-running",
        "homem-casual",
        "acessorios-meias",
        "crianca-running"
      ]
    }
  })
  .select("name reference category")
  .limit(20)
  .lean();

  console.log(JSON.stringify(produtos, null, 2));

  process.exit();

})
.catch(err => {
  console.error(err);
  process.exit(1);
});