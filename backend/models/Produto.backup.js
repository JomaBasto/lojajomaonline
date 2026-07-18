import mongoose from "mongoose";

const produtoSchema = new mongoose.Schema({
  name: String,
  reference: String,
  price: Number,
  images: [String],
  category: String,
  description: String,
  sizes: [String]
});

export default mongoose.model("Produto", produtoSchema);