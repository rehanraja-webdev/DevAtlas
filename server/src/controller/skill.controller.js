import { createUserSkill } from "../services/skill.service.js";

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
