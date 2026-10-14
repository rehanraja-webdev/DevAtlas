import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./db.js";
import Lesson from "../models/Lesson.js";
import Quiz from "../models/Quiz.js";
import Exercise from "../models/Exercise.js";
import { learningContent } from "../data/learningContent.js";

dotenv.config();

export const seedLearning = async () => {
  try {
    await connectDB();
    console.log(`Starting verified learning content seeding (${learningContent.length} topics)...`);

    for (const item of learningContent) {
      const { topicKey, lesson: lData, quiz: qData, exercise: eData } = item;

      // 1. Upsert Lesson
      const lesson = await Lesson.findOneAndUpdate(
        { topicKey },
        {
          $set: {
            topicKey,
            title: lData.title,
            content: lData.content,
            videoURL: lData.videoURL || "",
            estimatedTime: lData.estimatedTime || 20,
            isPublished: true,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );

      // 2. Upsert Quiz
      const quiz = await Quiz.findOneAndUpdate(
        { topicKey },
        {
          $set: {
            lessonId: lesson._id,
            topicKey,
            title: qData.title,
            passingScore: qData.passingScore || 80,
            questions: qData.questions,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );

      // 3. Upsert Exercise if present
      let exercise = null;
      if (eData) {
        exercise = await Exercise.findOneAndUpdate(
          { topicKey },
          {
            $set: {
              lessonId: lesson._id,
              topicKey,
              title: eData.title,
              description: eData.description,
              difficulty: eData.difficulty || "medium",
              language: eData.language || "javascript",
              templateCode: eData.templateCode,
              solutionCode: eData.solutionCode || "",
              tests: eData.tests,
            },
          },
          { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
        );
      }

      // 4. Update Lesson with Quiz and Exercise references
      lesson.quizId = quiz._id;
      if (exercise) {
        lesson.exerciseId = exercise._id;
      }
      await lesson.save();

      console.log(`✓ Synchronized Verified Learning: ${topicKey} -> Quiz: "${quiz.title}"`);
    }

    console.log("All verified learning content seeded successfully!");

    if (process.argv[1]?.includes("seedLearning")) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error("Learning content seeding error:", error.message);
    if (process.argv[1]?.includes("seedLearning")) {
      process.exit(1);
    }
  }
};

if (process.argv[1]?.includes("seedLearning")) {
  seedLearning();
}
