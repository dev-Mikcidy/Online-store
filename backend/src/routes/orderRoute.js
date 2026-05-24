import controller from "../controllers/orderController.js";
import express from "express";

const router = express.Router();

router.get("/orders",controller.getAllOrders);

router.get("/order/history",controller.getUserOrders);

export default router;