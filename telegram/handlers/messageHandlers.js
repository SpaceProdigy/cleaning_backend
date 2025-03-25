import { dinamicModel } from "../../models/cleaningSchedules.js";
import {
  botMessages,
  corridorNames,
  getCorridorOptions,
  getLessonsOptions,
  lessonsNames,
} from "../locales.js";
import dayjs from "dayjs";
import { processingRequests } from "../utils/processingRequests.js";
import { bot } from "../telegram-bot.js";
import { dinamicLessonsModel } from "../../models/lessonsModel.js";

// Обработка команды /start
export const handleStartCommand = async (msg) => {
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
    await bot.sendMessage(
      chatId,
      botMessages({ lang, notifyType: "greetings", text: firstName }),
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
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
    bot.sendMessage(
      chatId,
      botMessages({ lang, notifyType: "selectAction", text: firstName }),
      {
        parse_mode: "Markdown",
        reply_markup: {
          keyboard: [
            [{ text: botMessages({ lang, notifyType: "cleaningList" }) }],
            [{ text: botMessages({ lang, notifyType: "lesonsList" }) }],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } catch (error) {
    bot.sendMessage(chatId, botMessages({ lang, notifyType: "errorText" }));
    console.error(error);
  } finally {
    processingRequests.delete(chatId);
  }
};

// Обработка нажатий на обычные кнопки (не инлайн)
export const handleTextCleaningMessage = async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text; // Текст кнопки, на которую нажал пользователь
  let lang = msg.from.language_code;

  if (lang === "ru" || lang === "ua") {
    lang = "ua";
  } else {
    lang = "en";
  }

  if (processingRequests.has(chatId)) {
    return bot.sendMessage(
      chatId,
      botMessages({ lang, notifyType: "alreadyProcessed" })
    );
  }

  processingRequests.add(chatId);

  try {
    if (text === botMessages({ lang, notifyType: "cleaningList" })) {
      const corridorOptions = getCorridorOptions(lang);

      return bot.sendMessage(
        chatId,
        botMessages({
          lang,
          notifyType: "selectList",
          text: text,
        }),
        {
          reply_markup: {
            keyboard: [
              ...corridorOptions.map((option) => [{ text: option.text }]), // Кнопки для коридоров
              [{ text: botMessages({ lang, notifyType: "backToMainMenu" }) }], // Кнопка "Назад"
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }

    if (text === botMessages({ lang, notifyType: "backToMainMenu" })) {
      processingRequests.delete(chatId);
      return handleStartCommand(msg); // Возвращаем к основному меню
    }

    const cleaningText = Object.values(corridorNames).map(
      ({ en, ua }) => `${en},${ua}`
    );
    if (cleaningText.join(",").includes(text)) {
      // Проверим, какой коридор был выбран
      const selectedCorridorKey = Object.keys(corridorNames).find(
        (key) => corridorNames[key][lang] === text
      );

      if (!selectedCorridorKey) {
        return bot.sendMessage(
          chatId,
          botMessages({
            lang,
            notifyType: "CorridorNotFound",
            text: text,
          })
        );
      }

      const corridor = selectedCorridorKey;

      bot.sendMessage(
        chatId,
        botMessages({
          lang,
          notifyType: "processingRequestCorridorTask",
          text: text,
        }),
        { parse_mode: "HTML" }
      );

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
    }
  } catch (error) {
    bot.sendMessage(chatId, botMessages({ lang, notifyType: "errorText" }));
    console.error(error);
  } finally {
    processingRequests.delete(chatId);
  }
};

export const handleTextLessonsMessage = async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  let lang = msg.from.language_code;

  if (lang === "ru" || lang === "ua") {
    lang = "ua";
  } else {
    lang = "en";
  }

  if (processingRequests.has(chatId)) {
    return bot.sendMessage(
      chatId,
      botMessages({ lang, notifyType: "alreadyProcessed" })
    );
  }

  processingRequests.add(chatId);

  try {
    if (text === botMessages({ lang, notifyType: "lesonsList" })) {
      const lessonsOptions = getLessonsOptions(lang);

      return bot.sendMessage(
        chatId,
        botMessages({
          lang,
          notifyType: "selectList",
          text: text,
        }),
        {
          reply_markup: {
            keyboard: [
              ...lessonsOptions.map((option) => [{ text: option.text }]), // Кнопки для коридоров
              [{ text: botMessages({ lang, notifyType: "backToMainMenu" }) }], // Кнопка "Назад"
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }

    const lessonsText = Object.values(lessonsNames).map(
      ({ en, ua }) => `${en},${ua}`
    );

    if (lessonsText.join(",").includes(text)) {
      const selectedLessonKey = Object.keys(lessonsNames).find(
        (key) => lessonsNames[key][lang] === text
      );

      if (!selectedLessonKey) {
        return bot.sendMessage(
          chatId,
          botMessages({
            lang,
            notifyType: "LessonsNotFound",
            text: text,
          })
        );
      }

      const lessons = selectedLessonKey;

      bot.sendMessage(
        chatId,
        botMessages({
          lang,
          notifyType: "processingRequestCorridorTask",
          text: text,
        }),
        { parse_mode: "HTML" }
      );

      const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
      const endOfMonth = dayjs().endOf("month").format("YYYY-MM-DD");

      const filter = {
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      };

      const lessonsArr = await dinamicLessonsModel(lessons)
        .find(filter)
        .sort({ date: 1 });

      if (!lessonsArr.length) {
        bot.sendMessage(chatId, botMessages({ lang, notifyType: "noLessons" }));
        return;
      }

      bot.sendMessage(
        chatId,
        `${lessonsArr
          .map(
            ({ startTime, endTime, place, topic, notes, date }) => `
${place ? `<b>📍 Location:</b> ${place}` : ""}

${date ? `<b>📆 Date:</b> ${dayjs(date).format("DD.MM.YYYY")}` : ""}
        
${
  startTime && endTime
    ? `<b>⏰ Time:</b> ${dayjs(startTime).format("HH:mm")} - ${dayjs(
        endTime
      ).format("HH:mm")}`
    : ""
}
${
  topic || notes
    ? `
${topic ? `<b>📝 Topic:</b> ${topic}` : ""}
  
${notes ? `<b>🗒️ Notes:</b> ${notes}` : ""}
        `
    : ""
} 
 ------------------------------    `
          )
          .join("\n\n")}`,
        { parse_mode: "HTML" }
      );
    }
  } catch (error) {
    bot.sendMessage(chatId, botMessages({ lang, notifyType: "errorText" }));
    console.error(error);
  } finally {
    processingRequests.delete(chatId);
  }
};
