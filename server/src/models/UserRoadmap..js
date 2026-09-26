import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    itemKey: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["locked", "not-started", "in-progress", "completed"],
      default: "not-started",
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
  },
);

const userRoadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },

    progress: {
      type: [progressSchema],
      default: [],
    },

    overallProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true },
);

userRoadmapSchema.index({ user: 1, roadmap: 1 }, { unique: true });

const UserRoadmap = mongoose.model("UserRoadmap", userRoadmapSchema);

export default UserRoadmap;
