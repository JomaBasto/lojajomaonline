import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,

  email: String,
  password: String,

  telefone: String,
  morada: String,
  codigoPostal: String,
  localidade: String,
  nif: String,

  role: {
    type: String,
    default: "user"
  },

  resetToken: String,
  resetTokenExp: Date,
});

export default mongoose.model("User", userSchema);
