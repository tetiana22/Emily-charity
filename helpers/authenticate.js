import jwt from "jsonwebtoken";
import HttpError from "./HttpError.js";
import dotenv from "dotenv";
import { User } from "../models/User.js";
dotenv.config();

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  console.log("Authorization header:", authorization);
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer" || !token) {
    console.log("Invalid bearer token");
    return next(HttpError(401, "Not authorized"));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    console.log("Token verified, user ID:", id);
    const user = await User.findById(id);

    if (!user || user.token !== token) {
      console.log("User not found or token mismatch");
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return next(HttpError(401, "Not authorized"));
  }
};
export default authenticate;
