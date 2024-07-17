import { Schema, model } from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

export const columnSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Set title for column"],
    },
    boardId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);
columnSchema.post("save", handleMongooseError);
export const Column = model("column", columnSchema);
