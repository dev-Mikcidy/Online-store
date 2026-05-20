import express from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/reset-password", resetPassword);

export default router;
