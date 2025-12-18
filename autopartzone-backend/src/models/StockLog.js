import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  oldStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("StockLog", stockLogSchema);
