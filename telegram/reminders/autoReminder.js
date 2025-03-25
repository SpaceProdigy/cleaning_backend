import schedule from "node-schedule";
import { schedulesReminder } from "./cleaningAutoReminder.js";
import { schedulesLessonsReminder } from "./lessonsReminder.js";

schedule.scheduleJob("0 8 * * *", function () {
  console.log("⏳ Запуск автонапоминания уборки...");
  schedulesReminder();
});

schedule.scheduleJob("56 1 * * *", function () {
  console.log("⏳ Запуск автонапоминания уроков...");
  schedulesLessonsReminder();
});
