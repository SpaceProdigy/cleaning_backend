import express from "express";

// import { schedulesReminder } from "../telegram/reminders/autoCleaningReminder.js";
import { cleaningReminder } from "../telegram/reminders/cleaningReminder.js";

const reminders = express.Router();

// reminders.get("/autoReminder", schedulesReminder);

reminders.post("/:group", cleaningReminder);

export default reminders;
