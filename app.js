import express from "express";
import bodyParser from "body-parser";
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

app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
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

// Логування часу виконання запитів
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} [${res.statusCode}] - ${duration}ms`
    );
  });
  next();
});

// Health-check ендпоінт
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/payments", paymentRouter);

export default app;
