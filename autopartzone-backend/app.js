import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";

import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import stockRoutes from "./src/routes/stockRoutes.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import cartRoutes from "./src/routes/cartRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import recommendRoutes from "./src/routes/recommendRoutes.js";

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
