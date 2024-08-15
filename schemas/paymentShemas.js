import Joi from "joi";

// Схема для створення замовлення PayPal
export const payPalOrderSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default("USD"),
});

// Схема для створення запиту GoCardless
export const goCardlessRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  given_name: Joi.string().required(),
  family_name: Joi.string().optional(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).default("GBP"),
  description: Joi.string().optional(),
});

// Схема для створення потоку GoCardless
export const goCardlessFlowSchema = Joi.object({
  billingRequestId: Joi.string().required(),
});
