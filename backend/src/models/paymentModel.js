import stripeConfig from "../config/stripe.js";
import Order from "./schema/orderSchema.js";
import Stripe from "stripe";

class PaymentModel {
  async createPayment(id, cartItems) {
    const stripe = new Stripe(stripeConfig.apiKey, {
      apiVersion: "2026-04-22.dahlia",
    });

    let totalPrice = 0;
    cartItems.forEach((product) => {
      totalPrice += product.price * product.quantity;
    });

    const order = await Order.create({
      userId: id,
      products: cartItems.map((product) => ({
        productId: product._id,
        quantity: product.quantity,
      })),
      totalPrice,
    });

    return await stripe.checkout.sessions.create({
      line_items: cartItems.map((product) => ({
        price_data: {
          currency: "sek",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      })),

      metadata: {
        orderId: order._id.toString(),
      },

      automatic_tax: {
        enabled: true,
      },

      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      mode: "payment",
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });
  }
}

export default new PaymentModel();
