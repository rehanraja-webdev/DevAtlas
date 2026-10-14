import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./db.js";
import Roadmap from "../models/Roadmap.js";
import { roadmaps } from "../data/roadmaps.js";

dotenv.config();

export const seedRoadmaps = async () => {
  try {
    await connectDB();

    console.log(`Starting roadmap seeding for ${roadmaps.length} tracks...`);

    for (const r of roadmaps) {
      await Roadmap.findOneAndUpdate(
        { careerGoal: r.careerGoal },
        {
          $set: {
            title: r.title,
            description: r.description,
            items: r.items,
            isPublished: true,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      console.log(`✓ Synchronized roadmap: ${r.title} (${r.careerGoal})`);
    }

    console.log("All roadmaps seeded successfully");

    if (process.argv[1]?.includes("seedRoadmaps")) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (error) {
    console.error("Roadmap seeding failed: ", error.message);
    if (process.argv[1]?.includes("seedRoadmaps")) {
      process.exit(1);
    }
  }
};

if (process.argv[1]?.includes("seedRoadmaps")) {
  seedRoadmaps();
}