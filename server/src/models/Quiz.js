import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["mcq", "short-answer"],
      default: "mcq",
    },
    options: [
      {
        type: String,
        trim: true,
      },
    ],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      required: true, // Server-evaluated, never leaked in public GET
    },
    explanation: {
      type: String,
      default: "",
    },
    points: {
      type: Number,
      default: 20,
    },
  },
  { _id: true },
);

const quizSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    topicKey: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [questionSchema],
      required: true,
      validate: [(val) => val.length > 0, "Quiz must contain at least one question"],
    },
    passingScore: {
      type: Number,
      default: 80, // Mastery threshold: 80% as required by PRD
      min: 50,
      max: 100,
    },
    maxAttempts: {
      type: Number,
      default: 5, // Prevents brute-forcing
    },
    cooldownMinutes: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
