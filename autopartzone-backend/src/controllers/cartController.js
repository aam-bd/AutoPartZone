import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, qty } = req.body;

    // Check stock
    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) return res.status(400).json({ message: "Product unavailable" });
    if (product.stock < qty) return res.status(400).json({ message: "Not enough stock" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = await Cart.create({ userId, items: [] });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].qty += qty;
    } else {
      cart.items.push({ productId, qty });
    }

    await cart.save();
    res.json({ message: "Added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// REMOVE FROM CART
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

// GET CART
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
