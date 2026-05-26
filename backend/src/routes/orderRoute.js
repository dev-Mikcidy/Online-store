import controller from "../controllers/orderController.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/orders/user",authMiddleware,controller.getUserOrders);

export default router;