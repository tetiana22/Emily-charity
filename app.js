import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import paymentRouter from "./routes/paymentRouter.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Конфігурація CORS з обмеженням доменів
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://emily-charity-frontend.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Оптимізація статичних ресурсів
app.use(express.static(path.join(__dirname, "dist"), { maxAge: "1d" }));
app.use(express.json());

// Маршрутизація
app.use("/", paymentRouter);

// Централізована обробка помилок
app.use((err, req, res, next) => {
  console.error(`Error: ${err.stack}`);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;

// import express from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";
// import dotenv from "dotenv";
// import paymentRouter from "./routes/paymentRouter.js";

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.use(express.static(path.join(__dirname, "dist")));
// app.use(express.json());
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:5173",
//       "https://emily-charity-frontend.onrender.com",
//     ],
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use("/", paymentRouter);

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// export default app;
