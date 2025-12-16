import express from "express";
import {
  getSalesReport,
  getInventoryReport,
  getCustomerReport
} from "../controllers/reportController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// All report routes require authentication
router.use(authenticate);

// Sales reports (admin and staff)
router.get("/sales", authorize("admin", "staff"), getSalesReport);

// Inventory reports (admin and staff)
router.get("/inventory", authorize("admin", "staff"), getInventoryReport);

// Customer reports (admin only)
router.get("/customers", authorize("admin"), getCustomerReport);

export default router;