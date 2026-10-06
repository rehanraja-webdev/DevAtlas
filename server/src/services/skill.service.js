import { deleteCache } from "../utils/cache.js";
import Skill from "../models/Skill.js";
import { createActivity } from "./activity.service.js";

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

  await createActivity(userId, "skill_added", "skill", skill._id, {
    title: skill.name,
    level: skill.level,
  });

  deleteCache(`analytics:overview:${userId}`);

  return skill;
};

export const getUserSkills = async (userId) => {
  const skills = await Skill.find({
    user: userId,
  }).sort({ createdAt: -1 });

  return skills;
};

export const updateUserSkill = async (userId, skillId, data) => {
  const allowedFields = ["name", "category", "level", "proficiency"];

  const updates = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  }

  const skill = await Skill.findOneAndUpdate(
    {
      _id: skillId,
      user: userId,
    },
    {
      $set: updates,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!skill) {
    throw new Error("Skill not found!");
  }

  await createActivity(userId, "skill_updated", "skill", skill._id, {
    title: skill.name,
    level: skill.level,
  });

  await deleteCache(`analytics:overview:${userId}`);

  return skill;
};

export const deleteUserSkill = async (userId, skillId) => {
  const skill = await Skill.findOneAndDelete({
    _id: skillId,
    user: userId,
  });

  if (!skill) {
    throw new Error("No skill found!");
  }

  await deleteCache(`analytics:overview:${userId}`);

  return skill;
};
