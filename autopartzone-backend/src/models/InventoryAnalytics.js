import mongoose from "mongoose";

const inventoryAnalyticsSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true,
    index: true 
  },
  totalProducts: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  totalStockValue: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  lowStockItems: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  outOfStockItems: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  categories: [{
    name: String,
    totalProducts: Number,
    totalStock: Number,
    stockValue: Number,
    lowStockCount: Number
  }],
  topMovingProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    currentStock: Number,
    monthlySales: Number,
    stockTurnoverRate: Number
  }],
  lowStockProducts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    currentStock: Number,
    reorderLevel: Number,
    daysOfStock: Number
  }],
  restockingAlerts: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    recommendedQuantity: Number,
    lastRestocked: Date
  }]
}, { 
  timestamps: true 
});

// Indexes for better query performance
inventoryAnalyticsSchema.index({ date: -1 });
inventoryAnalyticsSchema.index({ "lowStockProducts.productId": 1 });

export default mongoose.model("InventoryAnalytics", inventoryAnalyticsSchema);