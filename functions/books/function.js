import { Readable } from "stream"; // Модуль для создания потока
import { googleDriveClient } from "../../googleDriveConfig.js";

export const uploadFileToGoogleDrive = async (fileBuffer, filename) => {
  try {
    const drive = googleDriveClient(); // Инициализируем Google Drive API

    // Преобразуем буфер в поток
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null); // Завершаем поток

    const fileMetadata = {
      name: filename,
      parents: ["1ssoD6Dm4SclBj3DN3MGWsWDwlPZn0G8a"], // ID папки в Google Drive
    };

    const media = {
      mimeType: "application/octet-stream",
      body: bufferStream, // Передаем поток вместо буфера
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id",
    });

    const fileId = response.data.id;

    // Даем публичный доступ к файлу
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader", // Доступ только для чтения
        type: "anyone", // Любой, у кого есть ссылка
      },
    });

    // Создаем корректную ссылку для скачивания
    const fileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    return {
      url: fileUrl,
      id: fileId,
    };
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
};
// Функция для удаления файла с Google Drive
export const deleteFileFromGoogleDrive = async (fileId) => {
  try {
    const drive = googleDriveClient(); // Your initialized Google Drive client
    await drive.files.delete({ fileId });
    console.log(`File with id:${fileId} was deleted with Google Drive`);
  } catch (error) {
    console.error("Ошибка при удалении файла с Google Drive:", error);
    throw error;
  }
};
