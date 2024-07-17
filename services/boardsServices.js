import { Board } from "../models/Board.js";
import HttpError from "../helpers/HttpError.js";
import { Card, cardSchema } from "../models/Card.js";
import { Column, columnSchema } from "../models/Column.js";

const listBoards = (owner) => Board.find({ owner });

const getOneBoardByFilter = (filter) => Board.findOne(filter);

const addBoard = async (owner, data) => {
  const exist = await Board.findOne({ owner, title: data.title });

  if (exist) {
    return {
      error: "Board with such name already exists",
    };
  }

  const board = await Board.create({ owner, ...data });

  return board;
};

const updateBoard = async (boardId, owner, data) => {
  try {
    const updatedBoard = await Board.findOneAndUpdate(
      {
        _id: boardId,
        owner,
      },
      data,
      {
        new: true,
      }
    );

    return updatedBoard;
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      return null;
    } else {
      throw error;
    }
  }
};

const removeBoard = async (owner, boardId) => {
  const deletedBoard = await Board.findOneAndDelete({
    _id: boardId,
    owner,
  });
  await Column.deleteMany({ boardId, owner });
  await Card.deleteMany({ boardId, owner });

  if (!deletedBoard) {
    throw HttpError(404);
  }

  return true;
};

export default {
  listBoards,
  getOneBoardByFilter,
  addBoard,
  updateBoard,
  removeBoard,
};
