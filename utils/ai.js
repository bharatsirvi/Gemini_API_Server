import {
  GoogleGenAI,
  Modality,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getAIInstance = (apiKey) => new GoogleGenAI({ apiKey: (apiKey || "").trim() });

const generateVirtualTryon = async (
  ai,
  personImageFile,
  outfitImageFile,
  prompt
) => {
  console.log("🤖 Starting AI generation process...");
  console.log("📊 Image details:", {
    personImage: {
      size: `${Math.round(personImageFile.size / 1024)}KB`,
      mimetype: personImageFile.mimetype,
      file: personImageFile,
    },
    outfitImage: {
      size: `${Math.round(outfitImageFile.size / 1024)}KB`,
      mimetype: outfitImageFile.mimetype,
      file: outfitImageFile,
    },
  });

  const parts = [
    {
      inlineData: {
        data: personImageFile.buffer.toString("base64"),
        mimeType: personImageFile.mimetype || "image/jpeg",
      },
    },
    {
      inlineData: {
        data: outfitImageFile.buffer.toString("base64"),
        mimeType: outfitImageFile.mimetype || "image/jpeg",
      },
    },
    { text: prompt },
  ];

  console.log("🚀 Sending request to Gemini AI...");
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  console.log("✅ AI request completed successfully");
  return response;
};
export { getAIInstance, generateVirtualTryon };

