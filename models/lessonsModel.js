import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidatePreUpdate } from "./hooks.js";

export const lessonSchemaJoi = Joi.object({
  date: Joi.date().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  topic: Joi.string().allow("").optional(),
  notes: Joi.string().allow("").optional(),
  adder: Joi.object().required(),
  place: Joi.string().required(),
  students: Joi.array().items(Joi.object()),
});

export const lessonSchemaJoiPart = Joi.object({
  date: Joi.date(),
  startTime: Joi.date().iso(),
  endTime: Joi.date().iso(),
  topic: Joi.string().allow("").optional(),
  place: Joi.string(),
  notes: Joi.string().allow("").optional(),
  students: Joi.array().items(Joi.object()),
  adder: Joi.object(),
});

const lessonSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    place: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
    },
    students: {
      type: [Object],
    },
    notes: {
      type: String,
    },
    adder: {
      type: Object,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Добавляем хуки для обработки ошибок
lessonSchema.post("save", handleSaveError);
lessonSchema.pre("findOneAndUpdate", runValidatePreUpdate);
lessonSchema.post("findOneAndUpdate", handleSaveError);

// Скрываем поля с датами, если они не нужны
lessonSchema.path("updatedAt").select(false);

export const dinamicLessonsModel = (currentModel) => {
  return model(currentModel, lessonSchema);
};
