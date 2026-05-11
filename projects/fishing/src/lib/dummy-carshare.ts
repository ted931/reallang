export interface CarShare {
  id: string;
  hostName: string;
  hostAvatar: string; // emoji
  region: string;
  departure: string; // 출발지
  destination: string; // 목적지 (포인트)
  date: string;
  time: string;
  seats: number; // 동승 가능 인원
  seatsTaken: number;
  pricePerSeat: number; // 1인당 분담금
  carType: string; // 차종
  targetFish: string[];
  note: string;
  createdAt: string;
}

export const DUMMY_CARSHARE: CarShare[] = [
  {
    id: "cs1", hostName: "갈치킹", hostAvatar: "🎣",
    region: "서귀포", departure: "제주시청 앞", destination: "서귀포 황금좌대",
    date: "2026-05-17", time: "04:00", seats: 3, seatsTaken: 1, pricePerSeat: 8000,
    carType: "카니발", targetFish: ["갈치", "참돔"],
    note: "낚싯대 고정 가능, 쿨러 공간 있음. 비흡연자 선호.",
    createdAt: "2026-05-10T10:00:00Z",
  },
  {
    id: "cs2", hostName: "참돔헌터", hostAvatar: "🐟",
    region: "성산", departure: "연동 이마트 앞", destination: "성산 일출 좌대",
    date: "2026-05-18", time: "03:30", seats: 2, seatsTaken: 0, pricePerSeat: 12000,
    carType: "스타리아", targetFish: ["참돔", "방어"],
    note: "장비 공간 넉넉. 새벽 출발이라 시간 엄수 부탁드려요.",
    createdAt: "2026-05-09T18:00:00Z",
  },
  {
    id: "cs3", hostName: "감성돔고수", hostAvatar: "🎿",
    region: "한림", departure: "노형 롯데마트", destination: "한림 애월 좌대",
    date: "2026-05-20", time: "05:00", seats: 2, seatsTaken: 1, pricePerSeat: 7000,
    carType: "소렌토", targetFish: ["감성돔"],
    note: "여성 동승자 환영. 낚시 초보도 OK!",
    createdAt: "2026-05-08T12:00:00Z",
  },
  {
    id: "cs4", hostName: "방어전사", hostAvatar: "⚓",
    region: "모슬포", departure: "제주공항 3번 출구", destination: "모슬포 방파제 좌대",
    date: "2026-05-22", time: "04:30", seats: 4, seatsTaken: 2, pricePerSeat: 10000,
    carType: "그랜드스타렉스", targetFish: ["방어", "부시리"],
    note: "제주 상경객 환영. 공항 픽업 가능.",
    createdAt: "2026-05-07T09:00:00Z",
  },
  {
    id: "cs5", hostName: "벵에돔장인", hostAvatar: "🔱",
    region: "구좌", departure: "함덕 해수욕장 주차장", destination: "구좌 동복 좌대",
    date: "2026-05-24", time: "05:30", seats: 2, seatsTaken: 0, pricePerSeat: 6000,
    carType: "투싼", targetFish: ["벵에돔", "볼락"],
    note: "빈 좌석 2개. 부드러운 드라이브 보장 😄",
    createdAt: "2026-05-06T14:00:00Z",
  },
  {
    id: "cs6", hostName: "야간낚시러버", hostAvatar: "🌙",
    region: "서귀포", departure: "서귀포 매일올레시장", destination: "서귀포 야간 갈치 좌대",
    date: "2026-05-25", time: "17:00", seats: 3, seatsTaken: 2, pricePerSeat: 5000,
    carType: "카니발", targetFish: ["갈치"],
    note: "야간 출조. 헤드랜턴 필수. 편의점 들를게요.",
    createdAt: "2026-05-05T11:00:00Z",
  },
  {
    id: "cs7", hostName: "볼락마스터", hostAvatar: "🌟",
    region: "애월", departure: "애월읍사무소", destination: "애월 곽지 좌대",
    date: "2026-05-26", time: "05:00", seats: 3, seatsTaken: 1, pricePerSeat: 5000,
    carType: "트래버스", targetFish: ["볼락", "벵에돔"],
    note: "조용히 집중하는 낚시 선호. 말 많이 안 해도 됩니다 😊",
    createdAt: "2026-05-04T16:00:00Z",
  },
  {
    id: "cs8", hostName: "돔브라더스", hostAvatar: "🤝",
    region: "성산", departure: "성산항 공영주차장", destination: "성산 오조리 바다낚시터",
    date: "2026-05-28", time: "06:00", seats: 2, seatsTaken: 0, pricePerSeat: 4000,
    carType: "아반떼", targetFish: ["참돔", "감성돔"],
    note: "당일 치기. 오후 3시 복귀 예정.",
    createdAt: "2026-05-03T10:00:00Z",
  },
];
