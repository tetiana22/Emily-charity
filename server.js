import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, PORT } = process.env;

if (!DB_HOST) {
  console.error("DB_HOST is not defined. Check your .env file.");
  process.exit(1);
}

mongoose
  .connect(DB_HOST)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
