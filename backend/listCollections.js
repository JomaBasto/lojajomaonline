import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(async () => {

  const collections = await mongoose.connection.db.listCollections().toArray();

  console.log(collections.map(c => c.name));

  process.exit();

})
.catch(err => {
  console.error(err);
  process.exit(1);
});