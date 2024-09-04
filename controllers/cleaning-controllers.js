import { HttpError } from "../helpers/index.js";

import {
  addSchedule,
  deleteScheduleById,
  allSchedules,
  scheduleById,
  updateScheduleById,
} from "../cleaning/functions.js";

import { controllerWrapper } from "../decorators/index.js";

const getList = async (req, res) => {
  const { dinamicCleaningRoute, date } = req.params;
  const data = await allSchedules({
    date,
    nameCollection: dinamicCleaningRoute,
  });
  res.json(data);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await scheduleById(id);
  res.json(result);
};

const add = async (req, res) => {
  const result = await addSchedule({
    newItem: req.body,
    nameCollection: req.params.dinamicCleaningRoute,
  });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id, dinamicCleaningRoute } = req.params;

  const result = await updateScheduleById({
    itemId: id,
    item: req.body,
    nameCollection: dinamicCleaningRoute,
  });
  res.json(result);
};

const deleteById = async (req, res) => {
  const { id, dinamicCleaningRoute } = req.params;
  const result = await deleteScheduleById({
    itemId: id,
    nameCollection: dinamicCleaningRoute,
  });
  res.json(result);
};

export default {
  getList: controllerWrapper(getList),
  getById: controllerWrapper(getById),
  add: controllerWrapper(add),
  updateById: controllerWrapper(updateById),
  deleteById: controllerWrapper(deleteById),
};
