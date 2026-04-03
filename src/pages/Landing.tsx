import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Target, Zap, BarChart3, Route, BrainCircuit, Users,
  ArrowRight, CheckCircle2, Star, Sparkles
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import GlowCard from "@/components/GlowCard";
import dashboardHero from "@/assets/dashboard-hero.png";
import dashboardShard from "@/assets/dashboard-shard.png";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16 grid-pattern">
        <ParticleField count={50} />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/8 blur-[120px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...stagger} initial="initial" animate="animate" className="space-y-8">
              <motion.div {...fadeUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-white">
                  <Sparkles size={14} /> AI-Powered Career Intelligence
                </span>
              </motion.div>
              <motion.h1
                {...fadeUp}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight"
              >
                Know Exactly{" "}
                <span className="text-gradient">How Far</span> You Are From Your{" "}
                <span className="text-gradient">Dream Job</span>
              </motion.h1>
              <motion.p {...fadeUp} className="text-muted-foreground text-lg sm:text-xl max-w-lg leading-relaxed">
                AI-powered career intelligence platform that analyzes your resume and gives a personalized roadmap to get hired faster.
              </motion.p>
              <motion.div {...fadeUp} className="flex flex-wrap gap-4">
                <Link
                  to="/analyze"
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold glow-md hover:glow-lg transition-all duration-300"
                >
                  Analyze My Resume
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl glass text-foreground font-semibold hover:bg-card/70 transition-colors"
                >
                  Try Demo
                </Link>
              </motion.div>
              <motion.div {...fadeUp} className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-secondary" /> Free to use</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-secondary" /> Get personalized AI for guidance</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-secondary" /> Instant results</span>
              </motion.div>
            </motion.div>

            {/* Crystal Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                <img
                  src={dashboardHero}
                  alt="CareerCompass Career Dashboard"
                  width={1024}
                  height={1024}
                  className="w-[400px] lg:w-[520px] animate-float drop-shadow-2xl"
                  style={{ filter: "drop-shadow(0 0 60px hsl(239 84% 67% / 0.3))" }}
                />
                {/* Floating dashboard shard bottom-left */}
                <motion.img
                  src={dashboardShard}
                  alt=""
                  loading="lazy"
                  width={512}
                  height={512}
                  className="absolute -bottom-8 -left-12 w-20 lg:w-28 animate-float-slow"
                  style={{ filter: "drop-shadow(0 0 20px hsl(239 84% 67% / 0.4))", animationDelay: "1s" }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
                {/* Glow orbs */}
                <div className="absolute top-10 right-10 w-3 h-3 rounded-full bg-secondary animate-pulse-glow" />
                <div className="absolute bottom-20 right-0 w-2 h-2 rounded-full bg-accent animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 relative">
        <div className="container max-w-4xl text-center space-y-6">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-primary font-semibold text-sm tracking-widest uppercase">
            The Problem
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold"
          >
            You're skilled. But are you <span className="text-gradient">job-ready?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto"
          >
            Most candidates have no idea what skills they're missing for their target role. They apply blindly, get rejected, and wonder what went wrong. The gap between "what you know" and "what companies want" is invisible — until now.
          </motion.p>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        <div className="container max-w-4xl text-center space-y-6">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-secondary font-semibold text-sm tracking-widest uppercase">
            The Solution
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold"
          >
            Your AI career <span className="text-gradient">co-pilot</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto"
          >
            CareerCompass reads your resume, understands your skills, compares them with real job requirements, and builds a personalized learning roadmap — so you know exactly what to learn and when.
          </motion.p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">Features</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Everything you need to <span className="text-gradient">level up</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Resume Analysis", desc: "AI-powered deep analysis of your skills, experience, and gaps.", color: "text-primary" },
              { icon: BarChart3, title: "Readiness Score", desc: "See how close you are to landing your dream role with a clear score.", color: "text-secondary" },
              { icon: Route, title: "Personalized Roadmap", desc: "Week-by-week learning plan tailored to your skill gaps.", color: "text-accent" },
              { icon: BrainCircuit, title: "AI Career Coach", desc: "Chat with an AI coach that knows your profile and goals.", color: "text-primary" },
              { icon: Zap, title: "Skill Gap Detection", desc: "Instantly identify what's missing between you and your target role.", color: "text-secondary" },
              { icon: Users, title: "Role Comparison", desc: "Compare your profile against industry standards and job listings.", color: "text-accent" },
            ].map((f, i) => (
              <GlowCard key={f.title} delay={i * 0.08}>
                <f.icon className={`${f.color} mb-4`} size={28} />
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">How It Works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Three steps to <span className="text-gradient">clarity</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload Resume", desc: "Drop your PDF or DOC. Our AI reads and understands your profile." },
              { step: "02", title: "Get Analysis", desc: "See your readiness score, strengths, gaps, and improvement areas." },
              { step: "03", title: "Follow Roadmap", desc: "Get a week-by-week plan and AI coaching to reach your goal." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center space-y-4"
              >
                <div className="inline-flex w-16 h-16 rounded-2xl gradient-primary items-center justify-center text-primary-foreground font-display font-bold text-xl glow-sm">
                  {s.step}
                </div>
                <h3 className="font-display font-semibold text-xl">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="container space-y-16">
          <div className="text-center space-y-4">
            <p className="text-primary font-semibold text-sm tracking-widest uppercase">Testimonials</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Loved by <span className="text-gradient">thousands</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", role: "SDE at Google", text: "CareerCompass showed me exactly what I was missing. Within 3 months, I cracked my dream role." },
              { name: "Rahul Mehta", role: "Data Analyst at Amazon", text: "The roadmap feature is incredible. It felt like having a personal career mentor." },
              { name: "Ananya Singh", role: "Frontend Dev at Razorpay", text: "I was applying blindly before. CareerCompass changed my entire approach to job hunting." },
            ].map((t, i) => (
              <GlowCard key={t.name} delay={i * 0.1}>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="container max-w-3xl text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold"
          >
            Ready to bridge the <span className="text-gradient">skill gap?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Join thousands of professionals who transformed their careers with CareerCompass.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg glow-lg hover:scale-[1.02] transition-transform"
            >
              Start Free Analysis <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-border/50">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-display font-semibold text-foreground">CareerCompass</span>
          <span>© 2026 CareerCompass. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
