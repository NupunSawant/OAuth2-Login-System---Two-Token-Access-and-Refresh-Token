import express from "express";
import {
	registerUser,
	authUser,
	refreshAccessToken,
	logoutUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Register and Login Routing
router.post("/register",registerUser)
router.post("/login",authUser)

// Tokens
router.post('/refresh',refreshAccessToken)
router.post("/logout",logoutUser)

router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

router.get("/private", protect, (req, res) => {
  res.json({
    message: "✅ You accessed a protected route!",
    user: req.user,
  });
});

export default router
