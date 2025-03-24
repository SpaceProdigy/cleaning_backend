import { Schema, model } from "mongoose";
import { handleSaveError, runValidatePreUpdate } from "./hooks.js";

const PostSchema = new Schema(
  {
    eventDate: {
      type: Date,
    },
    attendance: {
      type: Array,
    },
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
      default: "Announcements",
    },
    adder: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: [{ type: String }],

    videoLink: { type: String },

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
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

PostSchema.post("save", handleSaveError);
PostSchema.pre("findOneAndUpdate", runValidatePreUpdate);
PostSchema.post("findOneAndUpdate", handleSaveError);
PostSchema.path("updatedAt").select(false);

export const Post = model("Post", PostSchema);
