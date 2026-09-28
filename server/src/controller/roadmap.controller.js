import {
  getAllRoadmaps,
  getMyRoadmapService,
  getRoadmapById,
  startRoadmapService,
  updateRoadmapProgressService,
} from "../services/roadmap.service.js";

export const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await getAllRoadmaps();

    return res.status(200).json({
      success: true,
      data: {
        roadmaps,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRoadmap = async (req, res) => {
  try {
    const roadmap = await getRoadmapById(req.params.roadmapId);

    return res.status(200).json({
      success: true,
      data: {
        roadmap,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const startRoadmap = async (req, res) => {
  try {
    const userRoadmap = await startRoadmapService(
      req.user.userId,
      req.params.roadmapId,
    );

    return res.status(201).json({
      success: true,
      message: "Roadmap started successfully",
      data: {
        userRoadmap,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyRoadmap = async (req, res) => {
  try {
    const userRoadmap = await getMyRoadmapService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        roadmap: userRoadmap,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRoadmapProgress = async (req, res) => {
  try {
    const { progressPercent } = req.body;
    const userRoadmap = await updateRoadmapProgressService(
      req.user.userId,
      req.params.itemKey,
      progressPercent,
    );

    return res.status(200).json({
      success: true,
      message: "User roadmap updated",
      data: {
        userRoadmap,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
