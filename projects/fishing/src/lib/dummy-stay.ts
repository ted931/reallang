export interface Stay {
  id: string;
  name: string;
  type: "pension" | "minbak" | "guesthouse" | "camping";
  region: string;
  address: string;
  pricePerNight: number;
  capacity: number;
  rooms: number;
  amenities: string[]; // 어구세척, 냉동보관, 주차 등
  targetFish: string[]; // 인근 포인트 대상어
  nearbySpot: string; // 인근 포인트 이름
  distanceToSpot: string; // 포인트까지 거리
  hostName: string;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[]; // emoji placeholders
  tags: string[];
}

export const STAY_TYPE_LABEL: Record<Stay["type"], string> = {
  pension: "낚시 펜션",
  minbak: "민박",
  guesthouse: "게스트하우스",
  camping: "캠핑장",
};

export const DUMMY_STAY: Stay[] = [
  {
    id: "st1", name: "서귀포 바다낚시 펜션", type: "pension",
    region: "서귀포", address: "서귀포시 서홍동 해안로 1",
    pricePerNight: 120000, capacity: 8, rooms: 3,
    amenities: ["어구세척장", "냉동보관", "주차", "바베큐", "조식제공"],
    targetFish: ["갈치", "참돔", "감성돔"],
    nearbySpot: "서귀포 황금좌대", distanceToSpot: "도보 5분",
    hostName: "김서귀포", rating: 4.8, reviewCount: 47,
    description: "서귀포 황금좌대 바로 옆 낚시 전문 펜션. 어구 세척장 완비, 냉동 보관 서비스 제공. 새벽 출조 시 픽업 서비스 가능.",
    images: ["🏠", "🌊", "🎣"],
    tags: ["좌대바로옆", "새벽픽업", "어구보관"],
  },
  {
    id: "st2", name: "모슬포 낚시꾼 게스트하우스", type: "guesthouse",
    region: "모슬포", address: "서귀포시 대정읍 모슬포리 해안길 22",
    pricePerNight: 45000, capacity: 12, rooms: 6,
    amenities: ["어구보관", "주차", "공용주방", "세탁기"],
    targetFish: ["방어", "부시리", "참돔"],
    nearbySpot: "모슬포 방파제 좌대", distanceToSpot: "차량 3분",
    hostName: "이모슬포", rating: 4.6, reviewCount: 89,
    description: "1인실부터 도미토리까지. 낚시꾼을 위한 새벽 조용한 입·퇴실. 방어 시즌 10-12월 예약 필수!",
    images: ["🏡", "🐟", "🌅"],
    tags: ["저렴", "1인가능", "방어포인트"],
  },
  {
    id: "st3", name: "성산 일출 낚시 펜션", type: "pension",
    region: "성산", address: "서귀포시 성산읍 오조리 해변길 8",
    pricePerNight: 150000, capacity: 10, rooms: 4,
    amenities: ["어구세척장", "냉동보관", "주차", "바베큐", "회뜨기서비스"],
    targetFish: ["참돔", "반열기", "방어"],
    nearbySpot: "성산 일출 좌대", distanceToSpot: "도보 10분",
    hostName: "박성산", rating: 4.9, reviewCount: 63,
    description: "성산일출봉 전망 낚시 펜션. 잡은 고기 회뜨기 서비스 무료 제공. 일출 낚시 패키지 상품 운영 중.",
    images: ["🌄", "🏠", "🐟"],
    tags: ["일출뷰", "회뜨기무료", "패키지"],
  },
  {
    id: "st4", name: "한림 감성돔 민박", type: "minbak",
    region: "한림", address: "제주시 한림읍 수원리 포구길 5",
    pricePerNight: 60000, capacity: 6, rooms: 2,
    amenities: ["어구보관", "주차", "조식제공"],
    targetFish: ["감성돔", "벵에돔"],
    nearbySpot: "한림 애월 좌대", distanceToSpot: "차량 5분",
    hostName: "강한림", rating: 4.5, reviewCount: 32,
    description: "어촌 민박 특유의 정겨운 분위기. 주인장이 직접 낚시 포인트 안내. 조식은 직접 담근 갈치조림!",
    images: ["🏘️", "🎣", "🍱"],
    tags: ["어촌정겨움", "포인트안내", "갈치조림조식"],
  },
  {
    id: "st5", name: "애월 낚시캠핑장", type: "camping",
    region: "애월", address: "제주시 애월읍 곽지리 해안로 55",
    pricePerNight: 30000, capacity: 20, rooms: 10,
    amenities: ["어구세척장", "주차", "샤워실", "바베큐", "전기"],
    targetFish: ["볼락", "벵에돔", "감성돔"],
    nearbySpot: "애월 곽지 좌대", distanceToSpot: "도보 3분",
    hostName: "캠핑요정", rating: 4.4, reviewCount: 128,
    description: "해변 바로 앞 낚시 캠핑장. 텐트 자리 예약 가능. 바베큐 그릴 무료 대여. 밤에 볼락 야간 낚시 명소!",
    images: ["⛺", "🌊", "🔥"],
    tags: ["캠핑", "해변바로앞", "야간볼락"],
  },
  {
    id: "st6", name: "구좌 동복 낚시 펜션", type: "pension",
    region: "구좌", address: "제주시 구좌읍 동복리 해변길 12",
    pricePerNight: 100000, capacity: 8, rooms: 3,
    amenities: ["어구세척장", "냉동보관", "주차", "낚시용품대여"],
    targetFish: ["벵에돔", "볼락", "참돔"],
    nearbySpot: "구좌 동복 좌대", distanceToSpot: "도보 7분",
    hostName: "오구좌", rating: 4.7, reviewCount: 41,
    description: "낚시 용품 대여 서비스 운영. 장비 없이 와도 OK! 구좌 동복 좌대 바우처 10% 할인 제공.",
    images: ["🏠", "🎣", "🌊"],
    tags: ["장비대여", "바우처할인", "초보환영"],
  },
];

// 숙소 공유 (stay share) - 방이 남아서 공유하는 케이스
export interface StayShare {
  id: string;
  stayName: string;
  region: string;
  date: string;
  availableSeats: number; // 남은 자리
  pricePerPerson: number; // 1인당 분담금
  hostName: string;
  hostAvatar: string;
  targetFish: string[];
  note: string;
}

export const DUMMY_STAY_SHARE: StayShare[] = [
  {
    id: "ss1", stayName: "서귀포 바다낚시 펜션", region: "서귀포",
    date: "2026-05-17", availableSeats: 2, pricePerPerson: 40000,
    hostName: "갈치킹", hostAvatar: "🎣",
    targetFish: ["갈치", "참돔"],
    note: "4인 예약인데 2자리 남아요. 내일 새벽 출조 같이 가실 분!",
  },
  {
    id: "ss2", stayName: "성산 일출 낚시 펜션", region: "성산",
    date: "2026-05-20", availableSeats: 1, pricePerPerson: 50000,
    hostName: "참돔헌터", hostAvatar: "🐟",
    targetFish: ["참돔", "반열기"],
    note: "혼자 쓰기 아까워서 공유해요. 4인실 1자리 남습니다.",
  },
  {
    id: "ss3", stayName: "애월 낚시캠핑장", region: "애월",
    date: "2026-05-22", availableSeats: 3, pricePerPerson: 12000,
    hostName: "볼락마스터", hostAvatar: "🌟",
    targetFish: ["볼락", "벵에돔"],
    note: "대형 텐트 자리 공유. 조용한 분들 환영!",
  },
];
