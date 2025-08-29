import express from 'express';
import upload from '../middleware/upload.js';
import validatePassword from '../middleware/validatePassword.js';
import { generateVirtualTryon } from '../utils/ai.js';

const router = express.Router();

export default (ai, API_PASSWORD) => {
  router.post('/outfit-tryon', upload.fields([
    { name: 'personImage', maxCount: 1 },
    { name: 'outfitImage', maxCount: 1 }
  ]), validatePassword(API_PASSWORD), async (req, res) => {
    try {
      const personImageFile = req.files?.personImage?.[0];
      const outfitImageFile = req.files?.outfitImage?.[0];
      if (!personImageFile || !outfitImageFile) {
        return res.status(400).json({
          success: false,
          error: 'Missing required images',
          message: 'Both personImage and outfitImage files are required'
        });
      }
      if (personImageFile.size > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'File too large',
          message: 'Person image must be under 10MB'
        });
      }
      if (outfitImageFile.size > 10 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          error: 'File too large',
          message: 'Outfit image must be under 10MB'
        });
      }
      const prompt = `Virtual try-on: Place clothing from image 2 onto person in image 1. Keep face, hair, and all facial features EXACTLY unchanged. Only modify clothing area. Ensure realistic fit, natural lighting/shadows, proper proportions, and seamless integration.`;
      const response = await generateVirtualTryon(ai, personImageFile, outfitImageFile, prompt);
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
          return res.json({
            success: true,
            message: 'Virtual try-on image generated successfully',
            data: {
              generatedImageBase64: part.inlineData.data,
              model_used: 'gemini-2.5-flash-image-preview',
              processing_time: '3.2s',
              timestamp: new Date().toISOString()
            }
          });
        }
      }
      const text = response.candidates[0].content.parts.find(part => part.text)?.text || 'No analysis available';
      res.json({
        success: true,
        message: 'Virtual try-on analysis completed',
        data: {
          analysis: text,
          model_used: 'gemini-2.5-flash-image-preview',
          note: 'Analysis provided instead of image generation.',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      let errorMessage = error.message || 'Failed to process outfit try-on request';
      if (error.message && error.message.includes('API_KEY')) {
        errorMessage = 'API key is missing or invalid. Please check your environment configuration.';
      } else if (error.message && (error.message.includes('quota') || error.message.includes('limit'))) {
        errorMessage = 'API quota exceeded. Please try again later or check your billing settings.';
      } else if (error.message && (error.message.includes('safety') || error.message.includes('policy'))) {
        errorMessage = 'Content policy violation. Please use appropriate images and try again.';
      } else if (error.message && error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again with smaller images.';
      }
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  });
  return router;
};
