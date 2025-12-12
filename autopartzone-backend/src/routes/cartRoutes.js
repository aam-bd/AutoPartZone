import express from "express";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/add", authenticate, addToCart);
router.delete("/remove/:id", authenticate, removeFromCart);
router.get("/", authenticate, getCart);

export default router;
