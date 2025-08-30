import express from "express";
import validatePassword from "../middleware/validatePassword.js";
import upload from "../middleware/upload.js";
const router = express.Router();

export default (ai, API_PASSWORD) => {
  router.post(
    "/video-quick",
    validatePassword(API_PASSWORD),
    upload.single("image"),
    async (req, res) => {
      try {
        console.log("Video generation request received");
        const { prompt, aspectRatio, negativePrompt } = req.body || {};
        console.log("Video generation request received");

        const imageFile = req.file || null;
        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
          return res
            .status(400)
            .json({ success: false, error: "Missing prompt" });
        }
        console.log("Video generation request received");
        const cfg = {};
        cfg.aspectRatio =
          typeof aspectRatio === "string" && aspectRatio.trim()
            ? aspectRatio.trim()
            : "16:9";
        if (typeof negativePrompt === "string" && negativePrompt.trim()) {
          cfg.negativePrompt = negativePrompt.trim();
        }

        const genParams = {
          model: "veo-3.0-generate-preview",
          prompt: prompt.trim(),
          config: cfg,
        };
        if (imageFile) {
          const imageBytes = Buffer.from(imageFile.buffer).toString("base64");
          const mimeType = "image/jpeg";
          genParams.image = { imageBytes, mimeType };
        }
        console.log("Video generation request received", genParams);
        let operation = await ai.models.generateVideos(genParams);
        
        while (!operation?.done) {
          console.log("Waiting for video generation to complete...");
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({ operation });
        }
        console.log("✅ Video generation completed", operation);

        const videoRef = operation?.response?.generatedVideos?.[0]?.video;
        if (!videoRef) {
          return res
            .status(500)
            .json({ success: false, error: "No video returned" });
        }

        // Return URLs for client-side download/streaming
        let fileId = null;
        let uri = null;
        if (typeof videoRef === "string") {
          if (videoRef.startsWith("files/")) fileId = videoRef;
          else uri = videoRef;
        } else {
          if (videoRef?.name) fileId = videoRef.name;
          if (!fileId && videoRef?.uri) uri = videoRef.uri;
        }
        if (!fileId && uri) {
          const m = String(uri).match(/\/files\/([^:/?]+)/);
          if (m && m[1]) fileId = `files/${m[1]}`;
        }
        const proxyUrl = fileId ? `/api/video-download/${fileId}` : null;
        const downloadUrl = uri || null;

        console.log("✅ Video completed");
        return res.status(200).json({
          success: true,
          data: {
            model: "veo-3.0-generate-preview",
            fileId,
            proxyUrl,
            downloadUrl,
          },
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          error: error?.message || "Generation failed",
        });
      }
    }
  );

  return router;
};
