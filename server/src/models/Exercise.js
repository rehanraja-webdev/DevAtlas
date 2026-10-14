import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

const exerciseSchema = new mongoose.Schema(
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
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    language: {
      type: String,
      default: "javascript",
    },
    templateCode: {
      type: String,
      required: true,
    },
    solutionCode: {
      type: String,
      default: "",
    },
    tests: {
      type: [testCaseSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

export default Exercise;
