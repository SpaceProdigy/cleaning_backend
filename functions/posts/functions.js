import cloudinary from "cloudinary";
import axios from "axios";
import FormData from "form-data";

const { TELEGRAM_BOT_KEY, STOREGE_CHAT_ID } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_KEY}`;

export const getErrorMessage = () => {
  return {
    fileUploadError: {
      ua: "❌ Помилка завантаження файлу.",
      en: "❌ File upload error.",
    },
    telegramUploadError: {
      ua: "❌ Помилка при завантаженні в Telegram.",
      en: "❌ Error uploading to Telegram.",
    },
    getFilePathError: {
      ua: "❌ Помилка отримання шляху файлу з Telegram.",
      en: "❌ Error getting file path from Telegram.",
    },
    timeoutError: {
      ua: "❌ Запит перевищив максимальний час очікування (30 секунд).",
      en: "❌ Request exceeded maximum timeout (30 seconds).",
    },
    databaseError: {
      ua: "❌ Помилка при збереженні в базу даних.",
      en: "❌ Error saving to the database.",
    },
  };
};

export const uploadImageToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const sendFileToTelegram = async (fileBuffer, fileName) => {
  const formData = new FormData();
  formData.append("chat_id", STOREGE_CHAT_ID);
  formData.append("document", fileBuffer, {
    filename: fileName,
  });

  try {
    const response = await axios.post(
      `${TELEGRAM_API}/sendDocument`,
      formData,
      { headers: formData.getHeaders() }
    );
    return response.data;
  } catch (error) {
    throw getErrorMessage().telegramUploadError;
  }
};

export const getFilePathFromTelegram = async (fileId) => {
  try {
    const response = await axios.get(
      `${TELEGRAM_API}/getFile?file_id=${fileId}`
    );
    return response.data.result.file_path;
  } catch (error) {
    throw new Error("Ошибка получения file_path от Telegram");
  }
};

export const deleteUploadedFiles = async (tempFiles) => {
  if (tempFiles.length === 0) {
    console.log("❌ No files to delete");
    return;
  }

  for (const file of tempFiles) {
    try {
      if (file.cloudinaryId) {
        console.log(`Deleting file with Cloudinary ID: ${file.cloudinaryId}`);
        await cloudinary.uploader.destroy(file.cloudinaryId); // Удаляем из Cloudinary
      }
      // Удаление из Telegram не предусмотрено API, но можно просто не сохранять ссылку
    } catch (error) {
      console.error("❌ Error deleting file:", error);
    }
  }
};
