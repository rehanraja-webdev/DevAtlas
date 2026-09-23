import DSAProblem from "../models/DSAProblem.js";

export const getAllProblems = async () => {
  const problems = (await DSAProblem.find()).toSorted({ createdAt: -1 });

  return problems;
};
