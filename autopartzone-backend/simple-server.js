import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import connectDB from "./src/config/db.js";
import Product from "./src/models/Product.js";

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5192',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Connect MongoDB
connectDB();

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Featured products route
app.get('/api/products/featured/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let query = { isAvailable: true };
    
    if (type === 'flash-sale') {
      query.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    }
    
    const products = await Product.find(query)
      .sort(type === 'flash-sale' ? { createdAt: -1 } : { stock: -1 })
      .limit(12);
    
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// All products route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true }).limit(20);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});