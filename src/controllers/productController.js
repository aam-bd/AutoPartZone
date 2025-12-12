// src/controllers/productController.js
const Product = require("../models/Product");

// POST /products/add (Admin-only)
exports.addProduct = async (req, res) => {
  try {
    const { name, brand, category, price, stock, isAvailable } = req.body;

    const product = await Product.create({
      name,
      brand,
      category,
      price,
      stock,
      isAvailable,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    // Handle validation errors
    if (err.name === "ValidationError") {
      const errors = {};
      Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
      });

      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    console.error("Error creating product:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
