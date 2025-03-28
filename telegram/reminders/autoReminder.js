import schedule from "node-schedule";
import { schedulesReminder } from "./cleaningAutoReminder.js";
import { schedulesLessonsReminder } from "./lessonsReminder.js";

schedule.scheduleJob("20 1 * * *", function () {
  console.log("⏳ Запуск автонапоминаний...");
  schedulesReminder();
  schedulesLessonsReminder();
});
