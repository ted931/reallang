export type SpotType = "방파제" | "갯바위" | "좌대" | "선상" | "기수역" | "해안";
export type FishingMethod = "찌낚시" | "루어" | "원투" | "선상" | "좌대낚시" | "생미끼";
export type AuthorLevel = "초보" | "중급" | "고수" | "프로";
export type PostCategory = "자유" | "질문" | "장터" | "조황" | "후기";
export type CatchRate = "상" | "중" | "하";
export type Difficulty = "쉬움" | "보통" | "어려움";
export type CostType = "free" | "split" | "fixed";

export interface WeatherInfo {
  condition: "맑음" | "흐림" | "비" | "바람";
  windSpeed: string;
  waveHeight: string;
  temp: number;
}

export interface CatchItem {
  fishName: string;
  size: string;
  count: number;
  note?: string;
}

export interface CatchReport {
  id: string;
  authorName: string;
  authorLevel: AuthorLevel;
  location: string;
  region: string;
  spotType: SpotType;
  fishingMethod: FishingMethod;
  catches: CatchItem[];
  weather: WeatherInfo;
  tidePhase: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface Jwaedae {
  id: string;
  name: string;
  region: string;
  location: string;
  operatorName: string;
  operatorPhone: string;
  description: string;
  targetFish: string[];
  facilities: string[];
  priceDay: number;
  priceNight?: number;
  capacity: number;
  availableSeats: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  transportInfo: string;
  bestSeason: string[];
  catchRate: CatchRate;
  hasAccommodation: boolean;
  schedule: string;
  createdAt: string;
}

export interface FishingGathering {
  id: string;
  title: string;
  hostName: string;
  hostRating: number;
  hostCatchCount: number;
  region: string;
  location: string;
  spotType: SpotType;
  targetFish: string[];
  fishingMethod: FishingMethod;
  date: string;
  time: string;
  maxMembers: number;
  currentMembers: number;
  costType: CostType;
  costAmount?: number;
  costNote?: string;
  equipmentProvided: boolean;
  beginnerWelcome: boolean;
  description: string;
  tags: string[];
  createdAt: string;
}

export type ClubLevel = "입문" | "중급" | "고급" | "전체";

export interface FishingClub {
  id: string;
  name: string;
  region: string;
  specialty: string;
  memberCount: number;
  maxMembers: number;
  meetingFrequency: string;
  level: ClubLevel;
  fishTypes: string[];
  activities: string[];
  description: string;
  monthlyFee: number;
  nextOuting: string;
  openRecruiting: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  category: PostCategory;
  title: string;
  content: string;
  authorName: string;
  authorLevel: AuthorLevel;
  region?: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isPinned?: boolean;
  createdAt: string;
}

export interface FishingPoint {
  id: string;
  name: string;
  region: string;
  spotType: SpotType;
  lat: number;
  lng: number;
  targetFish: string[];
  difficulty: Difficulty;
  description: string;
  recentCatchCount: number;
  rating: number;
}
