import mongoose from "mongoose";
import Activity from "../models/Activity.js";
import Project from "../models/Project.js";
import UserRoadmap from "../models/UserRoadmap.js";
import Skill from "../models/Skill.js";
import { fetchDSAStats } from "./dsa.service.js";
import { getCache } from "../utils/cache.js";

export const getActivityAnalyticsService = async (userId, days = 7) => {
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - (days - 1));

  const result = await Activity.aggregate([
    {
      $match: {
        user: new mongoose.Schema.ObjectId(userId),
        createdAt: {
          $gte: startDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },

        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
  ]);

  return result;
};

export const getDeveloperOverviewService = async (userId) => {
  const cacheKey = `analytics:overview:${userId}`;
  const cached = await getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const [dsa, skillCount, projectCount, roadmap] = await Promise.all([
    fetchDSAStats(userId),
    Skill.countDocuments({
      user: userId,
    }),
    Project.countDocuments({
      user: userId,
    }),
    UserRoadmap.findOne({
      user: userId,
    }).select("overallProgress"),
  ]);

  return {
    dsa,
    skills: skillCount,
    projects: projectCount,
    roadmapProgress: roadmap?.overallProgress ?? 0,
  };
};
