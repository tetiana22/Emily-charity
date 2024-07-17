import express from "express";
import { authenticate, validateBody, isIdValid } from "../helpers/index.js";

import columnsControllers from "../controllers/columnsControllers.js";
import {
  createColumnSchema,
  updateColumnSchema,
} from "../schemas/columnSchema.js";

const columnsRouter = express.Router();

columnsRouter.get("/:boardId", authenticate, columnsControllers.getAllColumns);

columnsRouter.post(
  "/",
  authenticate,
  validateBody(createColumnSchema),
  columnsControllers.addColumn
);

columnsRouter.put(
  "/:columnId",
  authenticate,
  isIdValid,
  validateBody(updateColumnSchema),
  columnsControllers.updateColumn
);

columnsRouter.delete(
  "/:columnId",
  authenticate,
  isIdValid,
  columnsControllers.deleteColumn
);

export default columnsRouter;
