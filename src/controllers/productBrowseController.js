// src/controllers/productBrowseController.js
const Product = require("../models/Product");
const NodeCache = require("node-cache");

// Cache with TTL 5 minutes (300 seconds)
const productCache = new NodeCache({ stdTTL: 300 });

/**
 * GET /products
 * Browse products with pagination
 * Query: ?page=1&limit=10
 */
exports.getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `browse:${page}:${limit}`;
    const cached = productCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const [products, total] = await Promise.all([
      Product.find({ isAvailable: true }).skip(skip).limit(limit),
      Product.countDocuments({ isAvailable: true }),
    ]);

    const response = {
      page,
      limit,
      total,
      products,
    };

    productCache.set(cacheKey, response);
    return res.json(response);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * GET /products/search?name=&brand=&category=&page=&limit=
 */
exports.searchProducts = async (req, res) => {
  try {
    const { name, brand, category } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `search:${JSON.stringify(req.query)}`;
    const cached = productCache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const filter = { isAvailable: true };

    if (name) {
      filter.name = { $regex: name, $options: "i" }; // fuzzy search
    }
    if (brand) {
      filter.brand = brand;
    }
    if (category) {
      filter.category = category;
    }

    const [products, total] = await Promise.all([
      Product.find(filter).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    const response = {
      page,
      limit,
      total,
      products,
    };

    productCache.set(cacheKey, response);
    return res.json(response);
  } catch (err) {
    console.error("Error searching products:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
