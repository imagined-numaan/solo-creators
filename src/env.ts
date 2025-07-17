import { configDotenv } from "dotenv";
configDotenv();

interface Env {
  RAPID_API_INSTAGRAM_KEY: string;
  RAPID_API_INSTAGRAM_HOST: string;
  MONGO_URI: string;
  SOLO_URI: string;
  GEMINI_API_KEY: string;
}

export default function initEnv() {
  const envConfig: Env = {
    RAPID_API_INSTAGRAM_KEY: process.env.RAPID_API_INSTAGRAM_KEY || "",
    RAPID_API_INSTAGRAM_HOST: process.env.RAPID_API_INSTAGRAM_HOST || "",
    MONGO_URI:
      process.env.MONGO_URI || "mongodb://localhost:27017/solo-creators",
    SOLO_URI:
      process.env.SOLO_URI || "mongodb://localhost:27017/solo-creators",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  };

  if (!envConfig.RAPID_API_INSTAGRAM_KEY) {
    throw new Error("RAPID_API_INSTAGRAM_KEY is not set");
  }
  if (!envConfig.RAPID_API_INSTAGRAM_HOST) {
    throw new Error("RAPID_API_INSTAGRAM_HOST is not set");
  }
  if (!envConfig.MONGO_URI) {
    throw new Error("MONGO_URI is not set");
  }

  return envConfig;
}
