// messageHandler.js
import { bot } from "../telegram-bot.js"; // Импортируем уже настроенный бот

// Функция для обработки команды /id
export const getID = async (msg) => {
  try {
    // Если сообщение содержит команду /id
    if (msg.text && msg.text.toLowerCase() === "/id") {
      // Получаем ID чата
      const chatId = msg.chat.id;
      let responseText = `ID of this group/channel: ${chatId}`;

      // Если это канал
      if (msg.chat.type === "channel") {
        responseText = `This channel's ID: ${chatId}`;
      }

      // Если это группа
      if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
        responseText = `This group's ID: ${chatId}`;
      }

      await bot.sendMessage(msg.chat.id, responseText);
    }
  } catch (error) {
    console.error("Ошибка при обработке сообщения:", error);
  }
};

// Функция для обработки сообщений в канале
export const getChannelID = async (msg) => {
  try {
    if (msg.text && msg.text.toLowerCase() === "/id") {
      const chatId = msg.chat.id;
      const responseText = `This channel's ID: ${chatId}`;

      // Отправляем ID канала обратно в канал
      await bot.sendMessage(chatId, responseText);
      console.log(`This channel's ID: ${chatId}`);
    }
  } catch (error) {
    console.error("Ошибка при обработке сообщения из канала:", error);
  }
};
