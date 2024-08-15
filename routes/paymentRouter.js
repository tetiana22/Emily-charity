import express from "express";
import {
  createPayPalOrder,
  createGoCardlessBillingRequest,
  createGoCardlessBillingRequestFlow,
} from "../controllers/paymentControllers.js";

const router = express.Router();

// Роут для створення PayPal замовлення
router.post("/create-paypal-order", createPayPalOrder);

// Роут для створення GoCardless billing request
router.post("/create-billing-request", createGoCardlessBillingRequest);

// Роут для створення GoCardless billing request flow
router.post("/create-billing-request-flow", createGoCardlessBillingRequestFlow);

export default router;
