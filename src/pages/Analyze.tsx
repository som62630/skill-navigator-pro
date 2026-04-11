import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import ParticleField from "@/components/ParticleField";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const roles = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Analyst", "Data Scientist", "ML Engineer",
  "Product Manager", "UI/UX Designer", "DevOps Engineer",
  "Mobile Developer", "Cloud Architect", "Cybersecurity Analyst",
];

const levels = ["Beginner", "Intermediate", "Advanced"];

const Analyze = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: "", role: "", level: "", file: null as File | null });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.role) e.role = "Select a target role";
    if (!form.level) e.level = "Select experience level";
    if (!form.file) e.file = "Upload your resume";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    if (!isAuthenticated) {
      toast.error("Please login to analyze your resume.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("role", form.role);
      formData.append("level", form.level);
      if (form.file) formData.append("file", form.file);

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_URL}/analysis/process`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Analysis failed");

      toast.success("Analysis complete!");
      navigate("/dashboard", { state: { analysis: data } });
    } catch (error: any) {
      toast.error(error.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.type === "application/pdf" || f.name.endsWith(".doc") || f.name.endsWith(".docx"))) {
      setForm((p) => ({ ...p, file: f }));
      setErrors((p) => ({ ...p, file: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative pt-24 pb-16">
        <ParticleField count={25} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

        <div className="container max-w-2xl relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 space-y-3">
            <h1 className="font-display text-3xl sm:text-4xl font-bold">
              Analyze Your <span className="text-gradient">Resume</span>
            </h1>
            <p className="text-muted-foreground">Upload your resume and we'll show you exactly where you stand.</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="glass gradient-border rounded-3xl p-6 sm:p-10 space-y-6"
          >
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: "" })); }}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="role">Target Role</label>
              <select
                id="role"
                value={form.role}
                onChange={(e) => { setForm((p) => ({ ...p, role: e.target.value })); setErrors((p) => ({ ...p, role: "" })); }}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
              >
                <option value="">Select a role</option>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              {errors.role && <p className="text-destructive text-xs">{errors.role}</p>}
            </div>

            {/* Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Level</label>
              <div className="grid grid-cols-3 gap-3">
                {levels.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => { setForm((p) => ({ ...p, level: l })); setErrors((p) => ({ ...p, level: "" })); }}
                    className={`py-3 rounded-xl text-sm font-medium border transition-all ${
                      form.level === l
                        ? "gradient-primary text-primary-foreground border-transparent glow-sm"
                        : "bg-muted/50 border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {errors.level && <p className="text-destructive text-xs">{errors.level}</p>}
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Resume (PDF / DOC)</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                  dragOver ? "border-primary bg-primary/5" : form.file ? "border-secondary bg-secondary/5" : "border-border hover:border-primary/40"
                }`}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setForm((p) => ({ ...p, file: f })); setErrors((p) => ({ ...p, file: "" })); }
                  }}
                />
                {form.file ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="text-secondary" size={32} />
                    <p className="text-sm font-medium">{form.file.name}</p>
                    <p className="text-xs text-muted-foreground">Click or drop to replace</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="text-muted-foreground" size={32} />
                    <p className="text-sm text-muted-foreground">Drag & drop your resume or click to browse</p>
                    <p className="text-xs text-muted-foreground">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                )}
              </div>
              {errors.file && <p className="text-destructive text-xs">{errors.file}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-lg glow-md hover:glow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  Analyze Resume <ArrowRight size={18} />
                </>
              )}
            </button>
          </motion.form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/30 text-center pb-8">
              Diagnostic: {import.meta.env.VITE_API_URL} | v3.2 - STABLE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
