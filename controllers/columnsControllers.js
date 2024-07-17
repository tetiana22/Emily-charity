import { errorCatcher, HttpError } from "../helpers/index.js";
import columnsServices from "../services/columnsServices.js";

const getAllColumns = async (req, res) => {
  const { boardId } = req.params;
  const { _id: owner } = req.user;

  const columns = await columnsServices.getAllColumns(boardId, owner);
  res.json(columns);
};

const addColumn = async (req, res) => {
  const { _id: owner } = req.user;
  const { boardId, title } = req.body;

  if (!boardId) {
    throw HttpError(400, "Board ID is required");
  }

  const newColumn = await columnsServices.addColumn(owner, { boardId, title });

  if (newColumn.error) {
    throw HttpError(409, newColumn.error);
  }

  res.status(201).json(newColumn);
};

const updateColumn = async (req, res) => {
  const { columnId } = req.params;
  const { body } = req;
  const { _id: owner } = req.user;

  if (!body || Object.keys(body).length === 0) {
    throw HttpError(400, "missing field");
  }

  const updatedColumn = await columnsServices.updateColumn(
    columnId,
    owner,
    body
  );

  if (!updatedColumn) {
    throw HttpError(404, `Column with id ${columnId} not found`);
  }

  res.json(updatedColumn);
};

const deleteColumn = async (req, res) => {
  const { columnId } = req.params;
  const { _id: owner } = req.user;

  const column = await columnsServices.removeColumn(columnId, owner);

  if (!column) {
    throw HttpError(404, `Column with id ${columnId} not found`);
  }

  res.json({ message: "Column deleted successfully" });
};

export default {
  getAllColumns: errorCatcher(getAllColumns),
  addColumn: errorCatcher(addColumn),
  updateColumn: errorCatcher(updateColumn),
  deleteColumn: errorCatcher(deleteColumn),
};
