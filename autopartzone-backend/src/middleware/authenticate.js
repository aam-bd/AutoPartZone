import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 Token decoded - user ID from token:', decoded.id);
    
    req.user = await User.findById(decoded.id).select("-password");
    
    console.log('🔐 User found:', {
      userId: req.user?._id,
      userIdType: typeof req.user?._id,
      userIdString: req.user?._id?.toString(),
      name: req.user?.name
    });
    
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};
export default authenticate;