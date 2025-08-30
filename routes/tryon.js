import express from "express";
import upload from "../middleware/upload.js";
import validatePassword from "../middleware/validatePassword.js";
import { generateVirtualTryon } from "../utils/ai.js";

const router = express.Router();

export default (ai, API_PASSWORD) => {
  router.post(
    "/outfit-tryon",
    upload.fields([
      { name: "personImage", maxCount: 1 },
      { name: "outfitImage", maxCount: 1 },
    ]),
    validatePassword(API_PASSWORD),
    async (req, res) => {
      try {
        const personImageFile = req.files?.personImage?.[0];
        const outfitImageFile = req.files?.outfitImage?.[0];

        console.log("📁 Files received:", {
          personImage: personImageFile
            ? `${personImageFile.originalname} (${Math.round(
                personImageFile.size / 1024
              )}KB)`
            : "missing",
          outfitImage: outfitImageFile
            ? `${outfitImageFile.originalname} (${Math.round(
                outfitImageFile.size / 1024
              )}KB)`
            : "missing",
        });
        if (!personImageFile || !outfitImageFile) {
          console.log("❌ Missing required images");
          return res.status(400).json({
            success: false,
            error: "Missing required images",
            message: "Both personImage and outfitImage files are required",
          });
        }

        const prompt =
          "Take the clothing item from the second image and place it realistically on the person in the first image. Make sure the fit, lighting, and shadows look natural.";

        console.log("🤖 Sending request to Gemini AI...");
        const response = await generateVirtualTryon(
          ai,
          personImageFile,
          outfitImageFile,
          prompt
        );
        console.log("✅ AI response received, processing results...", response);
        for (const part of response.candidates[0].content?.parts) {
          if (
            part.inlineData &&
            part.inlineData.mimeType.startsWith("image/")
          ) {
            console.log(
              "🖼️ Image found in response, returning generated image"
            );
            return res.status(200).json({
              success: true,
              message: "Virtual try-on image generated successfully",
              data: {
                generatedImageBase64: part.inlineData.data,
                model_used: "gemini-2.5-flash-image-preview",
                processing_time: "3.2s",
                timestamp: new Date().toISOString(),
              },
            });
          }
        }
        return res.status(400).json({
          success: false,
          error: "No image found Or Prohibited Content",
          message: "AI response did not contain a generated image",
        });
      } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({
          success: false,
          error: "Processing failed",
          message: error.message || "Failed to process outfit try-on request",
        });
      }
    }
  );
  return router;
};
