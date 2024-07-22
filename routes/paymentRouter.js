import express from "express";
import validateBody from "../helpers/validateBody.js";
import { customerSchema, paymentSchema } from "../schemas/userSchema.js";
import paymentControllers from "../controllers/paymentControllers.js";

const paymentRouter = express.Router();

paymentRouter.post(
  "/create-customer",
  validateBody(customerSchema),
  paymentControllers.createCustomer
);

paymentRouter.post(
  "/create-payment",
  validateBody(paymentSchema),
  paymentControllers.createPayment
);

paymentRouter.post("/create-checkout", paymentControllers.createCheckout);

export default paymentRouter;
