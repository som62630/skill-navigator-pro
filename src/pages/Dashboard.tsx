import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, AlertTriangle, CheckCircle2, BookOpen,
  FolderGit2, Calendar, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GlowCard from "@/components/GlowCard";

// Mock data
const mockData = {
  name: "Demo User",
  role: "Frontend Developer",
  score: 68,
  strengths: ["HTML/CSS", "JavaScript", "React Basics", "Git", "Responsive Design"],
  weaknesses: ["TypeScript", "Testing", "System Design", "Performance Optimization"],
  missing: ["Next.js", "GraphQL", "CI/CD Pipelines", "Docker", "AWS/Cloud Basics"],
  suggested: ["TypeScript Fundamentals", "React Testing Library", "Next.js App Router", "System Design Basics", "GraphQL with Apollo"],
  roadmap: [
    { week: "Week 1-2", title: "TypeScript Mastery", tasks: ["Complete TS handbook", "Migrate a React project to TS", "Practice type challenges"] },
    { week: "Week 3-4", title: "Testing & Quality", tasks: ["Learn Jest & RTL", "Write tests for 3 components", "Setup CI pipeline"] },
    { week: "Week 5-6", title: "Next.js & SSR", tasks: ["Build a Next.js app", "Learn App Router", "Deploy on Vercel"] },
    { week: "Week 7-8", title: "System Design & Interview Prep", tasks: ["Study common patterns", "Mock interviews", "Portfolio polish"] },
  ],
  projects: [
    { title: "E-Commerce Dashboard", desc: "Build a full dashboard with TS, Next.js, and charts.", difficulty: "Intermediate" },
    { title: "Real-time Chat App", desc: "WebSocket-based chat with authentication.", difficulty: "Advanced" },
    { title: "Portfolio Website", desc: "Responsive portfolio with animations and CMS.", difficulty: "Beginner" },
  ],
};

const ScoreRing = ({ score }: { score: number }) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "hsl(142 71% 45%)" : score >= 50 ? "hsl(38 92% 50%)" : "hsl(0 84% 60%)";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(217 33% 18%)" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          className="font-display text-3xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-muted-foreground">Ready</span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const state = location.state as { name?: string; role?: string; level?: string } | null;
  const data = {
    ...mockData,
    name: state?.name || mockData.name,
    role: state?.role || mockData.role,
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container space-y-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold">
                Welcome, <span className="text-gradient">{data.name}</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">Target: {data.role}</p>
            </div>
            <Link to="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold glow-sm">
              Talk to AI Coach <ArrowRight size={16} />
            </Link>
          </motion.div>

          {/* Score + Skills */}
          <div className="grid lg:grid-cols-3 gap-6">
            <GlowCard className="flex flex-col items-center justify-center py-8">
              <p className="text-sm text-muted-foreground mb-4 font-medium">Readiness Score</p>
              <ScoreRing score={data.score} />
              <p className="mt-4 text-sm text-muted-foreground">for {data.role}</p>
            </GlowCard>

            <GlowCard delay={0.1}>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-secondary" />
                <h3 className="font-display font-semibold">Strengths</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.strengths.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-medium">{s}</span>
                ))}
              </div>
            </GlowCard>

            <GlowCard delay={0.2}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-accent" />
                <h3 className="font-display font-semibold">Weaknesses</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.weaknesses.map((s) => (
                  <span key={s} className="px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium">{s}</span>
                ))}
              </div>
            </GlowCard>
          </div>

          {/* Missing & Suggested */}
          <div className="grid md:grid-cols-2 gap-6">
            <GlowCard>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-destructive" />
                <h3 className="font-display font-semibold">Missing Skills</h3>
              </div>
              <ul className="space-y-2">
                {data.missing.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> {s}
                  </li>
                ))}
              </ul>
            </GlowCard>

            <GlowCard delay={0.1}>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-primary" />
                <h3 className="font-display font-semibold">Suggested Learning</h3>
              </div>
              <ul className="space-y-2">
                {data.suggested.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </div>

          {/* Roadmap */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <h2 className="font-display text-xl font-bold">Your Personalized Roadmap</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.roadmap.map((r, i) => (
                <GlowCard key={r.week} delay={i * 0.08}>
                  <p className="text-xs font-semibold text-primary mb-1">{r.week}</p>
                  <h3 className="font-display font-semibold text-sm mb-3">{r.title}</h3>
                  <ul className="space-y-1.5">
                    {r.tasks.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 size={12} className="text-muted-foreground mt-0.5 shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FolderGit2 size={20} className="text-secondary" />
              <h2 className="font-display text-xl font-bold">Project Recommendations</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {data.projects.map((p, i) => (
                <GlowCard key={p.title} delay={i * 0.08}>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    p.difficulty === "Beginner" ? "bg-secondary/10 text-secondary"
                    : p.difficulty === "Intermediate" ? "bg-accent/10 text-accent"
                    : "bg-destructive/10 text-destructive"
                  }`}>{p.difficulty}</span>
                  <h3 className="font-display font-semibold text-sm mt-3 mb-1">{p.title}</h3>
                  <p className="text-muted-foreground text-xs">{p.desc}</p>
                </GlowCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
