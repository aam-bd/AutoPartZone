import express from "express";
import { placeOrder, getOrders, updateStatus, getInvoice } from "../controllers/orderController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Customer: place order
router.post("/place", authenticate, placeOrder);

// Admin/Staff: get all orders
router.get("/", authenticate, authorize("admin", "staff"), getOrders);

// Admin/Staff: update order status
router.patch("/status/:id", authenticate, authorize("admin", "staff"), updateStatus);

// Customer: get invoice
router.get("/invoice/:id", authenticate, getInvoice);

export default router;
