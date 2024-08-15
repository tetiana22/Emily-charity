import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import paymentRouter from "./routes/paymentRouter.js";

// Завантаження змінних середовища з .env файлу
dotenv.config();

// Створення __dirname для ES-модулів
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Статичні файли
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json()); // Використання вбудованого json парсера
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://emily-charity-frontend.onrender.com",
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Роутінг
app.use("/", paymentRouter);

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
