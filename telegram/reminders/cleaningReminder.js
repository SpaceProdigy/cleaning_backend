import dayjs from "dayjs";
import { dinamicModel } from "../../models/cleaningSchedules.js";
import { messageBlueCorridor } from "./messages.js";
import { corridorChatMap } from "../locales.js";
import { bot } from "../telegram-bot.js";
import { SentMessages } from "../../models/sentMessages.js";

const options = {
  parse_mode: "HTML",
};

export const cleaningReminder = async (req, res) => {
  try {
    const { group } = req.params;
    const today = dayjs().format("YYYY-MM-DD");

    const alreadySent = await SentMessages.findOne({ group, date: today });

    if (alreadySent) {
      console.log(`🔹 Сообщение для группы ${group} уже отправлено сегодня.`);
      return res.json(alreadySent);
    }

    const tasks = await dinamicModel(group)
      .find({
        date: today,
      })
      .sort({ task: 1, roomNumber: 1 });

    if (!tasks.length) {
      console.log(`Нет задач для группы ${group}.`);
      return res.status(200).send(`Нет задач для группы ${group}.`);
    }

    const chatId = corridorChatMap[group];

    if (!chatId) {
      console.log(`Нет чата для группы ${group}.`);
      return res.status(400).send(`Нет чата для группы ${group}.`);
    }

    try {
      await bot.sendMessage(chatId, messageBlueCorridor(tasks), options);
      console.log(`Сообщение отправлено в группу ${group}`);
      // Ищем запись по группе и обновляем ее
      const updatedMessage = await SentMessages.findOneAndUpdate(
        { group }, // Ищем существующую запись по группе
        { date: today, alreadySent: true, chatId }, // Обновляем данные
        { upsert: true, new: true } // Если нет записи - создаем, если есть - обновляем
      );

      console.log(`Запись обновлена/создана:`, updatedMessage);

      return res.json({ group, date: today, alreadySent: false, chatId });
    } catch (error) {
      console.error(`Ошибка при отправке сообщения в группу ${group}:`, error);
      return res
        .status(500)
        .send(`Ошибка при отправке сообщения в группу ${group}.`);
    }
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return res.status(500).send("Произошла ошибка при отправке напоминания.");
  }
};
