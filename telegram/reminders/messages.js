import dayjs from "dayjs";

export const messageBlueCorridor = (tasks) => `<b>📣 Напоминание / Reminder</b> 

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
