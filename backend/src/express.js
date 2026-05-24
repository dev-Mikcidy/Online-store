import express from "express";
import cors from "cors";
import logger from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler.js";
import { router as route } from "./routes/index.js";
import controller from "./controllers/paymentController.js";
dotenv.config();

export const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(logger("dev", { immediate: true }));
}

app.use(helmet());

app.disable("x-powered-by");

const allowedOrigins = [
  "http://localhost:5173",
  "https://online-store-six-inky.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(
  "/webhook",
  express.raw({ type: "application/json" }),
  controller.createWebhook,
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(route);

app.use(errorHandler.notFoundDefault);

app.use(errorHandler.errorDefault);
