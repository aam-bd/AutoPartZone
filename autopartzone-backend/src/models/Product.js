import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    brand: String,
    category: String,
    price: Number,
    stock: Number,
    isAvailable: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
