const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * authMiddleware — Verifies JWT token from Authorization header.
 * Attaches decoded user payload to req.user.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user id to request
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

/**
 * adminMiddleware — Ensures the authenticated user is an admin.
 * Must be used AFTER authMiddleware.
 */
const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { authMiddleware, adminMiddleware };
