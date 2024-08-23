import "dotenv/config";
import cors from "cors";
import express from "express";
import logger from "morgan";
import dinamicCleaningRoute from "./routes/dinamicCleaningRoute.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());

// console.log(process.env);

app.use("/cleaning", dinamicCleaningRoute);

app.use(function (req, res) {
  res.status(404).json({ message: "Not found" });
});

app.use(function (err, req, res, next) {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

export default app;
