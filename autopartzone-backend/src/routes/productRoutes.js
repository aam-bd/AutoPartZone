import express from "express";
import { addProduct, getProducts, removeProduct, getProductById } from "../controllers/productController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Public: list available products
router.get("/", getProducts);

// Admin-only route to add product
router.post("/add", authenticate, authorize("admin"), addProduct);

// Admin-only: soft-delete product (mark unavailable)
router.delete("/:id", authenticate, authorize("admin"), removeProduct);

// Public: get a single product by id (useful for verification/debug)
router.get("/:id", getProductById);

export default router;
