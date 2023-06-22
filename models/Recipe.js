import mongoose from "mongoose";
import crypto from "crypto";

const recipeSchema = new mongoose.Schema(
  {
    recipeId: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(6).toString("hex"),
    },
    content: {
      title: {
        type: String,
        trim: true,
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
      ingredients: [
        {
          type: String,
          trim: true,
          required: true,
        },
      ],
      steps: [
        {
          type: String,
          trim: true,
          required: true,
        },
      ],
      time: {
        type: String,
        trim: true,
      },
      image: {
        data: Buffer,
        contentType: String,
      },
      isPublic: {
        type: Boolean,
        default: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    comments: [
      {
        commentId: {
          type: String,
          required: true,
          default: () => crypto.randomBytes(6).toString("hex"),
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          trim: true,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Recipe", recipeSchema);
