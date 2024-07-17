import { errorCatcher, HttpError } from "../helpers/index.js";
import cardsServices from "../services/cardsServices.js";

const getAllCards = async (req, res) => {
  const { _id: owner } = req.user;
  const { boardId } = req.params;

  const cards = await cardsServices.getAllCards(boardId, owner);

  res.json(cards);
};

const addCard = async (req, res) => {
  const { _id: owner } = req.user;
  const { body } = req;

  const newCard = await cardsServices.addCards(owner, body);

  res.status(201).json(newCard);
};

const updateCard = async (req, res) => {
  const { cardId } = req.params;
  const { body } = req;
  const { _id: owner } = req.user;

  if (!body || Object.keys(body).length === 0) {
    throw HttpError(400, "missing field");
  }

  const updatedCard = await cardsServices.updateCard(cardId, owner, body);

  if (!updatedCard) {
    throw HttpError(404, `Card with id ${cardId} not found`);
  }

  res.json(updatedCard);
};

const updateColumnIdInCard = async (req, res) => {
  const { cardId } = req.params;
  const { body } = req;
  const { _id: owner } = req.user;

  const updateCard = await cardsServices.updateColumnIdInCard(
    cardId,
    owner,
    body
  );

  if (!updateCard) {
    throw HttpError(404, `Card with id ${cardId} not found`);
  }
};

const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  const { _id: owner } = req.user;

  const card = await cardsServices.removeCard(cardId, owner);

  if (!card) {
    throw HttpError(404, `Card with id ${cardId} not found`);
  }

  res.json({ message: "Card deleted successfully" });
};

export default {
  getAllCards: errorCatcher(getAllCards),
  addCard: errorCatcher(addCard),
  updateCard: errorCatcher(updateCard),
  updateColumnIdInCard: errorCatcher(updateColumnIdInCard),
  deleteCard: errorCatcher(deleteCard),
};
