import mongoose from "mongoose";

const roadmapItemSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
    },

    estimatedHours: {
      type: Number,
      min: 0,
    },

    skills: [
      {
        type: String,
        trim: true,
      },
    ],

    dependencies: [
      {
        type: String,
      },
    ],
  },
  {
    _id: false,
  },
);

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    careerGoal: {
      type: String,
      enum: [
        "frontend-developer",
        "backend-developer",
        "fullstack-developer",
        "software-engineer",
        "ai-engineer",
      ],
      required: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    items: {
      type: [roadmapItemSchema],
      required: true,
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

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
