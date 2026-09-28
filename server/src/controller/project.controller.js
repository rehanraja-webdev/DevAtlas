import { createProjectService } from "../services/project.service.js";

export const createProject = async (req, res) => {
  try {
    const project = await createProjectService(req.user.userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Project created successfully!",
      data: {
        project,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
