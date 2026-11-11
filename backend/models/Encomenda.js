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
        produtoId: { type: mongoose.Schema.Types.ObjectId, ref: "Produto", default: null },
      },
    ],

    total: Number,

    codigoCupao: { type: String, default: null },
    desconto: { type: Number, default: 0 },

    estado: {
      type: String,
      default: "Pendente",
    },

    estadoEnvio: {
      type: String,
      enum: ["Em preparação", "Enviada", "Entregue"],
      default: "Em preparação",
    },
    transportadora: { type: String, default: "" },
    codigoSeguimento: { type: String, default: "" },
    linkSeguimento: { type: String, default: "" },
    reviewInviteStatus: {
      type: String,
      enum: ["nao_enviado", "a_enviar", "enviado", "falhou"],
      default: "nao_enviado",
    },
    reviewInviteTokenHash: { type: String, select: false },
    reviewInviteExpiresAt: Date,
    reviewInviteSentAt: Date,
    reviewInviteSendingAt: Date,
    reviewInviteError: String,
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
