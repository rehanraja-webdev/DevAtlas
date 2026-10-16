import mongoose from "mongoose";

const reviewHistorySchema = new mongoose.Schema(
  {
    reviewedAt: {
      type: Date,
      default: Date.now,
    },
    score: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    previousIntervalDays: {
      type: Number,
      default: 1,
    },
    newIntervalDays: {
      type: Number,
      default: 1,
    },
  },
  { _id: false },
);

const skillMasterySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    skillKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    skillName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "frontend",
        "backend",
        "database",
        "devops",
        "language",
        "tools",
        "core",
        "fundamentals",
        "other",
      ],
      default: "core",
    },
    state: {
      type: String,
      enum: ["not_assessed", "learning", "practised", "demonstrated", "retained"],
      default: "not_assessed",
      index: true,
    },
    evidence: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SkillEvidence",
      },
    ],
    latestScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    lastAssessedAt: {
      type: Date,
      default: null,
    },
    nextReviewAt: {
      type: Date,
      default: null,
      index: true,
    },
    intervalDays: {
      type: Number,
      default: 1,
    },
    retentionStatus: {
      type: String,
      enum: ["none", "current", "due", "overdue"],
      default: "none",
    },
    reviewHistory: [reviewHistorySchema],
    rationale: {
      type: String,
      default: "Not yet assessed through server-verified milestones.",
    },
  },
  {
    timestamps: true,
  },
);

skillMasterySchema.index({ user: 1, skillKey: 1 }, { unique: true });
skillMasterySchema.index({ user: 1, state: 1 });
skillMasterySchema.index({ user: 1, nextReviewAt: 1 });

const SkillMastery = mongoose.model("SkillMastery", skillMasterySchema);

export default SkillMastery;
