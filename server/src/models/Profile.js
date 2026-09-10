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
      maxlength: 500,
      trim: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    location: {
      type: String,
      maxlength: 100,
      trim: true,
    },

    githubUrl: {
      type: String,
      trim: true,
    },

    linkedinUrl: {
      type: String,
      trim: true,
    },

    portfolioUrl: {
      type: String,
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
    },
  },
  {
    timestamps: true,
  },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
