import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import PDFDocument from "pdfkit";

// Place order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    // Accept either items in request body or use the user's cart
    const bodyItems = req.body.items;
    let itemsToOrder = [];
    let usedCart = false;

    if (Array.isArray(bodyItems) && bodyItems.length > 0) {
      // Normalize incoming items: accept { product, productId, quantity, qty }
      itemsToOrder = bodyItems.map(i => ({
        productId: i.product || i.productId,
        quantity: Number(i.quantity ?? i.qty ?? 0)
      }));
    } else {
      const cart = await Cart.findOne({ userId });
      if (!cart || !cart.items || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });
      usedCart = true;
      itemsToOrder = cart.items.map(i => ({ productId: i.productId, quantity: Number(i.qty ?? i.quantity ?? 0) }));
    }

    // Validate items and adjust stock
    let subtotal = 0;
    for (const item of itemsToOrder) {
      if (!item.productId) return res.status(400).json({ message: "Invalid product id in items" });
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ message: `Product not found for id ${item.productId}` });
      }
      const itemQty = item.quantity;
      if (itemQty <= 0) return res.status(400).json({ message: `Invalid quantity for product ${product.name || product._id}` });
      if (product.stock < itemQty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name || product._id}` });
      }
      subtotal += (product.price || 0) * itemQty;
      product.stock -= itemQty;
      await product.save();
    }

    const tax = +(subtotal * 0.05).toFixed(2); // 5% tax
    const total = +(subtotal + tax).toFixed(2);

    const order = new Order({
      userId,
      items: itemsToOrder,
      subtotal,
      tax,
      total,
      status: "processing",
    });

    await order.save();

    // If order was placed from cart, clear the cart
    if (usedCart) await Cart.deleteMany({ userId });

    res.json({ message: "Order placed", orderId: order._id });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all orders (Admin/Staff)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("items.productId", "name brand category price");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update order status (Admin/Staff)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;

    // Restore stock if cancelled
    if (status === "cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    await order.save();
    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Generate PDF invoice
export const getInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const doc = new PDFDocument();
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice_${order._id}.pdf`,
        "Content-Length": pdfData.length,
      });
      res.send(pdfData);
    });

    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`Customer: ${order.userId?.name || "Unknown"}`);
    doc.text(`Email: ${order.userId?.email || "Unknown"}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();
    order.items.forEach((item, i) => {
      const qty = item.quantity ?? item.qty ?? 0;
      const productName = item.productId?.name || (item.productId || "Unknown Product");
      doc.text(`${i + 1}. ${productName} - Quantity: ${qty}`);
    });

    doc.text(`Subtotal: $${order.subtotal}`);
    doc.text(`Tax: $${order.tax}`);
    doc.text(`Total: $${order.total}`);

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    // Build filter
    const filter = { userId };
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("items.productId", "name brand category images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        total,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Cancel order (customer)
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== 'processing') {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity || item.qty || 0 }
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date();
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reorder items from previous order
export const reorderItems = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: id, userId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create new cart with reordered items
    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isAvailable || product.stock === 0) {
        continue; // Skip unavailable products
      }

      const existingItem = cart.items.find(cartItem => 
        cartItem.productId.toString() === item.productId.toString()
      );

      if (existingItem) {
        existingItem.qty = (existingItem.qty || 0) + (item.quantity || item.qty || 0);
      } else {
        cart.items.push({
          productId: item.productId,
          qty: item.quantity || item.qty || 0
        });
      }
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.productId");

    res.json({ message: "Items added to cart", cart: populatedCart });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user order statistics
export const getUserOrderStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Order.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalOrders = stats.reduce((sum, stat) => sum + stat.count, 0);
    const totalSpent = stats.reduce((sum, stat) => sum + stat.totalSpent, 0);
    const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    res.json({
      totalOrders,
      totalSpent,
      avgOrderValue,
      stats
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
