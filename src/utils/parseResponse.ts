import { PredictionResult } from "../types/analysis.types";

export function parseGeminiTextResponse(response: string): PredictionResult {
  const replacedText = response.replace(/```/g, "").replace("json", "");
  return JSON.parse(replacedText);
}

export function parseGeminiJSONResponse(response: string): PredictionResult {
  return JSON.parse(response);
}
