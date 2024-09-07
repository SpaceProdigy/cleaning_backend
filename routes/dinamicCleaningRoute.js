import express from "express";

import cleaningControllers from "../controllers/cleaning-controllers.js";
import validation from "../middleware/validation/cleaning-validation.js";
import {
  isValidId,
  validateRoute,
} from "../middleware/validation/isValidId.js";

const dinamicCleaningRoute = express.Router();

const correctRoutes = [
  "blueCorridor",
  "redCorridor",
  "yellowCorridor",
  "kitchen3",
  "kitchen4",
  "kitchen5",
  "kitchen6",
];

dinamicCleaningRoute.get(
  "/:dinamicCleaningRoute/:date",
  validateRoute(correctRoutes),
  cleaningControllers.getList
);

dinamicCleaningRoute.post(
  "/:dinamicCleaningRoute",
  validateRoute(correctRoutes),
  validation.addCleaningValidate,
  cleaningControllers.add
);

dinamicCleaningRoute.put(
  "/:dinamicCleaningRoute/:id",
  validateRoute(correctRoutes),
  isValidId,
  validation.addCleaningValidate,
  cleaningControllers.updateById
);

dinamicCleaningRoute.patch(
  "/:dinamicCleaningRoute/:id",
  validateRoute(correctRoutes),
  isValidId,
  validation.patchCleaningValidate,
  cleaningControllers.updateById
);

dinamicCleaningRoute.delete(
  "/:dinamicCleaningRoute/:id",
  validateRoute(correctRoutes),
  isValidId,
  cleaningControllers.deleteById
);

export default dinamicCleaningRoute;
