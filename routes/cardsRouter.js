import express from "express";
import { authenticate, validateBody } from "../helpers/index.js";
import cardsControllers from "../controllers/cardsControllers.js";
import {
  createCardSchema,
  updateCardSchema,
  updateColumnIdInCardSchema,
} from "../schemas/cardSchema.js";
import { isIdValid } from "../helpers/index.js";

const cardsRouter = express.Router();

cardsRouter.get("/:boardId", authenticate, cardsControllers.getAllCards);

cardsRouter.post(
  "/",
  authenticate,
  validateBody(createCardSchema),
  cardsControllers.addCard
);

cardsRouter.put(
  "/:cardId",
  authenticate,
  isIdValid,
  validateBody(updateCardSchema),
  cardsControllers.updateCard
);

cardsRouter.patch(
  "/:cardId",
  authenticate,
  isIdValid,
  validateBody(updateColumnIdInCardSchema),
  cardsControllers.updateColumnIdInCard
);

cardsRouter.delete(
  "/:cardId",
  authenticate,
  isIdValid,
  cardsControllers.deleteCard
);

export default cardsRouter;
