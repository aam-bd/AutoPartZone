import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import recommendRoutes from "./routes/recommendRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/products", stockRoutes);
app.use("/search", searchRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/recommend", recommendRoutes);

export default app;
