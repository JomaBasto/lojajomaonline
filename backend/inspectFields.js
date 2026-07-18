import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import Produto from "./models/Produto.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async()=>{

const p = await Produto.findOne({
  name:"TR-6 2617 PETRÓLEO"
}).lean();

console.log(Object.keys(p));

console.log(JSON.stringify(p,null,2));

process.exit();

});