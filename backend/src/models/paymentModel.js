import stripeConfig from "../config/stripe.js";
import Stripe from "stripe"

const stripe = new Stripe(stripeConfig.apiKey, {
    apiVersion: "2026-04-22.dahlia"
})