import { getActivityService } from "../services/activity.service.js";

export const getMyActivity = async (req, res) => {
  try {
    const activities = await getActivityService(req.user.userId);
    const message =
      activities.length === 0
        ? "Activity list is empty"
        : "Activity list fetched";

    return res.status(200).json({
      success: true,
      message,
      data: {
        activities,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
