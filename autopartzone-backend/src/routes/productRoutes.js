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
  getRelatedProducts
} from "../controllers/productController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// Admin-only route to add product
router.post("/add", authenticate, authorize("admin"), addProduct);

// Admin-only: soft-delete product (mark unavailable)
router.delete("/:id", authenticate, authorize("admin"), removeProduct);

// Public: get a single product by id (useful for verification/debug)
router.get("/:id", getProductById);

// Public: get related products
router.get("/:id/related", getRelatedProducts);

// Public: get featured products
router.get("/featured", getFeaturedProducts);
router.get("/featured/:type", getFeaturedProducts);

// Public: get categories
router.get("/categories", getCategories);

// Public: get brands
router.get("/brands", getBrands);

// Public: get all products with search and filters
router.get("/", getProducts);

// Admin-only route to update product
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;