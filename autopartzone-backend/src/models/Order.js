import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    items: [],
    subtotal: Number,
    tax: Number,
    total: Number,
    status: { type: String, default: "processing" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
