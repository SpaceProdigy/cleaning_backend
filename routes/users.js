import express from "express";

import usersControllers from "../controllers/users-controllers.js";
import validation from "../middleware/validation/users-validation.js";
import { isValidId } from "../middleware/validation/isValidId.js";

const users = express.Router();

users.get("/admins", usersControllers.getAdmins);

users.patch(
  "/admins/:id?",
  validation.patchUsersValidate,
  usersControllers.addAdmin
);



users.get("/:id", usersControllers.getUser);

users.patch(
  "/:id",
  validation.patchUsersValidate,
  usersControllers.updateUser
);



export default users;
