import Cart from "../models/cart.js";
import Order from "../models/order.js";
import Product from "../models/product.js";

export const placeOrder = async (req, res) => {
  try {
    console.log('=== PLACE ORDER CONTROLLER CALLED ===');
    const userId = req.user._id;
    const { items, subtotal, tax, shippingCost, totalAmount, shippingAddress, billingAddress, paymentMethod, status } = req.body;

    // Simple validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    if (!shippingAddress || !billingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Populate product names for order items
    const orderItems = await Promise.all(items.map(async (item) => {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      return {
        productId: item.productId,
        name: product.name,
        price: item.price,
        quantity: item.quantity
      };
    }));

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      subtotal: Number(subtotal) || 0,
      tax: Number(tax) || 0,
      shippingCost: Number(shippingCost) || 0,
      totalAmount: Number(totalAmount) || 0,
      shippingAddress,
      billingAddress,
      paymentMethod: { type: String(paymentMethod || 'cod'), status: paymentMethod === 'cod' ? 'pending' : 'completed' },
      status: String(status || "pending")
    });

    await order.save();
    await Cart.deleteMany({ userId });

    res.json({ 
      message: "Order placed successfully", 
      order: {
        id: order.orderNumber,
        _id: order._id,
        orderNumber: order.orderNumber
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};