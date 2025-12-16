import mongoose from "mongoose";

const salesAnalyticsSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true,
    index: true 
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true
  },
  totalRevenue: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  totalOrders: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  totalItems: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  averageOrderValue: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  uniqueCustomers: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  ordersByStatus: {
    processing: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 }
  },
  revenueByCategory: [{
    category: String,
    revenue: Number,
    orders: Number
  }],
  topProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    quantity: Number,
    revenue: Number
  }]
}, { 
  timestamps: true 
});

// Compound indexes for better query performance
salesAnalyticsSchema.index({ date: -1, period: 1 });
salesAnalyticsSchema.index({ period: 1, date: -1 });

export default mongoose.model("SalesAnalytics", salesAnalyticsSchema);