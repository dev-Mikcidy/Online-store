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
      const { cartItems } = req.body;
      const session = await paymentModel.createPayment(cartItems);
      res.json({
        url: session.url,
      });
    } catch (error) {
      next(error);
    }
  }

  async webHook(req, res, next) {
    let event, status, orderId;
    const endpointSecret = stripeConfig.endpointSecret;
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = req.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret,
        );
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          if (session.payment_status === "paid") {
            orderId = session.metadata.orderId;

            status = "paid";

            const order = await Order.findOne(
              { _id: orderId, status: "pending" },
              { products: true },
            );

            if (!order) {
              throw new Error("Order not found or already processed");
            }

            for (const product of order.products) {
              await productModel.updateProduct(
                product.productId,
                product.quantity,
              );
            }
          }
          break;
        case "checkout.session.expired":
          status = "cancelled";
          break;
        case "payment_intent.payment_failed":
          status = "failed";
          break;
      }
      if (orderId) {
        await Order.updateOne({ _id: orderId }, { status });
      }

      res.json({ received: true });
    }
  }
}

export default new PaymentController();
