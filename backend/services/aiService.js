const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeResume = async (resumeBuffer, mimeType, role, level) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: { responseMimeType: "application/json" },
  });

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

  let parts = [{ text: prompt }];

  if (mimeType === "application/pdf") {
    parts.push({
      inlineData: {
        data: resumeBuffer.toString("base64"),
        mimeType: "application/pdf",
      },
    });
  } else {
    parts.push({ text: "\nResume Content:\n" + resumeBuffer.toString("utf-8") });
  }

  try {
    const result = await model.generateContent(parts);
    const response = result.response;
    const text = response.text().replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze resume with Gemini AI.");
  }
};

exports.chat = async (message, history) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "You are an expert AI Career Coach for software developers. Provide actionable, professional advice. Keep answers concise and markdown-formatted.",
  });

  try {
    const chat = model.startChat({
      history: history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw new Error("Failed to get response from Gemini AI.");
  }
};

exports.generateRoadmap = async (goal) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: { responseMimeType: "application/json" },
  });

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
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().replace(/```(?:json)?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Roadmap Error:", error);
    throw new Error("Failed to generate roadmap with Gemini AI.");
  }
};

