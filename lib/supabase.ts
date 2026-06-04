import { createClient } from '@supabase/supabase-js';
import { Course } from '@/types/course';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only initialize Supabase if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Required seed courses
export const SEED_COURSES: Course[] = [
  {
    id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
    title: 'Advanced React Patterns',
    progress: 0,
    icon_name: 'react',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    video_url: 'https://www.youtube.com/watch?v=il5J3ij7Z_M',
  },
  {
    id: 'e4b1a208-1ad0-449e-b9ef-d4d1264c185e',
    title: 'Next.js Mastery',
    progress: 0,
    icon_name: 'nextjs',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    video_url: 'https://www.youtube.com/watch?v=1WmNXEVia8I',
  },
  {
    id: 'f72da0c7-1a0e-436f-b258-3932789fcf27',
    title: 'TypeScript Pro',
    progress: 0,
    icon_name: 'typescript',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    video_url: 'https://www.youtube.com/watch?v=BwuLxPH8IDs',
  },
  {
    id: 'a718b5df-fb14-41d5-86f2-bf7bc9b69f68',
    title: 'Framer Motion Essentials',
    progress: 0,
    icon_name: 'framer',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    video_url: 'https://www.youtube.com/watch?v=li0K3hazYYo',
  },
];

export async function getCourses(): Promise<Course[]> {
  if (!supabase) {
    // Return mock data for visual-only environment
    return SEED_COURSES;
  }

  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Supabase fetch failed, returning empty course list:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data as Course[];
  } catch (err) {
    console.error('Supabase connection error, returning empty course list:', err);
    return [];
  }
}
