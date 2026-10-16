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
      enum: ["mcq", "code_analysis", "fill_blank", "boolean"],
      default: "mcq",
    },
    options: [
      {
        type: String,
        required: true,
      },
    ],
    // Server-only: never sent to client in GET requests
    correctAnswer: {
      type: String,
      required: true,
      select: false,
    },
    // Server-only until attempt submitted: explains underlying misconception
    explanation: {
      type: String,
      default: "",
      select: false,
    },
    misconceptionKey: {
      type: String,
      default: null,
    },
    points: {
      type: Number,
      default: 25,
      min: 1,
    },
  },
  { _id: true },
);

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    topicKey: {
      type: String,
      required: true,
      index: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
      index: true,
    },
    skillTags: [
      {
        type: String,
        trim: true,
      },
    ],
    passingScore: {
      type: Number,
      default: 80,
      min: 1,
      max: 100,
    },
    questions: [questionSchema],
    rubric: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    variants: [
      {
        variantKey: String,
        questions: [questionSchema],
      },
    ],
  },
  {
    timestamps: true,
  },
);

assessmentSchema.index({ topicKey: 1, version: -1 });
assessmentSchema.index({ slug: 1, version: 1 }, { unique: true });

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
