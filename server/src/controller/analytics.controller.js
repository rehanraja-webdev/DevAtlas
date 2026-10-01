import { getActivityAnalyticsService } from "../services/analytics.service.js";

export const getActivityAnalytics = async (req, res) => {
  try {
    const days = Number(req.query.days) || 7;

    if (![7, 30, 90].includes(days)) {
      return res.status(400).json({
        success: false,
        message: "Days must be 7, 30 or 90",
      });
    }

    const activity = await getActivityAnalyticsService(req.user.userId, days);

    return res.status(200).json({
      success: true,
      data: {
        activity,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
