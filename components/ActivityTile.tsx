"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Activity, Sparkles, Check } from "lucide-react";
import { Course } from "@/types/course";
import {
  ActivityEvent,
  WeeklyPresenceDay,
  buildActivityGrid,
  buildWeeklyPresence,
  getActivitySummary,
  loadActivityLog,
} from "@/lib/activityLog";

interface ActivityCell {
  id: string;
  intensity: 0 | 1 | 2 | 3 | 4;
  date: string;
  count: number;
  dateKey: string;
  isToday: boolean;
}

const cellVariants: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
      delay: i * 0.002,
    },
  }),
};

const intensityClass = (intensity: number) => {
  switch (intensity) {
    case 1:
      return "bg-accent-primary/20 border border-accent-primary/10";
    case 2:
      return "bg-accent-primary/45 border border-accent-primary/20";
    case 3:
      return "bg-accent-primary/70 border border-accent-primary/30";
    case 4:
      return "bg-accent-primary border border-accent-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.4)]";
    default:
      return "bg-white/5 border border-white/[0.02]";
  }
};

export default function ActivityTile({ courses, mode = 'dashboard' }: { courses: Course[]; mode?: 'dashboard' | 'analytics' }) {
  const [hoveredCell, setHoveredCell] = useState<ActivityCell | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    setActivityLog(loadActivityLog());

    const handler = () => setActivityLog(loadActivityLog());
    window.addEventListener('nexus-activity-log-updated', handler);
    return () => window.removeEventListener('nexus-activity-log-updated', handler);
  }, []);

  const activityData = useMemo(
    () => (mode === 'analytics' ? buildActivityGrid(activityLog) : []),
    [activityLog, mode]
  );
  const weeklyPresence = useMemo(() => buildWeeklyPresence(activityLog), [activityLog]);
  const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
  const completedCourses = courses.filter((course) => course.progress > 0).length;
  const averageProgress = courses.length > 0 ? Math.round(totalProgress / courses.length) : 0;
  const activityMessage = activityLog.length === 0
    ? "No learning activity yet. Start a lesson to create your first heatmap entry."
    : getActivitySummary(activityLog);

  return (
    <article className="col-span-1 rounded-2xl glass p-5 flex flex-col justify-between overflow-hidden relative group min-h-[220px]">
      {/* Background visual detail */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-transparent pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent-primary/10 flex items-center justify-center border border-accent-primary/15">
            <Activity className="h-4.5 w-4.5 text-accent-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#f4f4f7] tracking-wide font-sans">
              Activity Heatmap
            </h2>
            <p className="text-[10px] text-neutral-500 font-sans">
              {activityMessage}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-accent-secondary/10 border border-accent-secondary/20 text-accent-secondary text-[9px] font-semibold font-mono rounded-full px-2 py-0.5">
          <Sparkles className="h-3 w-3" />
          <span>Real Time</span>
        </div>
      </div>

      {/* Chart Layout */}
      <div className="flex flex-col gap-3 justify-center items-center my-auto w-full">
        {mode === 'dashboard' ? (
          <div className="w-full">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-sans mb-3">
              <span>Current week activity</span>
              <span className="font-medium text-accent-primary">
                {weeklyPresence.filter((day) => day.count > 0).length} days
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weeklyPresence.map((day) => (
                <div
                  key={day.dateKey}
                  className={`relative flex h-16 flex-col items-center justify-center rounded-2xl border transition-all duration-200 ${
                    day.count > 0
                      ? 'bg-accent-primary/20 border-accent-primary/30'
                      : 'bg-white/5 border-white/10'
                  } ${day.isToday ? 'ring-2 ring-accent-secondary/80 shadow-[0_0_0_1px_rgba(139,92,246,0.5)]' : ''} ${
                    day.isFuture ? 'opacity-50' : ''
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">{day.label}</span>
                  <div className="mt-2 flex h-8 w-8 items-center justify-center rounded-full">
                    {day.count > 0 ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <span className="text-[9px] text-neutral-500">{day.isToday ? 'TODAY' : ''}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-1.5 w-full justify-center overflow-x-auto py-1 scrollbar-none">
            {/* Day indicators */}
            <div className="flex flex-col justify-between text-[9px] text-neutral-600 font-mono py-1 pr-1 select-none">
              <span>M</span>
              <span>W</span>
              <span>F</span>
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
              {activityData.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const globalIndex = rowIndex * 24 + colIndex;
                  return (
                    <motion.div
                      key={cell.id}
                      custom={globalIndex}
                      initial="hidden"
                      animate="visible"
                      variants={cellVariants}
                      onMouseEnter={() => setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`h-2.5 w-2.5 rounded-[2px] transition-all duration-150 cursor-pointer ${intensityClass(
                        cell.intensity
                      )} ${cell.isToday ? 'ring-1 ring-accent-secondary/70 shadow-[0_0_0_1px_rgba(139,92,246,0.5)]' : ''}`}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Legend / Stats Row */}
        <div className="flex items-center justify-between text-[10px] text-neutral-500 font-sans w-full px-1 pt-1 border-t border-white/5">
          <div className="flex items-center gap-1 font-mono">
            <span>Less</span>
            <div className="h-2 w-2 rounded-[1px] bg-white/5 border border-white/[0.02]" />
            <div className="h-2 w-2 rounded-[1px] bg-accent-primary/20 border border-accent-primary/10" />
            <div className="h-2 w-2 rounded-[1px] bg-accent-primary/45 border border-accent-primary/20" />
            <div className="h-2 w-2 rounded-[1px] bg-accent-primary/70 border border-accent-primary/30" />
            <div className="h-2 w-2 rounded-[1px] bg-accent-primary border border-accent-primary/40" />
            <span>More</span>
          </div>

          <div className="h-4 flex items-center justify-end min-w-[120px] text-right">
            {hoveredCell ? (
              <span className="font-mono text-[9px] text-accent-cyan transition-opacity duration-200">
                {hoveredCell.count > 0
                  ? `${hoveredCell.count} task${hoveredCell.count > 1 ? "s" : ""} on ${hoveredCell.date}`
                  : `No tasks on ${hoveredCell.date}`}
              </span>
            ) : (
              <span className="text-neutral-500 font-mono text-[9px]">Hover cell for stats</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
