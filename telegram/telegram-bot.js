import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { botMessages, corridorNames, corridors } from "./locales.js";
import dayjs from "dayjs";
import { dinamicModel } from "../models/cleaningSchedules.js";
import { getChannelID, getID } from "./botCommands/getID.js";
import { Router } from "express";

dotenv.config();

const telegramBotRoute = Router();

const { TELEGRAM_BOT_KEY_FLEX_SP_BOT } = process.env;
const url = "https://cleaning-backend.onrender.com";

export const bot = new TelegramBot(TELEGRAM_BOT_KEY_FLEX_SP_BOT);
bot.setWebHook(`${url}/bot${TELEGRAM_BOT_KEY_FLEX_SP_BOT}`);

console.log("🤖 Бот успешно запущен!");

// Обработка обновлений от Telegram
telegramBotRoute.post(`/bot${TELEGRAM_BOT_KEY_FLEX_SP_BOT}`, (req, res) => {
  console.log("✅ Получены обновления от Telegram");
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Пинг для проверки бота
bot.on("message", (msg) => {
  bot.sendMessage(msg.chat.id, "I am alive!");
});

export default telegramBotRoute;

// 📌 Обработка всех сообщений
bot.on("message", getID);

bot.on("channel_post", getChannelID);

// 🟢 Блокируем спам нажатий (чтобы не кликали 100 раз подряд)
const processingRequests = new Set();

// 📌 Обработка команды /start
bot.onText(/\/start/, async (msg) => {
  const lang = msg.from.language_code;
  const firstName = msg.chat.first_name;

  const chatId = msg.chat.id;

  if (processingRequests.has(chatId)) {
    return bot.sendMessage(
      chatId,
      botMessages({ lang, notifyType: "alreadyProcessed" })
    );
  }

  processingRequests.add(chatId);
  bot.sendMessage(
    chatId,
    botMessages({ lang, notifyType: "processingRequest" })
  );

  try {
    bot.sendMessage(
      chatId,
      botMessages({ lang, notifyType: "greetings", text: firstName }),
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: botMessages({ lang, notifyType: "selectLists" }),
                callback_data: "get_list",
              },
            ],
            [
              {
                text: botMessages({ lang, notifyType: "openTheApp" }),
                url: "https://t.me/flex_sp_bot/fox",
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    bot.sendMessage(chatId, botMessages({ lang, notifyType: "errorText" }));
    console.error(error);
  } finally {
    processingRequests.delete(chatId);
  }
});

// 📌 Обработка всех кнопок
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id;
  const corridor = query.data;
  const lang = query.from.language_code;

  if (processingRequests.has(chatId)) {
    return bot.sendMessage(
      chatId,
      botMessages({ lang, notifyType: "alreadyProcessed" })
    );
  }

  processingRequests.add(chatId);

  try {
    if (corridors.includes(corridor)) {
      bot.sendMessage(
        chatId,
        botMessages({
          lang,
          notifyType: "processingRequestCorridorTask",
          text: corridorNames[corridor],
        }),
        { parse_mode: "HTML" }
      );
    }

    if (corridor === "get_list") {
      processingRequests.delete(chatId);
      return bot.sendMessage(chatId, "Выбери коридор:", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔵 Синий", callback_data: "blueCorridor" }],
            // [{ text: "🔴 Красный", callback_data: "redCorridor" }],
            // [{ text: "🟡 Желтый", callback_data: "yellowCorridor" }],
            // [{ text: "🍽️ Кухня 3", callback_data: "kitchen3" }],
            [{ text: "🍽️ Кухня 4", callback_data: "kitchen4" }],
            // [{ text: "🍽️ Кухня 5", callback_data: "kitchen5" }],
            // [{ text: "🍽️ Кухня 6", callback_data: "kitchen6" }],
          ],
        },
      });
    }

    const startOfMonth = dayjs().startOf("week").format("YYYY-MM-DD");
    const endOfMonth = dayjs().endOf("week").format("YYYY-MM-DD");

    const filter = {
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    };

    const tasks = await dinamicModel(corridor)
      .find(filter)
      .sort({ date: 1, task: 1, roomNumber: 1 });

    if (!tasks.length) {
      bot.sendMessage(chatId, botMessages({ lang, notifyType: "noTask" }));

      return;
    }

    bot.sendMessage(
      chatId,
      `${tasks
        .map(
          ({ roomNumber, task, date }) =>
            `
<b>⌛${date}</b> 
<b>➡️ ${roomNumber} - ${task.ua} / ${task.en}</b> `
        )
        .join("\n\n")}`,
      { parse_mode: "HTML" }
    );
  } catch (error) {
    bot.sendMessage(chatId, botMessages({ lang, notifyType: "errorText" }));
    console.error(error);
  } finally {
    processingRequests.delete(chatId);
  }
});
