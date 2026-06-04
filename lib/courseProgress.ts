import { Course } from "@/types/course";

const STORAGE_KEY = "nexus_course_progress";

type ProgressOverrides = Record<string, number>;

export function loadCourseProgressOverrides(): ProgressOverrides {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ProgressOverrides) : {};
  } catch {
    return {};
  }
}

export function saveCourseProgressOverrides(overrides: ProgressOverrides) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // ignore storage errors
  }
}

export function mergeCourseProgress(courses: Course[]): Course[] {
  const overrides = loadCourseProgressOverrides();
  return courses.map((course) => ({
    ...course,
    progress: typeof overrides[course.id] === "number" ? overrides[course.id] : course.progress,
  }));
}

export function updateCourseProgress(courseId: string, progress: number) {
  const overrides = loadCourseProgressOverrides();
  const normalized = Math.max(0, Math.min(100, progress));
  saveCourseProgressOverrides({
    ...overrides,
    [courseId]: normalized,
  });
}
