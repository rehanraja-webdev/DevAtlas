import mongoose from "mongoose";

const dsaProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    platform: {
      type: String,
      enum: ["leetcode", "geeksforgeeks", "codechef", "codeforces", "other"],
      required: true,
    },

    externalId: {
      type: String,
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },

    topics: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

dsaProblemSchema.index({ platform: 1, externalId: 1 }, { unique: true });

const DSAProblem = mongoose.model("DSAProblem", dsaProblemSchema);

export default DSAProblem;
