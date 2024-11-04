import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

// Protect Middleware to authenticate the user
const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database, excluding the password
      req.user = await User.findById(decoded.id || decoded.userId).select(
        "-password"
      );

      // Store user roles in request object
      req.userRoles = decoded.roles;

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token found");
  }
});

const hasRole = (...requiredRoles) => (req, res, next) => {
  if (!req.userRoles) {
    return res.status(403).json({ error: "Access denied, no roles assigned" });
  }

  const userRoles = Array.isArray(req.userRoles) ? req.userRoles : [req.userRoles];

  const hasValidRole = userRoles.some((role) => requiredRoles.includes(role));

  if (!hasValidRole) {
    return res
      .status(403)
      .json({ error: "Access denied, insufficient privileges" });
  }

  next();
};

export { protect, hasRole };
