import { ApiError } from "@google/genai";


// todo: modify this to handle errors from the Gemini API
// this is a temporary error handler for the Gemini API
// it will log the error and exit the process
export async function geminiErrorHandler(callback: any) {
  try {
    return await callback();
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`An error occured: ${error.status}: ${error.message}`);
      process.exit(1);
    }
  }
}
