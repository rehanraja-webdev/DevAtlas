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
