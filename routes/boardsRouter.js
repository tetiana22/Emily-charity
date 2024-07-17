import express from "express";
import boardsControllers from "../controllers/boardsControllers.js";
import { authenticate, validateBody } from "../helpers/index.js";
import {
  createBoardSchema,
  updateBoardSchema,
} from "../schemas/boardSchema.js";
import  isIdValid  from "../helpers/isIdValid.js";

const boardsRouter = express.Router();

boardsRouter.get("/", authenticate, boardsControllers.getAllBoards);

boardsRouter.post(
  "/",
  authenticate,
  validateBody(createBoardSchema),
  boardsControllers.addBoard
);

boardsRouter.put(
  "/:boardId",
  authenticate,
  isIdValid,
  validateBody(updateBoardSchema),
  boardsControllers.updateBoard
);

boardsRouter.delete(
  "/:boardId",
  authenticate,
  isIdValid,
  boardsControllers.deleteBoard
);

export default boardsRouter;
