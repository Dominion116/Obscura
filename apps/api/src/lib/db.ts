import mongoose from "mongoose";
import { env } from "../config/env";
import { createLogger } from "./logger";

const logger = createLogger("db");

export async function connectDb(): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongodbUri);
  logger.info("Connected to MongoDB");
}
