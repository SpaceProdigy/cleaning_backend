import express from "express";

import lessonsControllers from "../controllers/lessons-controllers.js";
import validation from "../middleware/validation/lessons-validation.js";
import {
  isValidId,
  validateLessonsRoute,
} from "../middleware/validation/isValidId.js";

const dinamicLessonsRoute = express.Router();

const correctRoutes = ["lessonWithJill"];

dinamicLessonsRoute.get(
  "/:dinamicLessonsRoute/:date",
  validateLessonsRoute(correctRoutes),
  lessonsControllers.getList
);

dinamicLessonsRoute.post(
  "/:dinamicLessonsRoute",
  validateLessonsRoute(correctRoutes),
  validation.addLessonValidate,
  lessonsControllers.add
);

dinamicLessonsRoute.put(
  "/:dinamicLessonsRoute/:id",
  validateLessonsRoute(correctRoutes),
  isValidId,
  validation.patchLessonValidate,
  lessonsControllers.updateById
);

dinamicLessonsRoute.delete(
  "/:dinamicLessonsRoute/:id",
  validateLessonsRoute(correctRoutes),
  isValidId,
  lessonsControllers.deleteById
);

export default dinamicLessonsRoute;
