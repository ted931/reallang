export interface CafePass {
  id: string;
  type: "unlimited" | "cup";
  name: string;
  price: number;
  unitPrice?: number;
  duration?: string;
  count?: number;
  popular?: boolean;
  desc: string;
}

export interface CafeTour {
  id: string;
  title: string;
  region: string;
  cafes: CafeTourStop[];
  totalTime: string;
  distance: string;
  desc: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  image: string;
}

export interface CafeTourStop {
  name: string;
  specialty: string;
  stayMin: number;
  note?: string;
}

export const CAFE_PASSES: CafePass[] = [
  {
    id: "pass-3d",
    type: "unlimited",
    name: "3일 프리미엄",
    price: 14900,
    duration: "사용시작한 날로부터 3일",
    popular: true,
    desc: "이용권 기간 내에 3시간마다 기본 음료 1잔 무제한 이용 가능",
  },
  {
    id: "pass-5d",
    type: "unlimited",
    name: "5일 프리미엄",
    price: 19900,
    duration: "사용시작한 날로부터 5일",
    desc: "이용권 기간 내에 3시간마다 기본 음료 1잔 무제한 이용 가능",
  },
  {
    id: "pass-3c",
    type: "cup",
    name: "3잔",
    price: 9900,
    unitPrice: 3300,
    count: 3,
    desc: "필요한 만큼만 구매해서 30일 이내에 이용 가능",
  },
  {
    id: "pass-5c",
    type: "cup",
    name: "5잔",
    price: 15500,
    unitPrice: 3100,
    count: 5,
    desc: "필요한 만큼만 구매해서 30일 이내에 이용 가능",
  },
];

export const CAFE_TOURS: CafeTour[] = [
  {
    id: "ct1",
    title: "애월 감성 카페 5곳 코스",
    region: "애월",
    cafes: [
      { name: "카페 델문도", specialty: "바다뷰 아메리카노", stayMin: 30, note: "오션뷰 1열 자리 추천" },
      { name: "봄날", specialty: "귤라떼", stayMin: 25 },
      { name: "어도어하우스", specialty: "유기농 말차라떼", stayMin: 30, note: "제주 감귤밭 뷰" },
      { name: "레이지펌프", specialty: "코코넛 라떼", stayMin: 25 },
      { name: "해녀의부엌 카페", specialty: "해녀 에스프레소", stayMin: 30, note: "해녀 체험 가능" },
    ],
    totalTime: "약 3시간",
    distance: "12km (차량 10분 간격)",
    desc: "애월 해안도로를 따라 오션뷰 카페 5곳을 돌아보는 코스. 감성 사진 맛집만 엄선했어요.",
    tags: ["오션뷰", "감성카페", "애월", "사진맛집"],
    rating: 4.8,
    reviewCount: 124,
    image: "🌊",
  },
  {
    id: "ct2",
    title: "서귀포 숨은 로컬 카페 투어",
    region: "서귀포",
    cafes: [
      { name: "카페소롱", specialty: "한라봉 에이드", stayMin: 30, note: "서귀포 올레시장 근처" },
      { name: "이니스프리 제주하우스", specialty: "그린티 세트", stayMin: 35 },
      { name: "빈브라더스 서귀포", specialty: "싱글오리진 핸드드립", stayMin: 25, note: "로스터리 카페" },
      { name: "풍림다원", specialty: "제주 녹차", stayMin: 30, note: "전통 다원 체험" },
    ],
    totalTime: "약 2.5시간",
    distance: "8km (도보 가능 구간 포함)",
    desc: "관광객은 모르는 서귀포 로컬 감성 카페들. 올레시장 점심 후 카페 호핑 추천!",
    tags: ["로컬카페", "서귀포", "핸드드립", "녹차"],
    rating: 4.6,
    reviewCount: 87,
    image: "🍊",
  },
  {
    id: "ct3",
    title: "한림·협재 바다 카페 코스",
    region: "한림",
    cafes: [
      { name: "카페 공백", specialty: "씨솔트 라떼", stayMin: 30, note: "협재 해변 도보 1분" },
      { name: "러스틱카페", specialty: "당근케이크 + 아메리카노", stayMin: 25 },
      { name: "세인트26", specialty: "바닐라 플랫화이트", stayMin: 30, note: "금능해변 뷰" },
      { name: "해변일기", specialty: "제주 감귤 스무디", stayMin: 25 },
      { name: "수우카페", specialty: "흑임자 라떼", stayMin: 30, note: "한옥 분위기" },
    ],
    totalTime: "약 3시간",
    distance: "6km (해변 도보 이동 가능)",
    desc: "협재·금능 해변을 걸으며 카페 호핑. 에메랄드빛 바다 + 커피 조합은 제주에서만!",
    tags: ["협재", "해변카페", "도보가능", "에메랄드"],
    rating: 4.9,
    reviewCount: 156,
    image: "🏖️",
  },
  {
    id: "ct4",
    title: "구좌·세화 감성 투어",
    region: "구좌",
    cafes: [
      { name: "델피노", specialty: "플랫화이트", stayMin: 25, note: "세화해변 정면 뷰" },
      { name: "카페 공천포", specialty: "딸기 라떼", stayMin: 30 },
      { name: "울트라마린", specialty: "바다색 에이드", stayMin: 25, note: "인스타 핫플" },
      { name: "세화 아날로그", specialty: "드립커피 + 당근케이크", stayMin: 30 },
    ],
    totalTime: "약 2시간",
    distance: "5km (세화리 내 도보)",
    desc: "세화해변 따라 걷는 카페 투어. 플리마켓 날이면 보너스!",
    tags: ["세화", "감성", "플리마켓", "인스타"],
    rating: 4.7,
    reviewCount: 98,
    image: "📸",
  },
];
