import Skill from "../models/Skill.js";

export const createUserSkill = async (
  userId,
  { name, category, level, proficiency },
) => {
  const existingSkill = await Skill.findOne({
    user: userId,
    name,
  });

  if (existingSkill) {
    throw new Error("SKill already exists");
  }

  const skill = await Skill.create({
    user: userId,
    name,
    category,
    level,
    proficiency,
  });

  return skill;
};

export const getUserSkills = async (userId) => {
  const skills = await Skill.find({
    user: userId,
  }).sort({ createdAt: -1 });

  return skills;
};
