// ─── Skill Roadmap Service ──────────────────────────────────────────────────
// Mock data layer structured for easy backend API swap.
// To connect to real backend, replace the mock in generateRoadmap() with fetch().

export interface Skill {
  name: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  progress: number; // 0-100
  resources: string[];
}

export interface SkillCategory {
  name: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  skills: Skill[];
  overallProgress: number; // 0-100
}

export interface RoadmapWeek {
  week: string;
  title: string;
  tasks: string[];
  completed: boolean;
}

export interface RoadmapData {
  goal: string;
  summary: string;
  estimatedWeeks: number;
  categories: SkillCategory[];
  timeline: RoadmapWeek[];
  generatedAt: string;
}

// ─── Mock Data Generator ────────────────────────────────────────────────────

const mockRoadmaps: Record<string, () => RoadmapData> = {
  default: () => ({
    goal: "Software Developer",
    summary: "A comprehensive roadmap covering programming fundamentals, web technologies, databases, and professional skills to become a well-rounded software developer.",
    estimatedWeeks: 12,
    categories: [
      {
        name: "Programming Fundamentals",
        icon: "Code2",
        color: "text-primary",
        overallProgress: 0,
        skills: [
          { name: "Python / JavaScript", description: "Master one general-purpose language deeply", difficulty: "Beginner", estimatedHours: 40, progress: 0, resources: ["freeCodeCamp", "The Odin Project", "CS50x"] },
          { name: "Data Structures", description: "Arrays, trees, graphs, hash maps, heaps", difficulty: "Intermediate", estimatedHours: 30, progress: 0, resources: ["NeetCode 150", "LeetCode Patterns"] },
          { name: "Algorithms", description: "Sorting, searching, dynamic programming, greedy", difficulty: "Intermediate", estimatedHours: 30, progress: 0, resources: ["Blind 75", "Grokking Algorithms book"] },
          { name: "OOP & Design Patterns", description: "SOLID principles, factory, observer, strategy patterns", difficulty: "Intermediate", estimatedHours: 15, progress: 0, resources: ["Head First Design Patterns", "Refactoring Guru"] },
        ],
      },
      {
        name: "Web Development",
        icon: "Globe",
        color: "text-secondary",
        overallProgress: 0,
        skills: [
          { name: "HTML & CSS", description: "Semantic markup, Flexbox, Grid, animations", difficulty: "Beginner", estimatedHours: 20, progress: 0, resources: ["MDN Web Docs", "CSS Tricks"] },
          { name: "React / Vue", description: "Component architecture, hooks, state management", difficulty: "Intermediate", estimatedHours: 40, progress: 0, resources: ["React Docs", "TanStack Query"] },
          { name: "TypeScript", description: "Type safety, generics, utility types", difficulty: "Intermediate", estimatedHours: 20, progress: 0, resources: ["TypeScript Handbook", "Type Challenges"] },
          { name: "Next.js / Vite", description: "SSR, routing, deployment, performance", difficulty: "Advanced", estimatedHours: 25, progress: 0, resources: ["Next.js Docs", "Vercel Learn"] },
        ],
      },
      {
        name: "Databases & Backend",
        icon: "Database",
        color: "text-accent",
        overallProgress: 0,
        skills: [
          { name: "SQL (PostgreSQL)", description: "Queries, joins, indexing, transactions", difficulty: "Beginner", estimatedHours: 20, progress: 0, resources: ["SQLBolt", "PostgreSQL Tutorial"] },
          { name: "NoSQL (MongoDB)", description: "Document databases, aggregation pipeline", difficulty: "Beginner", estimatedHours: 15, progress: 0, resources: ["MongoDB University", "Mongoose Docs"] },
          { name: "REST API Design", description: "HTTP methods, status codes, auth, versioning", difficulty: "Intermediate", estimatedHours: 15, progress: 0, resources: ["RESTful API Design Guide"] },
          { name: "Authentication", description: "JWT, OAuth2, session management, security", difficulty: "Intermediate", estimatedHours: 10, progress: 0, resources: ["Auth0 Docs", "OWASP Guide"] },
        ],
      },
      {
        name: "DevOps & Tools",
        icon: "Settings",
        color: "text-destructive",
        overallProgress: 0,
        skills: [
          { name: "Git & GitHub", description: "Branching, PRs, merge strategies, CI/CD", difficulty: "Beginner", estimatedHours: 10, progress: 0, resources: ["Git Handbook", "GitHub Skills"] },
          { name: "Docker", description: "Containers, Docker Compose, multi-stage builds", difficulty: "Intermediate", estimatedHours: 15, progress: 0, resources: ["Docker Docs", "Play with Docker"] },
          { name: "Cloud Basics (AWS)", description: "EC2, S3, Lambda, RDS fundamentals", difficulty: "Intermediate", estimatedHours: 20, progress: 0, resources: ["AWS Cloud Practitioner", "A Cloud Guru"] },
          { name: "CI/CD Pipelines", description: "GitHub Actions, automated testing, deployment", difficulty: "Advanced", estimatedHours: 10, progress: 0, resources: ["GitHub Actions Docs"] },
        ],
      },
    ],
    timeline: [
      { week: "Week 1-2", title: "Programming Foundations", tasks: ["Learn Python/JS basics", "Practice 20 array/string problems", "Build a CLI tool"], completed: false },
      { week: "Week 3-4", title: "Web Fundamentals", tasks: ["Master HTML/CSS layouts", "Build 3 responsive pages", "Learn React hooks"], completed: false },
      { week: "Week 5-6", title: "Full-Stack Development", tasks: ["Build a REST API", "Connect frontend to backend", "Implement authentication"], completed: false },
      { week: "Week 7-8", title: "Databases & Data", tasks: ["Design a database schema", "Write complex SQL queries", "Build a CRUD app with MongoDB"], completed: false },
      { week: "Week 9-10", title: "DevOps & Deployment", tasks: ["Dockerize your app", "Set up CI/CD pipeline", "Deploy to cloud"], completed: false },
      { week: "Week 11-12", title: "Portfolio & Interview Prep", tasks: ["Polish 3 portfolio projects", "Practice system design", "Do mock interviews"], completed: false },
    ],
    generatedAt: new Date().toISOString(),
  }),

  "data scientist": () => ({
    goal: "Data Scientist",
    summary: "Complete roadmap to become a data scientist — from statistics foundations through machine learning, deep learning, and deploying ML models in production.",
    estimatedWeeks: 16,
    categories: [
      {
        name: "Mathematics & Statistics",
        icon: "Calculator",
        color: "text-primary",
        overallProgress: 0,
        skills: [
          { name: "Linear Algebra", description: "Vectors, matrices, eigenvalues, decomposition", difficulty: "Intermediate", estimatedHours: 25, progress: 0, resources: ["3Blue1Brown", "MIT OCW 18.06"] },
          { name: "Probability & Statistics", description: "Distributions, hypothesis testing, Bayesian inference", difficulty: "Intermediate", estimatedHours: 30, progress: 0, resources: ["Khan Academy", "StatQuest"] },
          { name: "Calculus", description: "Derivatives, gradients, chain rule for backprop", difficulty: "Intermediate", estimatedHours: 20, progress: 0, resources: ["3Blue1Brown Calculus", "MIT OCW"] },
        ],
      },
      {
        name: "Programming & Tools",
        icon: "Code2",
        color: "text-secondary",
        overallProgress: 0,
        skills: [
          { name: "Python", description: "NumPy, Pandas, Matplotlib, Seaborn", difficulty: "Beginner", estimatedHours: 30, progress: 0, resources: ["Python for Data Analysis (book)", "Kaggle Learn"] },
          { name: "SQL", description: "Complex queries for data analysis", difficulty: "Beginner", estimatedHours: 15, progress: 0, resources: ["Mode Analytics SQL Tutorial"] },
          { name: "Jupyter & Notebooks", description: "Interactive analysis, visualization, storytelling", difficulty: "Beginner", estimatedHours: 5, progress: 0, resources: ["Jupyter Docs"] },
        ],
      },
      {
        name: "Machine Learning",
        icon: "BrainCircuit",
        color: "text-accent",
        overallProgress: 0,
        skills: [
          { name: "Supervised Learning", description: "Regression, classification, SVMs, random forests", difficulty: "Intermediate", estimatedHours: 35, progress: 0, resources: ["Andrew Ng's ML Course", "Scikit-learn Docs"] },
          { name: "Unsupervised Learning", description: "Clustering, PCA, dimensionality reduction", difficulty: "Intermediate", estimatedHours: 20, progress: 0, resources: ["Coursera ML Specialization"] },
          { name: "Deep Learning", description: "Neural networks, CNNs, RNNs, Transformers", difficulty: "Advanced", estimatedHours: 40, progress: 0, resources: ["Fast.ai", "Deep Learning Specialization"] },
          { name: "Model Deployment", description: "MLflow, FastAPI, Docker, model monitoring", difficulty: "Advanced", estimatedHours: 20, progress: 0, resources: ["MLOps Guide", "Made With ML"] },
        ],
      },
      {
        name: "Domain & Communication",
        icon: "Presentation",
        color: "text-destructive",
        overallProgress: 0,
        skills: [
          { name: "Data Storytelling", description: "Communicating insights to stakeholders", difficulty: "Beginner", estimatedHours: 10, progress: 0, resources: ["Storytelling with Data (book)"] },
          { name: "A/B Testing", description: "Experiment design, statistical significance", difficulty: "Intermediate", estimatedHours: 10, progress: 0, resources: ["Evan Miller's Guide"] },
          { name: "Business Acumen", description: "KPIs, metrics, product thinking", difficulty: "Beginner", estimatedHours: 10, progress: 0, resources: ["Reforge", "Lenny's Newsletter"] },
        ],
      },
    ],
    timeline: [
      { week: "Week 1-3", title: "Math & Python Foundations", tasks: ["Complete linear algebra module", "Practice statistics problems", "Master Pandas & NumPy"], completed: false },
      { week: "Week 4-6", title: "Data Analysis & SQL", tasks: ["Do 5 Kaggle datasets analysis", "Master SQL window functions", "Build analysis portfolio"], completed: false },
      { week: "Week 7-10", title: "Machine Learning Core", tasks: ["Implement 10 ML algorithms from scratch", "Complete Kaggle competitions", "Build an end-to-end ML pipeline"], completed: false },
      { week: "Week 11-13", title: "Deep Learning & NLP", tasks: ["Build a CNN image classifier", "Fine-tune a Transformer model", "Create a sentiment analysis app"], completed: false },
      { week: "Week 14-16", title: "Portfolio & Job Prep", tasks: ["Deploy 2 ML models to production", "Write case studies", "Practice data science interviews"], completed: false },
    ],
    generatedAt: new Date().toISOString(),
  }),
};

// ─── Keyword matching for mock data ─────────────────────────────────────────

function findMockKey(goal: string): string {
  const lower = goal.toLowerCase();
  if (lower.includes("data scien") || lower.includes("machine learning") || lower.includes("ml ") || lower.includes("ai ")) {
    return "data scientist";
  }
  return "default";
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * Generate a skill roadmap for a given career goal.
 * Connects to the real backend API.
 */
export async function generateRoadmap(goal: string, token?: string): Promise<RoadmapData> {
  if (!token) {
    console.warn("No auth token provided to generateRoadmap. Falling back to mock data.");
    return simulateMockRoadmap(goal);
  }

  try {
    const response = await fetch(`${API_URL}/roadmap/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ goal }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to generate roadmap");

    return data;
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    // Fallback to mock data in development if the backend fails, 
    // but in production we want to know it failed.
    if (import.meta.env.DEV) {
      console.info("Falling back to mock data in development mode.");
      return simulateMockRoadmap(goal);
    }
    throw error;
  }
}

async function simulateMockRoadmap(goal: string): Promise<RoadmapData> {
  // Simulate AI thinking delay
  await new Promise((r) => setTimeout(r, 1800 + Math.random() * 1200));

  const key = findMockKey(goal);
  const data = mockRoadmaps[key]?.() ?? mockRoadmaps.default();
  
  // Override the goal with the user's actual input
  data.goal = goal;
  data.generatedAt = new Date().toISOString();

  return data;
}
