import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import {
  handleStartCommand,
  handleTextCleaningMessage,
  handleTextLessonsMessage,
} from "./handlers/messageHandlers.js";
import { getChannelID, getID } from "./handlers/getID.js";
import { handleDocumentUpload } from "./handlers/fileHandler.js";

dotenv.config();

export const TELEGRAM_BOT_KEY = process.env.TELEGRAM_BOT_KEY_FLEX_SP_BOT;
const url = "https://cleaning-backend.onrender.com";

export const bot = new TelegramBot(TELEGRAM_BOT_KEY);

bot
  .setWebHook(`${url}/bot${TELEGRAM_BOT_KEY}`)
  .then(() => {
    console.log("Webhook successfully set");
  })
  .catch((error) => {
    console.error("Error setting webhook:", error);
  });

console.log("🤖 Bot successfully run!");

bot.on("document", async (msg) => {
  try {
    await handleDocumentUpload(msg, bot, TELEGRAM_BOT_KEY);
  } catch (error) {
    console.error("Ошибка в обработке document:", error);
  }
});

bot.on("message", async (msg) => {
  try {
    const chatType = msg.chat.type;
    const isGroup = chatType === "group" || chatType === "supergroup";

    if (msg.text === "/id") {
      await getID(msg, bot);
    }

    if (!isGroup) {
      await handleTextCleaningMessage(msg, bot);
      await handleTextLessonsMessage(msg, bot);
    }
  } catch (error) {
    console.error("Ошибка в обработке сообщения:", error);
  }
});

bot.onText(/\/start/, async (msg) => {
  try {
    const chatType = msg.chat.type;
    const isGroup = chatType === "group" || chatType === "supergroup";
    if (!isGroup) {
      await handleStartCommand(msg, bot);
    }
  } catch (error) {
    console.error("Ошибка в обработке команды /start:", error);
  }
});

bot.on("channel_post", async (msg) => {
  try {
    if (msg.text === "/id") {
      await getChannelID(msg, bot);
    }
  } catch (error) {
    console.error("Ошибка в обработке поста в канале:", error);
  }
});

bot.on("polling_error", (err) => console.error("Polling error:", err));
