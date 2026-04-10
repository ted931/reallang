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

// 추가 더미 데이터 (카테고리별 충분한 수량)
export const EXTRA_PINS: MapPin[] = [
  // 카페 추가
  { id: "c1", name: "카페 진정성 종점", category: "cafe", lat: 33.5120, lng: 126.5280, address: "제주시 서해안로 124", description: "밀크티 맛집, 건축 감성" },
  { id: "c2", name: "봄날 카페", category: "cafe", lat: 33.2480, lng: 126.5650, address: "서귀포시 월평동", description: "서귀포 올레길 카페거리" },
  { id: "c3", name: "애월 몽상드애월", category: "cafe", lat: 33.4650, lng: 126.3350, address: "제주시 애월읍", description: "GD 카페로 유명한 오션뷰" },
  { id: "c4", name: "하이엔드 제주", category: "cafe", lat: 33.5100, lng: 126.5350, address: "제주시 탑동", description: "바다 앞 브레드 카페" },
  { id: "c5", name: "수풍석 카페", category: "cafe", lat: 33.2400, lng: 126.4050, address: "서귀포시 중문동", description: "주상절리 뷰 카페" },
  // 맛집 추가
  { id: "r1", name: "우진해장국", category: "restaurant", lat: 33.5150, lng: 126.5250, address: "제주시 삼도2동", description: "몸국 원조 맛집" },
  { id: "r2", name: "자매국수", category: "restaurant", lat: 33.2520, lng: 126.5580, address: "서귀포시 서귀동", description: "고기국수 원조" },
  { id: "r3", name: "올래국수", category: "restaurant", lat: 33.5110, lng: 126.5200, address: "제주시 귀아랑길", description: "줄 서서 먹는 고기국수" },
  { id: "r4", name: "색달식당", category: "restaurant", lat: 33.2450, lng: 126.4080, address: "서귀포시 중문동", description: "갈치조림 맛집" },
  { id: "r5", name: "흑돈가", category: "restaurant", lat: 33.4600, lng: 126.3300, address: "제주시 애월읍", description: "애월 흑돼지 전문" },
  // 숙박 추가
  { id: "s1", name: "제주신라호텔", category: "stay", lat: 33.2470, lng: 126.4090, address: "서귀포시 중문동", description: "중문 5성급 리조트" },
  { id: "s2", name: "롯데호텔 제주", category: "stay", lat: 33.2500, lng: 126.4130, address: "서귀포시 중문동", description: "헬로키티 뮤지엄 옆" },
  { id: "s3", name: "해비치호텔", category: "stay", lat: 33.3200, lng: 126.8300, address: "서귀포시 표선면", description: "동쪽 해안 리조트" },
  { id: "s4", name: "히든클리프호텔", category: "stay", lat: 33.2430, lng: 126.3800, address: "서귀포시 안덕면", description: "절벽 위 부티크 호텔" },
  { id: "s5", name: "제주 에어시티호텔", category: "stay", lat: 33.5050, lng: 126.4950, address: "제주시 공항로", description: "공항 도보 5분" },
  // 관광지 추가
  { id: "a1", name: "천지연폭포", category: "attraction", lat: 33.2470, lng: 126.5550, address: "서귀포시 천지동", description: "야간 조명이 아름다운 폭포" },
  { id: "a2", name: "정방폭포", category: "attraction", lat: 33.2440, lng: 126.5720, address: "서귀포시 동홍동", description: "바다로 떨어지는 폭포" },
  { id: "a3", name: "만장굴", category: "attraction", lat: 33.5280, lng: 126.7710, address: "제주시 구좌읍", description: "유네스코 용암동굴" },
  { id: "a4", name: "한림공원", category: "attraction", lat: 33.4050, lng: 126.2400, address: "제주시 한림읍", description: "식물원+동굴+민속촌" },
  { id: "a5", name: "에코랜드", category: "attraction", lat: 33.4530, lng: 126.6600, address: "제주시 조천읍", description: "기차 타고 곶자왈 탐험" },
  // 해변 추가
  { id: "b1", name: "금능해수욕장", category: "beach", lat: 33.3930, lng: 126.2350, address: "제주시 한림읍", description: "에메랄드빛 협재 옆 해변" },
  { id: "b2", name: "곽지해수욕장", category: "beach", lat: 33.4520, lng: 126.3100, address: "제주시 애월읍", description: "노천탕이 있는 해변" },
  { id: "b3", name: "중문색달해변", category: "beach", lat: 33.2420, lng: 126.4060, address: "서귀포시 중문동", description: "서핑 명소" },
  { id: "b4", name: "표선해수욕장", category: "beach", lat: 33.3250, lng: 126.8280, address: "서귀포시 표선면", description: "조개껍데기 해변" },
  { id: "b5", name: "세화해변", category: "beach", lat: 33.5350, lng: 126.8580, address: "제주시 구좌읍", description: "벽화마을+핸드메이드 시장" },
  // 올레길 추가
  { id: "t1", name: "올레길 1코스", category: "trail", lat: 33.4560, lng: 126.9280, address: "서귀포시 성산읍", description: "시흥→광치기 15.1km" },
  { id: "t2", name: "올레길 6코스", category: "trail", lat: 33.2400, lng: 126.4200, address: "서귀포시 중문동", description: "쇠소깍→천제연 14.4km" },
  { id: "t3", name: "올레길 10코스", category: "trail", lat: 33.2300, lng: 126.3200, address: "서귀포시 안덕면", description: "화순→모슬포 15.5km" },
  { id: "t4", name: "올레길 15코스", category: "trail", lat: 33.4600, lng: 126.3200, address: "제주시 애월읍", description: "한림→곽지 19.5km" },
  { id: "t5", name: "비자림로 숲길", category: "trail", lat: 33.4800, lng: 126.7500, address: "제주시 구좌읍", description: "천연기념물 비자나무 숲" },
  // 서핑 추가
  { id: "sf1", name: "이호테우 서핑", category: "surfing", lat: 33.4978, lng: 126.4526, address: "제주시 이호동", description: "초보자 서핑 교실" },
  { id: "sf2", name: "협재 서핑", category: "surfing", lat: 33.3946, lng: 126.2398, address: "제주시 한림읍", description: "맑은 물 서핑" },
  { id: "sf3", name: "월정리 서핑", category: "surfing", lat: 33.5558, lng: 126.7979, address: "제주시 구좌읍", description: "SUP+서핑 인기" },
  { id: "sf4", name: "표선 서핑", category: "surfing", lat: 33.3250, lng: 126.8280, address: "서귀포시 표선면", description: "한적한 서핑 스팟" },
  { id: "sf5", name: "사계 서핑", category: "surfing", lat: 33.2280, lng: 126.3080, address: "서귀포시 안덕면", description: "산방산 뷰 서핑" },
  // 뷰포인트 추가
  { id: "v1", name: "새별오름", category: "viewpoint", lat: 33.3630, lng: 126.3380, address: "제주시 한림읍", description: "일몰 명소 오름" },
  { id: "v2", name: "다랑쉬오름", category: "viewpoint", lat: 33.4650, lng: 126.8350, address: "제주시 구좌읍", description: "제주 10대 오름" },
  { id: "v3", name: "송악산", category: "viewpoint", lat: 33.2150, lng: 126.2900, address: "서귀포시 대정읍", description: "마라도 뷰+해안절벽" },
  { id: "v4", name: "수월봉", category: "viewpoint", lat: 33.3000, lng: 126.1700, address: "제주시 한경면", description: "유네스코 지질공원 뷰" },
  { id: "v5", name: "도두봉", category: "viewpoint", lat: 33.5100, lng: 126.4700, address: "제주시 도두동", description: "공항 근처 일몰 스팟" },
  // 낚시 추가
  { id: "f1", name: "도두항 낚시", category: "fishing", lat: 33.5080, lng: 126.4680, address: "제주시 도두동", description: "방파제 낚시 포인트" },
  { id: "f2", name: "한림항 낚시", category: "fishing", lat: 33.4150, lng: 126.2600, address: "제주시 한림읍", description: "볼락·우럭 포인트" },
  { id: "f3", name: "서귀포항 낚시", category: "fishing", lat: 33.2400, lng: 126.5600, address: "서귀포시", description: "다금바리 낚시" },
  { id: "f4", name: "모슬포항 낚시", category: "fishing", lat: 33.2200, lng: 126.2500, address: "서귀포시 대정읍", description: "대물 낚시 출항지" },
  { id: "f5", name: "추자도 낚시", category: "fishing", lat: 33.9500, lng: 126.2800, address: "제주시 추자면", description: "참돔·방어 원정" },
  // 자전거 추가
  { id: "cy1", name: "용머리해안 코스", category: "cycling", lat: 33.2340, lng: 126.3130, address: "서귀포시 안덕면", description: "해안도로 자전거길" },
  { id: "cy2", name: "한라산 둘레길", category: "cycling", lat: 33.3800, lng: 126.5500, address: "제주시", description: "산간 자전거 코스" },
  { id: "cy3", name: "월정리~세화 해안", category: "cycling", lat: 33.5450, lng: 126.8200, address: "제주시 구좌읍", description: "동쪽 해안 라이딩" },
  { id: "cy4", name: "서귀포 해안도로", category: "cycling", lat: 33.2380, lng: 126.5000, address: "서귀포시", description: "남쪽 해안 자전거길" },
  { id: "cy5", name: "성산~우도 페리", category: "cycling", lat: 33.4700, lng: 126.9400, address: "서귀포시 성산읍", description: "우도 자전거 일주" },
  // 체험 추가
  { id: "ac1", name: "감귤따기 체험", category: "activity", lat: 33.2900, lng: 126.6000, address: "서귀포시 남원읍", description: "10~1월 감귤 수확 체험" },
  { id: "ac2", name: "승마체험 렛츠런파크", category: "activity", lat: 33.4000, lng: 126.4500, address: "제주시 조천읍", description: "한라산 배경 승마" },
  { id: "ac3", name: "제주유리의성", category: "activity", lat: 33.3100, lng: 126.2500, address: "제주시 한경면", description: "유리공예 체험" },
  { id: "ac4", name: "서핑교실 김녕", category: "activity", lat: 33.5577, lng: 126.7573, address: "제주시 구좌읍", description: "초보자 서핑 레슨" },
  { id: "ac5", name: "카약 쇠소깍", category: "activity", lat: 33.2518, lng: 126.6233, address: "서귀포시 하효동", description: "투명카약 체험" },
  // 주차장 추가
  { id: "pk1", name: "성산일출봉 주차장", category: "parking", lat: 33.4590, lng: 126.9300, address: "서귀포시 성산읍", description: "유료 1,000원" },
  { id: "pk2", name: "협재해변 공영주차장", category: "parking", lat: 33.3950, lng: 126.2380, address: "제주시 한림읍", description: "무료" },
  { id: "pk3", name: "중문관광단지 주차장", category: "parking", lat: 33.2510, lng: 126.4110, address: "서귀포시 중문동", description: "유료 2,000원" },
  { id: "pk4", name: "월정리 공영주차장", category: "parking", lat: 33.5560, lng: 126.7980, address: "제주시 구좌읍", description: "무료, 성수기 만차" },
  { id: "pk5", name: "한라산 어리목 주차장", category: "parking", lat: 33.3620, lng: 126.5290, address: "제주시", description: "무료, 새벽 도착 추천" },
  // 편의시설 추가
  { id: "cv1", name: "제주공항 편의점", category: "convenience", lat: 33.5066, lng: 126.4928, address: "제주시 공항로", description: "CU, GS25, 세븐일레븐" },
  { id: "cv2", name: "중문 편의점", category: "convenience", lat: 33.2500, lng: 126.4100, address: "서귀포시 중문동", description: "24시간" },
  { id: "cv3", name: "성산 편의점", category: "convenience", lat: 33.4580, lng: 126.9260, address: "서귀포시 성산읍", description: "일출봉 입구" },
  { id: "cv4", name: "함덕 편의점", category: "convenience", lat: 33.5430, lng: 126.6700, address: "제주시 조천읍", description: "해수욕장 앞" },
  { id: "cv5", name: "애월 편의점", category: "convenience", lat: 33.4630, lng: 126.3310, address: "제주시 애월읍", description: "해안도로변" },
];
