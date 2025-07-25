import { Blob, GenerateContentConfig, GoogleGenAI, Part } from "@google/genai";
import initEnv from "../env";
import { promptsObj } from "./prompts";
import {
  parseGeminiJSONResponse,
  parseGeminiTextResponse,
} from "../utils/parseResponse";
import { geminiErrorHandler } from "../errors/gemini_error_handler";

const envData = initEnv();

class FakeProfileAnalyzer {
  private geminiAI: GoogleGenAI;
  private responseSchema: object;

  constructor(apiKey: string) {
    this.geminiAI = new GoogleGenAI({ apiKey });
    this.responseSchema = {
      type: "object",
      properties: {
        isFake: {
          type: "integer",
          enum: ["0", "1"],
          description:
            "Integer representing whether the profile is fake or not. 1 indicates a fake profile, 0 indicates a real profile.",
        },
        riskScore: {
          type: "number",
          format: "float",
          description:
            "Float between 0 and 1 representing the fake profile score for this feature. Lower scores indicate a higher likelihood of being a real profile. Higher scores indicate a higher likelihood of being a fake profile. Assign a precise/reliable/accurate float value.",
        },
        accuracy: {
          type: "number",
          format: "float",
          description:
            "Float between 0 and 1 representing the confidence in the classification made by the model. 1 is 100% confident, 0 is 0% confident. Assign a precise/reliable/accurate float value.",
        },
        reason: {
          type: "string",
          description:
            "Reason for the classification made by the model. This is a short description of why the model classified the profile as fake or real.",
        },
      },
      required: ["isFake", "riskScore", "accuracy", "reason"],
      propertyOrdering: ["isFake", "accuracy", "riskScore", "reason"],
    };
  }

  private geminiApi(
    config: GenerateContentConfig,
    prompt: string,
    inlineContent?: Blob
  ) {
    const contents: Part[] = [{ text: prompt }];
    if (inlineContent) {
      contents.push({
        inlineData: inlineContent,
      });
    }
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

  async classifyUsername(username: string) {
    const prediction = await geminiErrorHandler(async () => {
      const prompt = promptsObj.usernameClassificationPrompt(username);

      const response = await this.geminiApi(
        {
          responseMimeType: "application/json",
          responseJsonSchema: this.responseSchema,
        },
        prompt
      );

      if (response.text !== undefined) {
        return parseGeminiJSONResponse(response.text);
      }
    });

    return prediction;
  }

  async classifyProfilePicture(profilePictureUrl: string) {
    const prediction = await geminiErrorHandler(async () => {
      const imageResponse = await fetch(profilePictureUrl);
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      const base64ImageData = Buffer.from(imageArrayBuffer).toString("base64");

      const inlineContent: Blob = {
        mimeType: imageResponse.headers.get("content-type") || "image/jpeg",
        data: base64ImageData,
      };
      const prompt = promptsObj.profilePictureClassificationPrompt();
      const response = await this.geminiApi(
        {
          tools: [{ googleSearch: {} }],
        },
        prompt,
        inlineContent
      );

      if (response.text) {
        console.log("PROFILEEEE-----------------------", response.text);

        return parseGeminiTextResponse(response.text);
      }
    });
    return prediction;
  }

  async classifyBiography(biography: string) {
    const prediction = await geminiErrorHandler(async () => {
      const prompt = promptsObj.userBiographyClassificationPrompt(biography);

      const response = await this.geminiApi(
        {
          responseMimeType: "application/json",
          responseJsonSchema: this.responseSchema,
        },

        prompt
      );

      if (response.text !== undefined) {
        return parseGeminiTextResponse(response.text);
      }
    });
    return prediction;
  }

  async classifyFollowingCount(followerCount: number, followingCount: number) {
    const prediction = await geminiErrorHandler(async () => {
      const prompt = promptsObj.followerFollowingClassificationPrompt(
        followerCount,
        followingCount
      );

      const response = await this.geminiApi(
        {
          responseMimeType: "application/json",
          responseJsonSchema: this.responseSchema,
        },
        prompt
      );

      if (response.text !== undefined) {
        return parseGeminiJSONResponse(response.text);
      }
    });
    return prediction;
  }
}

const fakeProfileAnalyzer = new FakeProfileAnalyzer(envData.GEMINI_API_KEY);
export default fakeProfileAnalyzer;
