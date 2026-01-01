import express from "express";
import Product from "../models/Product.js";
import { 
  getProducts, 
  addProduct, 
  removeProduct, 
  getProductById,
  getFeaturedProducts,
  getCategories,
  getBrands,
  getRelatedProducts,
  updateProduct
} from "../controllers/productController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";
import upload from "../utils/upload.js";

const router = express.Router();

// Public: get all products with search and filters - THIS MUST COME FIRST
router.get("/", getProducts);

// Admin-only route to add product
router.post("/add", authenticate, authorize("admin"), upload.single('image'), addProduct);

// Admin-only: soft-delete product (mark unavailable)
router.delete("/:id", authenticate, authorize("admin"), removeProduct);

// Public: get featured products
router.get("/featured/:type", getFeaturedProducts);

// Public: get categories  
router.get("/categories", getCategories);

// Public: get brands
router.get("/brands", getBrands);

// Public: get a single product by id (useful for verification/debug) - MUST BE LAST
router.get("/:id", getProductById);

// Public: get related products
router.get("/:id/related", getRelatedProducts);

// Admin-only route to update product
router.put("/:id", authenticate, authorize("admin"), upload.single('image'), updateProduct);

export default router;