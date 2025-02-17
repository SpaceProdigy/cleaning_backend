export const corridorChatMap = {
  blueCorridor: -1002236250541, // Группа для синиего коридора
  kitchen4: -1002166625361, // Группа для кухни 4
};

export const corridors = [
  "blueCorridor",
  "redCorridor",
  "yellowCorridor",
  "kitchen3",
  "kitchen4",
  "kitchen5",
  "kitchen6",
];

export const corridorNames = {
  blueCorridor: "🔵 Синий коридор",
  redCorridor: "🔴 Красный коридор",
  yellowCorridor: "🟡 Желтый коридор",
  kitchen3: "🍽️ Кухня 3",
  kitchen4: "🍽️ Кухня 4",
  kitchen5: "🍽️ Кухня 5",
  kitchen6: "🍽️ Кухня 6",
};

export const botMessages = ({ lang, notifyType, text }) => {
  if (lang === "ru") {
    lang = "ua";
  }

  const notificationMap = {
    ua: {
      greetings: `👋 Привіт, *${text}*!
Вас вітає Telegram-бот.

🔽 Виберіть дію нижче:`,
      selectLists: "📋 Переглянутий список завдань",
      alreadyProcessed: "⏳ Ваш запит уже обробляється, зачекайте...",
      processingRequest: "🔄 Обробка вашого запиту, зачекайте...",
      processingRequestCorridorTask: `📋 Завдання для <b>${text}</b> завантажуються...`,
      noTask: "Нема завдання",
      errorText: "❌ Сталася помилка, повторіть спробу пізніше.",
      openTheApp: "🚀 Відкрийти програму",
    },

    en: {
      greetings: `👋 Hello, *${text}*!
You are welcomed by the Telegram bot.

🔽 Choose an action below:`,
      selectLists: "📋 View task list",
      alreadyProcessed:
        "⏳ Your request is already being processed, please wait...",
      processingRequest: "🔄 Processing your request, please wait...",
      processingRequestCorridorTask: `📋 Tasks for ${text} are loading...`,
      errorText: "❌ An error occurred, please try again later.",
      noTask: "No task",
      openTheApp: "🚀 Open the app",
    },
  };

  const selectedLanguage = notificationMap[lang] || notificationMap.en;

  const notifyMessage =
    selectedLanguage[notifyType] ||
    (lang === "ua" ? "Невідома команда!" : "Unknown error!");

  return notifyMessage;
};
