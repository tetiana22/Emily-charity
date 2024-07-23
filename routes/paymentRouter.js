import express from "express";

import paymentControllers from "../controllers/paymentControllers.js";

const paymentRouter = express.Router();

paymentRouter.post("/create-checkout", paymentControllers.createCheckout);

export default paymentRouter;
