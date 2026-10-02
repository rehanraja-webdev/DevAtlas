import {
  fetchDSAStats,
  getAllProblems,
  getMyDSAProgress,
  updateUserDSAProgress,
} from "../services/dsa.service.js";

export const getProblems = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);

    const { search, difficulty, platform, topic } = req.query;

    if (difficulty && !["easy", "medium", "hard"].includes(difficulty)) {
      return res.status(400).json({
        success: false,
        message: "Invalid difficulty",
      });
    }

    const result = await getAllProblems({
      page,
      limit,
      search,
      difficulty,
      platform,
      topic,
    });

    return res.status(200).json({
      success: true,
      message: "All problems fetched!",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDSAProgress = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["attempted", "solved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const progress = await updateUserDSAProgress(
      req.user.userId,
      req.params.problemId,
      status,
    );

    return res.status(200).json({
      success: true,
      message: "DSA progress updated",
      data: {
        progress,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDSAProgress = async (req, res) => {
  try {
    const { status } = req.query;

    const progress = await getMyDSAProgress(req.user.userId, status);

    return res.status(200).json({
      success: true,
      message: "DSA progress fetched!",
      data: {
        progress,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDSAStats = async (req, res) => {
  try {
    const stats = await fetchDSAStats(req.user.userId);

    return res.status(200).json({
      success: true,
      message: "DSA stats fetched",
      data: {
        stats,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
