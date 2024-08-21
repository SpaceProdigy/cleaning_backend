import Schedule from "../models/cleaningSchedules.js";
import HttpError from "../helpers/HttpError.js";

export const allSchedules = async () => {
  const data = await Schedule.find();
  return data;
};

export const scheduleById = async (itemId) => {
  const result = await Schedule.findById(itemId);
  if (!result) {
    throw HttpError(404, `Not found ${itemId}`);
  }
  return result;
};

export const addSchedule = async (newItem) => {
  return await Schedule.create(newItem);
};

export const updateScheduleById = async (itemId, item) => {
  const result = await Schedule.findByIdAndUpdate(itemId, item, { new: true });
  if (!result) {
    throw HttpError(404, `Not found ${itemId}`);
  }
  return result;
};

export const deleteScheduleById = async (itemId) => {
  const result = await Schedule.findByIdAndDelete(itemId);
  if (!result) {
    throw HttpError(404, `Not found ${itemId}`);
  }
  return result;
};
