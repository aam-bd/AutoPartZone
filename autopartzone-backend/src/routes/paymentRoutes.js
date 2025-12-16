import express from "express";
import {
  createPaymentIntent,
  confirmPayment,
  stripeWebhook,
  processRefund
} from "../controllers/paymentController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// User routes (require authentication)
router.post("/create-intent", authenticate, createPaymentIntent);
router.post("/confirm", authenticate, confirmPayment);
router.post("/refund", authenticate, authorize("admin", "staff"), processRefund);

// Stripe webhook (no authentication needed - verified by signature)
router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

export default router;