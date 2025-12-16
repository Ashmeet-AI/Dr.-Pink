import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DailyTheme } from "../types";

const FALLBACK_THEME: DailyTheme = {
  title: "Presence Without Performance",
  prompt: "What is a feeling you are carrying today that doesn't need a name?",
  invitation: "Create something small that honors your current state."
};

export const getDailyTheme = async (): Promise<DailyTheme> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.warn("No API Key available, using fallback theme.");
    return FALLBACK_THEME;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "A poetic, short title for the daily theme." },
        prompt: { type: Type.STRING, description: "A deep, non-judgmental reflective question." },
        invitation: { type: Type.STRING, description: "A gentle invitation to create art, writing, or music." }
      },
      required: ["title", "prompt", "invitation"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a gentle, psycho-creative daily theme for a community focused on emotional safety and 'witnessing not rating'. The tone should be soft, non-urgent, and intimate.",
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyTheme;
    }
    
    return FALLBACK_THEME;
  } catch (error) {
    console.error("Failed to fetch daily theme from Gemini:", error);
    return FALLBACK_THEME;
  }
};

export const getCreativePrompt = async (emotion: string): Promise<string> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return "What wants to be expressed right now?";

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user is feeling "${emotion}". Provide a single, short, 1-sentence gentle creative prompt for them to express this feeling through art or writing.`,
        });
        return response.text || "What wants to be expressed right now?";
    } catch (e) {
        return "What wants to be expressed right now?";
    }
}