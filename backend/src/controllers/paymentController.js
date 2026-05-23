import paymentModel from "../models/paymentModel.js";
import stripeConfig from "../config/stripe.js";
import Order from "../models/schema/orderSchema.js";
import productModel from "../models/productModel.js";
import Stripe from "stripe";

const stripe = new Stripe(stripeConfig.apiKey, {
  apiVersion: "2026-04-22.dahlia",
});

class PaymentController {
  async createPayment(req, res, next) {
    try {
      const { userId, cartItems } = req.body;
      const session = await paymentModel.createPayment(userId, cartItems);
      res.json({
        url: session.url,
      });
    } catch (error) {
      next(error);
    }
  }

  async createWebhook(req, res, next) {
    let event;
    let status;
    let orderId;
    const secret = stripeConfig.endpointSecret;
    if (!secret) {
      res.status(404).send("Endpoint secret not found");
      return;
    }

    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, secret);
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;

          if (session.payment_status === "paid") {
            orderId = session.metadata.orderId;
            const order = await Order.findById(orderId);
            if (!order) {
              throw new Error("Order not found or already processed");
            }
            for (const product of order.products) {
              const updateResult = await productModel.updateProduct(
                product.productId,
                product.quantity,
              );
              if (!updateResult || updateResult.modifiedCount === 0) {
                throw new Error(
                  `Failed to update product ${product.productId}: insufficient stock or update error`,
                );
              }
            }
            status = "paid";
          }
          break;
        }
        case "checkout.session.expired":
          status = "cancelled";
          orderId = event.data.object.metadata?.orderId;

          break;
        case "payment_intent.payment_failed":
          status = "failed";
          orderId = event.data.object.metadata?.orderId;
          
          break;
        default:
          break;
      }
      if (orderId && status) {
        await Order.updateOne({ _id: orderId }, { status });
      }

      res.json({ received: true });
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}

export default new PaymentController();
