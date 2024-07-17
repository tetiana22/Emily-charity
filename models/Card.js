import { Schema, model } from "mongoose";

import handleMongooseError from "../helpers/handleMongooseError.js";

const priorityList = ["Without priority", "Low", "Medium", "High"];

export const cardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for card"],
    },
    description: {
      type: String,
      required: [true, "Set description for card"],
    },
    priority: {
      type: String,
      enum: priorityList,
      default: "Low",
    },
    color: {
      type: String,
      default: null,
    },
    deadline: {
      type: Date,
      required: [true, "Set deadline for card"],
    },
    columnId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Column",
    },
    boardId: {
      type: Schema.Types.ObjectId,
      reqiured: true,
      ref: "Board",
    },
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    index: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

cardSchema.post("save", handleMongooseError);
export const Card = model("card", cardSchema);