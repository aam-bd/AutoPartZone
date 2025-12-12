import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product || product.stock < quantity) {
      return res.status(400).json({ message: "Product not available in stock" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.json({ message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item._id.toString() !== id);
    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
