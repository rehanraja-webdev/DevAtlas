import {
  getAllProblems,
  getMyDSAProgress,
  updateUserDSAProgress,
} from "../services/dsa.service.js";

export const getProblems = async (req, res) => {
  try {
    const problems = await getAllProblems();

    return res.status(200).json({
      success: true,
      message: "All problems fetched!",
      data: {
        problems,
      },
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
    const { status } = req.body();

    if (!["attempted", "solved"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const progress = updateUserDSAProgress(
      req.user.userId,
      req.params.problemsId,
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
    const progress = await getMyDSAProgress(req.user.userId);

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
