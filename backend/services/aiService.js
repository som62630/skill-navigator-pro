const { GoogleGenerativeAI } = require("@google/generative-ai");

// Keep fallbacks fast to avoid long roadmap wait times.
const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];
const VERSION_FALLBACKS = ["v1"];
const MAX_RETRIES = 1;
const MAX_TOTAL_AI_TIME_MS = 15000;
const MAX_429_WAIT_MS = 2500;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function parseJsonFromText(rawText) {
  const cleanedText = rawText.replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(cleanedText);
  } catch {
    const objectMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!objectMatch) {
      throw new Error("AI returned non-JSON response.");
    }
    return JSON.parse(objectMatch[0]);
  }
}

async function generateWithFallback(parts, isJson = true) {
  let lastError = null;
  const startedAt = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY on backend.");
  }
  
  for (const modelName of MODEL_FALLBACKS) {
    for (const apiVersion of VERSION_FALLBACKS) {
      if (Date.now() - startedAt > MAX_TOTAL_AI_TIME_MS) {
        throw new Error("AI request timed out. Please try again.");
      }

      let retryCount = 0;

      while (retryCount <= MAX_RETRIES) {
        try {
          console.log(`📡 Trying AI: ${modelName} (${apiVersion})... ${retryCount > 0 ? `(Retry ${retryCount})` : ''}`);
          const genAI = new GoogleGenerativeAI(apiKey, { apiVersion });
          const model = genAI.getGenerativeModel({ model: modelName });
          
          const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: isJson ? 2800 : 1500,
              responseMimeType: isJson ? "application/json" : "text/plain",
            }
          });
          
          const responseText = result?.response?.text?.();
          if (!responseText) throw new Error("Empty response from AI");
          
          if (isJson) {
            return parseJsonFromText(responseText);
          }
          return responseText.trim();
        } catch (error) {
          lastError = error;
          const errText = error.message?.toLowerCase() || "";
          
          // Smart 429 Handling: Parse suggested wait time
          if (errText.includes("429") || errText.includes("quota") || errText.includes("too many requests")) {
            // Extract "retry in X.Xs" or similar patterns
            const waitMatch = error.message.match(/retry in (\d+\.?\d*)s/i);
            const suggestedWait = waitMatch ? parseFloat(waitMatch[1]) * 1000 : null;
            
            if (retryCount < MAX_RETRIES) {
              const waitTime = suggestedWait ? Math.min(suggestedWait, MAX_429_WAIT_MS) : 1200;
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
  const prompt = `Create a professional, highly detailed career roadmap for someone wanting to become: "${goal}".
    
    Return ONLY a valid JSON object with this EXACT structure:
    {
      "goal": "${goal}",
      "summary": "A 2-3 sentence strategic overview of this career path.",
      "estimatedWeeks": 12,
      "categories": [
        {
          "name": "Category Name (e.g., Frontend Fundamentals)",
          "icon": "Code2|Globe|Database|Settings|Calculator|Presentation|BrainCircuit|Target|BookOpen|BarChart3|Zap",
          "color": "text-primary|text-secondary|text-accent|text-destructive",
          "overallProgress": 0,
          "skills": [
            {
              "name": "Skill Name",
              "description": "Short explanation of what to learn",
              "difficulty": "Beginner|Intermediate|Advanced",
              "estimatedHours": 10,
              "progress": 0,
              "resources": ["Specific Course Name", "Documentation Link", "YouTube Channel"]
            }
          ]
        }
      ],
      "timeline": [
        {
          "week": "Week 1-2",
          "title": "Phase Title",
          "tasks": ["Task 1", "Task 2", "Task 3"],
          "completed": false
        }
      ]
    }

    Guidelines:
    1. Create 4-5 core categories.
    2. Each category should have 3-5 specific skills.
    3. Timeline should cover 8-16 weeks.
    4. Icons must be from the allowed list: Code2, Globe, Database, Settings, Calculator, Presentation, BrainCircuit, Target, BookOpen, BarChart3, Zap.
    5. Colors must be from the allowed list: text-primary, text-secondary, text-accent, text-destructive.`;

  try {
    return await generateWithFallback([{ text: prompt }], true);
  } catch (error) {
    throw new Error(error.message.includes("AI") ? error.message : `Roadmap Error: ${error.message}`);
  }
};

