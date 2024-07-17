import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const options = [
  "#icon-Project",
  "#icon-star",
  "#icon-loading",
  "#icon-puzzle-piece",
  "#icon-container",
  "#icon-lightning",
  "#icon-colors",
  "#icon-hexagon",
];

const boardSchema = new Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, "Set title for board"],
    },
    icon: {
      type: String,
      default: "#icon-hexagon",
      enum: options,
    },
    background: {
      type: String,
      default: "1",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

boardSchema.post("save", handleMongooseError);

export const Board = model("board", boardSchema);
