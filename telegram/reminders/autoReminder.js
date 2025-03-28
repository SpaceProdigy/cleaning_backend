import schedule from "node-schedule";
import { schedulesReminder } from "./cleaningAutoReminder.js";
import { schedulesLessonsReminder } from "./lessonsReminder.js";
const rule = new schedule.RecurrenceRule();
rule.hour = 8;
rule.minute = 0;
rule.tz = "Europe/Amsterdam";

schedule.scheduleJob(rule, async function () {
  console.log("⏳ Запуск автонапоминаний...");
  await schedulesReminder();
  await schedulesLessonsReminder();
});
