import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidatePreUpdate } from "./hooks.js";

export const cleaningSchemaJoi = Joi.object({
  date: Joi.string().required(),
  task: Joi.object().required(),
  roomNumber: Joi.number().required(),
  adder: Joi.object().required(),
});

export const cleaningSchemaJoiPart = Joi.object({
  date: Joi.string(),
  task: Joi.object(),
  roomNumber: Joi.number(),
  editor: Joi.object(),
  checked: Joi.object(),
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
    adder: {
      type: Object,
      require: true,
    },
    editor: {
      type: Object,
    },
    checked: {
      type: Object,
      default: { isDone: false },
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

export const dinamicModel = (currentModel) => {
  return model(currentModel, cleaningSchema);
};
