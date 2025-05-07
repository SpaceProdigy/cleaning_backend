export const corridorChatMap = {
  blueCorridor: -1002270137153, // Группа для синиего коридора
  kitchen4: -1002509818103, // Группа для кухни 4
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

// Функция для получения текста на нужном языке
export const getCorridorName = (corridorKey, lang) => {
  const corridor = corridorNames[corridorKey];
  return corridor ? corridor[lang] || corridor.en : "Коридор не найден"; // по умолчанию английский
};

export const botMessages = ({ lang, notifyType, text }) => {
  if (lang === "ru") {
    lang = "ua";
  }

  const notificationMap = {
    ua: {
      greetings: `👋 Привіт, *${text}*!
Вас вітає Telegram-бот.
Я можу показати вам розклад, або ви можете переглянути його у веб-додатку.
`,

      cleaningList: "🧹 Переглянутий список прибирань",
      lesonsList: "🔔 Переглянутий список уроків",
      alreadyProcessed: "⏳ Ваш запит уже обробляється, зачекайте...",
      processingRequest: "🔄 Обробка вашого запиту, зачекайте...",
      processingRequestCorridorTask: `📋 Завдання для <b>${text}</b> завантажуються...`,
      noTask: "Немає завдання",
      noLessons: "Немає уроків",
      errorText: "❌ Сталася помилка, повторіть спробу пізніше.",
      openTheApp: "🚀 Відкрити додаток",
      CorridorNotFound: "Коридор не знайдено",
      LessonsNotFound: "Уроки не знайдено",
      taskNotFound: "Завдання не знайдено",
      backToMainMenu: "Назад",
      selectList: "⬇️ Виберіть Список",
      selectAction: "🔽 Виберіть дію нижче",
    },

    en: {
      greetings: `👋 Hello, *${text}*!
You are welcomed by the Telegram bot.
I can show you the schedule, or you can view it in the web application.
`,
      cleaningList: "🧹 Revised cleaning list",
      lesonsList: "🔔 Revised list of lessons",
      alreadyProcessed:
        "⏳ Your request is already being processed, please wait...",
      processingRequest: "🔄 Processing your request, please wait...",
      processingRequestCorridorTask: `📋 Tasks for ${text} are loading...`,
      errorText: "❌ An error occurred, please try again later.",
      noTask: "No task",
      noLessons: "No lessons",
      openTheApp: "🚀 Open the app",
      CorridorNotFound: "Corridor not found",
      LessonsNotFound: "Lessons not found",
      taskNotFound: "Task not found",
      backToMainMenu: "Back",
      selectList: "⬇️ Select List",
      selectAction: "🔽 Choose an action below",
    },
  };

  const selectedLanguage = notificationMap[lang] || notificationMap.en;

  const notifyMessage =
    selectedLanguage[notifyType] ||
    (lang === "ua" ? "Невідома команда!" : "Unknown error!");

  return notifyMessage;
};

export const corridorNames = {
  blueCorridor: {
    en: "🔵 Blue Corridor",
    ua: "🔵 Синій коридор",
  },
  redCorridor: {
    en: "🔴 Red Corridor",
    ua: "🔴 Червоний коридор",
  },
  yellowCorridor: {
    en: "🟡 Yellow Corridor",
    ua: "🟡 Жовтий коридор",
  },
  kitchen3: {
    en: "🍽 Kitchen 3",
    ua: "🍽 Кухня 3",
  },
  kitchen4: {
    en: "🍽 Kitchen 4",
    ua: "🍽 Кухня 4",
  },
  kitchen5: {
    en: "🍽 Kitchen 5",
    ua: "🍽 Кухня 5",
  },
  kitchen6: {
    en: "🍽 Kitchen 6",
    ua: "🍽 Кухня 6",
  },
};

export const getCorridorOptions = (lang) => {
  if (lang === "ru" || lang === "ua") {
    lang = "ua";
  } else {
    lang = "en";
  }

  // Проверка на наличие всех нужных значений
  const options = [
    { text: corridorNames.blueCorridor[lang] || "Unknown" },
    { text: corridorNames.redCorridor[lang] || "Unknown" },
    { text: corridorNames.yellowCorridor[lang] || "Unknown" },
    { text: corridorNames.kitchen3[lang] || "Unknown" },
    { text: corridorNames.kitchen4[lang] || "Unknown" },
    { text: corridorNames.kitchen5[lang] || "Unknown" },
    { text: corridorNames.kitchen6[lang] || "Unknown" },
  ];

  return options;
};

export const lessonsNames = {
  lessonWithJill: {
    en: "🏫 English lesson with Jill",
    ua: "🏫 Урок англійської з Джилл",
  },
  lessonWithBert: {
    en: "🎸Guitar Lessons with Bert",
    ua: "🎸Уроки гітари з Бертом",
  },
};

export const getLessonsOptions = (lang) => {
  if (lang === "ru" || lang === "ua") {
    lang = "ua";
  } else {
    lang = "en";
  }

  // Проверка на наличие всех нужных значений
  const options = [
    { text: lessonsNames.lessonWithJill[lang] || "Unknown" },
    { text: lessonsNames.lessonWithBert[lang] || "Unknown" },
  ];

  return options;
};
