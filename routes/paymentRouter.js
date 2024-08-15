import { Router } from "express";
import {
  createPayPalOrder,
  createGoCardlessBillingRequest,
  createGoCardlessBillingRequestFlow,
} from "../controllers/paymentControllers.js";
import {
  payPalOrderSchema,
  goCardlessFlowSchema,
  goCardlessRequestSchema,
} from "../schemas/paymentShemas.js";

// Функція для валідації запитів
const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

const router = Router();

// Роут для створення PayPal замовлення
router.post(
  "/create-paypal-order",
  validateRequest(payPalOrderSchema),
  createPayPalOrder
);

// Роут для створення GoCardless billing request
router.post(
  "/create-billing-request",
  validateRequest(goCardlessRequestSchema),
  createGoCardlessBillingRequest
);

// Роут для створення GoCardless billing request flow
router.post(
  "/create-billing-request-flow",
  validateRequest(goCardlessFlowSchema),
  createGoCardlessBillingRequestFlow
);

export default router;
