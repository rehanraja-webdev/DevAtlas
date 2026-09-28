import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    status: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "planned",
    },

    technologies: [
      {
        type: String,
        trim: true,
      },
    ],

    githubUrl: {
      type: String,
      trim: true,
      default: null,
    },

    liveUrl: {
      type: String,
      trim: true,
      default: null,
    },

    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

return Project;
