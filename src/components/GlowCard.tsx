import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const GlowCard = ({ children, className = "", delay = 0 }: GlowCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`glass gradient-border rounded-2xl p-6 hover:bg-card/70 transition-colors duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

export default GlowCard;
