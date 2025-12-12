import Order from "../models/Order.js";
import Product from "../models/Product.js";

// After a successful order, recommend other products from the same category
export const getRecommendations = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const categories = [];
    order.items.forEach((item) => {
      if (item.productCategory) categories.push(item.productCategory);
    });

    // Simple recommendation logic: other products from the same categories
    const recommendedProducts = await Product.find({
      category: { $in: categories },
      _id: { $nin: order.items.map((i) => i.productId) }, // exclude already purchased
      isAvailable: true,
    }).limit(4);

    res.json(recommendedProducts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
