import Profile from "../models/Profile.js";
import {
  getProfileUseByUserId,
  updateUserProfile,
} from "../services/profile.service.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await getProfileUseByUserId(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "Authenticated profile request",
      data: {
        profile,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await updateUserProfile(req.user.userId, req.body);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        profile,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
