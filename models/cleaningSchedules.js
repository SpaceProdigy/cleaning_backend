import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidatePreUpdate } from "./hooks.js";

export const cleaningSchemaJoi = Joi.object({
  date: Joi.string().required(),
  task: Joi.object().required(),
  roomNumber: Joi.number().required(),
});

export const cleaningSchemaJoiPart = Joi.object({
  date: Joi.string(),
  task: Joi.object(),
  roomNumber: Joi.number(),
});

const cleaningSchema = new Schema(
  {
    date: {
      type: String,
      require: true,
    },
    roomNumber: {
      type: Number,
      require: true,
    },
    task: {
      type: Object,
      require: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

cleaningSchema.post("save", handleSaveError);
cleaningSchema.pre("findOneAndUpdate", runValidatePreUpdate);
cleaningSchema.post("findOneAndUpdate", handleSaveError);
cleaningSchema.path("createdAt").select(false);
cleaningSchema.path("updatedAt").select(false);

const Schedule = model("blueCorridor", cleaningSchema);

export const dinamicModel = (currentModel) => {
  return model(currentModel, cleaningSchema);
};

export default Schedule;
