import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Analyze Resume", to: "/analyze" },
  { label: "Roadmap", to: "/roadmap" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "AI Coach", to: "/chat" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center glow-sm">
            <Sparkles size={16} className="text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            <span className="text-foreground">Career</span><span className="text-primary">Compass</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === l.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          
          <div className="ml-4 h-6 w-[1px] bg-border/50 mx-2" />

          {isAuthenticated ? (
            <div className="flex items-center gap-3 ml-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/50 text-sm font-medium border border-border">
                <User size={14} className="text-primary" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity glow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass-strong border-t border-border/50"
          >
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === l.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              
              <div className="my-2 border-t border-border/50" />

              {isAuthenticated ? (
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <User size={16} className="text-primary" />
                    <span>{user?.name}</span>
                  </div>
                  <button
                    onClick={() => { logout(); setOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 py-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="w-full px-5 py-3 rounded-xl glass text-foreground text-sm font-semibold text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="w-full px-5 py-3 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
