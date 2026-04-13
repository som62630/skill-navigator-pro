const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1" });

// Bulletproof model selection: Tries EVERY possible model name to find one that works on the user's account
const MODEL_FALLBACKS = [
  "gemini-1.5-flash", 
  "gemini-1.5-pro",
  "gemini-2.0-flash-exp",
  "gemini-2.0-flash"
];
const VERSION_FALLBACKS = ["v1", "v1beta"];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithFallback(parts, isJson = true) {
  let lastError = null;
  
  for (const modelName of MODEL_FALLBACKS) {
    for (const apiVersion of VERSION_FALLBACKS) {
      let retryCount = 0;
      const MAX_RETRIES = 2;

      while (retryCount <= MAX_RETRIES) {
        try {
          console.log(`📡 Trying AI: ${modelName} (${apiVersion})... ${retryCount > 0 ? `(Retry ${retryCount})` : ''}`);
          const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion });
          
          const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: { temperature: 0.1 }
          });
          
          const responseText = result.response.text();
          if (!responseText) throw new Error("Empty response from AI");

          const cleanedText = responseText.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
          
          if (isJson) {
            try {
              return JSON.parse(cleanedText);
            } catch (jsonError) {
              console.warn(`🧩 JSON Parse Error for ${modelName}:`, jsonError.message);
              lastError = jsonError;
              break; 
            }
          }
          return cleanedText;
        } catch (error) {
          lastError = error;
          const errText = error.message?.toLowerCase() || "";
          
          // Smart 429 Handling: Parse suggested wait time
          if (errText.includes("429") || errText.includes("quota") || errText.includes("too many requests")) {
            // Extract "retry in X.Xs" or similar patterns
            const waitMatch = error.message.match(/retry in (\d+\.?\d*)s/i);
            const suggestedWait = waitMatch ? parseFloat(waitMatch[1]) * 1000 : null;
            
            if (retryCount < MAX_RETRIES) {
              const waitTime = suggestedWait ? Math.min(suggestedWait + 1000, 30000) : (retryCount + 1) * 5000;
              console.warn(`⏳ Quota exceeded. Waiting ${waitTime/1000}s based on API feedback...`);
              await sleep(waitTime);
              retryCount++;
              continue;
            }
            
            // If all retries fail, throw a clean quota message
            throw new Error("AI is currently busy due to high demand. Please try again in 1-2 minutes.");
          }

          const isRetryable = 
            errText.includes("400") || 
            errText.includes("404") || 
            errText.includes("500") ||
            errText.includes("503") ||
            errText.includes("not found") || 
            errText.includes("unavailable") ||
            errText.includes("fetch") ||
            errText.includes("model");

          if (isRetryable) {
            console.warn(`⚠️ Fallback triggered for ${modelName} (${apiVersion}): ${errText.substring(0, 50)}...`);
            break;
          }
          
          throw error;
        }
      }
    }
  }
  throw lastError || new Error("The AI service is temporarily unavailable. Please try again shortly.");
}

exports.analyzeResume = async (resumeBuffer, mimeType, role, level) => {
  // Compression: Using extremely concise prompt to save tokens
  const prompt = `Analyze resume for ${level} ${role}. Return ONLY JSON:
    { "score": 0-100, "strengths": [string], "weaknesses": [string], "missing": [string], "suggested": [string],
      "roadmap": [{ "week": "Week 1-2", "title": "string", "tasks": [string] }, ... (4 items)],
      "projects": [{ "title": "string", "desc": "string", "difficulty": "Beginner|Intermediate|Advanced" } (3 items)] }`;

  let parts = [];
  if (mimeType === "application/pdf") {
    parts.push({ inlineData: { data: resumeBuffer.toString("base64"), mimeType: "application/pdf" } });
  } else {
    parts.push({ text: "Resume:\n" + resumeBuffer.toString("utf-8") });
  }
  parts.push({ text: prompt });

  try {
    return await generateWithFallback(parts, true);
  } catch (error) {
    if (mimeType === "application/pdf") {
      try {
        return await generateWithFallback([{ text: "Resume:\n" + resumeBuffer.toString("utf-8") }, { text: prompt }], true);
      } catch (fError) { /* ignore fallback error and throw primary */ }
    }
    throw new Error(error.message.includes("AI") ? error.message : `Analysis Error: ${error.message}`);
  }
};

exports.chat = async (message, history) => {
  const parts = history.map((m) => ({ text: `${m.role === "assistant" ? "Coach" : "User"}: ${m.content}` }));
  parts.unshift({ text: "Expert AI Career Coach. Professional, actionable advice. Markdown allowed." });
  parts.push({ text: `Message: ${message}` });

  try {
    return await generateWithFallback(parts, false);
  } catch (error) {
    throw new Error(error.message.includes("AI") ? error.message : `Chat Error: ${error.message}`);
  }
};

exports.generateRoadmap = async (goal) => {
  const prompt = `Skill roadmap for "${goal}". Return ONLY JSON:
    { "goal": "${goal}", "summary": "string", "estimatedWeeks": number,
      "categories": [{ "name": "string", "icon": "Code2|Globe|...", "color": "text-primary|...", "overallProgress": 0, "skills": [...] } (4 items)],
      "timeline": [{ "week": "Week X-Y", "title": "string", "tasks": [string], "completed": false } (4-6 items)] }
    Icons: Code2, Globe, Database, Settings, Calculator, Presentation, BrainCircuit, Target, BookOpen, BarChart3, Zap. Colors: text-primary, text-secondary, text-accent, text-destructive.`;

  try {
    return await generateWithFallback([{ text: prompt }], true);
  } catch (error) {
    throw new Error(error.message.includes("AI") ? error.message : `Roadmap Error: ${error.message}`);
  }
};

