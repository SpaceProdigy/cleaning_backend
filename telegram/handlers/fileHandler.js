export const handleDocumentUpload = async (msg, bot, TELEGRAM_BOT_KEY) => {
  try {
    const fileId = msg.document.file_id;
    const originalFileName = msg.document.file_name;
    const fileSize = msg.document.file_size;

    // Если файл больше 20MB, отправляем ссылку на сообщение с файлом
    if (fileSize > 20 * 1024 * 1024) {
      const fileMessageLink = `https://t.me/c/${msg.chat.id
        .toString()
        .replace("-100", "")}/${msg.message_id}`;

      await bot.sendMessage(
        msg.chat.id,
        `❗ Файл "${originalFileName}" слишком большой (${(
          fileSize /
          (1024 * 1024)
        ).toFixed(2)} MB).  
         🔗 **Скачать можно вручную:** [Ссылка на файл](${fileMessageLink})`
      );
      return;
    }

    // Получаем ссылку через API (если файл до 20MB)
    const file = await bot.getFile(fileId);
    const downloadLink = `https://api.telegram.org/file/bot${TELEGRAM_BOT_KEY}/${file.file_path}`;

    await bot.sendMessage(
      msg.chat.id,
      `✅ Файл "${originalFileName}" загружен!\n🔗 Ссылка для скачивания: ${downloadLink}`
    );
  } catch (error) {
    console.error("Ошибка при получении файла:", error);
    await bot.sendMessage(msg.chat.id, "❌ Ошибка при обработке файла.");
  }
};
