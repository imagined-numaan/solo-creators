import { GenerateContentConfig, GoogleGenAI, Part } from "@google/genai";
import initEnv from "../env";
import { promptsObj } from "./prompts";
import { parseGeminiJSONResponse, parseGeminiTextResponse } from "../utils/parseResponse";
import { geminiErrorHandler } from "../errors/gemini_error_handler";

const envData = initEnv();

class CreatorProfileAnalyzer {
  private geminiAI: GoogleGenAI;
  private responseSchema: object;


  // todo: need to refactor this because it is similar to the fake profile analyzer
  constructor(apiKey: string) {
    this.geminiAI = new GoogleGenAI({ apiKey });
    this.responseSchema = {
      type: "object",
      properties: {
        isCreator: {
          type: "integer",
          enum: ["0", "1"],
          description:
            "Integer representing whether the profile is a creator or not. 1 indicates a creator profile, 0 indicates a non-creator profile.",
        },

        accuracy: {
          type: "number",
          format: "float",
          description:
            "Float between 0.0 and 1.0 representing the confidence in the classification made by the model. 1.0 is 100% confident, 0.0 is 0% confident.",
        },
        reason: {
          type: "string",
          description:
            "Reason for the classification made by the model. This is a short description of why the model classified the profile as creator or not.",
        },
      },
      required: ["isCreator", "accuracy", "reason"],
      propertyOrdering: ["isCreator", "accuracy", "reason"],
    };
  }

  private geminiApi(config: GenerateContentConfig, prompt: string) {
    const contents: Part[] = [{ text: prompt }];

    return this.geminiAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        topK: 1,
        topP: 0,
        temperature: 0,
        ...config,
      },
    });
  }

  // this function uses the username, bio and category to classify profiles 
  // as creators or not
  async analyzeProfile(username: string, biography: string, category: string) {
    const prediction = await geminiErrorHandler(async () => {
      const prompt = promptsObj.creatorAnalysisPrompt(username, biography, category);

      const response = await this.geminiApi(
        {
          tools: [{googleSearch: {}}],
        },
        prompt
      );

      if (response.text) {
        return parseGeminiTextResponse(response.text);
      }
    });
    return prediction;
  }
}

const creatorAnalyzer = new CreatorProfileAnalyzer(envData.GEMINI_API_KEY);
export default creatorAnalyzer;
