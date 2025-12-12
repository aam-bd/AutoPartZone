import Product from "../models/Product.js";
import NodeCache from "node-cache";

const productCache = new NodeCache({ stdTTL: 300 }); // 5 minutes TTL

export const searchProducts = async (req, res) => {
  try {
    const { name, brand, category } = req.query;

    // Build a cache key based on query
    const cacheKey = `search:${name || ""}:${brand || ""}:${category || ""}`;
    const cached = productCache.get(cacheKey);
    if (cached) return res.json(cached);

    const query = {};
    if (name) query.name = { $regex: name, $options: "i" };
    if (brand) query.brand = brand;
    if (category) query.category = category;

    const products = await Product.find(query);
    productCache.set(cacheKey, products);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
