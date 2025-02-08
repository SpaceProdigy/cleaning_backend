import dayjs from "dayjs";
import TelegramBot from "node-telegram-bot-api";
import { dinamicModel } from "../../models/cleaningSchedules.js";
import { messageBlueCorridor } from "./messages.js";

const { TELEGRAM_BOT_KEY } = process.env;

const token = TELEGRAM_BOT_KEY;

console.log("Бот запускается...");

const bot = new TelegramBot(token, { polling: true });

bot.on("polling_error", (error) => {
  console.error("Ошибка polling:", error);
});

console.log("Бот успешно запущен!");

// bot.on("message", (msg) => {
//   const chatId = msg.forward_from_chat?.id || msg.chat.id;
//   console.log("Chat ID:", chatId);
//   bot.sendMessage(chatId, "Ваш chatId: " + chatId);
// });

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
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Посмотреть расписание",
          url: "https://spaceprodigy.github.io/cleaning_frontend/",
        },
      ],
    ],
  },
};

// Функция для отправки напоминания
export const schedulesReminder = async (req, res) => {
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
    // Возвращаем успешный статус
    res.status(200).send("Напоминания успешно отправлены.");
  } catch (error) {
    console.error("Ошибка при отправке напоминания:", error);
    res.status(500).send("Произошла ошибка при отправке напоминания.");
  }
};
