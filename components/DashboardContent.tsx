"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search, GraduationCap } from "lucide-react";
import { Course } from "@/types/course";
import { mergeCourseProgress, updateCourseProgress } from "@/lib/courseProgress";
import { getActivitySummary, loadActivityLog } from "@/lib/activityLog";
import { addActivityEvent } from "@/lib/activityLog";

import BentoGrid from "./BentoGrid";
import HeroTile from "./HeroTile";
import CourseCard from "./CourseCard";
import ActivityTile from "./ActivityTile";

interface DashboardContentProps {
  courses: Course[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export default function DashboardContent({ courses }: DashboardContentProps) {
  const [activePage, setActivePage] = useState("dashboard");
  const [localCourses, setLocalCourses] = useState<Course[]>(courses);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsSummary, setNotificationsSummary] = useState("No new notifications.");

  useEffect(() => {
    setLocalCourses(mergeCourseProgress(courses));
  }, [courses]);

  useEffect(() => {
    const activityLog = loadActivityLog();
    const summary = getActivitySummary(activityLog);
    setNotificationsSummary(summary === 'No learning activity yet. Start a course to create your first heatmap entry.'
      ? 'No new notifications. Keep learning to generate activity alerts.'
      : summary);
  }, []);

  const handleProgressUpdate = (courseId: string, nextProgress: number) => {
    const currentCourse = localCourses.find((course) => course.id === courseId);
    const delta = currentCourse ? Math.max(0, nextProgress - currentCourse.progress) : 0;
    updateCourseProgress(courseId, nextProgress);
    if (currentCourse && delta > 0) {
      addActivityEvent(currentCourse, delta);
    }
    setLocalCourses((current) =>
      current.map((course) =>
        course.id === courseId ? { ...course, progress: nextProgress } : course
      )
    );
  };

  // Staggered motion wrapper for Hero, Activity and CourseCards
  const renderDashboardGrid = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <BentoGrid>
        {/* Row 1: Hero Tile & Activity Tile */}
        <HeroTile courses={localCourses} />
        <ActivityTile courses={localCourses} mode="dashboard" />

        {/* Row 2: Course Cards */}
        {localCourses.length > 0 ? (
          localCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={`course-card-${course.id}`}
              course={course}
              onProgressUpdate={handleProgressUpdate}
            />
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl border border-white/10 bg-[#0b0b12]/80 p-8 text-center">
            <p className="text-sm text-neutral-400 mb-3">No courses have been started yet.</p>
            <p className="text-base font-semibold text-[#f4f4f7]">Explore the courses page to begin your first lesson.</p>
          </div>
        )}
      </BentoGrid>
    </motion.div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#050508]">
      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Semantic Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between px-6 lg:px-8 bg-[#050508cc] backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#f4f4f7] capitalize select-none font-mono tracking-wider">
              {activePage}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search container */}
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                id="header-search-input"
                type="text"
                placeholder="Search courses..."
                className="w-full bg-[#ffffff04] border border-white/5 rounded-xl py-1.5 pl-9 pr-4 text-xs text-[#f4f4f7] placeholder-neutral-500 focus:outline-none focus:border-accent-primary/40 focus:bg-[#ffffff08] transition-all"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notifications-button"
                type="button"
                onClick={() => setShowNotifications((current) => !current)}
                className="relative p-2 rounded-xl bg-[#ffffff03] border border-white/5 hover:border-white/10 hover:bg-[#ffffff06] text-neutral-400 hover:text-[#f4f4f7] transition-all cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-accent-primary animate-pulse" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-[#09090f]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-xl z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-[#f4f4f7]">Notifications</p>
                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-neutral-400 hover:text-white"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500 mb-1">Activity</p>
                      <p className="text-sm text-neutral-200 leading-snug">{notificationsSummary}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-500 mb-1">Tip</p>
                      <p className="text-sm text-neutral-200 leading-snug">Keep the bell active to get course progress updates for today.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Container */}
        <main className="flex-1 px-6 lg:px-8 py-6 overflow-y-auto w-full">
          {activePage === "dashboard" ? (
            renderDashboardGrid()
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-[50vh] text-center"
            >
              <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-accent-primary" />
              </div>
              <h2 className="text-lg font-bold text-[#f4f4f7] capitalize mb-1">
                {activePage}
              </h2>
              <p className="text-sm text-neutral-500 max-w-xs">
                This section is currently under development on the Nexus learning platform.
              </p>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
