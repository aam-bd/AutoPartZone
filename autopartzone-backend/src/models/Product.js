import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  make: { type: String, default: "", trim: true },
  model: { type: String, default: "", trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: "", trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  isAvailable: { type: Boolean, default: true },
  
  // Additional fields for enhanced functionality
  images: [{ type: String }], // Array of image URLs
  specifications: {
    type: Map,
    of: String,
    default: {}
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  sku: { type: String, unique: true, sparse: true },
  weight: Number, // in pounds
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  tags: [String],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
