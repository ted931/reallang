export type RentCar = {
  id: string;
  name: string;          // 차종명 (e.g. "아반떼", "투싼", "스타리아")
  type: "sedan" | "suv" | "van" | "truck";
  seats: number;
  region: string;        // 픽업 지역
  pickupSpot: string;    // 픽업 장소
  regularPrice: number;  // 정상 일일 요금 (원)
  todayPrice: number;    // 당일 할인 요금
  availableUntil: string; // 픽업 가능 시간
  features: string[];    // 특장점 태그
  fishingFriendly: boolean;
  emoji: string;
  company: string;       // 렌터카 업체명
};

export const DUMMY_RENTCAR: RentCar[] = [
  {
    id: "rc1",
    name: "아반떼",
    type: "sedan",
    seats: 5,
    region: "제주시",
    pickupSpot: "제주공항 렌터카 타운",
    regularPrice: 58000,
    todayPrice: 38000,
    availableUntil: "14:00",
    features: ["블랙박스", "후방카메라", "하이패스"],
    fishingFriendly: false,
    emoji: "🚗",
    company: "제주드라이브",
  },
  {
    id: "rc2",
    name: "투싼",
    type: "suv",
    seats: 5,
    region: "제주시",
    pickupSpot: "제주공항 렌터카 타운",
    regularPrice: 88000,
    todayPrice: 62000,
    availableUntil: "13:00",
    features: ["4WD", "블랙박스", "루프캐리어", "낚시장비 탑재가능"],
    fishingFriendly: true,
    emoji: "🚙",
    company: "섬카렌트",
  },
  {
    id: "rc3",
    name: "스타리아",
    type: "van",
    seats: 9,
    region: "서귀포",
    pickupSpot: "서귀포시청 앞",
    regularPrice: 128000,
    todayPrice: 88000,
    availableUntil: "12:00",
    features: ["대용량 트렁크", "낚시장비 탑재가능", "쿨러 적재가능", "블랙박스"],
    fishingFriendly: true,
    emoji: "🚐",
    company: "한라렌터카",
  },
  {
    id: "rc4",
    name: "소렌토",
    type: "suv",
    seats: 7,
    region: "성산",
    pickupSpot: "성산항 근처",
    regularPrice: 96000,
    todayPrice: 68000,
    availableUntil: "15:00",
    features: ["4WD", "루프캐리어", "블랙박스", "낚시장비 탑재가능"],
    fishingFriendly: true,
    emoji: "🚙",
    company: "오름카렌트",
  },
  {
    id: "rc5",
    name: "카니발",
    type: "van",
    seats: 7,
    region: "애월",
    pickupSpot: "애월읍사무소 인근",
    regularPrice: 118000,
    todayPrice: 82000,
    availableUntil: "11:00",
    features: ["대용량 트렁크", "쿨러 적재가능", "블랙박스", "낚시장비 탑재가능"],
    fishingFriendly: true,
    emoji: "🚐",
    company: "바당렌터카",
  },
  {
    id: "rc6",
    name: "아이오닉6",
    type: "sedan",
    seats: 5,
    region: "한림",
    pickupSpot: "한림항 주차장",
    regularPrice: 65000,
    todayPrice: 45000,
    availableUntil: "16:00",
    features: ["전기차", "블랙박스", "후방카메라", "하이패스"],
    fishingFriendly: false,
    emoji: "⚡",
    company: "그린카제주",
  },
  {
    id: "rc7",
    name: "팰리세이드",
    type: "suv",
    seats: 8,
    region: "모슬포",
    pickupSpot: "모슬포항 근처",
    regularPrice: 105000,
    todayPrice: 72000,
    availableUntil: "13:30",
    features: ["4WD", "루프캐리어", "대용량 트렁크", "블랙박스", "낚시장비 탑재가능"],
    fishingFriendly: true,
    emoji: "🚙",
    company: "마라도렌트",
  },
  {
    id: "rc8",
    name: "레이",
    type: "sedan",
    seats: 4,
    region: "서귀포",
    pickupSpot: "서귀포 매일올레시장 앞",
    regularPrice: 42000,
    todayPrice: 28000,
    availableUntil: "17:00",
    features: ["블랙박스", "후방카메라"],
    fishingFriendly: false,
    emoji: "🚗",
    company: "제주드라이브",
  },
];

export const REGION_LIST = ["전체", "제주시", "서귀포", "애월", "한림", "성산", "모슬포"];
export const CAR_TYPE_LABEL: Record<RentCar["type"], string> = {
  sedan: "세단",
  suv: "SUV",
  van: "승합/밴",
  truck: "화물",
};
