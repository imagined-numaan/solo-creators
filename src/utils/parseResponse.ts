import { PredictionResult } from "../types/analysis.types";

// todo: add comments for better clarity of what this function is doing to a response string
export function parseGeminiTextResponse(response: string): PredictionResult {
  const start = response.indexOf("{");
  const end = response.indexOf("}");
  if (start === -1 || end === -1 || start >= end) {
    throw new Error("Invalid JSON format in response");
  }

  const jsonString = response.substring(start, end + 1);
  console.log("Parsed JSON String:", jsonString);

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    throw new Error("Failed to parse Gemini text response");
  }
}

export function parseGeminiJSONResponse(response: string): PredictionResult {
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error("Error parsing JSON response:", error);
    throw new Error("Failed to parse Gemini JSON response");
  }
}
