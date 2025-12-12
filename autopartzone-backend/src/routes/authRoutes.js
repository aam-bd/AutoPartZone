import express from "express";
import { register, login } from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";  // default import
import authorize from "../middleware/authorize.js";        // default import

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Example protected route
router.get(
  "/profile",
  authenticate,
  authorize("admin", "staff", "customer"),
  (req, res) => {
    res.json({ message: "Profile accessed", user: req.user });
  }
);

export default router;
