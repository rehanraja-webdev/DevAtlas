import mongoose from "mongoose";
import DSAProblem from "../models/DSAProblem.js";
import DSAProgress from "../models/DSAProgress.js";

export const getAllProblems = async () => {
  const problems = (await DSAProblem.find()).toSorted({ createdAt: -1 });

  return problems;
};

export const updateUserDSAProgress = async (userId, problemId, status) => {
  const problem = await DSAProblem.findById(problemId);

  if (!problem) {
    throw new Error("Problem not found!");
  }

  const progress = await DSAProgress.findOneAndUpdate(
    {
      user: userId,
      problem: problemId,
    },
    {
      $set: {
        status,
        lastAttemptedAt: new Date(),
        ...(status === "solved" ? { solvedAt: new Date() } : {}),
      },
      $inc: {
        attempts: 1,
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );

  return progress;
};

export const getMyDSAProgress = async (userId, status) => {
  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  return DSAProgress.find(query)
    .populate("problem", "title plateform difficulty topics url")
    .sort({ updatedAt: -1 });
};

export const getDSAStats = async (userId) => {
  const result = await DSAProgress.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: 1,
        },
      },
      solved: {
        $sum: {
          $cond: [{ $eq: ["$status", "solved"] }, 1, 0],
        },
      },

      attempted: {
        $sum: {
          $cond: [{ $eq: ["$status", "attempted"] }, 1, 0],
        },
      },
    },
  ]);

  return (
    result[0] || {
      total: 0,
      solved: 0,
      attempted: 0,
    }
  );
};
