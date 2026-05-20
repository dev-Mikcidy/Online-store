import controller from "../controllers/paymentController.js";
import express from "express";

const router = express.Router();

router.post("/create-checkout-session", controller.createPayment);

router.post('/webhook', express.raw({type: 'application/json'}), controller.webHook);

export default router;
