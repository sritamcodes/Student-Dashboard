"use client";

import { useEffect, useState } from "react";
import ActivityTile from "@/components/ActivityTile";
import { getCourses } from "@/lib/supabase";
import { mergeCourseProgress } from "@/lib/courseProgress";
import { Course } from "@/types/course";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function AnalyticsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await getCourses();
      setCourses(mergeCourseProgress(data));
      setLoading(false);
    };
    loadCourses();
  }, []);

  return (
    <main className="min-h-screen p-6 bg-[#050508] text-[#f4f4f7]">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <p className="mb-4 text-lg">Your learning activity overview.</p>
        <div className="bg-[#0a0a0c]/60 p-4 rounded-xl glass-panel">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <ActivityTile courses={courses} mode="analytics" />
          )}
        </div>
      </section>
    </main>
  );
}
