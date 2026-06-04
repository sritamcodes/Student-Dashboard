"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Calendar } from "lucide-react";
import { useUser } from "@/lib/UserContext";
import { Course } from "@/types/course";
import { WeeklyPresenceDay, buildWeeklyPresence, loadActivityLog } from "@/lib/activityLog";

interface HeroTileProps {
  courses: Course[];
}

export default function HeroTile({ courses }: HeroTileProps) {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [weeklyPresence, setWeeklyPresence] = useState<WeeklyPresenceDay[]>([]);

  const completedCourses = courses.filter((course) => course.progress > 0).length;
  const averageProgress = courses.length > 0 ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length) : 0;
  const statusMessage = completedCourses > 0
    ? `You're making solid progress this week. Your average course completion is ${averageProgress}%. Keep it going!`
    : "Begin your first lesson to start tracking progress and building your learning streak.";

  useEffect(() => {
    setMounted(true);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setFormattedDate(new Date().toLocaleDateString("en-US", options));
    setWeeklyPresence(buildWeeklyPresence(loadActivityLog()));

    const handler = () => setWeeklyPresence(buildWeeklyPresence(loadActivityLog()));
    window.addEventListener('nexus-activity-log-updated', handler);
    return () => window.removeEventListener('nexus-activity-log-updated', handler);
  }, []);

  // Weekly checklist for the streak
  const weekDays = weeklyPresence.length > 0
    ? weeklyPresence
    : [
        { label: "M", dateKey: "", formattedDate: "", count: 0, isToday: false, isFuture: false },
        { label: "T", dateKey: "", formattedDate: "", count: 0, isToday: false, isFuture: false },
        { label: "W", dateKey: "", formattedDate: "", count: 0, isToday: false, isFuture: false },
        { label: "T", dateKey: "", formattedDate: "", count: 0, isToday: true, isFuture: false },
        { label: "F", dateKey: "", formattedDate: "", count: 0, isToday: false, isFuture: false },
        { label: "S", dateKey: "", formattedDate: "", count: 0, isToday: false, isFuture: false },
        { label: "S", dateKey: "", formattedDate: "", count: 0, isToday: false, isFuture: false },
      ];

  return (
    <article className="relative md:col-span-2 col-span-1 rounded-2xl glass p-6 lg:p-8 flex flex-col justify-between overflow-hidden group min-h-[220px]">
      {/* Hardware Accelerated Pulsing Glow Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent-primary/10 blur-[60px]"
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -10, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent-secondary/10 blur-[60px]"
          animate={{
            x: [0, -20, 10, 0],
            y: [0, 20, -10, 0],
            scale: [1, 0.9, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 w-full h-full items-center">
        {/* Welcome Section */}
        <div className="lg:col-span-7 flex flex-col justify-center h-full">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-accent-cyan" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-mono">
              {mounted ? formattedDate : "Loading date..."}
            </span>
          </div>

          <h1 className="text-2.5xl lg:text-3.5xl font-bold tracking-tight text-[#f4f4f7] mb-2 leading-tight">
            Welcome back, <span className="bg-gradient-to-r from-accent-primary via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">{user?.name || "Student"}</span>
          </h1>
          <p className="text-sm text-neutral-400 max-w-md font-sans leading-relaxed">
            {statusMessage}
          </p>
        </div>

        {/* Streak Counter Section */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
          <div className="bg-[#ffffff03] glass-border rounded-2xl p-4 w-full max-w-[280px] flex flex-col gap-3 relative overflow-hidden backdrop-blur-md">
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.15)] animate-pulse">
                  <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <span className="text-lg font-bold text-[#f4f4f7] font-mono leading-none">{completedCourses > 0 ? `${completedCourses} course${completedCourses > 1 ? "s" : ""}` : "No courses"}</span>
                  <p className="text-[10px] text-neutral-400 font-sans mt-0.5">{completedCourses > 0 ? "Active learning" : "Get started today"}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-full px-2 py-0.5 font-mono">
                {completedCourses > 0 ? `Avg ${averageProgress}%` : "Begin"}
              </span>
            </div>

            {/* Streak Grid */}
            <div className="flex items-center justify-between mt-1 px-1">
              {weekDays.map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-neutral-400 font-mono">
                    {day.label}
                  </span>
                  <div
                    className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all duration-300 ${
                      day.count > 0
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                        : day.isToday
                        ? "border border-orange-500/40 text-orange-400 bg-orange-500/5"
                        : "bg-[#ffffff05] border border-white/5 text-neutral-600"
                    }`}
                  >
                    {day.count > 0 ? "✓" : day.isToday ? "TODAY" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
