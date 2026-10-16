import mongoose from "mongoose";

const learningAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
    },
    assessmentVersion: {
      type: Number,
      default: 1,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    topicKey: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["quiz", "exercise", "scenario_lab", "review"],
      required: true,
      default: "quiz",
    },
    responses: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    feedback: {
      type: String,
      default: "",
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    durationSec: {
      type: Number,
      default: 0,
    },
    idempotencyKey: {
      type: String,
      index: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

learningAttemptSchema.index({ user: 1, topicKey: 1, createdAt: -1 });
learningAttemptSchema.index({ user: 1, assessment: 1, createdAt: -1 });
learningAttemptSchema.index(
  { user: 1, idempotencyKey: 1 },
  { unique: true, partialFilterExpression: { idempotencyKey: { $type: "string" } } },
);

const LearningAttempt = mongoose.model("LearningAttempt", learningAttemptSchema);

export default LearningAttempt;
