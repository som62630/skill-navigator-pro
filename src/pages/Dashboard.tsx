import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  TrendingUp, AlertTriangle, CheckCircle2, BookOpen,
  FolderGit2, Calendar, ArrowRight, BarChart3, Target,
  Clock, Zap, ChevronRight, Sparkles, Plus, Route, FileText
} from "lucide-react";
import Navbar from "@/components/Navbar";
import GlowCard from "@/components/GlowCard";

/* ─── Mock Data ──────────────────────────────────────────────────────────── */

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

const mockSavedRoadmaps = [
  { id: 1, goal: "Full-Stack Developer", skills: 16, weeks: 12, progress: 35, createdAt: "2026-03-15" },
  { id: 2, goal: "Data Scientist", skills: 13, weeks: 16, progress: 12, createdAt: "2026-04-01" },
];

/* ─── Score Ring ──────────────────────────────────────────────────────────── */

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

/* ─── Dashboard ──────────────────────────────────────────────────────────── */

const Dashboard = () => {
  const location = useLocation();
  const state = location.state as { analysis?: any } | null;
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());

  const data = state?.analysis ? {
    ...state.analysis,
    name: state.analysis.name || "User",
    role: state.analysis.role || "Developer"
  } : mockData;

  const toggleTask = (task: string) => {
    setCheckedTasks(prev => {
      const next = new Set(prev);
      if (next.has(task)) next.delete(task);
      else next.add(task);
      return next;
    });
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
            <div className="flex gap-3">
              <Link to="/roadmap" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold glow-sm hover:opacity-90 transition-opacity">
                <Plus size={16} /> New Roadmap
              </Link>
              <Link to="/analyze" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-secondary text-secondary text-sm font-semibold hover:bg-secondary/10 transition-colors">
                <FileText size={16} /> Analyze Resume
              </Link>
              <Link to="/chat" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-foreground text-sm font-semibold hover:bg-card/70 transition-colors">
                Talk to AI Coach <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Saved Roadmaps */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Route size={20} className="text-primary" />
              <h2 className="font-display text-xl font-bold">My Roadmaps</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockSavedRoadmaps.map((rm, i) => (
                <GlowCard key={rm.id} delay={i * 0.08}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-semibold text-sm">{rm.goal}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{rm.weeks}w</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Target size={12} /> {rm.skills} skills</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {rm.createdAt}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted/50 overflow-hidden mb-2">
                    <motion.div
                      className="h-full rounded-full gradient-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${rm.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right">{rm.progress}% complete</p>
                </GlowCard>
              ))}

              {/* Add new roadmap card */}
              <Link to="/roadmap" className="glass gradient-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-card/70 transition-colors min-h-[160px] group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="text-primary" size={24} />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Generate New Roadmap</p>
              </Link>
            </div>
          </div>

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
                {data.strengths.map((s: string) => (
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
                {data.weaknesses.map((s: string) => (
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
                {data.missing.map((s: string) => (
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
                {data.suggested.map((s: string) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {s}
                  </li>
                ))}
              </ul>
            </GlowCard>
          </div>

          {/* Roadmap with Progress Tracking */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <h2 className="font-display text-xl font-bold">Your Personalized Roadmap</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.roadmap.map((r: any, i: number) => (
                <GlowCard key={r.week} delay={i * 0.08}>
                  <p className="text-xs font-semibold text-primary mb-1">{r.week}</p>
                  <h3 className="font-display font-semibold text-sm mb-3">{r.title}</h3>
                  <ul className="space-y-2">
                    {r.tasks.map((t: string) => {
                      const isChecked = checkedTasks.has(t);
                      return (
                        <li
                          key={t}
                          className="flex items-start gap-2 text-xs cursor-pointer group"
                          onClick={() => toggleTask(t)}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            isChecked
                              ? "bg-secondary border-secondary"
                              : "border-muted-foreground/40 group-hover:border-primary/60"
                          }`}>
                            {isChecked && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          <span className={`transition-colors ${isChecked ? "line-through text-muted-foreground/50" : "text-muted-foreground"}`}>
                            {t}
                          </span>
                        </li>
                      );
                    })}
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
              {data.projects.map((p: any, i: number) => (
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
