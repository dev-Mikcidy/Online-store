import controller from "../controllers/productController.js";
import express from "express";

const router = express.Router();

router.get("/products",controller.getAllProducts);

router.get("/products/categories",controller.getProductsByCategory);

router.get("/products/search",controller.searchProducts)


router.get("/products/:id",controller.getProductById);

export default router;
