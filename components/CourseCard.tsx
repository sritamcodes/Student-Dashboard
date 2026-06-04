"use client";

import { motion, Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Course } from "@/types/course";
import ProgressBar from "./ProgressBar";

interface CourseCardProps {
  course: Course;
  id: string;
  onProgressUpdate?: (courseId: string, nextProgress: number) => void;
}

const getCourseVideoUrl = (course: Course) => {
  if (course.video_url) {
    return course.video_url;
  }

  switch (course.icon_name.toLowerCase()) {
    case "react":
      return "https://www.youtube.com/watch?v=il5J3ij7Z_M";
    case "nextjs":
      return "https://www.youtube.com/watch?v=1WmNXEVia8I";
    case "typescript":
      return "https://www.youtube.com/watch?v=BwuLxPH8IDs";
    case "framer":
      return "https://www.youtube.com/watch?v=li0K3hazYYo";
    default:
      return "https://www.youtube.com/results?search_query=programming+tutorials";
  }
};

// Custom futuristic SVG renderers for tech icons to ensure a premium UI
function TechIcon({ name }: { name: string }) {
  switch (name.toLowerCase()) {
    case "react":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent-primary animate-[spin_20s_linear_infinite]" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="2" />
          <path d="M12 3C20.3 3 20.3 21 12 21C3.7 21 3.7 3 12 3Z" className="opacity-80" />
          <path d="M12 3C20.3 3 20.3 21 12 21C3.7 21 3.7 3 12 3Z" className="opacity-80 rotate-[60deg] origin-center" />
          <path d="M12 3C20.3 3 20.3 21 12 21C3.7 21 3.7 3 12 3Z" className="opacity-80 rotate-[120deg] origin-center" />
        </svg>
      );
    case "nextjs":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5V8.5h1.25l4.31 5.92V8.5h1.19v9h-1.25l-4.31-5.92v5.92H11z" />
        </svg>
      );
    case "typescript":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent-cyan" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M9 17v-6H7v-1.5h5.5V11h-2v6H9z" />
          <path d="M15.5 10c1.5 0 2 1 2 2h-1.5c0-.5-.2-.7-.7-.7-.5 0-.8.3-.8.7 0 .5.3.7.8.9l.8.3c1 .3 1.6.8 1.6 1.8 0 1.2-1 2-2.2 2-1.3 0-2.3-.8-2.3-2.2h1.5c0 .6.4.9.8.9.4 0 .7-.2.7-.6 0-.4-.2-.6-.7-.8l-.8-.3c-1-.3-1.6-.8-1.6-1.8 0-1.2 1-2 2.2-2z" />
        </svg>
      );
    case "framer":
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent-secondary" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 3h14v6.5l-7 7.5 7 7H5V14.5l7-7.5-7-7z" fill="currentColor" fillOpacity="0.1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
  }
}

// Framer motion variants for page load entry
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

export default function CourseCard({ course, id, onProgressUpdate }: CourseCardProps) {
  const videoUrl = getCourseVideoUrl(course);
  const canAdvance = typeof onProgressUpdate === "function" && course.progress < 100;
  const actionLabel = course.progress >= 100
    ? "Completed"
    : course.progress === 0
    ? "Start course"
    : "Mark next lesson watched";

  const handleProgressClick = () => {
    if (!canAdvance) return;
    onProgressUpdate?.(course.id, Math.min(100, course.progress + 10));
  };

  return (
    <motion.article
      id={id}
      variants={cardVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative p-[1px] rounded-2xl overflow-hidden glass transition-all duration-300 w-full h-[220px] flex flex-col justify-between"
    >
      {/* Shifting radial glow background inside border margin (hardware-accelerated) */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 via-transparent to-accent-secondary/0 group-hover:to-accent-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />
      
      {/* Background card plate */}
      <div className="absolute inset-[1px] rounded-[15px] bg-[#08080cb3] backdrop-blur-xl -z-5" />

      {/* Main Content Area */}
      <div className="p-5 flex flex-col justify-between h-full relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 border border-white/5 shadow-inner">
            <TechIcon name={course.icon_name} />
          </div>
          
          <div className="h-7 w-7 rounded-lg bg-white/0 group-hover:bg-[#ffffff0a] border border-white/0 group-hover:border-white/5 flex items-center justify-center transition-all duration-300">
            <ArrowUpRight className="h-4 w-4 text-neutral-500 group-hover:text-[#f4f4f7] transition-colors duration-200" />
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-[#f4f4f7] group-hover:text-accent-primary transition-colors duration-200 tracking-wide font-sans mb-3 line-clamp-1">
            {course.title}
          </h2>
          
          {/* Progress Section */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 font-sans">Progress</span>
              <span className="font-semibold text-accent-emerald font-mono">{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        </div>
        <div className="space-y-3">
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-semibold text-[#f4f4f7] transition hover:bg-white/10"
          >
            Watch lesson on YouTube
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <button
            type="button"
            onClick={handleProgressClick}
            disabled={!canAdvance}
            className={`w-full rounded-xl px-3 py-2 text-xs font-semibold transition ${
              canAdvance
                ? "bg-accent-primary text-[#050508] hover:bg-accent-primary/90"
                : "bg-white/5 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
