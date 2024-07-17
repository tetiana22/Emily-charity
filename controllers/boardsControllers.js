import { errorCatcher, HttpError } from "../helpers/index.js";
import  boardsServices  from "../services/boardsServices.js";
import { mongoose } from "mongoose";

const getAllBoards = async (req, res) => {
  const { _id: owner } = req.user;
  const boards = await boardsServices.listBoards(owner);
  res.json(boards);
};

const addBoard = async (req, res) => {
  const { _id: owner } = req.user;

  const ownerId = new mongoose.Types.ObjectId(owner);

  const newBoard = await boardsServices.addBoard(ownerId, req.body);

  if (newBoard.error) {
    throw HttpError(409, newBoard.error);
  }

  res.status(201).json(newBoard);
};

const updateBoard = async (req, res) => {
  const { _id: owner } = req.user;
  const { boardId } = req.params;
  const { body } = req;

  if (!body || Object.keys(body).length === 0) {
    throw HttpError(400, "missing field");
  }

  try {
    const updatedBoard = await boardsServices.updateBoard(boardId, owner, body);

    if (!updatedBoard) {
      throw HttpError(404, `Board with id ${boardId} not found`);
    }

    res.json(updatedBoard);
  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      throw HttpError(400, `Invalid board ID: ${boardId}`);
    } else {
      throw error;
    }
  }
};

const deleteBoard = async (req, res) => {
  const { _id: owner } = req.user;
  const { boardId } = req.params;

  const board = await boardsServices.removeBoard(owner, boardId);
  if (!board) throw HttpError(404, `Board with id ${boardId} not found`);
  res.json({ message: "Board deleted successfully" });
};

export default {
  getAllBoards: errorCatcher(getAllBoards),
  addBoard: errorCatcher(addBoard),
  updateBoard: errorCatcher(updateBoard),
  deleteBoard: errorCatcher(deleteBoard),
};
