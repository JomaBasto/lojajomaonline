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

    codigoCupao: { type: String, default: null },
    desconto: { type: Number, default: 0 },

    estado: {
      type: String,
      default: "Pendente",
    },

    stripeSessionId: String,

    metodoPagamento: {
      type: String,
      default: "stripe",
    },

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
