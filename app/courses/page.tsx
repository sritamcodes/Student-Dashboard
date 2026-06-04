"use client";

import { useEffect, useState } from "react";
import { getCourses } from "@/lib/supabase";
import { mergeCourseProgress, updateCourseProgress } from "@/lib/courseProgress";
import { addActivityEvent } from "@/lib/activityLog";
import CourseCard from "@/components/CourseCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Course } from "@/types/course";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCourses();
      setCourses(mergeCourseProgress(data));
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <main className="min-h-screen p-6 bg-[#050508] text-[#f4f4f7]">
      <section className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Courses</h1>
        {loading ? (
          <LoadingSkeleton />
        ) : courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <CourseCard
                key={c.id}
                id={c.id}
                course={c}
                onProgressUpdate={(courseId, nextProgress) => {
                  const previous = courses.find((course) => course.id === courseId);
                  const delta = previous ? Math.max(0, nextProgress - previous.progress) : 0;
                  updateCourseProgress(courseId, nextProgress);
                  if (previous && delta > 0) {
                    addActivityEvent(previous, delta);
                  }
                  setCourses((current) =>
                    current.map((course) =>
                      course.id === courseId ? { ...course, progress: nextProgress } : course
                    )
                  );
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-[#0b0b12]/80 p-10 text-center">
            <p className="text-sm text-neutral-400 mb-3">No courses have been added to your account yet.</p>
            <p className="text-base font-semibold text-[#f4f4f7]">Head back to the dashboard to start a course.</p>
          </div>
        )}
      </section>
    </main>
  );
}
