import dayjs from "dayjs";
import { dinamicModel } from "../../models/cleaningSchedules.js";
import { messageBlueCorridor, messageEnglishReminder } from "./messages.js";

import schedule from "node-schedule";
import { bot } from "../telegram-bot.js";
import { dinamicLessonsModel } from "../../models/lessonsModel.js";

const corridorChatMap = {
  blueCorridor: -1002236250541, // Группа для синиего коридора
  kitchen4: -1002166625361, // Группа для кухни 4
};

const corridors = [
  "blueCorridor",
  "redCorridor",
  "yellowCorridor",
  "kitchen3",
  "kitchen4",
  "kitchen5",
  "kitchen6",
];

const options = {
  parse_mode: "HTML",
};

// Функция для отправки напоминания
export const schedulesReminder = async () => {
  try {
    // Собираем все задачи из всех коллекций
    const tasksByCorridor = {};

    await Promise.all(
      corridors.map(async (corridor) => {
        const tasks = await dinamicModel(corridor).find({
          date: dayjs().format("YYYY-MM-DD"),
        });
        if (tasks.length) tasksByCorridor[corridor] = tasks;
      })
    );

    for (const [corridor, tasks] of Object.entries(tasksByCorridor)) {
      const chatId = corridorChatMap[corridor]; // Получаем ID чата

      if (!chatId) {
        console.log(`Нет чата для ${corridor}, пропускаем.`);
        continue;
      }

      // Отправляем сообщение в Telegram
      try {
        await bot.sendMessage(chatId, messageBlueCorridor(tasks), options);
        console.log(`Сообщение отправлено в группу ${corridor}`);
      } catch (error) {
        console.error(
          `Ошибка при отправке сообщения в группу ${corridor}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Ошибка при отправке напоминания:", error);
  }
};

const lessonsChatMap = {
  lessonwithjills: -1002585856507,
};

const lessons = ["lessonwithjills"];

export const schedulesLessonsReminder = async () => {
  try {
    const tasksByLessons = {};

    await Promise.all(
      lessons.map(async (lesson) => {
        const startOfDay = dayjs().startOf("day").toISOString(); // начало текущего дня
        const endOfDay = dayjs().endOf("day").toISOString(); // конец текущего дня

        const tasks = await dinamicLessonsModel(lesson).find({
          date: {
            $gte: startOfDay, // >= начало дня
            $lte: endOfDay, // <= конец дня
          },
        });

        if (tasks.length) tasksByLessons[lesson] = tasks;
      })
    );

    for (const [lesson, tasks] of Object.entries(tasksByLessons)) {
      const chatId = lessonsChatMap[lesson]; // Получаем ID чата

      if (!chatId) {
        console.log(`Нет чата для ${lesson}, пропускаем.`);
        continue;
      }

      // Отправляем сообщение в Telegram
      try {
        await bot.sendMessage(chatId, messageEnglishReminder(tasks), options);
        console.log(`Сообщение отправлено в группу ${lesson}`);
      } catch (error) {
        console.error(
          `Ошибка при отправке сообщения в группу ${lesson}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Ошибка при отправке напоминания:", error);
  }
};

schedule.scheduleJob("0 8 * * *", function () {
  schedulesReminder();
});

schedule.scheduleJob("0 11 * * *", function () {
  schedulesLessonsReminder();
});
