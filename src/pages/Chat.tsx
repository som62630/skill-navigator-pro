import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import { sendChatMessage } from "@/lib/gemini";
import { getAIResponse as getLocalResponse } from "@/lib/aiCoach";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What skills should I learn for a frontend role?",
  "Help me prepare for system design interviews",
  "Create a 30-day learning plan for React",
  "Review my portfolio strategy",
];

const Chat = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;

    if (!isAuthenticated) {
      toast.error("Please login to talk to the AI Coach.");
      navigate("/login");
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const currentHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const responseText = await sendChatMessage(text, currentHistory, token || undefined);
      
      setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: "assistant", content: responseText }]);
    } catch (error: any) {
      console.warn("Gemini connection unsuccessful, falling back to local coach brain:", error);
      
      try {
        // 2. Fallback to local AI coach brain which is completely offline-capable
        const localHistory = messages.map(m => ({ role: m.role, content: m.content }));
        const fallbackResponse = await getLocalResponse(text, localHistory);
        setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: "assistant", content: fallbackResponse }]);
      } catch (fallbackError: any) {
        console.error("Local Coach Error:", fallbackError);
        setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: "assistant", content: "I'm sorry, I'm having trouble connecting to my brain right now. Please check your connection." }]);
      }
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col pt-16 max-w-3xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center h-full space-y-8 py-20">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center glow-md">
                <Sparkles size={28} className="text-primary-foreground" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="font-display text-2xl font-bold">AI Career Coach</h2>
                <p className="text-muted-foreground text-sm">Ask me anything about your career, skills, or job preparation.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left text-sm px-4 py-3 rounded-xl glass hover:bg-card/70 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} className="text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "glass text-foreground rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-1">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <Bot size={16} className="text-primary-foreground" />
              </div>
              <div className="glass rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: "0.4s" }} />
              </div>
            </motion.div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex gap-3 items-center"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your AI career coach..."
              className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="p-3 rounded-xl gradient-primary text-primary-foreground disabled:opacity-50 glow-sm hover:glow-md transition-all"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
