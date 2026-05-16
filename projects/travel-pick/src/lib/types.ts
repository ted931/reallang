export interface PreferenceProfile {
  waitTolerance: number;       // 0~100  (0=즉시, 100=1시간 OK)
  crowdTolerance: number;      // 0~100  (0=조용, 100=북적)
  sceneryVsFood: number;       // 0=경치, 100=맛
  activityLevel: number;       // 0~100  (0=휴식, 100=액티비티)
  transportMode: "car" | "transit" | "walk";
  companion: "solo" | "couple" | "family" | "friends" | "parents";
}

export interface Place {
  id: string;
  name: string;
  category: "restaurant" | "cafe" | "attraction" | "viewpoint" | "beach" | "activity";
  lat: number;
  lng: number;
  address: string;
  image: string;
  description: string;
  tags: string[];
  avgWaitMinutes: number;
  crowdScore: number;       // 1~5
  sceneryScore: number;     // 1~5
  foodScore: number;        // 1~5
  activityScore: number;    // 1~5
  parkingEase: "easy" | "medium" | "hard";
  childFriendly: boolean;
  operatingHours: string;
  priceRange: "₩" | "₩₩" | "₩₩₩";
}

export interface CourseStop {
  place: Place;
  order: number;
  note?: string;
  duration: number; // 분
}

export interface SavedCourse {
  id: string;
  name: string;
  days: number;
  stops: CourseStop[];
  preference: PreferenceProfile;
  shareToken: string;
  createdAt: string;
}

export type PersonaType = "미식가" | "관광객" | "힐링러" | "가족여행자";

export interface PersonaResult {
  type: PersonaType;
  label: string;
  emoji: string;
  description: string;
  color: string;
}
