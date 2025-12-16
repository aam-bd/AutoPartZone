import express from "express";
import {
  getDashboardOverview,
  getSalesAnalytics,
  getInventoryAnalytics,
  getUserAnalytics
} from "../controllers/analyticsController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize("admin", "staff"));

// Dashboard overview
router.get("/dashboard", getDashboardOverview);

// Sales analytics
router.get("/sales", getSalesAnalytics);

// Inventory analytics
router.get("/inventory", getInventoryAnalytics);

// User analytics (admin only)
router.get("/users", authorize("admin"), getUserAnalytics);

export default router;