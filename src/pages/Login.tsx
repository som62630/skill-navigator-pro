import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight, Github, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col pt-24 pb-12 overflow-hidden px-4">
      <Navbar />
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto relative z-10"
      >
        <div className="glass gradient-border rounded-3xl p-8 sm:p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary mb-2 glow-sm">
              <LogIn className="text-primary-foreground" size={28} />
            </div>
            <h1 className="text-3xl font-display font-bold">Welcome <span className="text-gradient">Back</span></h1>
            <p className="text-muted-foreground text-sm">Sign in to CareerCompass to access your roadmaps</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium ml-1" htmlFor="email">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium" htmlFor="password">Password</label>
                <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-muted/30 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-lg glow-md hover:glow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign In"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/50 px-2 text-muted-foreground backdrop-blur-sm">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass hover:bg-card/70 transition-colors text-sm font-medium">
              <Sparkles size={16} className="text-secondary" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl glass hover:bg-card/70 transition-colors text-sm font-medium">
              <Github size={16} /> GitHub
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
