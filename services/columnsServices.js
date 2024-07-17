import { HttpError } from "../helpers/index.js";
import { Card } from "../models/Card.js";
import { Column } from "../models/Column.js";

const getAllColumns = async (id, owner) => {
  const columns = await Column.find({ boardId: id, owner });

  if (!columns) {
    throw HttpError(404);
  }

  return columns;
};

const addColumn = async (owner, data) => {
  const exist = await Column.findOne({ title: data.title });

  if (exist) {
    return {
      error: "Column with such title already exists",
    };
  }
  const newColumn = await Column.create({ ...data, owner });

  return newColumn;
};

const updateColumn = async (id, owner, data) => {
  const updatedColumn = await Column.findOneAndUpdate(
    { _id: id, owner },
    data,
    { new: true }
  );

  return updatedColumn;
};

const removeColumn = async (id, owner) => {
  const deletedColumn = await Column.findOneAndDelete({
    _id: id,
    owner,
  });

  await Card.deleteMany({ columnId: id, owner });

  return deletedColumn;
};

export default {
  getAllColumns,
  addColumn,
  updateColumn,
  removeColumn,
};
