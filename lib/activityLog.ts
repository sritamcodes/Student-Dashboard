import { Course } from '@/types/course';

const STORAGE_KEY = 'nexus_activity_log';

export type ActivityEvent = {
  id: string;
  date: string;
  courseId: string;
  courseTitle: string;
  progressDelta: number;
  timestamp: string;
};

const getDateKey = (date = new Date()) => date.toISOString().slice(0, 10);

export function loadActivityLog(): ActivityEvent[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ActivityEvent[]) : [];
  } catch {
    return [];
  }
}

export function saveActivityLog(events: ActivityEvent[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new CustomEvent('nexus-activity-log-updated'));
  } catch {
    // ignore storage errors
  }
}

export function addActivityEvent(course: Course, progressDelta: number) {
  if (typeof window === 'undefined' || progressDelta <= 0) {
    return;
  }

  const date = getDateKey();
  const existing = loadActivityLog();
  const event: ActivityEvent = {
    id: `${course.id}-${date}-${Date.now()}`,
    date,
    courseId: course.id,
    courseTitle: course.title,
    progressDelta,
    timestamp: new Date().toISOString(),
  };

  saveActivityLog([...existing, event]);
}

export function getActivitySummary(events: ActivityEvent[]) {
  const todayKey = getDateKey();
  const todayEvents = events.filter((event) => event.date === todayKey);
  const totalToday = todayEvents.length;
  const courseTitles = Array.from(new Set(todayEvents.map((event) => event.courseTitle)));

  if (totalToday > 0) {
    if (totalToday === 1) {
      return `Today you marked one lesson complete in ${courseTitles[0]}.`;
    }
    return `Today you marked ${totalToday} lessons complete across ${courseTitles.length} course${courseTitles.length === 1 ? '' : 's'}.`;
  }

  if (events.length === 0) {
    return 'No learning activity yet. Start a course to create your first heatmap entry.';
  }

  const latestEvent = [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
  return `Last activity was on ${new Date(latestEvent.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}.`;
}

export function getActivityMap(events: ActivityEvent[]) {
  return events.reduce<Record<string, number>>((map, event) => {
    map[event.date] = (map[event.date] ?? 0) + 1;
    return map;
  }, {});
}

export type WeeklyPresenceDay = {
  label: string;
  dateKey: string;
  formattedDate: string;
  count: number;
  isToday: boolean;
  isFuture: boolean;
};

export function buildWeeklyPresence(events: ActivityEvent[]) {
  const now = new Date();
  const todayKey = getDateKey(now);
  const eventMap = getActivityMap(events);

  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() + (dayOfWeek === 0 ? -6 : 1 - dayOfWeek));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateKey = getDateKey(date);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index],
      dateKey,
      formattedDate,
      count: eventMap[dateKey] ?? 0,
      isToday: dateKey === todayKey,
      isFuture: dateKey > todayKey,
    };
  });
}

export function buildActivityGrid(events: ActivityEvent[]) {
  const rows: { id: string; intensity: 0 | 1 | 2 | 3 | 4; date: string; dateKey: string; count: number; isToday: boolean }[][] =
    Array.from({ length: 7 }, () => []);
  const eventMap = getActivityMap(events);
  const now = new Date();
  const todayKey = getDateKey(now);

  for (let index = 0; index < 168; index += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() - (167 - index));
    const dateKey = getDateKey(date);
    const count = eventMap[dateKey] ?? 0;
    const weekday = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6

    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 5) intensity = 4;
    else if (count >= 3) intensity = 3;
    else if (count >= 2) intensity = 2;
    else if (count === 1) intensity = 1;

    rows[weekday].push({
      id: `${dateKey}-${weekday}`,
      intensity,
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      dateKey,
      count,
      isToday: dateKey === todayKey,
    });
  }

  return rows;
}
