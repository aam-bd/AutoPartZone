import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import StockLog from "../models/StockLog.js";
import AuditLog from "../models/AuditLog.js";
import PDFDocument from 'pdfkit';

// Generate Sales Report
export const getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json', period = 'monthly' } = req.query;
    
    // Set date range
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.$gte = new Date(startDate);
      dateFilter.$lte = new Date(endDate);
    } else {
      // Default to last 30 days
      dateFilter.$gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      dateFilter.$lte = new Date();
    }

    // Sales data aggregation
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
          uniqueCustomers: { $addToSet: "$userId" },
          ordersByStatus: {
            $push: {
              status: "$status",
              revenue: "$totalAmount"
            }
          }
        }
      },
      {
        $addFields: {
          uniqueCustomerCount: { $size: "$uniqueCustomers" },
          averageOrderValue: { $divide: ["$totalRevenue", "$totalOrders"] }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Top selling products
    const topProducts = await Order.aggregate([
      { $match: { createdAt: dateFilter } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderCount: { $addToSet: "$_id" }
        }
      },
      {
        $addFields: {
          orderCount: { $size: "$orderCount" }
        }
      },
      { $sort: { totalRevenue: -1 } },
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
          category: "$product.category",
          brand: "$product.brand",
          totalQuantity: 1,
          totalRevenue: 1,
          orderCount: 1,
          currentStock: "$product.stock"
        }
      }
    ]);

    // Revenue by category
    const categoryRevenue = await Order.aggregate([
      { $match: { createdAt: dateFilter } },
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
          quantity: { $sum: "$items.quantity" },
          orders: { $addToSet: "$_id" },
          uniqueProducts: { $addToSet: "$items.productId" }
        }
      },
      {
        $addFields: {
          orderCount: { $size: "$orders" },
          productCount: { $size: "$uniqueProducts" }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    const reportData = {
      period,
      dateRange: {
        start: dateFilter.$gte,
        end: dateFilter.$lte
      },
      summary: {
        totalRevenue: salesData.reduce((sum, item) => sum + item.totalRevenue, 0),
        totalOrders: salesData.reduce((sum, item) => sum + item.totalOrders, 0),
        totalItems: salesData.reduce((sum, item) => sum + item.totalItems, 0),
        totalCustomers: salesData.reduce((max, item) => Math.max(max, item.uniqueCustomerCount), 0),
        averageOrderValue: salesData.length > 0 ? 
          salesData.reduce((sum, item) => sum + item.averageOrderValue, 0) / salesData.length : 0
      },
      salesData,
      topProducts,
      categoryRevenue
    };

    if (format === 'pdf') {
      return generatePDFReport(res, reportData, 'sales');
    } else if (format === 'csv') {
      return generateCSVReport(res, reportData, 'sales');
    }

    res.json({
      message: "Sales report generated successfully",
      data: reportData
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to generate sales report", error: error.message });
  }
};

// Generate Inventory Report
export const getInventoryReport = async (req, res) => {
  try {
    const { format = 'json', category, stockLevel } = req.query;

    // Build filter
    const filter = { isAvailable: true };
    if (category) filter.category = category;
    if (stockLevel) {
      switch (stockLevel) {
        case 'out':
          filter.stock = 0;
          break;
        case 'low':
          filter.stock = { $gt: 0, $lt: 10 };
          break;
        case 'normal':
          filter.stock = { $gte: 10 };
          break;
      }
    }

    // Inventory data
    const products = await Product.find(filter)
      .select('name category brand price stock isActive')
      .sort({ stock: 1 });

    // Category summary
    const categorySummary = await Product.aggregate([
      { $match: { isAvailable: true } },
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          stockValue: { $sum: { $multiply: ["$price", "$stock"] } },
          lowStockCount: {
            $sum: { $cond: [{ $lt: ["$stock", 10] }, 1, 0] }
          },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] }
          },
          totalValue: { $sum: { $multiply: ["$price", "$stock"] } }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    // Stock movement (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const stockMovement = await StockLog.find({
      createdAt: { $gte: thirtyDaysAgo }
    })
      .populate('productId', 'name category')
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    // Movement summary
    const movementSummary = await StockLog.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: "$type",
          totalTransactions: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" }
        }
      }
    ]);

    const reportData = {
      generatedAt: new Date(),
      summary: {
        totalProducts: products.length,
        totalStockValue: products.reduce((sum, item) => sum + (item.price * item.stock), 0),
        lowStockProducts: products.filter(item => item.stock > 0 && item.stock < 10).length,
        outOfStockProducts: products.filter(item => item.stock === 0).length,
        categoryCount: categorySummary.length
      },
      categorySummary,
      products,
      stockMovement: {
        summary: movementSummary,
        details: stockMovement
      }
    };

    if (format === 'pdf') {
      return generatePDFReport(res, reportData, 'inventory');
    } else if (format === 'csv') {
      return generateCSVReport(res, reportData, 'inventory');
    }

    res.json({
      message: "Inventory report generated successfully",
      data: reportData
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to generate inventory report", error: error.message });
  }
};

// Generate Customer Report
export const getCustomerReport = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    // Date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.$gte = new Date(startDate);
      dateFilter.$lte = new Date(endDate);
    } else {
      dateFilter.$gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      dateFilter.$lte = new Date();
    }

    // Customer analytics
    const customerAnalytics = await Order.aggregate([
      { $match: { createdAt: dateFilter } },
      {
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
          totalItems: { $sum: { $size: "$items" } },
          firstOrder: { $min: "$createdAt" },
          lastOrder: { $max: "$createdAt" },
          orderStatuses: { $push: "$status" }
        }
      },
      {
        $addFields: {
          averageOrderValue: { $divide: ["$totalSpent", "$totalOrders"] },
          completedOrders: {
            $size: {
              $filter: {
                input: "$orderStatuses",
                cond: { $eq: ["$$this", "completed"] }
              }
            }
          },
          cancelledOrders: {
            $size: {
              $filter: {
                input: "$orderStatuses",
                cond: { $eq: ["$$this", "cancelled"] }
              }
            }
          }
        }
      },
      { $sort: { totalSpent: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          email: "$user.email",
          role: "$user.role",
          isActive: "$user.isActive",
          lastLogin: "$user.lastLogin",
          totalOrders: 1,
          totalSpent: 1,
          averageOrderValue: 1,
          totalItems: 1,
          completedOrders: 1,
          cancelledOrders: 1,
          firstOrder: 1,
          lastOrder: 1,
          customerSince: "$user.createdAt"
        }
      }
    ]);

    // Customer segmentation
    const customerSegments = {
      vip: customerAnalytics.filter(c => c.totalSpent > 1000).length,
      loyal: customerAnalytics.filter(c => c.totalOrders > 5).length,
      new: customerAnalytics.filter(c => c.totalOrders === 1).length,
      churned: customerAnalytics.filter(c => c.lastOrder < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)).length
    };

    // Registration trends
    const registrationTrends = await User.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m",
              date: "$createdAt"
            }
          },
          count: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: ["$isActive", 1, 0] }
          }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const reportData = {
      period: {
        start: dateFilter.$gte,
        end: dateFilter.$lte
      },
      summary: {
        totalCustomers: customerAnalytics.length,
        totalRevenue: customerAnalytics.reduce((sum, c) => sum + c.totalSpent, 0),
        averageRevenuePerCustomer: customerAnalytics.length > 0 ? 
          customerAnalytics.reduce((sum, c) => sum + c.totalSpent, 0) / customerAnalytics.length : 0,
        customerSegments
      },
      customerAnalytics,
      registrationTrends
    };

    if (format === 'pdf') {
      return generatePDFReport(res, reportData, 'customer');
    } else if (format === 'csv') {
      return generateCSVReport(res, reportData, 'customer');
    }

    res.json({
      message: "Customer report generated successfully",
      data: reportData
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to generate customer report", error: error.message });
  }
};

// PDF Report Generation
const generatePDFReport = (res, data, reportType) => {
  try {
    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(`Content-Disposition`, `attachment; filename=${reportType}-report.pdf`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text(`${reportType.toUpperCase()} Report`, { align: 'center' });
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown();

    // Content based on report type
    switch (reportType) {
      case 'sales':
        doc.fontSize(14).text('Summary');
        doc.fontSize(10);
        doc.text(`Total Revenue: $${data.summary.totalRevenue.toFixed(2)}`);
        doc.text(`Total Orders: ${data.summary.totalOrders}`);
        doc.text(`Total Items Sold: ${data.summary.totalItems}`);
        doc.text(`Average Order Value: $${data.summary.averageOrderValue.toFixed(2)}`);
        doc.moveDown();

        doc.fontSize(14).text('Top Products');
        doc.fontSize(10);
        data.topProducts.slice(0, 10).forEach((product, index) => {
          doc.text(`${index + 1}. ${product.name} - $${product.totalRevenue.toFixed(2)}`);
        });
        break;

      case 'inventory':
        doc.fontSize(14).text('Inventory Summary');
        doc.fontSize(10);
        doc.text(`Total Products: ${data.summary.totalProducts}`);
        doc.text(`Total Stock Value: $${data.summary.totalStockValue.toFixed(2)}`);
        doc.text(`Low Stock Products: ${data.summary.lowStockProducts}`);
        doc.text(`Out of Stock Products: ${data.summary.outOfStockProducts}`);
        doc.moveDown();

        doc.fontSize(14).text('Category Breakdown');
        doc.fontSize(10);
        data.categorySummary.forEach(category => {
          doc.text(`${category._id}: ${category.totalProducts} products`);
        });
        break;

      case 'customer':
        doc.fontSize(14).text('Customer Summary');
        doc.fontSize(10);
        doc.text(`Total Customers: ${data.summary.totalCustomers}`);
        doc.text(`Total Revenue: $${data.summary.totalRevenue.toFixed(2)}`);
        doc.text(`Average Revenue per Customer: $${data.summary.averageRevenuePerCustomer.toFixed(2)}`);
        doc.moveDown();

        doc.fontSize(14).text('Customer Segments');
        doc.fontSize(10);
        Object.entries(data.summary.customerSegments).forEach(([segment, count]) => {
          doc.text(`${segment.charAt(0).toUpperCase() + segment.slice(1)}: ${count}`);
        });
        break;
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Failed to generate PDF report", error: error.message });
  }
};

// CSV Report Generation
const generateCSVReport = (res, data, reportType) => {
  try {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(`Content-Disposition`, `attachment; filename=${reportType}-report.csv`);

    let csv = '';

    switch (reportType) {
      case 'sales':
        csv += 'Period,Total Revenue,Total Orders,Total Items,Average Order Value\n';
        data.salesData.forEach(row => {
          csv += `${row._id},${row.totalRevenue},${row.totalOrders},${row.totalItems},${row.averageOrderValue}\n`;
        });
        
        csv += '\nTop Products\n';
        csv += 'Name,Category,Total Quantity,Total Revenue,Order Count\n';
        data.topProducts.forEach(product => {
          csv += `"${product.name}","${product.category}",${product.totalQuantity},${product.totalRevenue},${product.orderCount}\n`;
        });
        break;

      case 'inventory':
        csv += 'Product Name,Category,Brand,Price,Current Stock,Stock Value\n';
        data.products.forEach(product => {
          csv += `"${product.name}","${product.category}","${product.brand}",${product.price},${product.stock},${product.price * product.stock}\n`;
        });
        break;

      case 'customer':
        csv += 'Name,Email,Total Orders,Total Spent,Average Order Value,Total Items,Customer Since\n';
        data.customerAnalytics.forEach(customer => {
          csv += `"${customer.name}","${customer.email}",${customer.totalOrders},${customer.totalSpent},${customer.averageOrderValue},${customer.totalItems},${new Date(customer.customerSince).toLocaleDateString()}\n`;
        });
        break;
    }

    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate CSV report", error: error.message });
  }
};

export default {
  getSalesReport,
  getInventoryReport,
  getCustomerReport
};