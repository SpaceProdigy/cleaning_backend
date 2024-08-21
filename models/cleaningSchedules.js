import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidatePreUpdate } from "./hooks.js";

export const cleaningSchemaJoi = Joi.object({
  date: Joi.string().required(),
  task: Joi.string().required(),
  roomNumber: Joi.number().required(),
});

export const cleaningSchemaJoiPart = Joi.object({
  date: Joi.string(),
  task: Joi.string(),
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
      type: String,
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

const Schedule = model("schedules", cleaningSchema);

export default Schedule;
