import express from "express";
import multer from "multer";
import {
  deleteUploadedFiles,
  getErrorMessage,
  uploadImageToCloudinary,
} from "../functions/posts/functions.js";
import { configureCloudinary } from "../cloudinaryConfig.js";
import { Books } from "../models/booksModel.js";
import {
  deleteFileFromGoogleDrive,
  uploadFileToGoogleDrive,
} from "../functions/books/function.js";

// Инициализация Cloudinary
configureCloudinary();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const booksRoute = express.Router();

booksRoute.get("/all", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query; // Получаем параметры пагинации, по умолчанию страница 1 и лимит 5
    const skip = (page - 1) * limit; // Пропускание книг для пагинации

    // Получаем все книги с учетом пагинации
    const allBooks = await Books.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalBooks = await Books.countDocuments(); // Получаем общее количество книг
    const totalPages = Math.ceil(totalBooks / limit); // Вычисляем количество страниц

    if (allBooks.length === 0) {
      return res.status(404).json({
        message: "No books found",
      });
    }

    res.json({
      books: allBooks,
      totalPages: totalPages, // Добавляем количество страниц
    });
  } catch (error) {
    console.error("Error retrieving books:", error);

    // В случае ошибки возвращаем ошибку
    res.status(500).json({
      error: "Failed to retrieve books data",
    });
  }
});

booksRoute.patch("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, displayName, avatar } = req.body;

    const book = await Books.findById(postId);
    if (!book) return res.status(404).json({ message: "Пост не найден" });

    const hasLiked = book.likedBy.some(
      (user) => user.userId.toString() === userId
    );

    if (hasLiked) {
      // Удаляем лайк
      book.likedBy = book.likedBy.filter(
        (user) => user.userId.toString() !== userId
      );
      book.likes -= 1;
    } else {
      // Добавляем лайк с доп. инфой
      book.likedBy.push({ userId, displayName, avatar });
      book.likes += 1;
    }

    await book.save();

    res.json({
      likes: book.likes,
      likedBy: book.likedBy, // Возвращаем массив объектов с userId, displayName, avatar
    });
  } catch (error) {
    console.error("Ошибка при лайке:", error);
    res.status(500).json({ error: "Не удалось поставить лайк" });
  }
});

booksRoute.post(
  "/",
  upload.fields([
    { name: "poster", maxCount: 10 },
    { name: "file", maxCount: 10 },
  ]),
  async (req, res) => {
    const errorMessages = getErrorMessage(); // Получаем объект с ошибками на двух языках
    const tempFiles = []; // Для хранения временных загруженных файлов

    req.on("aborted", () => {
      console.log("Request was aborted");
      deleteUploadedFiles(tempFiles);
    });

    try {
      const posterData = [];
      const fileData = [];

      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(errorMessages.timeoutError), 120000)
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
              const googleDriveResponse = await uploadFileToGoogleDrive(
                file.buffer,
                file.originalname
              );

              const fileUrl = googleDriveResponse.url;

              fileData.push({
                url: fileUrl,
                name: file.originalname,
                type: file.mimetype,
                size: file.size,
                id: googleDriveResponse.id,
              });
            } catch (error) {
              throw error;
            }
          });
          await Promise.all(filePromises);
        }
      };

      await Promise.race([processFiles(), timeout]);

      const newPostData = {
        adder: JSON.parse(req.body.adder),
        title: req.body.title || undefined,
        category: req.body.category || undefined,
        posters: posterData,
        files: fileData,
      };

      const newBook = new Books(newPostData);

      await newBook.save();

      res.json({
        newBook,
      });
    } catch (error) {
      console.error(errorMessages.databaseError, error);
      await deleteUploadedFiles(tempFiles);

      // Удаляем файлы с Google Drive
      for (const file of fileData) {
        try {
          await deleteFileFromGoogleDrive(file.id); // Удаление файла с Google Drive
        } catch (err) {
          console.error("Ошибка при удалении файла с Google Drive:", err);
        }
      }

      const parsedError = error || errorMessages.databaseError;

      res.status(500).json({
        error: parsedError,
      });
    }
  }
);

booksRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Books.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (book.posters && book.posters.length > 0) {
      await deleteUploadedFiles(book.posters);
    }

    if (book.files && book.files.length > 0) {
      for (const bookEl of book.files) {
        await deleteFileFromGoogleDrive(bookEl.id);
      }
    }

    await Books.findByIdAndDelete(id);

    res.json({ id });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default booksRoute;
