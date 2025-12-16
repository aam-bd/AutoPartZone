import express from "express";
import { 
  addToCart, 
  removeFromCart, 
  getCart, 
  updateCartItem, 
  clearCart 
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

// All routes require authentication
router.post("/add", authenticate, addToCart);
router.put("/update", authenticate, updateCartItem);
router.delete("/remove", authenticate, removeFromCart);
router.delete("/clear", authenticate, clearCart);
router.get("/", authenticate, getCart);

export default router;
