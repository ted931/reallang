export interface MapCategory {
  id: string;
  label: string;
  emoji: string;
  color: string;
  contentTypeId?: string; // 한국관광공사 API 콘텐츠타입
}

export const CATEGORIES: MapCategory[] = [
  { id: "cafe", label: "카페", emoji: "☕", color: "#92400E", contentTypeId: "39" },
  { id: "restaurant", label: "맛집", emoji: "🍽️", color: "#DC2626", contentTypeId: "39" },
  { id: "stay", label: "숙박", emoji: "🏨", color: "#7C3AED", contentTypeId: "32" },
  { id: "attraction", label: "관광지", emoji: "🌋", color: "#2563EB", contentTypeId: "12" },
  { id: "activity", label: "체험", emoji: "🎯", color: "#059669", contentTypeId: "28" },
  { id: "beach", label: "해변", emoji: "🏖️", color: "#0891B2" },
  { id: "trail", label: "올레길", emoji: "🥾", color: "#65A30D" },
  { id: "cycling", label: "자전거", emoji: "🚴", color: "#EA580C" },
  { id: "fishing", label: "낚시", emoji: "🎣", color: "#1D4ED8" },
  { id: "surfing", label: "서핑", emoji: "🏄", color: "#0D9488" },
  { id: "viewpoint", label: "뷰포인트", emoji: "📸", color: "#DB2777" },
  { id: "parking", label: "주차장", emoji: "🅿️", color: "#6B7280" },
  { id: "convenience", label: "편의시설", emoji: "🏪", color: "#78716C" },
];

export interface MapPin {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
  description?: string;
  image?: string;
}

// 더미 데이터 (실제 데이터는 API에서)
export const DUMMY_PINS: MapPin[] = [
  { id: "1", name: "선셋카페", category: "cafe", lat: 33.5432, lng: 126.6698, address: "제주시 조천읍 함덕리", description: "함덕 바다 오션뷰 카페" },
  { id: "2", name: "고씨네 흑돼지", category: "restaurant", lat: 33.2490, lng: 126.4122, address: "서귀포시 중문관광로", description: "15년 전통 흑돼지 맛집" },
  { id: "3", name: "성산일출봉", category: "attraction", lat: 33.4584, lng: 126.9272, address: "서귀포시 성산읍", description: "유네스코 세계자연유산" },
  { id: "4", name: "협재해수욕장", category: "beach", lat: 33.3946, lng: 126.2398, address: "제주시 한림읍 협재리", description: "에메랄드빛 바다" },
  { id: "5", name: "돌담 베이커리", category: "cafe", lat: 33.2541, lng: 126.5600, address: "서귀포시 중앙로", description: "한라봉 크림빵" },
  { id: "6", name: "올레길 7코스", category: "trail", lat: 33.2441, lng: 126.4100, address: "서귀포시", description: "외돌개~월평 구간 11.7km" },
  { id: "7", name: "김녕해수욕장 서핑", category: "surfing", lat: 33.5577, lng: 126.7573, address: "제주시 구좌읍 김녕리", description: "초보자 서핑 스팟" },
  { id: "8", name: "월정리 해변", category: "beach", lat: 33.5558, lng: 126.7979, address: "제주시 구좌읍 월정리", description: "투명 카약, 감성 카페거리" },
  { id: "9", name: "사려니숲길", category: "trail", lat: 33.3880, lng: 126.6488, address: "제주시 조천읍", description: "비자림로 삼나무 숲길 15km" },
  { id: "10", name: "애월 해안도로", category: "cycling", lat: 33.4631, lng: 126.3313, address: "제주시 애월읍", description: "해안도로 자전거 코스" },
  { id: "11", name: "한라산 어리목", category: "attraction", lat: 33.3616, lng: 126.5292, address: "제주시 해안동", description: "한라산 등반 코스" },
  { id: "12", name: "제주스시 오마카세", category: "restaurant", lat: 33.4890, lng: 126.4932, address: "제주시 연동", description: "당일 잡은 활어 오마카세" },
  { id: "13", name: "섭지코지", category: "viewpoint", lat: 33.4313, lng: 126.9302, address: "서귀포시 성산읍", description: "드라마 촬영지, 일출 명소" },
  { id: "14", name: "쇠소깍", category: "activity", lat: 33.2518, lng: 126.6233, address: "서귀포시 하효동", description: "투명카약, 카누 체험" },
  { id: "15", name: "이호테우 해변", category: "beach", lat: 33.4978, lng: 126.4526, address: "제주시 이호동", description: "조랑말 등대, 석양 명소" },
  { id: "16", name: "제주민속촌", category: "attraction", lat: 33.3225, lng: 126.8413, address: "서귀포시 표선면", description: "제주 전통 마을 체험" },
  { id: "17", name: "중문 색달해변", category: "surfing", lat: 33.2420, lng: 126.4059, address: "서귀포시 중문동", description: "중급자 서핑 스팟" },
  { id: "18", name: "용머리해안", category: "viewpoint", lat: 33.2340, lng: 126.3130, address: "서귀포시 안덕면", description: "산방산 해안 절경" },
  { id: "19", name: "공항 주차장", category: "parking", lat: 33.5066, lng: 126.4928, address: "제주시 공항로", description: "제주공항 공영주차장" },
  { id: "20", name: "중문 관광단지 편의점", category: "convenience", lat: 33.2500, lng: 126.4100, address: "서귀포시 중문동", description: "GS25, CU" },
];
