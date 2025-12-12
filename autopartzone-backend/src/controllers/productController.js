import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { name, brand, category, price, stock } = req.body;

    if (!name || !brand || !category || !price || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = new Product({
      name,
      brand,
      category,
      price,
      stock,
      isAvailable: true,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
