import mongoose from "mongoose";
import Activity from "../models/Activity.js";

export const getActivityAnalyticsService = async (userId, days = 7) => {
  const startDate = new Date();

  //To keep the record 1 day before
  startDate.setDate(startDate.getDate() - (days - 1));

  const result = await Activity.aggregate([
    {
      $match: {
        user: new mongoose.Schema.ObjectId(userId),
        createdAt: {
          $gte: startDate,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },

        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },

    {
      $project: {
        _id: 0,
        date: "$_id",
        count: 1,
      },
    },
  ]);

  return result;
};
