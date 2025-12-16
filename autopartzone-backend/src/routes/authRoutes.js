import express from "express";
import User from "../models/User.js";
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  getProfile, 
  updateProfile 
} from "../controllers/authController.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);

// Protected routes
router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);

// Admin only routes
router.get(
  "/users",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

router.patch(
  "/users/:id/status",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const { isActive } = req.body;
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User status updated", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

export default router;
