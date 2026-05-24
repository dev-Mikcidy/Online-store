import dotenv from "dotenv";

dotenv.config();

const stripe = {
  apiKey: process.env.STRIPE_API_KEY,
  endpointSecret: process.env.ENDPOINT_SECRET_KEY,
  successURL: process.env.SUCCESS_URL,
  cancelURL: process.env.CANCEL_URL
};
export default stripe;
