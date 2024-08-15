import joi from "joi";

// Схема для створення замовлення PayPal
export const payPalOrderSchema = joi.object({
  amount: joi.number().positive().required(),
  currency: joi.string().length(3).default("USD"),
});

// Схема для створення запиту GoCardless
export const goCardlessRequestSchema = joi.object({
  email: joi.string().email().required(),
  given_name: joi.string().required(),
  family_name: joi.string().optional(),
  amount: joi.number().positive().required(),
  currency: joi.string().length(3).default("GBP"),
  description: joi.string().optional(),
});

// Схема для створення потоку GoCardless
export const goCardlessFlowSchema = joi.object({
  billingRequestId: joi.string().required(),
});
