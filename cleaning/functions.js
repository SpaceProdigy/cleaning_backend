import Schedule, { dinamicModel } from "../models/cleaningSchedules.js";
import HttpError from "../helpers/HttpError.js";
import dayjs from "dayjs";

export const allSchedules = async ({ date, nameCollection }) => {
  const startOfMonth = dayjs(date).startOf("month").format("YYYY-MM-DD");
  const endOfMonth = dayjs(date).endOf("month").format("YYYY-MM-DD");

  const data = await dinamicModel(nameCollection).find({
    date: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  });
  return data;
};

export const scheduleById = async (itemId) => {
  const result = await Schedule.findById(itemId);
  if (!result) {
    throw HttpError(404, `Not found ${itemId}`);
  }
  return result;
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
