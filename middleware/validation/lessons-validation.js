import { validateBody } from "../../decorators/index.js";
import {
  lessonSchemaJoi,
  lessonSchemaJoiPart,
} from "../../models/lessonsModel.js";

const addLessonValidate = validateBody(lessonSchemaJoi);
const patchLessonValidate = validateBody(lessonSchemaJoiPart);

export default {
  addLessonValidate,
  patchLessonValidate,
};
