import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = express.Router();

// ======================
// ?? REGISTER
// ======================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      telefone,
      morada,
      codigoPostal,
      localidade,
      nif
    } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User já existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      telefone,
      morada,
      codigoPostal,
      localidade,
      nif,
      role: "user"
    });

    console.log("REGISTER OK");

    return res.status(201).json({
      message: "Conta criada com sucesso"
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro no registo" });
  }
});

// ======================
// ?? FORGOT PASSWORD
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
