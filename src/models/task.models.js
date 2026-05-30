import mongoose, { Schema } from "mongoose";
import { availableTaskStatus, taskStatus } from "../utils/constants.js";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assingedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assingedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: availableTaskStatus,
      default: taskStatus.TODO,
    },
    attachments: {
      type: [
        {
          url: String,
          mimetype: String,
          size: number,
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model("Task", taskSchema);
