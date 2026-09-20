import Profile from "../models/Profile.js";

export const getProfileUseByUserId = async (userId) => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile;
};

export const updateUserProfile = async (userId, data) => {
  const allowedFields = [
    "bio",
    "avatar",
    "location",
    "githubUrl",
    "linkedInUrl",
    "portfolioUrl",
    "careerGoal",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  const profile = await Profile.findOneAndUpdate(
    { user: userId },
    { $set: updates },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!profile) {
    throw new Error("Profile not found");
  }

  return profile;
};
