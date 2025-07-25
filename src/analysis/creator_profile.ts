import { GenerateContentConfig, GoogleGenAI, Part } from "@google/genai";
import initEnv from "../env";
import { promptsObj } from "./prompts";
import { parseGeminiJSONResponse, parseGeminiTextResponse } from "../utils/parseResponse";
import { geminiErrorHandler } from "../errors/gemini_error_handler";
import { IUser } from "../types/response.types";

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
          description:
            "String representing whether the profile is a creator or not. '1' indicates a creator profile, '0' indicates a non-creator profile.",
        },
        accuracy: {
          type: "number",
          format: "float",
          description:
            "Float between 0 and 1 representing the confidence in the classification made by the model. 1 is 100% confident, 0 is 0% confident.",
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
  async analyzeProfile(profile: IUser) {
    const prediction = await geminiErrorHandler(async () => {
      const prompt = promptsObj.creatorAnalysisPrompt(profile);

      const response = await this.geminiApi(
        {
          
          tools: [{googleSearch: {}}],
        },
        prompt
      );

      if (response.text) {
        console.log(" CREATOR-----------------------", response.text);
        return parseGeminiTextResponse(response.text);
      }
    });
    return prediction;
  }
}

const creatorAnalyzer = new CreatorProfileAnalyzer(envData.GEMINI_API_KEY);
export default creatorAnalyzer;
