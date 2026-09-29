import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "dsa_solved",
        "dsa_attempted",
        "project_created",
        "project_completed",
        "roadmap_started",
        "roadmap_completed",
        "skill_added",
        "skill_updated",
      ],
      required: true,
    },

    entityType: {
      type: String,
      enum: ["dsa", "project", "roadmap", "skill"],
      required: true,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

activitySchema.index({
  user: 1,
  createdAt: -1,
});

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
