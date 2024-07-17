import Joi from "joi";
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .pattern(emailRegexp)
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .pattern(emailRegexp)
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": '"name" cannot be an empty field',
  }),
  email: Joi.string()
    .pattern(emailRegexp)
    .messages({
      "string.pattern.base": "Incorrect email format",
      "string.empty": '"email" cannot be an empty field',
    }),
  password: Joi.string()
    .min(6)
    .messages({
      "string.empty": '"password" cannot be an empty field',
      "string.min": '"password" should have a minimum length of 6',
    }),
  avatarURL: Joi.any(),
});

export const sendMailSchema = Joi.object({
  email: Joi.string()
    .required()
    .pattern(emailRegexp)
    .messages({
      "string.pattern.base": "Incorrect email format",
      "string.empty": '"email" cannot be an empty field',
      "any.required": 'missing required field "email"',
    }),
  comment: Joi.string().messages({
    "string.empty": '"comment" cannot be an empty field',
    "any.required": 'missing required field "email"',
  }),
});

export const updateThemeSchema = Joi.object({
  theme: Joi.string()
    .valid("light", "violet", "dark")
    .required(),
});
