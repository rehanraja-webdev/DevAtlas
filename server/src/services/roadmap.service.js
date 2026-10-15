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

/**
 * Recalculate user roadmap progress strictly based on server-verified assessment attempts.
 * Eliminates client tampering by auditing passed attempts and re-evaluating dependency chains.
 */
export const recalculateUserRoadmapProgress = async (userRoadmap, userId) => {
  if (!userRoadmap || !userRoadmap.progress || userRoadmap.progress.length === 0) {
    return userRoadmap;
  }

  // Fetch all genuinely passed attempts for this user
  const passedAttempts = await Attempt.find({
    user: userId,
    passed: true,
  }).select("topicKey score type createdAt");

  const passedMap = new Map();
  passedAttempts.forEach((att) => {
    const existing = passedMap.get(att.topicKey);
    if (!existing || att.score > existing.score) {
      passedMap.set(att.topicKey, att);
    }
  });

  let changed = false;

  // 1. Audit milestone completion against real passed attempts
  userRoadmap.progress.forEach((pItem) => {
    const bestPassed = passedMap.get(pItem.itemKey);
    if (bestPassed) {
      if (!pItem.verifiedMastery || pItem.status !== "completed" || pItem.progressPercent !== 100) {
        pItem.verifiedMastery = true;
        pItem.quizScore = bestPassed.score;
        pItem.status = "completed";
        pItem.progressPercent = 100;
        if (!pItem.completedAt) pItem.completedAt = bestPassed.createdAt || new Date();
        changed = true;
      }
    } else {
      // No passed attempt exists for this topic! Revoke any unverified completion.
      if (pItem.verifiedMastery || pItem.status === "completed" || pItem.progressPercent === 100) {
        pItem.verifiedMastery = false;
        pItem.status = pItem.progressPercent > 0 ? "in-progress" : "not-started";
        pItem.progressPercent = pItem.progressPercent === 100 ? 40 : pItem.progressPercent;
        pItem.completedAt = null;
        changed = true;
      }
    }
  });

  // 2. Re-evaluate dependency unlock chains
  if (userRoadmap.roadmap && userRoadmap.roadmap.items) {
    userRoadmap.progress.forEach((pItem) => {
      // Completed items don't re-lock
      if (pItem.verifiedMastery || pItem.status === "completed") return;

      const rItem = userRoadmap.roadmap.items.find((i) => i.key === pItem.itemKey);
      if (rItem && rItem.dependencies?.length > 0) {
        const allDepsMet = rItem.dependencies.every((depKey) => {
          const depProg = userRoadmap.progress.find((p) => p.itemKey === depKey);
          return depProg && (depProg.status === "completed" || depProg.verifiedMastery === true);
        });

        if (allDepsMet && pItem.status === "locked") {
          pItem.status = "not-started";
          changed = true;
        } else if (!allDepsMet && pItem.status !== "locked") {
          pItem.status = "locked";
          pItem.progressPercent = 0;
          changed = true;
        }
      } else if ((!rItem || !rItem.dependencies || rItem.dependencies.length === 0) && pItem.status === "locked") {
        pItem.status = "not-started";
        changed = true;
      }
    });
  }

  // 3. Strictly calculate overall progress from genuine milestone completions
  const completedCount = userRoadmap.progress.filter(
    (item) => item.status === "completed" || item.verifiedMastery === true,
  ).length;

  const inProgressSum = userRoadmap.progress
    .filter((item) => item.status === "in-progress" && !item.verifiedMastery)
    .reduce((acc, curr) => acc + (curr.progressPercent || 0), 0);

  const totalItems = userRoadmap.progress.length || 1;
  const calculatedOverall = Math.min(
    100,
    Math.round(
      ((completedCount * 100 + inProgressSum) / (totalItems * 100)) * 100,
    ),
  );

  if (userRoadmap.overallProgress !== calculatedOverall) {
    userRoadmap.overallProgress = calculatedOverall;
    changed = true;
  }

  if (changed) {
    userRoadmap.updatedAt = new Date();
    await userRoadmap.save();
  }

  return userRoadmap;
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

  // Audit and recalculate progress directly from verified attempts
  await recalculateUserRoadmapProgress(userRoadmap, userId);

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
        return depProg?.status === "completed" || depProg?.verifiedMastery === true;
      },
    );

    if (!dependenciesCompleted) {
      throw new Error("Complete the required prerequisite topics first");
    }
  }

  if (progressPercent >= 100) {
    // Mastery Gate Check: Enforce server-side passed attempt before completion
    const passedAttempt = await Attempt.findOne({
      user: userId,
      topicKey: itemKey,
      type: "quiz",
      passed: true,
    }).sort({ score: -1 });

    if (!passedAttempt || passedAttempt.score < 80) {
      const error = new Error(
        `Mastery gate active: You cannot mark "${roadmapItem.title}" complete without passing the verified mastery quiz (≥80%) on the server.`,
      );
      error.statusCode = 403;
      throw error;
    }

    progressItem.progressPercent = 100;
    progressItem.status = "completed";
    progressItem.verifiedMastery = true;
    progressItem.quizScore = passedAttempt.score;
    progressItem.completedAt = new Date();
  } else if (progressPercent > 0) {
    // Mark as in-progress (e.g., lesson viewed/started)
    progressItem.progressPercent = Math.min(40, progressPercent);
    progressItem.status = "in-progress";
    if (!progressItem.startedAt) {
      progressItem.startedAt = new Date();
    }
  } else {
    // Reset to not-started (or locked if prerequisites not satisfied)
    const allDepsMet =
      !roadmapItem.dependencies?.length ||
      roadmapItem.dependencies.every((depKey) => {
        const depProg = userRoadmap.progress.find((p) => p.itemKey === depKey);
        return depProg?.status === "completed" || depProg?.verifiedMastery === true;
      });
    progressItem.progressPercent = 0;
    progressItem.status = allDepsMet ? "not-started" : "locked";
  }

  // Recalculate full roadmap progress & unlock states
  await recalculateUserRoadmapProgress(userRoadmap, userId);

  const type =
    progressItem.progressPercent === 100 ? "roadmap_completed" : "roadmap_updated";

  await createActivity(userId, type, "roadmap", userRoadmap._id, {
    completionPercentage: progressItem.progressPercent,
    lastUpdate: new Date(),
  });

  await deleteCache(`analytics:overview:${userId}`);

  return userRoadmap;
};
