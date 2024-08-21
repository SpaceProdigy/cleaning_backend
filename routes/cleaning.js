import express from "express";

import cleaningControllers from "../controllers/cleaning-controllers.js";
import validation from "../middleware/validation/cleaning-validation.js";
import { isValidId } from "../middleware/validation/isValidId.js";

const cleaningRouter = express.Router();

cleaningRouter.get("/", cleaningControllers.getList);

cleaningRouter.get("/:id", isValidId, cleaningControllers.getById);

cleaningRouter.post(
  "/",
  validation.addCleaningValidate,
  cleaningControllers.add
);

cleaningRouter.put(
  "/:id",
  isValidId,
  validation.addCleaningValidate,
  cleaningControllers.updateById
);

cleaningRouter.patch(
  "/:id",
  isValidId,
  validation.patchCleaningValidate,
  cleaningControllers.updateById
);

cleaningRouter.delete("/:id", isValidId, cleaningControllers.deleteById);

export default cleaningRouter;
