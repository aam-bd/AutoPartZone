// src/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const { addProduct } = require("../controllers/productController");
const { authenticate, authorize } = require("../middleware/auth");

// Admin-only product create route
router.post(
  "/add",
  authenticate,
  authorize(["admin"]), // or authorize("admin") depending on your implementation
  addProduct
);

module.exports = router;
