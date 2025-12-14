import Order from "../models/Order.js";
import Product from "../models/Product.js";

// After a successful order, recommend other products from the same category
export const getRecommendations = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Gather productIds from the order and load their categories
    const productIds = order.items.map((i) => i.productId).filter(Boolean);
    if (!productIds.length) return res.json([]);

    const products = await Product.find({ _id: { $in: productIds } }).select("category");
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    if (!categories.length) return res.json([]);

    // Simple recommendation logic: other products from the same categories
    const recommendedProducts = await Product.find({
      category: { $in: categories },
      _id: { $nin: productIds }, // exclude already purchased
      isAvailable: true,
    }).limit(4);

    res.json(recommendedProducts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
