import mongoose from "mongoose";
import app from "./app.js";
import { bot } from "./telegram/telegram-bot.js";
import "./telegram/reminders/autoReminder.js";
// npx ngrok http 3000

const { DB_HOST, PORT } = process.env;
const WEBHOOK_URL = "https://cleaning-backend.onrender.com/webhook";

// Обработчик Webhook от Telegram
app.post("/webhook", (req, res) => {
  bot.processUpdate(req.body); // Telegram отправляет обновления сюда
  res.sendStatus(200);
});

mongoose
  .connect(DB_HOST)
  .then(async () => {
    app.listen(PORT || 3000, async () => {
      console.log(`🚀 Server running on port ${PORT}`);

      try {
        // Прямо устанавливаем Webhook, без предварительной проверки
        const result = await bot.setWebHook(WEBHOOK_URL);
        if (result) {
          console.log(`✅ Webhook установлен на ${WEBHOOK_URL}`);
        } else {
          console.error("❌ Ошибка установки Webhook");
        }
      } catch (error) {
        console.error("❌ Ошибка при установке Webhook:", error);
      }
    });
  })
  .catch((error) => {
    console.log("❌ Ошибка подключения к MongoDB:", error.message);
    process.exit(1);
  });
