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
