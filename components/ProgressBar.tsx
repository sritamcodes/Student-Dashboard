"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number;
  className?: string;
}

export default function ProgressBar({ value, className = "" }: ProgressBarProps) {
  // Clamp value between 0 and 100
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full h-1.5 bg-[#ffffff08] rounded-full overflow-hidden glass-border ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-cyan rounded-full origin-left"
        initial={{ width: "0%" }}
        animate={{ width: `${percentage}%` }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />
    </div>
  );
}
