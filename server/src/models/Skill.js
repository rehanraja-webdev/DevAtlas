import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    category: {
      type: String,
      enum: [
        "frontend",
        "backend",
        "database",
        "devops",
        "language",
        "tools",
        "core",
        "fundamentals",
        "other",
      ],
      default: "other",
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      default: "beginner",
    },

    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    source: {
      type: String,
      enum: ["self_reported", "verified"],
      default: "self_reported",
    },

    verifiedMasteryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SkillMastery",
      default: null,
    },

    lastVerifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

skillSchema.index({ user: 1, name: 1 }, { unique: true });
skillSchema.index({ user: 1, source: 1 });

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
