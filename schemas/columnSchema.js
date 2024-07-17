import Joi from "joi";

export const createColumnSchema = Joi.object({
  title: Joi.string().required(),
  cards: Joi.array(),
  boardId: Joi.string().required(),
});

export const updateColumnSchema = Joi.object({
  title: Joi.string(),
  cards: Joi.array(),
  boardId: Joi.string(),
});
