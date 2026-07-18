import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Produto from "./models/Produto.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

  const categorias = await Produto.aggregate([
    {
      $group: {
        _id: "$category",
        total: { $sum: 1 }
      }
    },
    {
      $sort: { total: -1 }
    }
  ]);

  console.log(categorias);

  process.exit();

})
.catch(err => {
  console.error(err);
  process.exit(1);
});