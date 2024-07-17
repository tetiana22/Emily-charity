import Joi from "joi";

export const createCardSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string(),
  priority: Joi.string()
    .valid("Without priority", "Low", "Medium", "High")
    .default("Low"),
  deadline: Joi.date().required(),
  boardId: Joi.string().required(),
  columnId: Joi.string().required(),
  index: Joi.number().required(),
});

export const updateCardSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  deadline: Joi.date(),
  boardId: Joi.string(),
  columnId: Joi.string(),
  index: Joi.number(),
});

export const updateColumnIdInCardSchema = Joi.object({
  columnId: Joi.string().required(),
  index: Joi.number().required(),
});
