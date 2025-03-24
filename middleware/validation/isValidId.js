import { isValidObjectId } from "mongoose";
import { HttpError } from "../../helpers/index.js";

export const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} is not valid id`));
  }
  next();
};

export const validateRoute = (correctRoutes) => {
  return (req, res, next) => {
    const { dinamicCleaningRoute } = req.params;
    if (correctRoutes.includes(dinamicCleaningRoute)) {
      next();
    } else {
      res.status(404).send(`404 Not Found: ${correctRoutes} Invalid route`);
    }
  };
};

export const validateLessonsRoute = (correctRoutes) => {
  return (req, res, next) => {
    const { dinamicLessonsRoute } = req.params;
    if (correctRoutes.includes(dinamicLessonsRoute)) {
      next();
    } else {
      res.status(404).send(`404 Not Found: ${correctRoutes} Invalid route`);
    }
  };
};
