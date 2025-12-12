import express from "express";
import { getRecommendations } from "../controllers/recommendController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/:orderId", authenticate, getRecommendations);

export default router;
