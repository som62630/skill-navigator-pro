const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, { apiVersion: "v1" });

// Bulletproof model selection: Tries EVERY possible model name to find one that works on the user's account
const MODEL_FALLBACKS = [
  "gemini-1.5-flash-latest", 
  "gemini-1.5-flash", 
  "gemini-2.0-flash", 
  "gemini-1.5-pro",
  "gemini-pro"
];
const VERSION_FALLBACKS = ["v1", "v1beta"];

async function generateWithFallback(parts, isJson = true) {
  let lastError = null;
  
  for (const modelName of MODEL_FALLBACKS) {
    for (const apiVersion of VERSION_FALLBACKS) {
      try {
        console.log(`📡 Trying AI: ${modelName} (${apiVersion})...`);
        const model = genAI.getGenerativeModel({ model: modelName }, { apiVersion });
        
        const result = await model.generateContent({
          contents: [{ role: "user", parts }],
          generationConfig: {}
        });
        
        const text = result.response.text().replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
        return isJson ? JSON.parse(text) : text;
      } catch (error) {
        lastError = error;
        const errText = error.message?.toLowerCase() || "";
        // Catch 400 (Bad), 404 (Not Found), 429 (Quota), 503 (Unavailable)
        if (errText.includes("400") || errText.includes("404") || errText.includes("429") || errText.includes("not found") || errText.includes("quota") || errText.includes("limit") || errText.includes("unavailable")) {
          console.warn(`⚠️ Fallback triggered for ${modelName} (${apiVersion}): ${errText.substring(0, 50)}...`);
          continue;
        }
        throw error;
      }
    }
  }
  throw lastError;
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

