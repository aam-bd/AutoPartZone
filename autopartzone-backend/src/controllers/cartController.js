import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, name, brand } = req.body;
    const userId = req.user._id;

    // Normalize quantity field to match schema 'qty'
    const qty = Number(quantity ?? req.body.qty ?? 1);

    // Resolve product by id or by name+brand (case-insensitive)
    let product;
    if (productId) {
      product = await Product.findById(productId);
    } else if (name && brand) {
      const escapeRegex = (s = "") => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
      const nameRe = { $regex: `^${escapeRegex(name)}$`, $options: "i" };
      const brandRe = { $regex: `^${escapeRegex(brand)}$`, $options: "i" };
      product = await Product.findOne({ name: nameRe, brand: brandRe });
    } else {
      return res.status(400).json({ message: "Provide productId or (name and brand)" });
    }

    if (!product || product.stock < qty) {
      return res.status(400).json({ message: "Product not available in stock" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const pid = product._id.toString();
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === pid);
    if (itemIndex > -1) {
      cart.items[itemIndex].qty = (cart.items[itemIndex].qty || 0) + qty;
    } else {
      cart.items.push({ productId: product._id, qty });
    }

    await cart.save();

    // Return populated cart with product details (name, brand, etc.)
    const populated = await Cart.findById(cart._id).populate("items.productId");
    res.json({ message: "Added to cart", cart: populated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const id = productId || req.params.id; // Support both body and param

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Try to remove by cart item id first, then by productId
    let removed = false;
    let newItems = cart.items.filter(item => {
      if (item._id && item._id.toString() === id) {
        removed = true;
        return false;
      }
      return true;
    });

    if (!removed) {
      newItems = cart.items.filter(item => {
        if (item.productId && item.productId.toString() === id) {
          removed = true;
          return false;
        }
        return true;
      });
    }

    if (!removed) return res.status(404).json({ message: "Item not found in cart" });

    cart.items = newItems;
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    res.json({ message: "Item removed", cart: populated });
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

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (quantity <= 0) {
      return removeFromCart(req, res);
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Check stock availability
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    cart.items[itemIndex].qty = quantity;
    await cart.save();

    const populated = await Cart.findById(cart._id).populate("items.productId");
    res.json({ message: "Cart updated", cart: populated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    await Cart.findOneAndDelete({ userId });
    
    res.json({ message: "Cart cleared", cart: { items: [] } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
