export type MarketCategory = "rod" | "reel" | "lure" | "line" | "hook" | "box" | "wear" | "etc";

export interface MarketItem {
  id: string;
  title: string;
  category: MarketCategory;
  price: number;
  originalPrice: number;
  condition: "S" | "A" | "B" | "C"; // S=미사용, A=상태양호, B=보통, C=하자있음
  region: string;
  sellerName: string;
  sellerAvatar: string;
  images: string[]; // emoji placeholders
  description: string;
  tags: string[];
  views: number;
  likes: number;
  status: "selling" | "reserved" | "sold";
  createdAt: string;
}

export const MARKET_CATEGORY_LABEL: Record<MarketCategory, string> = {
  rod: "낚싯대", reel: "릴", lure: "루어/미끼", line: "낚싯줄",
  hook: "바늘/채비", box: "태클박스", wear: "낚시 의류/장비", etc: "기타",
};

export const MARKET_CATEGORY_ICON: Record<MarketCategory, string> = {
  rod: "🎣", reel: "🌀", lure: "🐟", line: "🧵",
  hook: "🪝", box: "📦", wear: "🧥", etc: "📌",
};

export const CONDITION_LABEL: Record<MarketItem["condition"], { label: string; color: string }> = {
  S: { label: "미사용", color: "text-teal-300 bg-teal-900/40 border-teal-800" },
  A: { label: "상태양호", color: "text-hook bg-hook/10 border-hook/30" },
  B: { label: "보통", color: "text-slate-300 bg-slate-800 border-slate-700" },
  C: { label: "하자있음", color: "text-orange-400 bg-orange-900/30 border-orange-800" },
};

export const DUMMY_MARKET: MarketItem[] = [
  {
    id: "mk1", title: "다이와 BG 5000 릴 거의 미사용", category: "reel",
    price: 85000, originalPrice: 170000, condition: "S",
    region: "서귀포", sellerName: "갈치킹", sellerAvatar: "🎣",
    images: ["🌀", "📦"],
    description: "3개월 전 구매 후 2번 사용. 드랙 정상, 베일 이상 없음. 서귀포 직거래 우선. 택배 가능(선불).",
    tags: ["다이와", "BG5000", "스피닝릴"],
    views: 142, likes: 18, status: "selling",
    createdAt: "2026-05-08T10:00:00Z",
  },
  {
    id: "mk2", title: "시마노 솔티가 C4000XG — A급", category: "reel",
    price: 220000, originalPrice: 480000, condition: "A",
    region: "성산", sellerName: "참돔헌터", sellerAvatar: "🐟",
    images: ["🌀"],
    description: "1년 사용. 외관 미세 스크래치 있으나 기계적 이상 없음. 오버홀 완료. 케이스 포함.",
    tags: ["시마노", "솔티가", "지깅릴"],
    views: 215, likes: 32, status: "selling",
    createdAt: "2026-05-07T14:00:00Z",
  },
  {
    id: "mk3", title: "갈치 전용대 4.5m 3세트", category: "rod",
    price: 60000, originalPrice: 120000, condition: "A",
    region: "서귀포", sellerName: "야간낚시러버", sellerAvatar: "🌙",
    images: ["🎣"],
    description: "서귀포 갈치 전용으로 2시즌 사용. 가이드 이상 없음. 낚시가방 포함해서 드립니다.",
    tags: ["갈치대", "4.5m", "세트판매"],
    views: 88, likes: 11, status: "selling",
    createdAt: "2026-05-06T09:00:00Z",
  },
  {
    id: "mk4", title: "선상 루어 지깅 세트 (100g~200g 20개)", category: "lure",
    price: 35000, originalPrice: 80000, condition: "B",
    region: "모슬포", sellerName: "방어전사", sellerAvatar: "⚓",
    images: ["🐟", "📦"],
    description: "방어·부시리 지깅용. 일부 도색 벗겨짐. 무게별 다양. 케이스 포함.",
    tags: ["지깅", "방어", "루어세트"],
    views: 67, likes: 7, status: "reserved",
    createdAt: "2026-05-05T16:00:00Z",
  },
  {
    id: "mk5", title: "낚시 방수 재킷 L사이즈 미착용", category: "wear",
    price: 45000, originalPrice: 130000, condition: "S",
    region: "제주시", sellerName: "볼락마스터", sellerAvatar: "🌟",
    images: ["🧥"],
    description: "선물 받았으나 사이즈 안 맞음. 택배 가능. 브랜드: 심사노 방수 재킷 L.",
    tags: ["낚시재킷", "방수", "미착용"],
    views: 193, likes: 41, status: "selling",
    createdAt: "2026-05-04T12:00:00Z",
  },
  {
    id: "mk6", title: "PE라인 2호 200m × 3롤", category: "line",
    price: 28000, originalPrice: 60000, condition: "S",
    region: "한림", sellerName: "감성돔고수", sellerAvatar: "🎿",
    images: ["🧵"],
    description: "구매 후 사용 안 함. 전량 판매. 브랜드: 요즈리 하이드라.",
    tags: ["PE라인", "2호", "미사용"],
    views: 54, likes: 6, status: "selling",
    createdAt: "2026-05-03T18:00:00Z",
  },
  {
    id: "mk7", title: "하드 케이스 태클박스 대형", category: "box",
    price: 22000, originalPrice: 55000, condition: "B",
    region: "애월", sellerName: "벵에돔장인", sellerAvatar: "🔱",
    images: ["📦"],
    description: "외관 스크래치 있으나 잠금장치 정상. 수납 칸 많음. 직거래 선호.",
    tags: ["태클박스", "하드케이스", "대형"],
    views: 38, likes: 3, status: "selling",
    createdAt: "2026-05-02T10:00:00Z",
  },
  {
    id: "mk8", title: "갈치 채비 세트 20조 (신품)", category: "hook",
    price: 15000, originalPrice: 30000, condition: "S",
    region: "서귀포", sellerName: "갈치킹", sellerAvatar: "🎣",
    images: ["🪝"],
    description: "대형마트 세일 때 대량 구매 후 일부 판매. 1조당 750원. 택배 가능.",
    tags: ["갈치채비", "야광", "대량"],
    views: 112, likes: 14, status: "selling",
    createdAt: "2026-05-01T08:00:00Z",
  },
  {
    id: "mk9", title: "참돔 타이라바 세트 30~100g", category: "lure",
    price: 40000, originalPrice: 90000, condition: "A",
    region: "성산", sellerName: "돔브라더스", sellerAvatar: "🤝",
    images: ["🐟"],
    description: "참돔 전용 타이라바 다양한 색상 15개. 성산 직거래 또는 택배.",
    tags: ["타이라바", "참돔", "선상"],
    views: 76, likes: 9, status: "sold",
    createdAt: "2026-04-29T14:00:00Z",
  },
  {
    id: "mk10", title: "낚시 접이식 의자 + 가방 세트", category: "etc",
    price: 25000, originalPrice: 58000, condition: "A",
    region: "구좌", sellerName: "야간낚시러버", sellerAvatar: "🌙",
    images: ["📌"],
    description: "2년 사용. 의자 다리 견고. 수납 가방 포함. 구좌 직거래 또는 착불 택배.",
    tags: ["낚시의자", "접이식", "세트"],
    views: 45, likes: 5, status: "selling",
    createdAt: "2026-04-28T11:00:00Z",
  },
];
