import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema({
  name: String,
  reference: String,

  // Preço normal
  price: Number,

  // Preço promocional (opcional)
  promoPrice: {
    type: Number,
    default: null
  },

  images: [String],
  category: String,
  description: String,
  sizes: [String],

  promocao: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Produto", produtoSchema);