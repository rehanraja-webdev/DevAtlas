import Profile from "../models/Profile.js";

export const getProfileUseByUserId = async (userId) => {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    throw new Error("Profile not found");
  }
  return profile;
};
