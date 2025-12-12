import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      qty: Number
    }
  ]
});

export default mongoose.model("Cart", cartSchema);
