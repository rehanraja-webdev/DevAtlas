import mongoose from "mongoose";

const interviewRoundSchema = new mongoose.Schema(
  {
    questionNumber: { type: Number, required: true },
    category: {
      type: String,
      enum: ["introduction", "project-deepdive", "system-design", "core-fundamentals", "behavioral", "problem-solving"],
      default: "project-deepdive",
    },
    question: { type: String, required: true },
    candidateAnswer: { type: String, default: "" },
    feedback: { type: String, default: "" },
    score: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false },
);

const scorecardSchema = new mongoose.Schema(
  {
    overallScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    feedbackSummary: { type: String, default: "" },
    strengths: { type: [String], default: [] },
    improvements: { type: [String], default: [] },
    recommendation: {
      type: String,
      enum: ["Strong Hire", "Hire", "Leaning Hire", "Needs Preparation"],
      default: "Leaning Hire",
    },
  },
  { _id: false },
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
      default: "Full Stack Developer",
    },
    resumeData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
    currentRoundIndex: {
      type: Number,
      default: 0,
    },
    rounds: {
      type: [interviewRoundSchema],
      default: [],
    },
    scorecard: {
      type: scorecardSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;
