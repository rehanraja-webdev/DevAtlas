import mongoose from "mongoose";

const metricsSchema = new mongoose.Schema(
  {
    totalActivities: { type: Number, default: 0 },
    dsaSolved: { type: Number, default: 0 },
    dsaAttempted: { type: Number, default: 0 },
    projectsCreated: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    roadmapsStarted: { type: Number, default: 0 },
    roadmapsCompleted: { type: Number, default: 0 },
    skillsAdded: { type: Number, default: 0 },
    skillsUpdated: { type: Number, default: 0 },
  },
  { _id: false },
);

const developerReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["weekly"],
      default: "weekly",
    },

    periodStart: {
      type: Date,
      required: true,
    },

    periodEnd: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["queued", "processing", "completed", "failed"],
      default: "queued",
    },

    metrics: {
      type: metricsSchema,
      default: () => ({}),
    },

    insights: {
      type: [String],
      default: [],
    },

    generatedAt: {
      type: Date,
      default: null,
    },

    errorMessage: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

// Only one report per user and reporting period.
developerReportSchema.index(
  { user: 1, type: 1, periodStart: 1 },
  { unique: true },
);

developerReportSchema.index({
  user: 1,
  createdAt: -1,
});

const DeveloperReport = mongoose.model(
  "DeveloperReport",
  developerReportSchema,
);

export default DeveloperReport;
