import express from "express";
import { 
  placeOrder, 
  getOrders, 
  updateStatus, 
  getInvoice, 
  getOrderById,
  getUserOrders,
  cancelOrder,
  reorderItems,
  getUserOrderStats
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Customer: place order
router.post("/place", authenticate, placeOrder);

// Admin/Staff: get all orders
router.get("/", authenticate, authorize("admin", "staff"), getOrders);

// Customer: get user's orders
router.get("/user", authenticate, getUserOrders);

// Customer: get user order statistics
router.get("/user/stats", authenticate, getUserOrderStats);

// Get specific order (customer/admin)
router.get("/:id", authenticate, getOrderById);

// Admin/Staff: update order status
router.patch("/status/:id", authenticate, authorize("admin", "staff"), updateStatus);
router.put("/:id/status", authenticate, authorize("admin"), updateStatus);

// Customer: cancel order
router.patch("/:id/cancel", authenticate, cancelOrder);

// Customer: reorder items
router.post("/:id/reorder", authenticate, reorderItems);

// Customer: get invoice
router.get("/invoice/:id", authenticate, getInvoice);

export default router;