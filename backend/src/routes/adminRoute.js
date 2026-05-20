import express from "express";
import adminController from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, adminMiddleware, adminController.getAdminProfile);
router.post("/product", authMiddleware, adminMiddleware, adminController.addProduct);
router.get("/products",authMiddleware, adminMiddleware, adminController.getAllProducts);
router.get("/orders", authMiddleware, adminMiddleware, adminController.getAllOrders);
router.get("/product/:id",authMiddleware, adminMiddleware, adminController.getSingleProduct);
router.put("/product/:id",authMiddleware, adminMiddleware, adminController.updateProduct);
router.delete("/product/:id",authMiddleware, adminMiddleware, adminController.deleteProduct);

export default router;