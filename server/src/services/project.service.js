import Project from "../models/Project.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteCache } from "../utils/cache.js";
import { createActivity } from "./activity.service.js";

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

  await createActivity(userId, "project_created", "project", project._id, {
    title: data.title,
    status: data.status,
  });

  await deleteCache(`analytics:overview:${userId}`);

  return project;
};

export const getProjectById = async (userId, projectId) => {
  const project = await Project.findOne({
    user: userId,
    _id: projectId,
  });

  if (!project) {
    throw new Error("Project not found!");
  }

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
    throw new ApiError(404, "Project not found!");
  }

  await deleteCache(`analytics:overview:${userId}`);
};

export const updateProjectService = async (userId, projectId, data) => {
  const project = await Project.findOneAndUpdate(
    { user: userId, _id: projectId },
    {
      description: data.description,
      status: data.status,
      technologies: data.technologies,
      githubUrl: data.githubUrl,
      liveUrl: data.liveUrl,
      startDate: data.startDate,
      endDate: data.endDate,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!project) {
    throw new Error("Project not found!");
  }

  const type =
    data.status === "completed" ? "project_completed" : "project_updated";

  await createActivity(userId, type, "project", project._id, {
    title: project.title,
    status: project.status,
  });

  await deleteCache(`analytics:overview:${userId}`);

  return project;
};
