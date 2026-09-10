import mongoose from "mongoose";

const dsaProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSAProblem",
      required: true,
    },

    status: {
      type: String,
      enum: ["attempted", "solved"],
      default: "attempted",
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    bestTimeMinutes: {
      type: Number,
      min: 0,
      default: null,
    },

    lastAttemptedAt: {
      type: Date,
      default: null,
    },

    solvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

dsaProgressSchema.index({ user: 1, problem: 1 }, { unique: true });

const DSAProgress = mongoose.model("DSAProgress", dsaProgressSchema);

export default DSAProgress;
