import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ArrowRight, Loader2, BrainCircuit, ChevronDown, ChevronRight,
  Clock, Zap, BookOpen, CheckCircle2, Target, Code2, Globe, Database,
  Settings, Calculator, Presentation, BarChart3, Sparkles, Download,
  RotateCcw
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import GlowCard from "@/components/GlowCard";
import { generateRoadmap, type RoadmapData, type SkillCategory } from "@/lib/roadmapService";

/* ─── Icon Map ───────────────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  Code2, Globe, Database, Settings, Calculator, Presentation, BrainCircuit,
  Target, BookOpen, BarChart3, Zap,
};

const getIcon = (iconName: string) => iconMap[iconName] || Code2;

/* ─── Difficulty Badge ───────────────────────────────────────────────────── */

const DifficultyBadge = ({ level }: { level: string }) => {
  const styles: Record<string, string> = {
    Beginner: "bg-secondary/10 text-secondary",
    Intermediate: "bg-accent/10 text-accent",
    Advanced: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${styles[level] || styles.Beginner}`}>
      {level}
    </span>
  );
};

/* ─── Loading Skeleton ───────────────────────────────────────────────────── */

const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="space-y-8"
  >
    {/* Thinking header */}
    <div className="text-center space-y-4 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="inline-flex w-16 h-16 rounded-2xl gradient-primary items-center justify-center glow-md mx-auto"
      >
        <BrainCircuit className="text-primary-foreground" size={28} />
      </motion.div>
      <h3 className="font-display text-xl font-bold">AI is analyzing your goal...</h3>
      <p className="text-muted-foreground text-sm">Breaking down skills, estimating timeframes, and curating resources</p>
      <div className="flex justify-center gap-1.5 mt-4">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
            className="w-2.5 h-2.5 rounded-full bg-primary"
          />
        ))}
      </div>
    </div>

    {/* Skeleton cards */}
    <div className="grid sm:grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + i * 0.15 }}
          className="glass rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="skeleton w-32 h-5 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="skeleton w-full h-3 rounded" />
            <div className="skeleton w-3/4 h-3 rounded" />
            <div className="skeleton w-1/2 h-3 rounded" />
          </div>
          <div className="skeleton w-full h-2 rounded-full" />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ─── Category Card (Expandable) ─────────────────────────────────────────── */

const CategoryCard = ({ category, index }: { category: SkillCategory; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = getIcon(category.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="glass gradient-border rounded-2xl overflow-hidden hover:bg-card/70 transition-colors cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className={category.color} size={24} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base">{category.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{category.skills.length} skills</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-semibold">{category.overallProgress}%</span>
              <p className="text-[10px] text-muted-foreground">Complete</p>
            </div>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} className="text-muted-foreground" />
            </motion.div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4">
          <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full gradient-primary"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(category.overallProgress, 3)}%` }}
              transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Expanded: Skills */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-3 border-t border-border/30 pt-4">
                {category.skills.map((skill, j) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.08 }}
                    className="bg-muted/20 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{skill.name}</h4>
                          <DifficultyBadge level={skill.difficulty} />
                        </div>
                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                        <Clock size={12} />
                        <span>{skill.estimatedHours}h</span>
                      </div>
                    </div>

                    {/* Skill progress */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-primary progress-bar-animated"
                          style={{ width: `${Math.max(skill.progress, 2)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground w-8 text-right">{skill.progress}%</span>
                    </div>

                    {/* Resources */}
                    {skill.resources.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {skill.resources.map(r => (
                          <span key={r} className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[10px] font-medium">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ─── Timeline Card ──────────────────────────────────────────────────────── */

const TimelineSection = ({ timeline }: { timeline: RoadmapData["timeline"] }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.6 }}
    className="space-y-4"
  >
    <div className="flex items-center gap-2 mb-2">
      <BarChart3 size={20} className="text-primary" />
      <h2 className="font-display text-xl font-bold">Learning Timeline</h2>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {timeline.map((item, i) => (
        <motion.div
          key={item.week}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + i * 0.1 }}
        >
          <GlowCard delay={0}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-primary">{item.week}</span>
              {item.completed && <CheckCircle2 size={14} className="text-secondary" />}
            </div>
            <h4 className="font-display font-semibold text-sm mb-3">{item.title}</h4>
            <ul className="space-y-2">
              {item.tasks.map(t => (
                <li key={t} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <ChevronRight size={12} className="text-muted-foreground mt-0.5 shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </GlowCard>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ─── Main Roadmap Generator Page ────────────────────────────────────────── */

const Roadmap = () => {
  const location = useLocation();
  const initialGoal = (location.state as { goal?: string } | null)?.goal || "";

  const [goal, setGoal] = useState(initialGoal);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);

  // Auto-generate if navigated with a goal
  useEffect(() => {
    if (initialGoal && !roadmap) {
      handleGenerate(initialGoal);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async (overrideGoal?: string) => {
    const g = overrideGoal || goal;
    if (!g.trim()) return;
    setLoading(true);
    setRoadmap(null);
    try {
      const data = await generateRoadmap(g);
      setRoadmap(data);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRoadmap(null);
    setGoal("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative pt-24 pb-16">
        <ParticleField count={25} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="container max-w-5xl relative z-10 space-y-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-3"
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              Skill <span className="text-gradient">Roadmap Generator</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Enter any career goal and our AI will generate a detailed, personalized skill roadmap for you.
            </p>
          </motion.div>

          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="glass gradient-border rounded-2xl p-2">
              <form
                onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    id="roadmap-goal-input"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Enter your goal (e.g., Become a Data Scientist)"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none text-sm"
                    disabled={loading}
                  />
                </div>
                <button
                  id="roadmap-generate-button"
                  type="submit"
                  disabled={loading || !goal.trim()}
                  className="px-6 py-3.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 glow-sm shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      Generate Roadmap <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Quick suggestions */}
            {!roadmap && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-2 mt-4 justify-center"
              >
                {[
                  "Full-Stack Developer",
                  "Data Scientist",
                  "DevOps Engineer",
                  "Product Manager",
                  "UI/UX Designer",
                  "Mobile Developer",
                ].map(s => (
                  <button
                    key={s}
                    onClick={() => { setGoal(s); handleGenerate(s); }}
                    className="px-3 py-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-foreground hover:bg-card/70 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Loading */}
          <AnimatePresence mode="wait">
            {loading && <LoadingSkeleton key="loading" />}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence mode="wait">
            {roadmap && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Summary Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass gradient-border rounded-2xl p-6 sm:p-8"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={18} className="text-accent" />
                        <span className="text-xs text-muted-foreground font-medium">AI-Generated Roadmap</span>
                      </div>
                      <h2 className="font-display text-2xl font-bold">{roadmap.goal}</h2>
                      <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{roadmap.summary}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-center px-4 py-2 rounded-xl bg-primary/10">
                        <p className="font-display font-bold text-lg text-primary">{roadmap.estimatedWeeks}</p>
                        <p className="text-[10px] text-muted-foreground">Weeks</p>
                      </div>
                      <div className="text-center px-4 py-2 rounded-xl bg-secondary/10">
                        <p className="font-display font-bold text-lg text-secondary">{roadmap.categories.reduce((a, c) => a + c.skills.length, 0)}</p>
                        <p className="text-[10px] text-muted-foreground">Skills</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 rounded-xl glass text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      <RotateCcw size={14} /> New Roadmap
                    </button>
                    <Link
                      to="/dashboard"
                      className="px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2 glow-sm"
                    >
                      <Download size={14} /> Save to Dashboard
                    </Link>
                  </div>
                </motion.div>

                {/* Skill Categories */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Target size={20} className="text-primary" />
                    <h2 className="font-display text-xl font-bold">Skill Categories</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {roadmap.categories.map((cat, i) => (
                      <CategoryCard key={cat.name} category={cat} index={i} />
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <TimelineSection timeline={roadmap.timeline} />

                {/* Bottom CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center space-y-4 py-8"
                >
                  <p className="text-muted-foreground text-sm">Want personalized AI coaching for this roadmap?</p>
                  <Link
                    to="/chat"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl gradient-primary text-primary-foreground font-semibold glow-sm hover:glow-md transition-all"
                  >
                    Talk to AI Coach <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
