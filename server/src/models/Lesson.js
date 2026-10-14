import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
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
    content: {
      type: String,
      required: true, // Markdown or rich HTML tutorial content
    },
    videos: [
      {
        type: String, // Embed URLs or video links
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
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

lessonSchema.index({ topicKey: 1, isPublished: 1 });

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
