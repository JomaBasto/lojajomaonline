import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

  const db = mongoose.connection.db;

  const produto = await db.collection("produtos").findOne({
    name: "TR-6 2617 PETRÓLEO"
  });

  console.log(JSON.stringify(produto, null, 2));

  await mongoose.disconnect();
  process.exit();

})
.catch(err => {
  console.error(err);
  process.exit(1);
});