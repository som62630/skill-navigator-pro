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
      const MAX_RETRIES = 2; // Only retry 429 errors

      while (retryCount <= MAX_RETRIES) {
        try {
          console.log(`📡 Trying AI: ${modelName} (${apiVersion})... ${retryCount > 0 ? `(Retry ${retryCount})` : ''}`);
          const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion });
          
          const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig: {
              temperature: 0.1,
            }
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
              break; // Don't retry JSON parse errors with the same model
            }
          }
          return cleanedText;
        } catch (error) {
          lastError = error;
          const errText = error.message?.toLowerCase() || "";
          
          // Handle 429 (Too Many Requests) with specific retry pause
          if (errText.includes("429") || errText.includes("quota") || errText.includes("too many requests")) {
            if (retryCount < MAX_RETRIES) {
              const waitTime = (retryCount + 1) * 3000; // 3s, then 6s
              console.warn(`⏳ Quota exceeded (429). Waiting ${waitTime/1000}s before retry...`);
              await sleep(waitTime);
              retryCount++;
              continue;
            }
          }

          // Handle other retryable API errors (cycle to next model)
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
            break; // Exit the while loop to try next model/version
          }
          
          console.error(`❌ Non-retryable error for ${modelName}:`, error.message);
          throw error;
        }
      }
    }
  }
  throw lastError || new Error("All AI models failed");
}

exports.analyzeResume = async (resumeBuffer, mimeType, role, level) => {
  const prompt = `
    Analyze the following resume for a ${level}-level ${role} position.

    Return a strictly structured JSON response with the following fields:
    {
      "score": (number 0-100),
      "strengths": [string],
      "weaknesses": [string],
      "missing": [string],
      "suggested": [string],
      "roadmap": [ (exactly 4 items)
        { "week": "Week 1-2", "title": "string", "tasks": [string] },
        { "week": "Week 3-4", "title": "string", "tasks": [string] },
        { "week": "Week 5-6", "title": "string", "tasks": [string] },
        { "week": "Week 7-8", "title": "string", "tasks": [string] }
      ],
      "projects": [ (exactly 3 projects)
        { "title": "string", "desc": "string", "difficulty": "Beginner|Intermediate|Advanced" }
      ]
    }

    Ensure the response is valid JSON and contains NO other text.
  `;

  let parts = [];
  if (mimeType === "application/pdf") {
    parts.push({ inlineData: { data: resumeBuffer.toString("base64"), mimeType: "application/pdf" } });
  } else {
    parts.push({ text: "Resume Content:\n" + resumeBuffer.toString("utf-8") });
  }
  parts.push({ text: prompt });

  try {
    return await generateWithFallback(parts, true);
  } catch (error) {
    console.error("Gemini Analysis Primary Error:", error);

    // Deep Fallback: If PDF parsing itself is the issue, try raw text
    if (mimeType === "application/pdf") {
      try {
        const fallbackParts = [
          { text: "Resume Content (as raw text):\n" + resumeBuffer.toString("utf-8") },
          { text: prompt }
        ];
        return await generateWithFallback(fallbackParts, true);
      } catch (fallbackError) {
        console.error("Gemini Analysis Fallback Error:", fallbackError);
      }
    }

    const errMsg = error.message || "Unknown AI error";
    throw new Error(`AI Error: ${errMsg}`);
  }
};

exports.chat = async (message, history) => {
  const parts = history.map((m) => ({
    text: `${m.role === "assistant" ? "AI Coach" : "User"}: ${m.content}`
  }));
  parts.unshift({ text: "You are an expert AI Career Coach for software developers. Provide actionable, professional advice. Keep answers concise and markdown-formatted." });
  parts.push({ text: `User message: ${message}` });

  try {
    return await generateWithFallback(parts, false);
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    const errMsg = error.message || "Unknown AI error";
    throw new Error(`AI Error: ${errMsg}`);
  }
};

exports.generateRoadmap = async (goal) => {
  const prompt = `
    Generate a comprehensive skill roadmap for someone who wants to become a "${goal}".
    
    Return a strictly structured JSON response with the following format:
    {
      "goal": "${goal}",
      "summary": "A 1-2 sentence description of this career path",
      "estimatedWeeks": (number, estimated total weeks to become proficient),
      "categories": [
        {
          "name": "Category Name (e.g., Programming Fundamentals)",
          "icon": "Code2",
          "color": "text-primary",
          "overallProgress": 0,
          "skills": [
            {
              "name": "Skill Name",
              "description": "Brief description of this skill",
              "difficulty": "Beginner|Intermediate|Advanced",
              "estimatedHours": (number),
              "progress": 0,
              "resources": ["Resource 1", "Resource 2"]
            }
          ]
        }
      ],
      "timeline": [
        {
          "week": "Week X-Y",
          "title": "Phase Title",
          "tasks": ["Task 1", "Task 2", "Task 3"],
          "completed": false
        }
      ]
    }
    
    Requirements:
    - Include exactly 4 categories with 3-5 skills each
    - Include 4-6 timeline phases
    - Use only these icon names: Code2, Globe, Database, Settings, Calculator, Presentation, BrainCircuit, Target, BookOpen, BarChart3, Zap
    - Use only these color classes: text-primary, text-secondary, text-accent, text-destructive
    - Resources should be real, well-known learning resources
    - Ensure the response is valid JSON and contains NO other text
  `;

  try {
    return await generateWithFallback([{ text: prompt }], true);
  } catch (error) {
    console.error("Gemini Roadmap Error:", error);
    throw new Error("Failed to generate roadmap with Gemini AI.");
  }
};

