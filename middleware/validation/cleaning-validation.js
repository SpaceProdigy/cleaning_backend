import { validateBody } from "../../decorators/index.js";
import {
  cleaningSchemaJoi,
  cleaningSchemaJoiPart,
} from "../../models/cleaningSchedules.js";

const addCleaningValidate = validateBody(cleaningSchemaJoi);
const patchCleaningValidate = validateBody(cleaningSchemaJoiPart);

export default {
  addCleaningValidate,
  patchCleaningValidate,
};
