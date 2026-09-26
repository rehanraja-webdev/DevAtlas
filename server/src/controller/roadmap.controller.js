import { startRoadmapService } from "../services/roadmap.service";

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
