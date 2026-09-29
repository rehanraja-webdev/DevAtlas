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

export const getActivityService = (userId) => {
  return Activity.find({ user: userId }).sort({ createdAt: -1 }).limit(20);
};
