import Activity from "../models/Activity.js";

export const createActivity = ({
  userId,
  type,
  entityType,
  entityId,
  metadata = {},
}) => {
  return Activity.create({
    user: userId,
    type,
    entityType,
    entityId,
    metadata,
  });
};

export const getActivityService = async (userId) => {
  const activities = await Activity.find({ user: userId });

  return activities;
};
