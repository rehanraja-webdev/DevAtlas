import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./db.js";
import Roadmap from "../models/Roadmap.js";
import { roadmaps } from "../data/roadmaps.js";

dotenv.config();

const seedRoadmaps = async () => {
  try {
    await connectDB();

    await Roadmap.deleteMany();

    await Roadmap.insertMany(roadmaps);

    console.log("Roadmaps seeded successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.log("Roadmap seeding failed: ", error.message);
    process.exit();
  }
};

seedRoadmaps();