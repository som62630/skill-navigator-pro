const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analyzeResume = async (resumeText, role, level) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    generationConfig: { responseMimeType: "application/json" },
  });

  const prompt = `
    Analyze the following resume for a ${level}-level ${role} position.
    
    Resume Content:
    ${resumeText}

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

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return JSON.parse(response.text());
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
