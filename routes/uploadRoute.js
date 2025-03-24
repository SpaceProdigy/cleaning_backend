import express from "express";
import multer from "multer";
import { Post } from "../models/postsModel.js";
import {
  deleteUploadedFiles,
  getErrorMessage,
  getFilePathFromTelegram,
  sendFileToTelegram,
  uploadImageToCloudinary,
} from "../functions/posts/functions.js";
import { configureCloudinary } from "../cloudinaryConfig.js";

// Инициализация Cloudinary
configureCloudinary();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadRoute = express.Router();

uploadRoute.post(
  "/files",
  upload.fields([
    { name: "poster", maxCount: 10 },
    { name: "file", maxCount: 10 },
  ]),
  async (req, res) => {
    const errorMessages = getErrorMessage(); // Получаем объект с ошибками на двух языках
    const tempFiles = []; // Для хранения временных загруженных файлов

    // Слушаем событие аборта
    req.on("aborted", () => {
      console.log("Request was aborted");
      // Удаляем загруженные файлы или выполняем другие действия
      deleteUploadedFiles(tempFiles);
    });

    try {
      const posterData = [];
      const fileData = [];

      // Устанавливаем таймаут 30 секунд для запроса
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(errorMessages.timeoutError), 30000)
      );

      const processFiles = async () => {
        if (req.files.poster && req.files.poster.length > 0) {
          const posters = req.files.poster;

          const uploadPromises = posters.map(async (poster) => {
            try {
              const result = await uploadImageToCloudinary(poster.buffer);
              tempFiles.push({ cloudinaryId: result.public_id }); // Сохраняем ID
              posterData.push({
                url: result.secure_url,
                cloudinaryId: result.public_id,
                name: poster.originalname,
                type: poster.mimetype,
                size: poster.size,
              });
            } catch (error) {
              throw errorMessages.fileUploadError; // Используем объект ошибки
            }
          });
          await Promise.all(uploadPromises);
        }

        if (req.files.file && req.files.file.length > 0) {
          const files = req.files.file;

          const filePromises = files.map(async (file) => {
            try {
              const tgResponse = await sendFileToTelegram(
                file.buffer,
                file.originalname
              );

              const fileId = tgResponse.result.document?.file_id;
              const filePath = await getFilePathFromTelegram(fileId);
              const fileUrl = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_KEY_FLEX_SP_BOT}/${filePath}`;

              fileData.push({
                url: fileUrl,
                name: file.originalname,
                type: file.mimetype,
                size: file.size,
              });
            } catch (error) {
              throw error;
            }
          });
          await Promise.all(filePromises);
        }
      };

      // Запуск обработки файлов с таймаутом
      await Promise.race([processFiles(), timeout]);

      // Собираем данные для поста
      const newPostData = {
        adder: JSON.parse(req.body.adder),
        description: req.body.description || undefined,
        title: req.body.title || undefined,
        videoLink: req.body.videoLink || undefined,
        category: req.body.category || undefined,
        posters: posterData,
        files: fileData,
      };

      if (req.body.tags?.trim()) {
        // Преобразуем строку тегов в массив, разделяя по запятой
        const tagsArray = req.body.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag); // Убираем лишние пробелы и пустые строки

        // Если нужно, можно сделать теги уникальными
        const uniqueTags = [...new Set(tagsArray)];

        newPostData.tags = uniqueTags; // Добавляем массив тегов в объект
      }
      // Создание нового поста
      const newPost = new Post(newPostData);

      await newPost.save();

      res.json({
        newPost,
      });
    } catch (error) {
      console.error(errorMessages.databaseError, error);
      await deleteUploadedFiles(tempFiles);

      const parsedError = error || errorMessages.databaseError;

      res.status(500).json({
        error: parsedError,
      });
    }
  }
);

export default uploadRoute;
