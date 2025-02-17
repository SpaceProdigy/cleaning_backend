import { validateBody } from "../../decorators/index.js";
import {
  cleaningSchemaJoi,
  cleaningSchemaJoiPart,
} from "../../models/cleaningSchedules.js";
import { sentMessagesJoi } from "../../models/sentMessages.js";

const addCleaningValidate = validateBody(cleaningSchemaJoi);
const patchCleaningValidate = validateBody(cleaningSchemaJoiPart);
const addsentMessagesalidate = validateBody(sentMessagesJoi);

export default {
  addCleaningValidate,
  patchCleaningValidate,
  addsentMessagesalidate,
};
