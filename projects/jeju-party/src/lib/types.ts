export interface Party {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  region: string;
  location: string;
  maxMembers: number;
  currentMembers: number;
  costType: "split" | "free" | "fixed";
  costAmount?: number;
  hasRentalCar: boolean;
  carInfo?: string;
  equipmentNeeded?: string;
  hostName: string;
  hostRating: number;
  hostPartyCount: number;
  hostBio?: string;
  tags: string[];
  schedule?: ScheduleItem[];
  courseId?: string;
  createdAt: string;
}

export interface ScheduleItem {
  time: string;
  place: string;
  memo?: string;
}

export interface PartyFilter {
  category?: string;
  region?: string;
  date?: string;
}

export const HOBBY_CATEGORIES = [
  { id: "cycling", label: "자전거", emoji: "🚴" },
  { id: "hiking", label: "등산/트레킹", emoji: "⛰️" },
  { id: "fishing", label: "낚시", emoji: "🎣" },
  { id: "surfing", label: "서핑", emoji: "🏄" },
  { id: "running", label: "러닝/워킹", emoji: "🏃" },
  { id: "cafe", label: "카페탐방", emoji: "☕" },
  { id: "food", label: "맛집투어", emoji: "🍊" },
  { id: "photo", label: "출사/포토", emoji: "📸" },
  { id: "diving", label: "스노클링/다이빙", emoji: "🤿" },
  { id: "craft", label: "공방체험", emoji: "🎨" },
  { id: "drive", label: "드라이브", emoji: "🚗" },
  { id: "other", label: "기타", emoji: "✨" },
] as const;

export const REGIONS = [
  "제주시", "서귀포", "애월", "한림", "성산",
  "중문", "구좌", "표선", "우도", "기타",
] as const;
