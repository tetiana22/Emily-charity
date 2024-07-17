import { Schema, model } from "mongoose";

import handleMongooseError from "../helpers/handleMongooseError.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const themeList = ["light", "violet", "dark"];

export const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegexp,
    },
    password: {
      type: String,
      validate: {
        validator: function (value) {
          return value.length >= 6;
        },
        message: "Password must be at least 6 characters long",
      },
      required: [true, "Password is required"],
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: { type: String, default: "" },
    theme: {
      type: String,
      enum: themeList,
      default: "dark",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);
export const User = model("user", userSchema);
