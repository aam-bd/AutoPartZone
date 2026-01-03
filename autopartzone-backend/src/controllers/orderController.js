import Cart from "../models/cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

console.log('=== ORDER CONTROLLER LOADED ===');
console.log('Order model:', !!Order);
console.log('Order model type:', typeof Order);

export const placeOrder = async (req, res) => {
  try {
    console.log('=== PLACE ORDER CONTROLLER CALLED ===');
    console.log('req.user:', req.user);
    console.log('req.user._id:', req.user._id);
    
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

    // Decrease stock for each ordered item
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

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

    console.log('Order object before save:', { userId: order.userId, orderNumber: order.orderNumber, itemCount: order.items.length });
    
    await order.save();
    
    console.log('✅ Order saved successfully:', { userId: order.userId, _id: order._id, orderNumber: order.orderNumber });
    
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
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    
    // Get total count
    const total = await Order.countDocuments(filter);
    
    // Admin/Staff can view ALL orders with pagination
    const orders = await Order.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    res.json({
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalRecords: total,
        limit: limitNum
      }
    });
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
    console.log('=== GET USER ORDERS CALLED ===');
    console.log('req.user full object:', JSON.stringify(req.user, null, 2));
    
    if (!req.user || !req.user._id) {
      console.error('❌ USER NOT FOUND IN REQUEST');
      return res.status(401).json({ message: "User not authenticated" });
    }
    
    const userId = req.user._id;
    console.log('🔍 Querying orders with userId:', {
      userId: userId,
      userIdType: typeof userId,
      userIdString: userId?.toString()
    });
    
    // Try querying with both string and ObjectId
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    console.log('✅ Orders found:', orders.length);
    
    if (orders.length === 0) {
      console.warn('⚠️ No orders found for user', userId);
      // Debug: Check all orders in the database
      const allOrders = await Order.find({}).select('userId');
      console.log('📊 Total orders in DB:', allOrders.length);
      console.log('📊 Sample userIds in DB:', allOrders.slice(0, 5).map(o => ({
        userId: o.userId,
        userIdString: o.userId?.toString()
      })));
    }
    
    res.json(orders);
  } catch (err) {
    console.error('❌ Error in getUserOrders:', err);
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