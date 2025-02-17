import { dinamicModel } from "../../models/cleaningSchedules.js";
import HttpError from "../../helpers/HttpError.js";
import dayjs from "dayjs";

export const allSchedules = async ({ date, nameCollection, limit, page }) => {
  const startOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
  const endOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");

  // Фильтр по диапазону дат
  const filter = {
    date: {
      $gte: startOfMonth,
      $lte: endOfMonth,
    },
  };

  const data = await dinamicModel(nameCollection)
    .find(filter)
    .sort({ date: 1 }) // Сортировка: от самой ранней даты к более поздним
    .skip((page - 1) * limit) // Пропускаем элементы, которые не попадали на текущую страницу
    .limit(Number(limit)); // Ограничиваем количество данных на странице

  const total = await dinamicModel(nameCollection).countDocuments(filter); // Получаем общее количество документов
  const totalPages = Math.ceil(total / limit); // Общее количество страниц

  return {
    data,
    totalPages,
    currentPage: page,
    total,
  };
};

export const allSchedulesByRoom = async ({
  roomNumber,
  nameCollection,
  isTidied,
  limit,
  page,
}) => {
  const today = dayjs().format("YYYY-MM-DD");

  // Фильтр по диапазону дат
  const filter = {
    roomNumber,
    "checked.isDone": JSON.parse(isTidied),
    date: { $lt: today },
  };

  const data = await dinamicModel(nameCollection)
    .find(filter)
    .sort({ date: 1 }) // Сортировка: от самой ранней даты к более поздним
    .skip((page - 1) * limit) // Пропускаем элементы, которые не попадали на текущую страницу
    .limit(Number(limit)); // Ограничиваем количество данных на странице

  const total = await dinamicModel(nameCollection).countDocuments(filter); // Получаем общее количество документов
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    totalPages,
    currentPage: page,
    total,
  };
};

export const addSchedule = async ({ newItem, nameCollection }) => {
  return await dinamicModel(nameCollection).create(newItem);
};

export const updateScheduleById = async ({ itemId, item, nameCollection }) => {
  const result = await dinamicModel(nameCollection).findByIdAndUpdate(
    itemId,
    item,
    { new: true }
  );
  if (!result) {
    throw HttpError(404, `Not found ${itemId}`);
  }
  return result;
};

export const deleteScheduleById = async ({ itemId, nameCollection }) => {
  const result = await dinamicModel(nameCollection).findByIdAndDelete(itemId);
  if (!result) {
    throw HttpError(404, `Not found ${itemId}`);
  }
  return result;
};
