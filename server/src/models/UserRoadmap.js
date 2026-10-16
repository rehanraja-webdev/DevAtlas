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
    masteryState: {
      type: String,
      enum: ["not_started", "in_progress", "practised", "demonstrated", "retained"],
      default: "not_started",
    },
    progressSource: {
      type: String,
      enum: ["verified_evidence", "legacy_self_reported"],
      default: "verified_evidence",
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
    quizScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    exercisePassed: {
      type: Boolean,
      default: false,
    },
    verifiedMastery: {
      type: Boolean,
      default: false,
    },
    lessonViewed: {
      type: Boolean,
      default: false,
    },
    lastAttemptAt: {
      type: Date,
      default: null,
    },
    evidenceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkillEvidence",
      },
    ],
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
