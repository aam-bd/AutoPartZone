import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import StockLog from "../models/StockLog.js";
import SalesAnalytics from "../models/SalesAnalytics.js";
import InventoryAnalytics from "../models/InventoryAnalytics.js";

// Get dashboard overview statistics
export const getDashboardOverview = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get basic counts
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      lowStockProducts,
      recentOrders,
      monthlyRevenue,
      weeklyRevenue
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Product.countDocuments({ stock: { $lt: 10 } }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
      Order.aggregate([
        { $match: { createdAt: { $gte: lastMonth } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: lastWeek } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ])
    ]);

    // Get order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get top selling products
    const topSellingProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          totalQuantity: 1,
          totalRevenue: 1,
          currentStock: "$product.stock"
        }
      }
    ]);

    // Get recent activity from stock logs
    const recentActivity = await StockLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('productId', 'name')
      .populate('userId', 'name');

    res.json({
      message: "Dashboard overview retrieved successfully",
      data: {
        overview: {
          totalProducts,
          totalUsers,
          totalOrders,
          lowStockProducts,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          weeklyRevenue: weeklyRevenue[0]?.total || 0
        },
        charts: {
          orderStatusBreakdown,
          topSellingProducts,
          recentOrders,
          recentActivity
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    
    // Date range
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.$gte = new Date(startDate);
      dateFilter.$lte = new Date(endDate);
    }

    // Get sales data based on period
    const salesData = await Order.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === 'daily' ? '%Y-%m-%d' : 
                     period === 'weekly' ? '%Y-%U' : 
                     period === 'monthly' ? '%Y-%m' : '%Y',
              date: "$createdAt"
            }
          },
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          totalItems: { $sum: { $size: "$items" } },
          uniqueCustomers: { $addToSet: "$userId" }
        }
      },
      {
        $addFields: {
          averageOrderValue: { $divide: ["$totalRevenue", "$totalOrders"] },
          uniqueCustomerCount: { $size: "$uniqueCustomers" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Get revenue by category
    const revenueByCategory = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orders: { $addToSet: "$_id" },
          quantity: { $sum: "$items.quantity" }
        }
      },
      {
        $addFields: {
          orderCount: { $size: "$orders" }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      message: "Sales analytics retrieved successfully",
      data: {
        salesData,
        revenueByCategory
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get inventory analytics
export const getInventoryAnalytics = async (req, res) => {
  try {
    // Get inventory overview
    const [totalProducts, totalStockValue, lowStockItems, outOfStockItems] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Product.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$stock"] } } } }
      ]),
      Product.countDocuments({ stock: { $gt: 0, $lt: 10 } }),
      Product.countDocuments({ stock: 0 })
    ]);

    // Get category-wise inventory
    const categoryInventory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          stockValue: { $sum: { $multiply: ["$price", "$stock"] } },
          lowStockCount: {
            $sum: { $cond: [{ $lt: ["$stock", 10] }, 1, 0] }
          }
        }
      },
      { $sort: { stockValue: -1 } }
    ]);

    // Get low stock products
    const lowStockProducts = await Product.find({ 
      stock: { $gt: 0, $lt: 10 },
      isActive: true 
    })
      .select('name category price stock brand')
      .sort({ stock: 1 })
      .limit(20);

    // Get out of stock products
    const outOfStockProducts = await Product.find({ 
      stock: 0,
      isActive: true 
    })
      .select('name category price brand')
      .limit(20);

    // Get top moving products (based on recent orders)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const topMovingProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          name: "$product.name",
          currentStock: "$product.stock",
          totalSold: 1,
          revenue: 1,
          stockTurnoverRate: { $divide: ["$totalSold", "$product.stock"] }
        }
      }
    ]);

    res.json({
      message: "Inventory analytics retrieved successfully",
      data: {
        overview: {
          totalProducts: totalProducts || 0,
          totalStockValue: totalStockValue[0]?.totalValue || 0,
          lowStockItems: lowStockItems || 0,
          outOfStockItems: outOfStockItems || 0
        },
        categoryInventory,
        lowStockProducts,
        outOfStockProducts,
        topMovingProducts
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user analytics
export const getUserAnalytics = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Get user statistics
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      userRoles
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ 
        isActive: true,
        lastLogin: { $gte: thirtyDaysAgo }
      }),
      User.countDocuments({ 
        createdAt: { $gte: thirtyDaysAgo }
      }),
      User.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Get customer order statistics
    const customerOrderStats = await Order.aggregate([
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          lastOrder: { $max: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $match: { "user.isActive": true } },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          totalOrders: 1,
          totalSpent: 1,
          lastOrder: 1,
          averageOrderValue: { $divide: ["$totalSpent", "$totalOrders"] }
        }
      }
    ]);

    // Get registration trends
    const registrationTrends = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      message: "User analytics retrieved successfully",
      data: {
        overview: {
          totalUsers,
          activeUsers,
          newUsersThisMonth,
          userRoles
        },
        customerOrderStats,
        registrationTrends
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};