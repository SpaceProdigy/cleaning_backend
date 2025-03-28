import { Schema, model } from "mongoose";
import { handleSaveError, runValidatePreUpdate } from "./hooks.js";

const BooksSchema = new Schema(
  {
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        userId: { type: String, required: true },
        displayName: { type: String },
        avatar: { type: String },
      },
    ],
    category: {
      type: String,
    },
    adder: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },

    posters: [
      {
        cloudinaryId: { type: String, required: true },
        url: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: Number, required: true },
      },
    ],
    files: [
      {
        url: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        size: { type: Number, required: true },
        id: { type: String, required: true },
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

BooksSchema.post("save", handleSaveError);
BooksSchema.pre("findOneAndUpdate", runValidatePreUpdate);
BooksSchema.post("findOneAndUpdate", handleSaveError);
BooksSchema.path("updatedAt").select(false);

export const Books = model("Books", BooksSchema);
