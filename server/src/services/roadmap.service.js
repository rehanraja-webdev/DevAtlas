import Roadmap from "../models/Roadmap.js";
import UserRoadmap from "../models/UserRoadmap.js";
import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import { createActivity } from "./activity.service.js";
import { deleteCache } from "../utils/cache.js";
import { roadmaps as defaultRoadmaps } from "../data/roadmaps.js";

export const getAllRoadmaps = async () => {
  let roadmaps = await Roadmap.find({ isPublished: { $ne: false } }).select(
    "title careerGoal description items isPublished",
  );

  // Auto-seed if database collection is empty
  if (!roadmaps || roadmaps.length === 0) {
    try {
      if (defaultRoadmaps && defaultRoadmaps.length > 0) {
        await Roadmap.insertMany(defaultRoadmaps);
        roadmaps = await Roadmap.find({ isPublished: { $ne: false } }).select(
          "title careerGoal description items isPublished",
        );
      }
    } catch (err) {
      console.error("Auto-seeding roadmaps fallback error:", err.message);
    }
  }

  return roadmaps || [];
};

export const getRoadmapById = async (roadmapId) => {
  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) {
    throw new Error("Roadmap not found!");
  }

  return roadmap;
};

export const startRoadmapService = async (userId, roadmapId) => {
  const roadmap = await Roadmap.findById(roadmapId);

  if (!roadmap) {
    throw new Error("Roadmap not found");
  }

  let userRoadmap = await UserRoadmap.findOne({
    user: userId,
    roadmap: roadmapId,
  });

  if (userRoadmap) {
    // If roadmap already started, touch updatedAt to make it the active roadmap
    userRoadmap.updatedAt = new Date();
    await userRoadmap.save();
    return await userRoadmap.populate("roadmap", "title careerGoal description items");
  }

  const progress = roadmap.items.map((item) => ({
    itemKey: item.key,
    status: !item.dependencies || item.dependencies.length === 0 ? "not-started" : "locked",
    progressPercent: 0,
  }));

  userRoadmap = await UserRoadmap.create({
    user: userId,
    roadmap: roadmapId,
    progress,
    overallProgress: 0,
  });

  await createActivity(userId, "roadmap_started", "roadmap", roadmapId, {
    title: `Started ${roadmap.title}`,
  });

  return await userRoadmap.populate("roadmap", "title careerGoal description items");
};

export const getMyRoadmapService = async (userId) => {
  // Sort by updatedAt desc to always fetch the most recently active roadmap for the user
  const userRoadmap = await UserRoadmap.findOne({
    user: userId,
  })
    .sort({ updatedAt: -1 })
    .populate("roadmap", "title careerGoal description items");

  // If no roadmap has been started yet, return null cleanly
  if (!userRoadmap) {
    return null;
  }

  return userRoadmap;
};

export const updateRoadmapProgressService = async (
  userId,
  itemKey,
  progressPercent,
) => {
  const userRoadmap = await UserRoadmap.findOne({
    user: userId,
  })
    .sort({ updatedAt: -1 })
    .populate("roadmap");

  if (!userRoadmap) {
    throw new Error("No active roadmap found");
  }

  const progressItem = userRoadmap.progress.find(
    (item) => item.itemKey === itemKey,
  );

  if (!progressItem) {
    throw new Error(`Milestone '${itemKey}' not found in active roadmap`);
  }

  const roadmapItem = userRoadmap.roadmap.items.find(
    (item) => item.key === itemKey,
  );

  if (!roadmapItem) {
    throw new Error(`Milestone specification '${itemKey}' not found`);
  }

  // Validate prerequisites if progressing past 0
  if (progressPercent > 0 && roadmapItem.dependencies?.length > 0) {
    const dependenciesCompleted = roadmapItem.dependencies.every(
      (depKey) => {
        const depProg = userRoadmap.progress.find(
          (item) => item.itemKey === depKey,
        );
        return depProg?.status === "completed" || depProg?.progressPercent === 100;
      },
    );

    if (!dependenciesCompleted) {
      throw new Error("Complete the required prerequisite topics first");
    }
  }

  progressItem.progressPercent = progressPercent;

  if (progressPercent === 0) {
    const allDepsMet =
      !roadmapItem.dependencies?.length ||
      roadmapItem.dependencies.every((depKey) => {
        const depProg = userRoadmap.progress.find((p) => p.itemKey === depKey);
        return depProg?.status === "completed" || depProg?.progressPercent === 100;
      });
    progressItem.status = allDepsMet ? "not-started" : "locked";
  } else if (progressPercent < 100) {
    progressItem.status = "in-progress";
    if (!progressItem.startedAt) {
      progressItem.startedAt = new Date();
    }
  } else {
    // Mastery Gate Check: If an assessment exists for this topic, require passing attempt >= passingScore
    const quiz = await Quiz.findOne({ topicKey: itemKey });
    if (quiz) {
      const passedAttempt = await Attempt.findOne({
        user: userId,
        topicKey: itemKey,
        type: "quiz",
        passed: true,
      }).sort({ score: -1 });

      if (!passedAttempt || passedAttempt.score < (quiz.passingScore || 80)) {
        const error = new Error(
          `Mastery gate active: You must pass the ${quiz.title} with at least ${quiz.passingScore || 80}% score before completing this milestone.`,
        );
        error.statusCode = 403;
        throw error;
      }

      progressItem.quizScore = passedAttempt.score;
      progressItem.verifiedMastery = true;
    }

    progressItem.status = "completed";
    progressItem.completedAt = new Date();
  }

  // Auto-unlock downstream milestones whose dependencies are now fully satisfied
  userRoadmap.progress.forEach((pItem) => {
    if (pItem.status === "locked") {
      const rItem = userRoadmap.roadmap.items.find((i) => i.key === pItem.itemKey);
      if (rItem && rItem.dependencies?.length > 0) {
        const allMet = rItem.dependencies.every((depKey) => {
          const dProg = userRoadmap.progress.find((p) => p.itemKey === depKey);
          return dProg?.status === "completed" || dProg?.progressPercent === 100;
        });
        if (allMet) {
          pItem.status = "not-started";
        }
      }
    }
  });

  const completedCount = userRoadmap.progress.filter(
    (item) => item.status === "completed" || item.progressPercent === 100,
  ).length;

  userRoadmap.overallProgress = Math.round(
    (completedCount / userRoadmap.progress.length) * 100,
  );

  userRoadmap.updatedAt = new Date();
  await userRoadmap.save();

  const type =
    progressPercent === 100 ? "roadmap_completed" : "roadmap_updated";

  await createActivity(userId, type, "roadmap", userRoadmap._id, {
    completionPercentage: progressPercent,
    lastUpdate: new Date(),
  });

  await deleteCache(`analytics:overview:${userId}`);

  return userRoadmap;
};
