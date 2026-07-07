import mongoose from "mongoose";

const EncomendaSchema = new mongoose.Schema(
  {
    cliente: {
      nome: String,
      email: String,
      telefone: String,
      morada: String,
      codigoPostal: String,
      localidade: String,
      nif: String,
      observacoes: String,
    },

    items: [
      {
        name: String,
        size: String,
        qty: Number,
        price: Number,
        image: String,
      },
    ],

    total: Number,

    estado: {
      type: String,
      default: "Pendente",
    },

    stripeSessionId: String,

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "encomendas",
  }
);

export default mongoose.model("Encomenda", EncomendaSchema);