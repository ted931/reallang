export type CouponType = "percent" | "fixed" | "free";

export interface Coupon {
  id: string;
  jwaedaeId: string;
  jwaedaeName: string;
  region: string;
  type: CouponType;
  value: number; // % 또는 원
  minAmount: number; // 최소 결제금액
  maxDiscount?: number; // % 쿠폰 최대 할인액
  title: string;
  description: string;
  validUntil: string;
  remainCount: number;
  totalCount: number;
  targetFish: string[];
  condition: string; // 사용 조건
}

export const DUMMY_COUPONS: Coupon[] = [
  {
    id: "cp1", jwaedaeId: "jw1", jwaedaeName: "서귀포 황금좌대", region: "서귀포",
    type: "percent", value: 20, minAmount: 50000, maxDiscount: 20000,
    title: "신규 회원 20% 할인",
    description: "피싱로그 가입 후 첫 예약 20% 할인. 서귀포 황금좌대 한정.",
    validUntil: "2026-06-30", remainCount: 47, totalCount: 100,
    targetFish: ["갈치", "참돔"],
    condition: "신규 가입 후 7일 이내 사용",
  },
  {
    id: "cp2", jwaedaeId: "jw4", jwaedaeName: "성산 일출 좌대", region: "성산",
    type: "fixed", value: 10000, minAmount: 60000,
    title: "평일 1만원 할인",
    description: "월~목 출조 시 1만원 즉시 할인. 성수기 제외.",
    validUntil: "2026-07-31", remainCount: 23, totalCount: 50,
    targetFish: ["참돔", "반열기"],
    condition: "월~목요일 출조만 사용 가능",
  },
  {
    id: "cp3", jwaedaeId: "jw7", jwaedaeName: "한림 감성돔 좌대", region: "한림",
    type: "percent", value: 15, minAmount: 40000, maxDiscount: 15000,
    title: "2인 이상 15% 할인",
    description: "2인 이상 예약 시 전체 금액 15% 할인.",
    validUntil: "2026-08-31", remainCount: 61, totalCount: 80,
    targetFish: ["감성돔"],
    condition: "2인 이상 동시 예약 필수",
  },
  {
    id: "cp4", jwaedaeId: "jw13", jwaedaeName: "서귀포 야간 갈치 좌대", region: "서귀포",
    type: "free", value: 0, minAmount: 0,
    title: "야간 갈치 낚싯대 무료 대여",
    description: "출조 예약 시 갈치 전용대 무료 대여. 수량 한정.",
    validUntil: "2026-06-15", remainCount: 8, totalCount: 20,
    targetFish: ["갈치"],
    condition: "야간 출조(18:00 이후) 예약 시 적용",
  },
  {
    id: "cp5", jwaedaeId: "jw2", jwaedaeName: "모슬포 방파제 좌대", region: "모슬포",
    type: "fixed", value: 5000, minAmount: 55000,
    title: "방어 시즌 특별 할인",
    description: "방어 회유 시즌 한정 5천원 쿠폰. 모슬포 방파제 좌대.",
    validUntil: "2026-06-30", remainCount: 35, totalCount: 60,
    targetFish: ["방어", "부시리"],
    condition: "1인당 적용. 중복 사용 불가",
  },
  {
    id: "cp6", jwaedaeId: "jw10", jwaedaeName: "애월 석양 좌대", region: "애월",
    type: "percent", value: 10, minAmount: 30000, maxDiscount: 10000,
    title: "피싱로그 앱 전용 10%",
    description: "피싱로그를 통해 예약하면 상시 10% 할인. 애월 석양 좌대.",
    validUntil: "2026-12-31", remainCount: 999, totalCount: 999,
    targetFish: ["볼락", "벵에돔"],
    condition: "피싱로그 앱 예약 시 자동 적용",
  },
  {
    id: "cp7", jwaedaeId: "jw5", jwaedaeName: "구좌 동복 좌대", region: "구좌",
    type: "fixed", value: 8000, minAmount: 50000,
    title: "재방문 감사 쿠폰",
    description: "이전에 방문한 고객 전용 8천원 쿠폰. 재방문에 감사드립니다.",
    validUntil: "2026-07-15", remainCount: 12, totalCount: 30,
    targetFish: ["벵에돔", "볼락"],
    condition: "이전 예약 완료 고객만 사용 가능",
  },
  {
    id: "cp8", jwaedaeId: "jw1", jwaedaeName: "서귀포 황금좌대", region: "서귀포",
    type: "free", value: 0, minAmount: 100000,
    title: "미끼 서비스 (갈치)",
    description: "2인 이상 예약 시 갈치 전용 미끼 1세트 무료 증정.",
    validUntil: "2026-06-30", remainCount: 18, totalCount: 40,
    targetFish: ["갈치"],
    condition: "2인 이상 예약, 수량 소진 시 종료",
  },
];
