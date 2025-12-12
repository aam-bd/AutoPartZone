import express from "express";
import { placeOrder, getOrders, updateStatus, getInvoice } from "../controllers/orderController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.post("/place", authenticate, placeOrder);
router.get("/", authenticate, authorize("admin", "staff"), getOrders);
router.patch("/status/:id", authenticate, authorize("admin", "staff"), updateStatus);
router.get("/invoice/:id", authenticate, getInvoice);

export default router;
