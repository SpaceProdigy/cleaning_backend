import HttpError from "../../helpers/HttpError.js";
import dayjs from "dayjs";
import { dinamicLessonsModel } from "../../models/lessonsModel.js";

export const allSchedules = async ({ date, nameCollection, limit, page }) => {
  try {
    const startOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
    const endOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");

    const filter = {
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    };

    const model = dinamicLessonsModel(nameCollection);

    const data = await model
      .find(filter)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await model.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return { data, totalPages, currentPage: page, total };
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw new Error("Failed to fetch schedules");
  }
};

export const addLesson = async ({ newItem, nameCollection }) => {
  return await dinamicLessonsModel(nameCollection).create(newItem);
};

export const updateLessonById = async ({ itemId, item, nameCollection }) => {
  const result = await dinamicLessonsModel(nameCollection).findByIdAndUpdate(
    itemId,
    item,
    { new: true }
  );
  if (!result) {
    throw HttpError(404, `Not found ${itemId}`);
  }

  return result;
};

export const deleteLessonById = async ({ itemId, nameCollection }) => {
  const result = await dinamicLessonsModel(nameCollection).findByIdAndDelete(
    itemId
  );
  if (!result) {
    throw HttpError(404, `Not found ${itemId}`);
  }
  return result;
};
