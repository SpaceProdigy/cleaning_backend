import { validateBody } from "../../decorators/index.js";
import { usersSchemaJoi, usersSchemaJoiPart } from "../../models/usersModel.js";

const addUsersValidate = validateBody(usersSchemaJoi);
const patchUsersValidate = validateBody(usersSchemaJoiPart);

export default {
  addUsersValidate,
  patchUsersValidate,
};
