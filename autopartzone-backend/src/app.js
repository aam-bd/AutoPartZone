import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import mongoSanitize from "express-mongo-sanitize";
// import xss from "xss-clean";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import recommendRoutes from "./routes/recommendRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting - temporarily disabled for testing
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });
// app.use('/api/', limiter);

// Data sanitization - move after routes
// app.use(mongoSanitize()); // Against NoSQL injection
// app.use(xss()); // Against XSS attacks

// CORS configuration - allow all origins for development
app.use(cors({
  origin: '*', // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Debug middleware for orders
app.use('/api/orders', (req, res, next) => {
  console.log('=== ORDERS MIDDLEWARE CALLED ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Full URL:', req.originalUrl);
  if (req.method === 'GET') {
    console.log('Headers:', req.headers);
  }
  if (req.method === 'POST' && req.path === '/place') {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Serve static files (uploaded images)
app.use('/uploads', express.static('uploads'));

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/products", productRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "AutoPartZone API Server", version: "1.0.0", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

export default app;
