import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, Zap, BarChart3, Route, BrainCircuit, Users,
  ArrowRight, CheckCircle2, Star, Sparkles, Search,
  BookOpen, TrendingUp, Lightbulb, GraduationCap,
  Code2, Briefcase, ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import GlowCard from "@/components/GlowCard";

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

/* ─── Animated Roadmap Preview (Hero right side) ─────────────────────────── */

const RoadmapPreview = () => {
  const categories = [
    { name: "Programming", progress: 72, color: "from-primary to-[hsl(217,91%,60%)]" },
    { name: "Mathematics", progress: 45, color: "from-secondary to-emerald-400" },
    { name: "Tools & Frameworks", progress: 58, color: "from-accent to-orange-400" },
    { name: "Soft Skills", progress: 85, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="relative"
    >
      {/* Main card */}
      <div className="glass gradient-border rounded-3xl p-6 w-full max-w-md mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Generated Roadmap</p>
            <h4 className="font-display font-bold text-sm mt-0.5">Data Scientist</h4>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
            <TrendingUp size={12} /> 12 weeks
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-foreground font-medium">{cat.name}</span>
                <span className="text-muted-foreground">{cat.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${cat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${cat.progress}%` }}
                  transition={{ delay: 1 + i * 0.15, duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Skills preview */}
        <div className="flex flex-wrap gap-1.5">
          {["Python", "Statistics", "SQL", "TensorFlow", "Pandas"].map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.1 }}
              className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] font-medium"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-2.5 flex items-center gap-2 glow-sm"
      >
        <Sparkles className="text-accent" size={16} />
        <span className="text-xs font-semibold">AI Generated</span>
      </motion.div>

      {/* Glow orbs */}
      <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-primary/10 blur-[40px] pointer-events-none" />
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-secondary/10 blur-[50px] pointer-events-none" />
    </motion.div>
  );
};

/* ─── Animated Counter ───────────────────────────────────────────────────── */

const AnimatedCounter = ({ value, label }: { value: string; label: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <p className="text-3xl sm:text-4xl font-display font-bold text-gradient">{value}</p>
    <p className="text-sm text-muted-foreground mt-1">{label}</p>
  </motion.div>
);

/* ─── Landing Page ───────────────────────────────────────────────────────── */

const Landing = () => {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");

  const handleGenerate = () => {
    if (goal.trim()) {
      navigate("/roadmap", { state: { goal: goal.trim() } });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-16 grid-pattern">
        <ParticleField count={50} />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/6 blur-[140px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 xl:gap-12 items-center">
            <motion.div {...stagger} initial="initial" animate="animate" className="space-y-8 lg:col-span-7 xl:col-span-7">
              <motion.div {...fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-white">
                  <Sparkles size={14} className="text-accent" /> AI-Powered Skill Intelligence
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[3.5rem] font-bold leading-[1.08] tracking-tight"
              >
                Find the exact skills you need to land your{" "}
                <span className="text-gradient">dream job</span> — powered by{" "}
                <span className="text-gradient">AI</span>
              </motion.h1>

              <motion.p {...fadeUp} className="text-muted-foreground text-lg sm:text-xl max-w-xl leading-relaxed">
                Get a personalized roadmap, resources, and progress tracking in seconds.
              </motion.p>

              {/* ─ Goal Input ─ */}
              <motion.div {...fadeUp} className="max-w-lg">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                  <input
                    id="hero-goal-input"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    placeholder="Enter your goal (e.g., Become a Data Scientist)"
                    className="w-full pl-12 pr-44 py-4 rounded-2xl bg-muted/30 border border-border text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all text-sm"
                  />
                  <button
                    id="hero-generate-button"
                    onClick={handleGenerate}
                    disabled={!goal.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 glow-sm"
                  >
                    Generate <ArrowRight size={16} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 ml-1">
                  Try: "Become a Full-Stack Developer" or "Switch to Product Management"
                </p>
              </motion.div>

              <motion.div {...fadeUp} className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-secondary" /> Free to use</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-secondary" /> AI-powered</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-secondary" /> Instant results</span>
              </motion.div>
            </motion.div>

            {/* Right: Animated Preview */}
            <div className="hidden lg:flex justify-start lg:col-span-5 xl:col-span-5">
              <RoadmapPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF STRIP ═══ */}
      <section className="py-16 border-y border-border/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter value="1,200+" label="Learners" />
            <AnimatedCounter value="3,500+" label="Roadmaps Generated" />
            <AnimatedCounter value="95%" label="Satisfaction" />
            <AnimatedCounter value="50+" label="Career Paths" />
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">How It Works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Three steps to <span className="text-gradient">clarity</span></h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From confusion to a clear action plan in under 30 seconds.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {[
              { step: "01", icon: Search, title: "Enter Your Goal", desc: "Type in any career target — from 'Data Scientist' to 'Cloud Architect'. Our AI understands all of them.", color: "text-primary" },
              { step: "02", icon: BrainCircuit, title: "AI Analyzes", desc: "Our AI engine breaks down your goal into skill categories, difficulty levels, and a time-based learning path.", color: "text-secondary" },
              { step: "03", icon: Route, title: "Get Your Roadmap", desc: "Receive a detailed, actionable roadmap with progress tracking, resources, and a week-by-week plan.", color: "text-accent" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center space-y-4 relative z-10"
              >
                <div className="inline-flex w-20 h-20 rounded-2xl gradient-primary items-center justify-center glow-sm mx-auto">
                  <s.icon className="text-primary-foreground" size={32} />
                </div>
                <div className="inline-flex w-8 h-8 rounded-full bg-background border-2 border-primary items-center justify-center text-primary font-display font-bold text-xs -mt-3">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-xl">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">Features</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Everything you need to <span className="text-gradient">level up</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BrainCircuit, title: "AI Skill Analysis", desc: "Advanced AI breaks down any career into its component skills with difficulty ratings.", color: "text-primary" },
              { icon: Route, title: "Personalized Roadmaps", desc: "Get a week-by-week learning plan tailored to your specific career goal.", color: "text-secondary" },
              { icon: BarChart3, title: "Progress Tracking", desc: "Track your learning progress with visual dashboards and milestone markers.", color: "text-accent" },
              { icon: BookOpen, title: "Resource Curation", desc: "Curated free and paid resources for every skill — courses, books, tutorials.", color: "text-destructive" },
            ].map((f, i) => (
              <GlowCard key={f.title} delay={i * 0.08}>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className={f.color} size={24} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRODUCT SHOWCASE ═══ */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        {/* Ambient glow behind image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">See It In Action</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold">
              Your career intelligence <span className="text-gradient">dashboard</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              AI-powered readiness scoring, skill gap analysis, and a personalized career roadmap — all in one place.
            </p>
          </div>

          {/* Floating 3D Image Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-xl mx-auto"
          >
            {/* Main image with perspective */}
            <div className="relative group">
              <div
                className="rounded-2xl overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                style={{
                  perspective: "1200px",
                }}
              >
                <motion.div
                  initial={{ rotateX: 8, rotateY: -5 }}
                  whileInView={{ rotateX: 4, rotateY: -2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <img
                    src="/images/dashboard-hero.png"
                    alt="Skill Navigator Pro Dashboard — AI-powered readiness scoring, career roadmap, and skill analytics"
                    className="w-full h-auto drop-shadow-2xl"
                    loading="lazy"
                  />
                </motion.div>
              </div>

              {/* Glow border effect */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-xl opacity-60 group-hover:opacity-80 transition-opacity -z-10" />
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, x: -30, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="absolute -left-4 sm:-left-8 top-1/4 glass rounded-2xl px-4 py-3 glow-sm animate-float-slow hidden sm:flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Target size={18} className="text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">68% Ready</p>
                <p className="text-[10px] text-muted-foreground">Readiness Score</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="absolute -right-4 sm:-right-8 top-1/3 glass rounded-2xl px-4 py-3 glow-sm animate-float hidden sm:flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <TrendingUp size={18} className="text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-sm">16 Skills</p>
                <p className="text-[10px] text-muted-foreground">Tracked</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.7 }}
              className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 glow-sm hidden sm:flex items-center gap-3"
            >
              <Sparkles size={16} className="text-accent" />
              <span className="text-sm font-semibold">AI-Powered Analytics</span>
              <span className="text-xs text-muted-foreground">• Real-time</span>
            </motion.div>
          </motion.div>

          <div className="text-center">
            <Link
              to="/roadmap"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold glow-md hover:glow-lg hover:scale-[1.02] transition-all"
            >
              Try It Now — It's Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ USE CASES ═══ */}
      <section className="py-24">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">Who It's For</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Built for <span className="text-gradient">ambitious learners</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: "Students",
                desc: "College students who want clarity on what skills to learn for their first job. Stop guessing — start building the right things.",
                tag: "Most Popular",
                color: "text-primary",
              },
              {
                icon: Code2,
                title: "Developers",
                desc: "Developers learning new skills or frameworks. Get a structured path instead of random YouTube tutorials.",
                tag: "Power Users",
                color: "text-secondary",
              },
              {
                icon: Briefcase,
                title: "Career Switchers",
                desc: "People transitioning into tech from other industries. Know exactly what to learn and in what order.",
                tag: "Growing Fast",
                color: "text-accent",
              },
            ].map((uc, i) => (
              <GlowCard key={uc.title} delay={i * 0.1}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <uc.icon className={uc.color} size={24} />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{uc.tag}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{uc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{uc.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">Testimonials</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Loved by <span className="text-gradient">thousands</span></h2>
            <p className="text-muted-foreground">Used by 1,000+ learners across the globe</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", role: "SDE at Google", text: "Skill Navigator Pro showed me exactly what skills I was missing. I went from confused to confident — and landed my dream role within 3 months.", avatar: "PS" },
              { name: "Rahul Mehta", role: "Data Analyst at Amazon", text: "The roadmap feature is incredibly detailed. It felt like having a personal career mentor who actually understood my goals.", avatar: "RM" },
              { name: "Ananya Singh", role: "Frontend Dev at Razorpay", text: "I was learning randomly before — React one day, Python the next. This gave me structure and I actually finished a full learning path.", avatar: "AS" },
            ].map((t, i) => (
              <GlowCard key={t.name} delay={i * 0.1}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-3xl text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold"
          >
            Start building your roadmap — <span className="text-gradient">it's free</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Join thousands of professionals who found clarity with Skill Navigator Pro.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/roadmap"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg glow-lg hover:scale-[1.02] transition-transform"
            >
              Generate My Roadmap <ArrowRight size={20} />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass text-foreground font-bold text-lg hover:bg-card/70 transition-colors"
            >
              View Demo Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12 border-t border-border/50">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="font-display font-bold text-lg">
                <span className="text-foreground">Skill</span><span className="text-primary">Navigator</span><span className="text-foreground"> Pro</span>
              </span>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">AI-powered skill intelligence platform. Know exactly what to learn for your dream career.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <div className="space-y-2">
                <Link to="/roadmap" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Roadmap Generator</Link>
                <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
                <Link to="/chat" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">AI Coach</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Resources</h4>
              <div className="space-y-2">
                <Link to="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
                <Link to="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                <Link to="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Changelog</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <div className="space-y-2">
                <Link to="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link to="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <Link to="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>© 2026 Skill Navigator Pro. All rights reserved.</span>
            <span className="flex items-center gap-1">Built with <Sparkles size={14} className="text-primary" /> AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
