import mongoose from "mongoose";

const skillEvidenceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    skillKey: {
      type: String,
      required: true,
      index: true,
    },
    sourceType: {
      type: String,
      enum: [
        "assessment",
        "exercise",
        "scenario_lab",
        "project_milestone",
        "retention_review",
      ],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    rubric: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    verifiedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    contentVersion: {
      type: Number,
      default: 1,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

skillEvidenceSchema.index({ user: 1, skillKey: 1, verifiedAt: -1 });

const SkillEvidence = mongoose.model("SkillEvidence", skillEvidenceSchema);

export default SkillEvidence;
