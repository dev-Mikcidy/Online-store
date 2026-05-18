import dotenv from "dotenv";

dotenv.config();

const stripe = {
  apiKey: process.env.STRIPE_API_KEY,
};
export default stripe;
