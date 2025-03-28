import mongoose from "mongoose";
import app from "./app.js";

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    const serverPort = PORT || 5000;
    app.listen(serverPort, () => {
      console.log(`🚀 Server running on port ${serverPort}`);
    });
  })
  .catch((error) => {
    console.error("❌ Ошибка подключения к MongoDB:", error.message);
    process.exit(1);
  });

process.on("uncaughtException", (error) => {
  console.error("❌ Непредвиденная ошибка:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("⚠️ Обработан необработанный Promise:", reason);
});
