import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
    },
    topicKey: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["quiz", "exercise", "lesson_view"],
      required: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed, // User answers or submitted source code
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
    details: {
      type: mongoose.Schema.Types.Mixed, // Per-question results or test case pass/fail breakdown
      default: {},
    },
    durationSec: {
      type: Number,
      default: 0,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

attemptSchema.index({ user: 1, quiz: 1, createdAt: -1 });
attemptSchema.index({ user: 1, exercise: 1, createdAt: -1 });
attemptSchema.index({ user: 1, topicKey: 1, passed: 1 });

const Attempt = mongoose.model("Attempt", attemptSchema);

export default Attempt;
