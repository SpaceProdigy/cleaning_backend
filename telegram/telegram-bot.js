import dayjs from "dayjs";
import TelegramBot from "node-telegram-bot-api";
import schedule from "node-schedule";
import { dinamicModel } from "../models/cleaningSchedules.js";

const { TELEGRAM_BOT_KEY } = process.env;
const token = TELEGRAM_BOT_KEY;
const chatId = -1002236250541;

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
const schedulesReminder = async () => {
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

      const message = `<b>📣 Напоминание / Reminder</b> 

Сегодня <b>${dayjs().format(
        "DD.MM.YYYY"
      )}</b>, а это значит, что пора немного прибраться! 🧹✨ 

Today is <b>${dayjs().format(
        "DD.MM.YYYY"
      )}</b>, which means it's time to do some tidying up! 🧹✨    

На очереди комнаты / Next up are the rooms:

${tasks
  .map(
    ({ roomNumber, task }) =>
      `<b>➡️ ${roomNumber} - ${task.ua} / ${task.en}</b>`
  )
  .join("\n\n")}

Если уборка выполнена, просьба отписаться в группу и скинуть фото! Спасибо за участие! 🙌

If the cleaning is done, please write to the group and send a photo! Thank you for participating! 🙌

 📌 Это сообщение отправлено автоматически. / This message was sent automatically.
`;
      // Отправляем сообщение в Telegram
      await bot.sendMessage(chatId, message, options);
      console.log("Сообщение отправлено.");
    }
  } catch (error) {
    console.error("Ошибка при отправке напоминания:", error);
  }
};

// Планируем выполнение функции каждый день в 8:00
schedule.scheduleJob("0 8 * * *", () => {
  schedulesReminder();
});
