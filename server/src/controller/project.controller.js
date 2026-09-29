import {
  createProjectService,
  deleteMyProject,
  getMyProjectsService,
  getProjectById,
  updateProjectService,
} from "../services/project.service.js";

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

export const getMyProject = async (req, res) => {
  try {
    const project = await getProjectById(req.user.userId, req.params.projectId);

    return res.status(200).json({
      success: true,
      data: {
        project,
      },
    });
  } catch (error) {
    return res.status(403).json({
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

export const deleteProject = async (req, res) => {
  try {
    await deleteMyProject(req.user.userId, req.params.projectId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await updateProjectService(
      req.user.userId,
      req.params.projectId,
      req.body,
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      data: {
        project,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
