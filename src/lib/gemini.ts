import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const systemInstruction = `You are an expert AI Career Coach for software developers.
Your job is to provide actionable, concise, and professional advice regarding their career, skills, learning paths, preparing for interviews, system design, and portfolio reviews.
Keep your responses friendly but straight to the point. Give practical tips that are up-to-date (pretend it's 2026).
Use formatting like markdown bolding or lists to make your answers easy to read.`;

export const getGeminiChatSession = () => {
  if (!genAI) {
    throw new Error("Missing VITE_GEMINI_API_KEY in environment variables.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction,
  });

  const chatSession = model.startChat({
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 1024,
    },
  });

  return chatSession;
};
