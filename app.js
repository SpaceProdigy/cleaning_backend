import "dotenv/config";
import cors from "cors";
import express from "express";
import logger from "morgan";

import cleaningRouter from "./routes/cleaning.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());

// console.log(process.env);

app.use("/cleaning", cleaningRouter);

app.use(function (req, res) {
  res.status(404).json({ message: "Not found" });
});

app.use(function (err, req, res, next) {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

export default app;
