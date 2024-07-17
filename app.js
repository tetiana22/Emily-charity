import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

import authRouter from "./routes/authRouter.js";
import boardsRouter from "./routes/boardsRouter.js";
import columnsRouter from "./routes/columnsRouter.js";
import cardsRouter from "./routes/cardsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

// Routers
app.use("/users", authRouter);
app.use("/boards", boardsRouter);
app.use("/columns", columnsRouter);
app.use("/cards", cardsRouter);

// Read Swagger JSON file synchronously
const swaggerDocs = JSON.parse(fs.readFileSync("./swagger.json", "utf-8"));

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
