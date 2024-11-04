import express from "express";
const router = express.Router();
import {
  LoginUser,
  registerUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", LoginUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect, getUserProfile);

export default router;
