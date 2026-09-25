import jwt from "jsonwebtoken";
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
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
      return res.status(400).json({ message: "User jÃ¡ existe" });
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
    return res.json({ message: "Se existir, receberÃ¡s email" });
  }

  const token = crypto.randomBytes(20).toString("hex");

  user.resetToken = token;
  user.resetTokenExp = Date.now() + 1000 * 60 * 15;

  await user.save();

  const resetUrl = `https://jomabasto.pt/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Recuperação da palavra-passe — JomaBasto",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
          <h2>Recuperar palavra-passe</h2>
          <p>Recebemos um pedido para alterar a palavra-passe da sua conta JomaBasto.</p>
          <p>Para definir uma nova palavra-passe, clique no botão abaixo:</p>
          <p><a href="${resetUrl}" style="display:inline-block; padding:14px 22px; background:#111; color:#fff; text-decoration:none; border-radius:4px;">ALTERAR PALAVRA-PASSE</a></p>
          <p style="color:#666; font-size:13px;">Este link é válido durante 15 minutos.</p>
          <p style="color:#666; font-size:13px;">Se não solicitou esta alteração, pode ignorar este email.</p>
        </div>
      `
    });

    return res.json({ message: "Email enviado" });
  } catch (err) {
    console.log("ERRO RESEND:", err);
    return res.status(500).json({ message: "Não foi possível enviar o email" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token e palavra-passe são obrigatórios" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExp = undefined;

    await user.save();

    return res.json({ message: "Palavra-passe alterada com sucesso" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Erro ao alterar a palavra-passe" });
  }
});

// ======================
// EXPORT
// ======================
export default router;
