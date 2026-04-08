import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
  }

  try {
    const { goal } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Gemini API key not configured on server." }), { status: 500 });
    }

    if (!goal) {
      return new Response(JSON.stringify({ error: "Goal is required." }), { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
      Generate a comprehensive skill roadmap for someone who wants to become a "${goal}".
      
      Return a strictly structured JSON response with the following format:
      {
        "goal": "${goal}",
        "summary": "A 1-2 sentence description of this career path",
        "estimatedWeeks": (number),
        "categories": [
          {
            "name": "Category Name",
            "icon": "Code2",
            "color": "text-primary",
            "overallProgress": 0,
            "skills": [
              {
                "name": "Skill Name",
                "description": "Brief description",
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

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const roadmapData = JSON.parse(responseText);

    return new Response(JSON.stringify(roadmapData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Roadmap Generation Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
  }
}
