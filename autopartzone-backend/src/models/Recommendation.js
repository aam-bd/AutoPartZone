import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  orderId: String,
  recommended: []
});

export default mongoose.model("Recommendation", recommendationSchema);
