import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import GoCardless from "gocardless-nodejs";
import paymentRouter from "./routes/paymentRouter.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(bodyParser.raw({ type: "application/json", limit: "10mb" }));

const gcEnvironment = process.env.GC_API_URL.includes("sandbox")
  ? "sandbox"
  : "live";

// Ініціалізація GoCardless
const gc = new GoCardless({
  access_token: process.env.GC_ACCESS_TOKEN || "placeholder_access_token",
  environment: gcEnvironment,
});

// Routers
app.use("/payment", paymentRouter);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
export { gc };
