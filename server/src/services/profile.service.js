import Profile from "../models/Profile.js";
import User from "../models/User.js";

export const getProfileUseByUserId = async (userId) => {
  let profile = await Profile.findOne({ user: userId });

  if (!profile) {
    profile = await Profile.create({
      user: userId,
      careerGoal: "Full Stack Developer",
    });
  }
  return profile;
};

export const updateUserProfile = async (userId, data) => {
  if (data.fullname && typeof data.fullname === "string") {
    await User.findByIdAndUpdate(userId, {
      $set: { fullname: data.fullname.trim() },
    });
  }

  const allowedFields = [
    "bio",
    "avatar",
    "location",
    "githubUrl",
    "linkedInUrl",
    "linkedinUrl",
    "portfolioUrl",
    "careerGoal",
    "resumeText",
    "parsedResume",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  // Keep dual linkedInUrl / linkedinUrl in sync
  if (updates.linkedInUrl !== undefined) {
    updates.linkedinUrl = updates.linkedInUrl;
  } else if (updates.linkedinUrl !== undefined) {
    updates.linkedInUrl = updates.linkedinUrl;
  }

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: updates },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  );

  return profile;
};
