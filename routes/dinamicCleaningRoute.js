import express from "express";

import cleaningControllers from "../controllers/cleaning-controllers.js";
import validation from "../middleware/validation/cleaning-validation.js";
import { isValidId } from "../middleware/validation/isValidId.js";

const dinamicCleaningRoute = express.Router();

dinamicCleaningRoute.get("/:dinamicCleaningRoute", cleaningControllers.getList);

dinamicCleaningRoute.get(
  "/:dinamicCleaningRoute/:id",
  isValidId,
  cleaningControllers.getById
);

dinamicCleaningRoute.post(
  "/:dinamicCleaningRoute",
  validation.addCleaningValidate,
  cleaningControllers.add
);

dinamicCleaningRoute.put(
  "/:dinamicCleaningRoute/:id",
  isValidId,
  validation.addCleaningValidate,
  cleaningControllers.updateById
);

dinamicCleaningRoute.patch(
  "/:dinamicCleaningRoute/:id",
  isValidId,
  validation.patchCleaningValidate,
  cleaningControllers.updateById
);

dinamicCleaningRoute.delete(
  "/:dinamicCleaningRoute/:id",
  isValidId,
  cleaningControllers.deleteById
);

export default dinamicCleaningRoute;
