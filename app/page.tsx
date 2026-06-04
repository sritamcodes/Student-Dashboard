import { getCourses } from "@/lib/supabase";
import DashboardContent from "@/components/DashboardContent";

// Prevent Next.js from pre-rendering static shells so database queries remain fresh
export const revalidate = 0;

export default async function Home() {
  const courses = await getCourses();

  return <DashboardContent courses={courses} />;
}
