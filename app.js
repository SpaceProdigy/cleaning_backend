import "dotenv/config";
import cors from "cors";
import express from "express";
import logger from "morgan";
import dinamicCleaningRoute from "./routes/dinamicCleaningRoute.js";
import reminders from "./routes/reminders.js";
import users from "./routes/users.js";
import dinamicLessonsRoute from "./routes/dinamicLessonsRoute.js";
import postsRoute from "./routes/postsRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import "./telegram/reminders/autoReminder.js";
import booksRoute from "./routes/booksRoute.js";
import { bot, TELEGRAM_BOT_KEY } from "./telegram/telegram-bot.js";

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
app.use("/books", booksRoute);

app.post(`/bot${TELEGRAM_BOT_KEY}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.use(function (req, res) {
  res.status(404).json({ message: "Not found" });
});

app.use(function (err, req, res, next) {
  const { status = 500, message = "Server error" } = err;

  res.status(status).json({ message });
});

export default app;
