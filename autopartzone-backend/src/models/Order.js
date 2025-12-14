import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 }
      }
    ],
    subtotal: Number,
    tax: Number,
    total: Number,
    status: { type: String, default: "processing" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
