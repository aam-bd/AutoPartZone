import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  verifyEmail, 
  getProfile, 
  updateProfile,
  getAllUsers,
  updateUserRole,
  deactivateUser,
  activateUser,
  exportUsers
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

// Admin registration (public but should be protected in production)
router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    // Simple admin key verification (in production, use environment variable)
    if (adminKey !== "admin" && adminKey !== process.env.ADMIN_REGISTRATION_KEY) {
      return res.status(403).json({ message: "Invalid admin registration key" });
    }

    // Check if exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Admin registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Admin only routes
router.get("/users", authenticate, authorize("admin"), getAllUsers);
router.put("/users/:id/role", authenticate, authorize("admin"), updateUserRole);
router.put("/users/:id/deactivate", authenticate, authorize("admin"), deactivateUser);
router.put("/users/:id/activate", authenticate, authorize("admin"), activateUser);
router.get("/users/export", authenticate, authorize("admin"), exportUsers);

export default router;
