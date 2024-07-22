import Joi from "joi";
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const customerSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  address_line1: Joi.string().required(),
  city: Joi.string().required(),
  postal_code: Joi.string().required(),
  country_code: Joi.string().default("GB"),
});

export const paymentSchema = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().default("GB"),
  mandate_id: Joi.string().required(),
  customer_bank_account_id: Joi.string().required(),
});
