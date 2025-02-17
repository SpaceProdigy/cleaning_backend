import {
  addSchedule,
  deleteScheduleById,
  allSchedules,
  updateScheduleById,
  allSchedulesByRoom,
} from "../functions/cleaning/functions.js";

import { controllerWrapper } from "../decorators/index.js";

const getList = async (req, res) => {
  const { dinamicCleaningRoute, date } = req.params;
  const { page = 1, limit = 100 } = req.query;

  const data = await allSchedules({
    date,
    nameCollection: dinamicCleaningRoute,
    limit,
    page,
  });
  res.json(data);
};

const getListByRoom = async (req, res) => {
  const { dinamicCleaningRoute, roomNumber, isTidied } = req.params;
  const { page = 1, limit = 5 } = req.query;

  const data = await allSchedulesByRoom({
    roomNumber,
    nameCollection: dinamicCleaningRoute,
    isTidied,
    limit,
    page,
  });
  res.json(data);
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
  add: controllerWrapper(add),
  updateById: controllerWrapper(updateById),
  deleteById: controllerWrapper(deleteById),
  getListByRoom: controllerWrapper(getListByRoom),
};
