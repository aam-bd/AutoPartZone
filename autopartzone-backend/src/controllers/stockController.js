import Product from "../models/Product.js";
import StockLog from "../models/StockLog.js";

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const staffId = req.user._id;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const oldStock = product.stock;
    product.stock = stock;
    await product.save();

    const log = new StockLog({ productId: id, staffId, oldStock, newStock: stock });
    await log.save();

    res.json({ message: "Stock updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const toggleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const staffId = req.user._id;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const oldStock = product.stock;
    product.isAvailable = !product.isAvailable;
    await product.save();

    const log = new StockLog({ productId: id, staffId, oldStock, newStock: product.stock });
    await log.save();

    res.json({ message: `Product availability toggled to ${product.isAvailable}`, product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
