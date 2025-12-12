import express from "express";
import { addProduct } from "../controllers/productController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Admin-only route to add product
router.post("/add", authenticate, authorize("admin"), addProduct);

export default router;
