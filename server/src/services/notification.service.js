import Notification from "../models/Notification.js";

export const createNotification = async (userId, { title, message, type = "system", link = null }) => {
  return Notification.create({
    user: userId,
    title,
    message,
    type,
    link,
  });
};

export const getUserNotifications = async (userId, limit = 30) => {
  return Notification.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const markNotificationAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { $set: { isRead: true } },
    { new: true },
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

export const markAllNotificationsAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true } },
  );

  return { success: true };
};
