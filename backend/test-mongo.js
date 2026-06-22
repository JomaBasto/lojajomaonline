import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./.env") });

console.log("MONGO_URL =", process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ LIGADO AO MONGO!");
    process.exit();
  })
  .catch(err => {
    console.log("❌ ERRO:");
    console.log(err);
  });