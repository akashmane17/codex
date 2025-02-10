import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectToMongoDB = async (): Promise<void> => {
  const mongoURI = MONGO_URI;

  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application on failure
  }

  // Optional: Set Mongoose options
  mongoose.set("strictQuery", true); // Enforce strict query behavior
};

export default connectToMongoDB;
