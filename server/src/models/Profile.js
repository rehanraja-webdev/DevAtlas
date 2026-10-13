import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      maxlength: 1000,
      trim: true,
      default: "",
    },

    avatar: {
      type: String,
      default: null,
    },

    location: {
      type: String,
      maxlength: 100,
      trim: true,
      default: "",
    },

    githubUrl: {
      type: String,
      trim: true,
      default: null,
    },

    linkedinUrl: {
      type: String,
      trim: true,
      default: null,
    },

    linkedInUrl: {
      type: String,
      trim: true,
      default: null,
    },

    portfolioUrl: {
      type: String,
      trim: true,
      default: null,
    },

    careerGoal: {
      type: String,
      trim: true,
      default: "Full Stack Developer",
    },

    resumeText: {
      type: String,
      default: "",
    },

    parsedResume: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
