import { GoogleGenAI, Modality } from '@google/genai';

const getAIInstance = (apiKey) => new GoogleGenAI({ apiKey });

const generateVirtualTryon = async (ai, personImageFile, outfitImageFile, prompt) => {
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
    { text: prompt },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image-preview",
    contents: { parts },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
      temperature: 0.1,
      topP: 0.8,
      maxOutputTokens: 8192,
    },
  });
  return response;
};

export { getAIInstance, generateVirtualTryon };
