import Project from "../models/Project.js";

export const createProjectService = async (userId, data) => {
  const project = await Project.create({
    user: userId,
    title: data.title,
    description: data.description,
    status: data.status,
    technologies: data.technologies,
    githubUrl: data.githubUrl,
    liveUrl: data.liveUrl,
    startDate: data.startDate,
    endDate: data.endDate,
  });

  return project;
};

export const getMyProjectsService = async (userId) => {
  return Project.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

export const deleteMyProject = async (userId, projectId) => {
  const project = await Project.findOneAndDelete({
    user: userId,
    _id: projectId,
  });

  if (!project) {
    throw new Error("Project not found!");
  }
};
