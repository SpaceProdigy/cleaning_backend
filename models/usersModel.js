import Joi from "joi";
import { Schema, model } from "mongoose";
import { handleSaveError, runValidatePreUpdate } from "./hooks.js";

export const usersSchemaJoi = Joi.object({
  userId: Joi.string().required(),
  roomNumber: Joi.number(),
  role: Joi.string(),
  email: Joi.string(),
});

export const usersSchemaJoiPart = Joi.object({
  roomNumber: Joi.number(),
  role: Joi.string(),
  email: Joi.string(),
  displayName: Joi.string(),
  userId: Joi.string(),
});

const usersSchema = new Schema(
  {
    userId: {
      type: String,
      default: null,
    },
    roomNumber: {
      type: Number,
      default: null,
    },
    role: {
      type: Array,
      default: ["viewer"],
    },
    email: {
      type: String,
      default: null,
    },
    displayName: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

usersSchema.post("save", handleSaveError);
usersSchema.pre("findOneAndUpdate", runValidatePreUpdate);
usersSchema.post("findOneAndUpdate", handleSaveError);
usersSchema.path("createdAt").select(false);
usersSchema.path("updatedAt").select(false);

const Users = model("users", usersSchema);

export default Users;
