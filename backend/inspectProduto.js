import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Produto from "./models/Produto.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

  const produto = await Produto.findOne({
    name: "TR-6 2617 PETRÓLEO"
  }).lean();

  console.log(JSON.stringify(produto, null, 2));

  process.exit();

})
.catch(err => {
  console.error(err);
  process.exit(1);
});