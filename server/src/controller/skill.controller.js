import { createUserSkill, getUserSkills } from "../services/skill.service.js";

export const createSkill = async (req, res) => {
  try {
    const skill = await createUserSkill(req.user.userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: {
        skill,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSkills = async (req, res) => {
  try {
    const skills = await getUserSkills(req.user.userId);
    return res.status(200).json({
      succe: false,
      message: "User skills fetched",
      data: {
        skills,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSkill = (req, res) => {
  try {
    const skill = getUserSkills(req.user.userId, req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: {
        skill,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
