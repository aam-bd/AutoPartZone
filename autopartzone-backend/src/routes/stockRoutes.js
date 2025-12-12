import express from "express";
import { updateStock, toggleProduct } from "../controllers/stockController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.put("/update-stock/:id", authenticate, authorize("admin", "staff"), updateStock);
router.put("/toggle/:id", authenticate, authorize("admin", "staff"), toggleProduct);

export default router;
