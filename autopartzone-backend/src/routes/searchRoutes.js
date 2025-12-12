import express from "express";
import { browseProducts, searchProducts } from "../controllers/searchController.js";

const router = express.Router();

router.get("/", browseProducts);
router.get("/search", searchProducts);

export default router;
