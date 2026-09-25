import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./db.js";
import DSAProblem from "../models/DSAProblem.js";
import { dsaProblems } from "../data/dsaProblems";

dotenv.config();

const seedProblems = async () => {
  try {
    await connectDB();
    await DSAProblem.deleteMany();
    await DSAProblem.insertMany(dsaProblems);
    console.log("DSA Problems seeded successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed: ", error.message);
    process.exit(1);
  }
};
seedProblems();
