import mongoose from "mongoose";

const stockLogSchema = new mongoose.Schema({
  productId: String,
  staffId: String,
  oldStock: Number,
  newStock: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("StockLog", stockLogSchema);
