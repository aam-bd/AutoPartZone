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

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.status = status;
    await order.save();
    
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    order.status = "cancelled";
    await order.save();
    
    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const reorderItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Valid items array is required" });
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

    // Create order for reordered items
    const order = new Order({
      userId,
      items: orderItems,
      subtotal: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      tax: 0,
      shippingCost: 50,
      totalAmount: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 50,
      shippingAddress: req.body.shippingAddress,
      billingAddress: req.body.billingAddress,
      paymentMethod: { type: 'cod', status: 'pending' },
      status: "pending"
    });

    await order.save();
    
    res.json({ 
      message: "Items reordered successfully", 
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

export const getUserOrderStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ userId });
    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      completedOrders: orders.filter(order => order.status === 'completed').length,
      cancelledOrders: orders.filter(order => order.status === 'cancelled').length
    };
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};