import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  action: { 
    type: String, 
    required: true,
    enum: [
      'LOGIN', 'LOGOUT', 'REGISTER', 
      'PRODUCT_CREATE', 'PRODUCT_UPDATE', 'PRODUCT_DELETE',
      'ORDER_CREATE', 'ORDER_UPDATE', 'ORDER_CANCEL',
      'STOCK_UPDATE', 'USER_ACTIVATE', 'USER_DEACTIVATE',
      'PASSWORD_CHANGE', 'PASSWORD_RESET', 'EMAIL_VERIFY',
      'CART_ADD', 'CART_REMOVE', 'CART_CLEAR'
    ]
  },
  resource: { 
    type: String, 
    enum: ['User', 'Product', 'Order', 'Cart', 'Auth'],
    required: true 
  },
  resourceId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  details: { 
    type: mongoose.Schema.Types.Mixed,
    default: {} 
  },
  ipAddress: { 
    type: String, 
    required: true 
  },
  userAgent: { 
    type: String, 
    required: true 
  },
  success: { 
    type: Boolean, 
    required: true,
    default: true
  },
  errorMessage: {
    type: String,
    required: false
  }
}, { 
  timestamps: true 
});

// Indexes for better query performance
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1, createdAt: -1 });

export default mongoose.model("AuditLog", auditLogSchema);