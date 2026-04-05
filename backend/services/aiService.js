const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.analyzeResume = async (resumeText, role, level) => {
  const prompt = `
    Analyze the following resume for a ${level}-level ${role} position.
    
    Resume Content:
    ${resumeText}

    Return a strictly structured JSON response with the following fields:
    {
      "score": (number 0-100),
      "strengths": [string],
      "weaknesses": [string],
      "missing": [string], (skills the user totally lacks for this role)
      "suggested": [string], (learning topics)
      "roadmap": [ (exactly 4 weeks)
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are an expert career coach and technical recruiter." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("OpenAI Analysis Error:", error);
    throw new Error("Failed to analyze resume with AI.");
  }
};

exports.chat = async (message, history) => {
  const messages = [
    { role: "system", content: "You are an expert AI Career Coach for software developers. Provide actionable, professional advice. Keep answers concise and markdown-formatted." },
    ...history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    { role: "user", content: message },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    throw new Error("Failed to get chat response from AI.");
  }
};
