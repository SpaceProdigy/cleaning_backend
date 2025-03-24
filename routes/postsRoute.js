import express from "express";

import { Post } from "../models/postsModel.js";
import { deleteUploadedFiles } from "../functions/posts/functions.js";

const postsRoute = express.Router();

postsRoute.get("/all", async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const excludedCategories = [
      "English language",
      "Dutch language",
      "Guitar lesson",
    ]; // Категории, которые исключаем

    const totalPosts = await Post.countDocuments({
      category: { $nin: excludedCategories }, // Исключаем посты с этими категориями
    });
    if (totalPosts === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    const totalPages = Math.ceil(totalPosts / limit); // Рассчитываем количество страниц

    if (page > totalPages) {
      return res.status(404).json({ message: "Page not found" });
    }

    const posts = await Post.find({ category: { $nin: excludedCategories } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("title posters description likes likedBy createdAt");

    res.json({
      posts, // Сами посты
      totalPages, // Общее число страниц
      currentPage: Number(page), // Текущая страница (приводим к числу)
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      error: "Failed to retrieve posts",
    });
  }
});

postsRoute.get("/all/tag", async (req, res) => {
  try {
    const { page = 1, limit = 20, tag } = req.query;

    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }

    const totalPosts = await Post.countDocuments({ tags: tag }); // Фильтруем по тегу

    if (totalPosts === 0) {
      return res.status(404).json({ message: "No posts found for this tag" });
    }

    const totalPages = Math.ceil(totalPosts / limit);

    if (page > totalPages) {
      return res.status(404).json({ message: "Page not found" });
    }

    const posts = await Post.find({ tags: tag }) // Фильтрация по тегу
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("title posters description likes likedBy createdAt tags");

    res.json({
      posts,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      error: "Failed to retrieve posts",
    });
  }
});

postsRoute.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(post);
  } catch (error) {
    console.error("Error when receiving post:", error);
    res.status(500).json({
      error: "Failed to get post",
    });
  }
});

postsRoute.patch("/:postId/like", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, displayName, avatar } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Пост не найден" });

    const hasLiked = post.likedBy.some(
      (user) => user.userId.toString() === userId
    );

    if (hasLiked) {
      // Удаляем лайк
      post.likedBy = post.likedBy.filter(
        (user) => user.userId.toString() !== userId
      );
      post.likes -= 1;
    } else {
      // Добавляем лайк с доп. инфой
      post.likedBy.push({ userId, displayName, avatar });
      post.likes += 1;
    }

    await post.save();

    res.json({
      likes: post.likes,
      likedBy: post.likedBy, // Возвращаем массив объектов с userId, displayName, avatar
    });
  } catch (error) {
    console.error("Ошибка при лайке:", error);
    res.status(500).json({ error: "Не удалось поставить лайк" });
  }
});

postsRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.posters && post.posters.length > 0) {
      await deleteUploadedFiles(post.posters); // Исправил typo (posters)
    }

    await Post.findByIdAndDelete(id);

    res.json({ id });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default postsRoute;
