import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import {
  handleStartCommand,
  handleTextCleaningMessage,
  handleTextLessonsMessage,
} from "./handlers/messageHandlers.js";
import { getChannelID, getID } from "./handlers/getID.js";

dotenv.config();

const { TELEGRAM_BOT_KEY_FLEX_SP_BOT } = process.env;

export const bot = new TelegramBot(TELEGRAM_BOT_KEY_FLEX_SP_BOT, {
  polling: true,
});

console.log("🤖 Бот успешно запущен!");

bot.on("message", (msg) => {
  getID(msg);
  handleTextCleaningMessage(msg);
  handleTextLessonsMessage(msg);
});

bot.onText(/\/start/, async (msg) => {
  await handleStartCommand(msg);
});

bot.on("channel_post", (msg) => {
  getChannelID(msg);
});
