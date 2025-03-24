import "dotenv/config";
import cors from "cors";
import express from "express";
import logger from "morgan";
import dinamicCleaningRoute from "./routes/dinamicCleaningRoute.js";
import reminders from "./routes/reminders.js";
import users from "./routes/users.js";
import "./telegram/telegram-bot.js";
import dinamicLessonsRoute from "./routes/dinamicLessonsRoute.js";
import postsRoute from "./routes/postsRoute.js";
import uploadRoute from "./routes/uploadRoute.js";

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cors());

// console.log(process.env);

app.use("/cleaning", dinamicCleaningRoute);
app.use("/lessons", dinamicLessonsRoute);
app.use("/users", users);
app.use("/telegram", reminders);
app.use("/posts", postsRoute);
app.use("/upload", uploadRoute);

app.use(function (req, res) {
  res.status(404).json({ message: "Not found" });
});

app.use(function (err, req, res, next) {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

export default app;
