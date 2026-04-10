/**
 * sessionStorage 기반 탭 간 데이터 공유 유틸리티
 * 날씨 → 코스 → 플래너 → 지도 순서로 데이터가 전달됨
 */

const KEYS = {
  WEATHER: "jt_weather",
  COURSE: "jt_course",
  PLAN: "jt_plan",
} as const;

// ── 날씨 요약 ──
export interface WeatherSummary {
  sunnyAreas: string[];
  rainyAreas: string[];
  avgTemp: number;
  updatedAt: string;
}

export function saveWeather(data: WeatherSummary) {
  try {
    sessionStorage.setItem(KEYS.WEATHER, JSON.stringify(data));
  } catch {}
}

export function loadWeather(): WeatherSummary | null {
  try {
    const raw = sessionStorage.getItem(KEYS.WEATHER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── 선택된 코스 ──
export interface SelectedCourse {
  name: string;
  days: number;
  totalCost: number;
  companions: string;
  themes: string[];
  spots: { name: string; lat?: number; lng?: number; category: string }[];
}

export function saveCourse(data: SelectedCourse) {
  try {
    sessionStorage.setItem(KEYS.COURSE, JSON.stringify(data));
  } catch {}
}

export function loadCourse(): SelectedCourse | null {
  try {
    const raw = sessionStorage.getItem(KEYS.COURSE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── 생성된 일정 ──
export interface SavedPlan {
  title: string;
  nights: number;
  spots: { name: string; lat?: number; lng?: number; category: string; day: number }[];
}

export function savePlan(data: SavedPlan) {
  try {
    sessionStorage.setItem(KEYS.PLAN, JSON.stringify(data));
  } catch {}
}

export function loadPlan(): SavedPlan | null {
  try {
    const raw = sessionStorage.getItem(KEYS.PLAN);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
