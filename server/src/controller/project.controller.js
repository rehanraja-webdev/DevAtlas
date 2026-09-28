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

export const getMyProjects = async (req, res) => {
  try {
    const projects = await getMyProjectsService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: {
        projects,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};