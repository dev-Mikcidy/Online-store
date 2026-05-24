import paymentModel from "../models/paymentModel.js";
import stripeConfig from "../config/stripe.js";
import Order from "../models/schema/orderSchema.js";
import Product from "../models/schema/productSchema.js";
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
    const secret = stripeConfig.endpointSecret;

    if (!secret) {
      return res.status(400).send("Endpoint secret not found");
    }

    const signature = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, signature, secret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    let orderId;
    let status;

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object;
          orderId = session.metadata?.orderId;

          if (!orderId) break;

          const order = await Order.findOneAndUpdate(
            { _id: orderId, status: { $ne: "paid" } },
            { status: "processing" },
            { new: true },
          );

          if (!order) return res.json({ received: true });

          for (const item of order.products) {
            await Product.update(
              {
                _id: item.productId,
                quantity: { $gte: item.quantity },
              },
              {
                $inc: { quantity: -item.quantity },
              },
            );
          }

          order.status = "paid";
          await order.save();

          break;
        }

        case "checkout.session.expired": {
          orderId = event.data.object.metadata?.orderId;
          status = "cancelled";
          break;
        }

        case "payment_intent.payment_failed": {
          orderId = event.data.object.metadata?.orderId;
          status = "failed";
          break;
        }

        default:
          break;
      }

      if (orderId && status) {
        await Order.updateOne(
          { _id: orderId, status: { $ne: "paid" } },
          { status },
        );
      }

      return res.json({ received: true });
    } catch (err) {
      return res.status(500).send(`Webhook Error: ${err.message}`);
    }
  }
}

export default new PaymentController();
