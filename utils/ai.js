import { GoogleGenAI, Modality } from '@google/genai';

const getAIInstance = (apiKey) => new GoogleGenAI({ apiKey });

const generateVirtualTryon = async (ai, personImageFile, outfitImageFile, prompt) => {
  console.log('🤖 Starting AI generation process...');
  console.log('📊 Image details:', {
    personImage: { 
      size: `${Math.round(personImageFile.size / 1024)}KB`,
      mimetype: personImageFile.mimetype,
      file: personImageFile
    },
    outfitImage: { 
      size: `${Math.round(outfitImageFile.size / 1024)}KB`,
      mimetype: outfitImageFile.mimetype,
      file: outfitImageFile
    }
  });
  
  const parts = [
    {
      inlineData: {
        data: personImageFile.buffer.toString('base64'),
        mimeType: personImageFile.mimetype || 'image/jpeg',
      },
    },
    {
      inlineData: {
        data: outfitImageFile.buffer.toString('base64'),
        mimeType: outfitImageFile.mimetype || 'image/jpeg',
      },
    },
    { text: prompt ,
      negativePrompt: "blurry, distorted, low resolution, poorly drawn, deformed, bad anatomy, disfigured, mutated, extra limbs, cloned face, gross proportions, malformed limbs, missing arms, missing legs, fused fingers, too many fingers, long neck"
    },
  ];

  console.log('🚀 Sending request to Gemini AI...');
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  console.log('✅ AI request completed successfully');
  return response;
};

export { getAIInstance, generateVirtualTryon };
