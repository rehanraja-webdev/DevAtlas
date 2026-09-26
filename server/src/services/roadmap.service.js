import Roadmap from "../models/Roadmap.js";
import UserRoadmap from "../models/UserRoadmap.";

export const startRoadmapService = async (userId, roadmapId) => {
  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) {
    throw new Error("Roadmap not found");
  }

  const existing = await UserRoadmap.findOne({
    user: userId,
    roadmap: roadmapId,
  });

  if (existing) {
    throw new Error("Roadmap already started");
  }

  const progress = roadmap.items.map((item) => ({
    itemKey: item.key,
    status: item.dependencies.length === 0 ? "not-started" : "locked",
    progressPercent: 0,
  }));

  const userRoadmap = await UserRoadmap.create({
    user: userId,
    roadmap: roadmapId,
    progress,
  });

  return userRoadmap;
};
