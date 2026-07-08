import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

// ======================
// 📝 REGISTO
// ======================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    res.status(201).json({
      message: "Conta criada com sucesso",
      user
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro no registo" });
  }
});

// ======================
// 🔐 LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User não encontrado" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Password errada" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login OK",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro no login" });
  }
});

// ======================
// 🔁 FORGOT PASSWORD
// ======================
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "Se existir, receberás email" });
  }

  const token = crypto.randomBytes(20).toString("hex");

  user.resetToken = token;
  user.resetTokenExp = Date.now() + 1000 * 60 * 15;

  await user.save();

  res.json({ message: "Email enviado" });
});

// ======================
// EXPORT
// ======================
export default router;