import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

// function to connect connect the mongo database of provided url string
export const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "vipin",
    });
    console.log(chalk.bgGreen.bold("MongoDB connected successfully"));
  } catch (error) {
    console.log(
      error.message
        ? `MongoDB connection failed: ${error.message}`
        : `MongoDB connection failed`
    );
  }
};
