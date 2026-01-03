import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardOverview = async (req, res) => {
  try {
    console.log('📊 Fetching dashboard overview from database');
    
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 5 } });
    
    // Calculate monthly revenue (current month)
    // For COD: only count if delivered
    // For card: count if payment.status === 'completed'
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const monthlyOrders = await Order.find({
      createdAt: { $gte: firstDay, $lte: lastDay },
      $or: [
        { 'paymentMethod.type': 'cod', status: 'delivered' },
        { 'paymentMethod.type': { $ne: 'cod' }, 'paymentMethod.status': 'completed' }
      ]
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Calculate weekly revenue (last 7 days)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyOrders = await Order.find({
      createdAt: { $gte: weekAgo },
      $or: [
        { 'paymentMethod.type': 'cod', status: 'delivered' },
        { 'paymentMethod.type': { $ne: 'cod' }, 'paymentMethod.status': 'completed' }
      ]
    });
    const weeklyRevenue = weeklyOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    
    // Get order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    // Get top selling products (all time)
    const topSellingProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      }
    ]);
    
    const data = {
      overview: {
        totalProducts,
        totalUsers,
        totalOrders,
        lowStockProducts,
        monthlyRevenue,
        weeklyRevenue
      },
      charts: {
        orderStatusBreakdown,
        topSellingProducts: topSellingProducts.map(p => ({
          _id: p._id,
          name: p.productName,
          totalQuantity: p.totalQuantity,
          quantitySold: p.totalQuantity,
          revenue: p.totalRevenue,
          brand: p.productDetails?.[0]?.brand || 'N/A'
        })),
        recentOrders: monthlyOrders.slice(0, 5),
        recentActivity: []
      }
    };
    
    console.log('✅ Dashboard overview retrieved successfully');
    
    res.json({
      message: "Dashboard overview retrieved successfully",
      data: data
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    console.log('📊 Fetching sales analytics for period:', period);
    
    const now = new Date();
    let startDate;
    
    if (period === 'daily') {
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (period === 'weekly') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      // monthly
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: now }
    }).sort({ createdAt: -1 });
    
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    res.json({
      message: "Sales analytics retrieved successfully",
      data: {
        period,
        totalRevenue,
        totalOrders,
        averageOrderValue,
        orders: orders.slice(0, 10) // Return recent 10 orders
      }
    });
  } catch (error) {
    console.error('❌ Sales analytics error:', error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getInventoryAnalytics = async (req, res) => {
  try {
    console.log('📊 Fetching inventory analytics');
    
    const products = await Product.find().select('name stock price');
    
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock < 5).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;
    const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    
    res.json({
      message: "Inventory analytics retrieved successfully",
      data: {
        totalProducts,
        lowStockCount,
        outOfStockCount,
        totalStockValue,
        products
      }
    });
  } catch (error) {
    console.error('❌ Inventory analytics error:', error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserAnalytics = async (req, res) => {
  try {
    console.log('📊 Fetching user analytics');
    
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const staffUsers = await User.countDocuments({ role: 'staff' });
    const customerUsers = await User.countDocuments({ role: 'customer' });
    
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10);
    
    res.json({
      message: "User analytics retrieved successfully",
      data: {
        totalUsers,
        adminUsers,
        staffUsers,
        customerUsers,
        recentUsers
      }
    });
  } catch (error) {
    console.error('❌ User analytics error:', error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};