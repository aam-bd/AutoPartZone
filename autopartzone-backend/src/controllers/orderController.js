import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import PDFDocument from "pdfkit";

// Place order
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await Cart.find({ userId });

    if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

    let subtotal = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      subtotal += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const tax = +(subtotal * 0.05).toFixed(2); // 5% tax
    const total = +(subtotal + tax).toFixed(2);

    const order = new Order({
      userId,
      items: cartItems,
      subtotal,
      tax,
      total,
      status: "processing",
    });

    await order.save();
    await Cart.deleteMany({ userId });

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
    const order = await Order.findById(id).populate("userId", "name email");
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
    doc.text(`Customer: ${order.userId.name}`);
    doc.text(`Email: ${order.userId.email}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    order.items.forEach((item, i) => {
      doc.text(`${i + 1}. Product ID: ${item.productId}, Quantity: ${item.quantity}`);
    });

    doc.text(`Subtotal: $${order.subtotal}`);
    doc.text(`Tax: $${order.tax}`);
    doc.text(`Total: $${order.total}`);

    doc.end();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
