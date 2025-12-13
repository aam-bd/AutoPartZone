// src/controllers/recommendationController.js
const Recommendation = require("../models/Recommendation");
const Order = require("../models/Order");
const Product = require("../models/Product");

// GET /orders/recommendations/:orderId
exports.getRecommendations = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id; // from authenticate

    // 1. Check if recommendation already exists
    let recommendation = await Recommendation.findOne({ orderId }).populate(
      "recommendedProducts"
    );

    if (recommendation) {
      return res.json({
        orderId,
        recommendations: recommendation.recommendedProducts,
      });
    }

    // 2. If not, build new recommendation
    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optional: only allow owner or admin
    // if (order.userId.toString() !== userId && req.user.role !== "admin") {
    //   return res.status(403).json({ message: "Not allowed" });
    // }

    // Collect categories and exclude products already bought
    const categories = new Set();
    const purchasedIds = new Set();

    order.items.forEach((item) => {
      if (item.productId) {
        categories.add(item.productId.category);
        purchasedIds.add(item.productId._id.toString());
      }
    });

    // Find other products from same categories
    const categoryArray = Array.from(categories);

    let recommendedProducts = [];

    if (categoryArray.length > 0) {
      recommendedProducts = await Product.find({
        category: { $in: categoryArray },
        isAvailable: true,
      })
        .where("_id")
        .nin(Array.from(purchasedIds)) // exclude already bought
        .limit(4); // 2 4 items, we pick up to 4
    }

    // Save recommendation for next time
    recommendation = await Recommendation.create({
      orderId: order._id,
      userId: order.userId,
      recommendedProducts: recommendedProducts.map((p) => p._id),
    });

    return res.json({
      orderId,
      recommendations: recommendedProducts,
    });
  } catch (err) {
    console.error("Error getting recommendations:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
