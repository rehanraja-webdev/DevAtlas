import {
  getMyRoadmapService,
  startRoadmapService,
} from "../services/roadmap.service";

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
