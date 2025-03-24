import {
  allSchedules,
  addLesson,
  deleteLessonById,
  updateLessonById,
} from "../functions/lessons/functions.js";

import { controllerWrapper } from "../decorators/index.js";

const getList = async (req, res) => {
  const { dinamicLessonsRoute, date } = req.params;
  const { page = 1, limit = 100 } = req.query;

  const data = await allSchedules({
    date,
    nameCollection: dinamicLessonsRoute,
    limit,
    page,
  });
  res.json(data);
};

const add = async (req, res) => {
  const result = await addLesson({
    newItem: req.body,
    nameCollection: req.params.dinamicLessonsRoute,
  });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id, dinamicLessonsRoute } = req.params;

  const result = await updateLessonById({
    itemId: id,
    item: req.body,
    nameCollection: dinamicLessonsRoute,
  });
  res.json(result);
};

const deleteById = async (req, res) => {
  const { id, dinamicLessonsRoute } = req.params;
  const result = await deleteLessonById({
    itemId: id,
    nameCollection: dinamicLessonsRoute,
  });

  res.json(result);
};

export default {
  getList: controllerWrapper(getList),
  add: controllerWrapper(add),
  updateById: controllerWrapper(updateById),
  deleteById: controllerWrapper(deleteById),
};
