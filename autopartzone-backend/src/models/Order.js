import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
      }
    ],
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "processing" 
    },
    
    // Address information
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: "USA" }
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    
    // Payment information
    paymentMethod: {
      type: { type: String, enum: ['card', 'paypal', 'cash'], required: true },
      last4: String,
      transactionId: { type: String },
      status: { 
        type: String, 
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
      }
    },
    
    // Shipping information
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    
    // Refund information
    refundDetails: {
      refundId: String,
      amount: Number,
      reason: String,
      processedAt: { type: Date, default: Date.now }
    },
    
    // Notes
    notes: String,
    
    // Order metadata
    orderNumber: {
      type: String, 
      unique: true,
      default: () => 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    }
  }, 
  { timestamps: true }
);

// Indexes for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
// orderNumber index removed - unique field provides automatic indexing

// Static methods
orderSchema.statics.getUserOrders = function(userId, options = {}) {
  const { page = 1, limit = 10, status } = options;
  const query = { userId };
  if (status) query.status = status;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('items.productId', 'name images');
};

orderSchema.statics.getOrderStats = function(startDate, endDate) {
  return this.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' }
      }
    }
  ]);
};

export default mongoose.model("Order", orderSchema);
