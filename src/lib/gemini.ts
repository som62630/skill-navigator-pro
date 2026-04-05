import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

const systemInstruction = `You are an expert AI Career Coach for software developers.
Your job is to provide actionable, concise, and professional advice regarding their career, skills, learning paths, preparing for interviews, system design, and portfolio reviews.
Keep your responses friendly but straight to the point. Give practical tips that are up-to-date (2026).
Use formatting like markdown bolding or lists to make your answers easy to read.`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const getGeminiChatSession = (history: ChatMessage[] = []) => {
  // If we have a local API key, we can initialize a direct session
  if (genAI) {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    return model.startChat({
      history: history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 1024,
      },
    });
  }
  
  return null;
};

/**
 * Sends a message either via the backend API
 * or falls back to direct client-side Google AI call if key is present.
 */
export async function sendChatMessage(message: string, history: ChatMessage[], token?: string): Promise<string> {
  // 1. Try Backend API first
  if (token) {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_URL}/analysis/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message, history }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) return data.response;
      }
    } catch (error) {
      console.debug("Backend API not reachable, falling back to client call", error);
    }
  }

  // 2. Try direct client-side call if backend failed or no token was provided
  if (genAI) {
    try {
      const chat = getGeminiChatSession(history);
      if (chat) {
        const result = await chat.sendMessage(message);
        return result.response.text();
      }
    } catch (error) {
      console.error("Client-side Gemini error:", error);
      throw error;
    }
  }

  throw new Error("No AI connection available. Please login or check your configuration.");
}
