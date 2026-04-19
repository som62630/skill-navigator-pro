const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL_FALLBACKS = [
  "openai/gpt-4o-mini",
  "google/gemini-2.0-flash-001",
  "meta-llama/llama-3.1-70b-instruct",
];
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
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing OpenRouter key on backend. Set OPENROUTER_API_KEY (preferred) or API_KEY.");
  }

  const prompt = parts.map((p) => p.text || "").join("\n\n");

  for (const modelName of MODEL_FALLBACKS) {
    if (Date.now() - startedAt > MAX_TOTAL_AI_TIME_MS) {
      throw new Error("AI request timed out. Please try again.");
    }

    let retryCount = 0;
    while (retryCount <= MAX_RETRIES) {
      try {
        console.log(`📡 Trying AI via OpenRouter: ${modelName}${retryCount > 0 ? ` (Retry ${retryCount})` : ""}`);
        const response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.APP_URL || "http://localhost:5001",
            "X-Title": "Skill Navigator Pro",
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              {
                role: "user",
                content: prompt,
              }
            ],
            temperature: 0.1,
            max_tokens: isJson ? 2800 : 1500,
            response_format: isJson ? { type: "json_object" } : undefined,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          const apiError = data?.error?.message || data?.message || `HTTP ${response.status}`;
          throw new Error(apiError);
        }

        const responseText = data?.choices?.[0]?.message?.content;
        if (!responseText) throw new Error("Empty response from AI");

        if (isJson) {
          return parseJsonFromText(responseText);
        }
        return String(responseText).trim();
      } catch (error) {
        lastError = error;
        const errText = error.message?.toLowerCase() || "";

        if (errText.includes("429") || errText.includes("quota") || errText.includes("too many requests") || errText.includes("rate limit")) {
          const waitMatch = error.message.match(/retry in (\d+\.?\d*)s/i);
          const suggestedWait = waitMatch ? parseFloat(waitMatch[1]) * 1000 : null;

          if (retryCount < MAX_RETRIES) {
            const waitTime = suggestedWait ? Math.min(suggestedWait, MAX_429_WAIT_MS) : 1200;
            console.warn(`⏳ Rate limit hit. Waiting ${waitTime / 1000}s...`);
            await sleep(waitTime);
            retryCount++;
            continue;
          }
          throw new Error("AI is currently busy due to high demand. Please try again in 1-2 minutes.");
        }

        const isRetryable =
          errText.includes("400") ||
          errText.includes("404") ||
          errText.includes("500") ||
          errText.includes("503") ||
          errText.includes("timeout") ||
          errText.includes("network") ||
          errText.includes("fetch") ||
          errText.includes("model");

        if (isRetryable) {
          console.warn(`⚠️ Fallback triggered for ${modelName}: ${errText.substring(0, 80)}...`);
          break;
        }

        throw error;
      }
    }
  }
  throw lastError || new Error("The AI service is temporarily unavailable. Please try again shortly.");
}

exports.analyzeResume = async (resumeBuffer, mimeType, role, level) => {
  const prompt = `You are an expert technical recruiter analyzing a resume for a ${level} ${role}.

  CRITICAL SCORE INSTRUCTION: You MUST calculate the true readiness "score" using this strict 100-point rubric:
  - 40 points: Core skills exactly match the chosen role. Deduct points for missing skills.
  - 30 points: Experience and past work demonstrate relevance to this specific role.
  - 20 points: Tools, frameworks, and technologies match expected industry standards.
  - 10 points: Overall impact, metrics, and clarity.
  Be extremely strict. Most average candidates should score around 40-70. Do not give an 85 unless the candidate is flawless and senior-level.

  Return ONLY valid JSON:
    { "score": <final integer between 0-100 based strictly on the rubric>,
      "strengths": [<array of 4-5 precise, non-generic strengths found>],
      "weaknesses": [<array of 4-5 precise, critical weaknesses or gaps>],
      "missing": [<array of 4-5 specific missing skills or tools>],
      "suggested": [<array of 4-5 actionable, high-impact suggestions>],
      "roadmap": [{ "week": "Week 1-2", "title": "string", "tasks": ["specific task 1", "specific task 2", "specific task 3"] }, ... (4 items)],
      "projects": [{ "title": "string", "desc": "detailed specific description to fill gaps", "difficulty": "Beginner|Intermediate|Advanced" } (3 items)] }`;

  let parts = [];
  parts.push({ text: "Resume:\n" + resumeBuffer.toString("utf-8") });
  parts.push({ text: prompt });

  try {
    return await generateWithFallback(parts, true);
  } catch (error) {
    throw new Error(error.message.includes("AI") ? error.message : `Analysis Error: ${error.message}`);
  }
};

exports.chat = async (message, history) => {
  const historyText = history
    .map((m) => `${m.role === "assistant" ? "Coach" : "User"}: ${m.content}`)
    .join("\n");
  const parts = [
    { text: "Expert AI Career Coach. Professional, actionable advice. Markdown allowed." },
    { text: historyText ? `Conversation so far:\n${historyText}` : "No prior conversation." },
    { text: `Message: ${message}` },
  ];

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

