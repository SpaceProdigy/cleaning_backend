import { dinamicLessonsModel } from "../../models/lessonsModel.js";
import { bot } from "../telegram-bot.js";
import { messageEnglishReminder } from "./messages.js";
import dayjs from "dayjs";

const lessonsChatMap = {
  lessonwithjills: -1002585856507,
};

const lessons = ["lessonwithjills"];

const options = {
  parse_mode: "HTML",
};

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
