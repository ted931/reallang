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
  rentalCarMode?: "none" | "own-car" | "rent-together";
  rentalCarId?: string;
  rentalCarDailyPrice?: number;
  rentalCarDays?: number;
  rentalCarPerPerson?: number;
  rentalCarPickup?: string;
  rentalCarReturn?: string;
  rentalCarConfirmed?: number;
  equipmentNeeded?: string;
  hostName: string;
  hostRating: number;
  hostPartyCount: number;
  hostBio?: string;
  tags: string[];
  schedule?: ScheduleItem[];
  courseId?: string;
  cafePassEnabled?: boolean;
  cafePassNote?: string;
  cafeTourId?: string;
  stopSlugs?: string[];
  createdAt: string;
  // 사업자 파티 필드
  partyType?: "individual" | "commercial";   // 기본값: individual
  pricePerSeat?: number;                      // 1인당 가격 (원)
  depositRate?: number;                       // 선입금 비율 0~100 (기본 100)
  platformFeeRate?: number;                   // 플랫폼 수수료율 (기본 10)
  operatorName?: string;                      // 업체명
  operatorContact?: string;                   // 연락처
  operatorVerified?: boolean;                 // 사업자 인증 여부
  minMembers?: number;                        // 최소 인원 (미달 시 취소)
  reservedSeats?: number;                     // 현재 예약된 자리 수
  includedItems?: string[];                   // 포함 사항 (장비, 강습 등)
  excludedItems?: string[];                   // 불포함 사항
  refundPolicy?: string;                      // 환불 정책
  // 렌터카 코디 (사업자 파티 참가자 간 렌트카 공유 모집)
  rentalCoordEnabled?: boolean;              // 렌터카 코디 활성화
  rentalCoordNote?: string;                  // 픽업 장소, 시간 등 안내
  rentalCoordSeats?: number;                 // 구하는 동승자 수
  // 번들 파티 (개인이 여러 활동을 묶어 동행 구함)
  bundleItems?: BundleItem[];               // 번들 활동 목록
  // 한달살기 호스트 — 이미 제주 체류 중, 단기 동행 구함
  stayMode?: "stay";                         // stay = 현지 장기 체류 호스트
  hostStayDays?: number;                     // 호스트 체류 총 기간 (일)
  hostStayRegion?: string;                   // 머무는 동네
  guestNights?: number;                      // 게스트 숙박 가능 박 수 (0이면 당일만)
  guestCanStayOver?: boolean;               // 숙박 가능 여부 (소파/게스트룸 등)
  petFriendly?: boolean;                     // 반려동물 동반 가능
  petTypes?: string[];                       // 허용 반려동물 ("강아지", "고양이")
  petRules?: string;                         // 반려동물 관련 안내
  hostLocalTips?: string[];                  // 현지 꿀팁 (단골 카페, 숨은 포인트 등)
}

export interface BundleItem {
  id: string;
  title: string;
  category: string;              // HOBBY_CATEGORIES id
  time: string;                  // "HH:MM"
  location?: string;
  cost?: number;                 // 1인 비용 (0이면 무료)
  commercialPartyId?: string;    // 연결된 사업자 파티 ID (자동 예약 연동)
  note?: string;
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

// ── 결제 관련 타입 ──
export interface PartyParticipant {
  id: string;
  partyId: string;
  userName: string;
  phone?: string;
  status: "pending" | "approved" | "cancelled";
  paymentStatus: "none" | "pending" | "completed" | "refunded";
  paymentAmount?: number;
  joinedAt: string;
}

export interface PaymentRequest {
  partyId: string;
  partyTitle: string;
  amount: number;
  userName: string;
  phone?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
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
