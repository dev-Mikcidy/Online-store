import express from "express";
import productRoute from "./productRoute.js";
import authRoute from "./authRoute.js";
import paymentRoute from "./paymentRoute.js";
import adminRoute from "./adminRoute.js";
import orderRoute from "./orderRoute.js";
import cartRoute from "./cartRoute.js";

export const router = express.Router();

router.use("/api", productRoute);
router.use("/api/auth", authRoute);
router.use("/api", paymentRoute);
router.use("/api/admin", adminRoute);
router.use("/api", orderRoute);
router.use("/api/cart", cartRoute);
