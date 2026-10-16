import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db.js";
import Lesson from "../models/Lesson.js";
import Assessment from "../models/Assessment.js";
import Quiz from "../models/Quiz.js";
import { blueprintCurriculum } from "../data/seedCurriculum.js";

dotenv.config();

export const seedBlueprintCurriculum = async () => {
  try {
    await connectDB();
    console.log(
      `Starting Blueprint Curriculum seeding (${blueprintCurriculum.length} units)...`,
    );

    for (const item of blueprintCurriculum) {
      const {
        topicKey,
        slug,
        title,
        version,
        estimatedMinutes,
        learningObjectives,
        misconceptions,
        sources,
        content,
        assessment: aData,
      } = item;

      // 1. Upsert Lesson
      const lesson = await Lesson.findOneAndUpdate(
        { topicKey },
        {
          $set: {
            topicKey,
            slug,
            title,
            version: version || 1,
            estimatedMinutes,
            estimatedTime: estimatedMinutes,
            learningObjectives,
            misconceptions,
            sources,
            content,
            isPublished: true,
            status: "published",
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );

      // 2. Upsert Assessment
      const assessment = await Assessment.findOneAndUpdate(
        { slug: aData.slug, version: version || 1 },
        {
          $set: {
            title: aData.title,
            slug: aData.slug,
            topicKey,
            lessonId: lesson._id,
            version: version || 1,
            status: "published",
            skillTags: aData.skillTags,
            passingScore: aData.passingScore || 80,
            questions: aData.questions,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );

      // 3. Upsert legacy Quiz for backward compatibility
      const quiz = await Quiz.findOneAndUpdate(
        { topicKey },
        {
          $set: {
            topicKey,
            lessonId: lesson._id,
            title: aData.title,
            passingScore: aData.passingScore || 80,
            questions: aData.questions,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
      );

      // Link to lesson
      lesson.assessmentId = assessment._id;
      lesson.quizId = quiz._id;
      await lesson.save();

      console.log(
        `✓ Seeded Blueprint Unit: ${topicKey} -> Assessment: "${assessment.title}" (v${assessment.version})`,
      );
    }

    console.log("Blueprint Curriculum seeding completed successfully!");

    if (process.argv[1]?.includes("seedBlueprintCurriculum")) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error("Blueprint Curriculum seeding error:", error.message);
    if (process.argv[1]?.includes("seedBlueprintCurriculum")) {
      process.exit(1);
    }
  }
};

if (process.argv[1]?.includes("seedBlueprintCurriculum")) {
  seedBlueprintCurriculum();
}
