import mongoose from "mongoose";

const misconceptionSchema = new mongoose.Schema(
  {
    misconception: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false },
);

const sourceLinkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const lessonSchema = new mongoose.Schema(
  {
    topicKey: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      default: function () {
        return this.topicKey;
      },
    },
    title: {
      type: String,
      required: true,
      trim: true,
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
    content: {
      type: String,
      required: true, // Markdown tutorial content
    },
    learningObjectives: [
      {
        type: String,
        trim: true,
      },
    ],
    misconceptions: [misconceptionSchema],
    skillKeys: [
      {
        type: String,
        trim: true,
      },
    ],
    sources: [sourceLinkSchema],
    license: {
      type: String,
      default: "DevAtlas Verified Educational Content",
    },
    videos: [
      {
        type: String,
      },
    ],
    videoURL: {
      type: String,
      default: "",
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
    },
    dependencies: [
      {
        type: String, // topic keys that must be mastered first
      },
    ],
    estimatedTime: {
      type: Number,
      default: 20, // in minutes
    },
    estimatedMinutes: {
      type: Number,
      default: 20,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

lessonSchema.index({ topicKey: 1, version: -1 });
lessonSchema.index({ isPublished: 1, status: 1 });

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
