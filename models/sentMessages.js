import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidatePreUpdate } from "./hooks.js";

export const sentMessagesJoi = Joi.object({
  group: Joi.string().required(),
  date: Joi.string().required(),
  alreadySent: Joi.bool().required(),
});

const sentMessagesSchema = new Schema(
  {
    group: { type: String, required: true },
    date: { type: String, required: true },
    alreadySent: { type: Boolean, required: true, default: false },
    chatId: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

sentMessagesSchema.post("save", handleSaveError);
sentMessagesSchema.pre("findOneAndUpdate", runValidatePreUpdate);
sentMessagesSchema.post("findOneAndUpdate", handleSaveError);
sentMessagesSchema.path("createdAt").select(false);
sentMessagesSchema.path("updatedAt").select(false);

export const SentMessages = model("SentMessages", sentMessagesSchema);
