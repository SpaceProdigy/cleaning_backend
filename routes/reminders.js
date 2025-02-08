import express from "express";

import { schedulesReminder } from "../telegram/reminders/autoCleaningReminder.js";

const reminders = express.Router();

reminders.get("/autoReminder", schedulesReminder);

export default reminders;
