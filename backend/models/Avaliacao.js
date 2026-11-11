import mongoose from "mongoose";

const avaliacaoSchema = new mongoose.Schema(
  {
    produtoId: { type: mongoose.Schema.Types.ObjectId, ref: "Produto", required: true },
    encomendaId: { type: mongoose.Schema.Types.ObjectId, ref: "Encomenda", required: true },
    classificacao: { type: Number, required: true, min: 1, max: 5 },
    comentario: { type: String, trim: true, maxlength: 2000, default: "" },
    compraVerificada: { type: Boolean, default: true },
    estado: { type: String, enum: ["Pendente", "Aprovada", "Rejeitada"], default: "Pendente" },
  },
  { collection: "avaliacoes", timestamps: true }
);

avaliacaoSchema.index({ encomendaId: 1, produtoId: 1 }, { unique: true });

export default mongoose.model("Avaliacao", avaliacaoSchema);