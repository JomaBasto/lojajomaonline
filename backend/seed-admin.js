import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URL);

const exists = await User.findOne({ email: "admin@jomabasto.pt" });

if (!exists) {
  const hashedPassword = await bcrypt.hash("1234", 10);

  await User.create({
    name: "Admin",
    email: "admin@jomabasto.pt",
    password: hashedPassword,
    role: "admin"
  });

  console.log("✅ ADMIN CRIADO");
} else {
  console.log("⚠️ ADMIN JÁ EXISTE");
}

process.exit();