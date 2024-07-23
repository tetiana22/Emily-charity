import Joi from "joi";

const customerSchema = Joi.object({
  given_name: Joi.string().required(),
  family_name: Joi.string().required(),
  email: Joi.string().email().required(),
  address_line1: Joi.string().required(),
  city: Joi.string().required(),
  postal_code: Joi.string().required(),
});

const mandateSchema = Joi.object({
  customer_bank_account_id: Joi.string().required(),
});

const paymentSchema = Joi.object({
  amount: Joi.number().integer().min(1).required(),
  mandate_id: Joi.string().required(),
});

export { customerSchema, mandateSchema, paymentSchema };
