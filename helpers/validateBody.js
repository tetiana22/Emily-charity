import HttpError from "./HttpError.js";
import Joi from "joi";

const validateBody = (schema) => {
  const func = (req, _, next) => {
    if (Object.keys(req.body).length === 0) {
      return next(HttpError(400, "Body must have at least one field"));
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }

    next();
  };

  return func;
};

export default validateBody;
