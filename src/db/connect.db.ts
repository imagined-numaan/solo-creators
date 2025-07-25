import mongoose from "mongoose";
import initEnv from "../env";

const envData = initEnv();
export default async function connectToDatabase() {
  try {
    const localDB = await mongoose
      .createConnection(envData.LOCAL_MONGO_URI)
      .asPromise();
    const soloDB = await mongoose
      .createConnection(envData.SOLO_URI)
      .asPromise();
    return { localDB, soloDB };
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

 