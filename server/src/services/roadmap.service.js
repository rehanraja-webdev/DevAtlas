import Roadmap from "../models/Roadmap.js";
import UserRoadmap from "../models/UserRoadmap.js";

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

export const getMyRoadmapService = async (userId) => {
  const userRoadmap = await UserRoadmap.findOne({
    user: userId,
  }).populate("roadmap", "title careerGoal description items");

  if (!userRoadmap) {
    throw new Error("No roadmap started");
  }

  return userRoadmap;
};

export const updateRoadmapProgressService = async (
  userId,
  itemKey,
  progressPercent,
) => {
  const userRoadmap = Roadmap.findOne({
    user: userId,
  }).populate("roadmap");

  if (!userRoadmap) {
    throw new Error("Roadmap not found");
  }

  const progressItem = userRoadmap.progress.find(
    (item) => item.itemKey === itemKey,
  );

  if (!progressItem) {
    throw new Error("Roadmap not found");
  }

  const dependenciesCompleted = roadmapItem.dependencies.every((dependency) => {
    const dependencyProgress = userRoadmap.progress.find(
      (item) => item.itemKey === dependency,
    );

    return dependencyProgress?.status === "completed";
  });

  if (!dependenciesCompleted) {
    throw new Error("Complete the required topic first");
  }

  progressItem.progressPercent = progressPercent;

  if (progressPercent === 0) {
    progressItem.status = "not-started";
  } else if (progressPercent < 100) {
    progressItem.status = "in-progress";
    if (!progressItem.startedAt) {
      progressItem.startedAt = new Date();
    }
  } else {
    progressItem.status = "completed";
    progressItem.completedAt = new Date();
  }

  const completedCount = userRoadmap.progress.filter(
    (item) => item.status === "completed",
  ).length;

  userRoadmap.overallProgress = Math.round(
    (completedCount / userRoadmap.progress.length) * 100,
  );

  await userRoadmap.save();

  return userRoadmap;
};
