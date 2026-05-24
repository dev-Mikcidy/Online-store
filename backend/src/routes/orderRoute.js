import controller from "../controllers/orderController.js";
import express from "express";

const router = express.Router();

router.get("/orders/all",controller.getAllOrders);

router.get("/orders/:id",controller.getUserOrders);

export default router;