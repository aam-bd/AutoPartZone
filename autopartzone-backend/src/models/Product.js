import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  make: { type: String, default: "" },
  model: { type: String, default: "" },
  category: String,
  description: { type: String, default: "" },
  price: Number,
  stock: Number,
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
