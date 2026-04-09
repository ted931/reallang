// Supabase 연동 전 데모용 목 데이터
// 실제 운영 시 Supabase realtime subscription으로 교체

export interface DailyStat {
  date: string;
  revenue: number;
  reservations: number;
  cancelations: number;
  visitors: number;
}

export interface Reservation {
  id: string;
  customerName: string;
  product: string;
  category: "렌터카" | "숙소" | "액티비티" | "패키지";
  amount: number;
  status: "확정" | "대기" | "취소" | "완료";
  date: string;
  phone: string;
}

export interface CSTicket {
  id: string;
  title: string;
  category: "예약문의" | "환불요청" | "불만" | "기타";
  status: "대기" | "처리중" | "완료";
  priority: "높음" | "보통" | "낮음";
  createdAt: string;
  customerName: string;
}

const today = new Date();
const fmt = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function getWeeklyStats(): DailyStat[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const base = 800 + Math.floor(Math.random() * 400);
    return {
      date: fmt(d),
      revenue: (base * 15000 + Math.floor(Math.random() * 5000000)),
      reservations: base,
      cancelations: Math.floor(base * 0.05 + Math.random() * 10),
      visitors: base * 3 + Math.floor(Math.random() * 500),
    };
  });
}

const NAMES = ["김민수", "이서연", "박지훈", "최유진", "정현우", "한소희", "오태현", "윤채원", "임도현", "송지아"];
const PRODUCTS = [
  { name: "제주 카니발 3일", cat: "렌터카" as const },
  { name: "서귀포 오션뷰 펜션 2박", cat: "숙소" as const },
  { name: "성산 스쿠버다이빙 체험", cat: "액티비티" as const },
  { name: "제주 올인원 3박4일", cat: "패키지" as const },
  { name: "제주 레이 2일", cat: "렌터카" as const },
  { name: "애월 풀빌라 1박", cat: "숙소" as const },
  { name: "우도 전기자전거 투어", cat: "액티비티" as const },
  { name: "한라산 트레킹 가이드", cat: "액티비티" as const },
];
const STATUSES: Reservation["status"][] = ["확정", "확정", "확정", "대기", "완료", "완료", "취소"];

export function getRecentReservations(count = 15): Reservation[] {
  return Array.from({ length: count }, (_, i) => {
    const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const d = new Date(today);
    d.setHours(d.getHours() - Math.floor(Math.random() * 72));
    return {
      id: `R-${String(10000 + i).slice(1)}`,
      customerName: NAMES[Math.floor(Math.random() * NAMES.length)],
      product: prod.name,
      category: prod.cat,
      amount: [35000, 89000, 120000, 250000, 45000, 180000, 55000, 80000][Math.floor(Math.random() * 8)],
      status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
      date: fmt(d),
      phone: `010-${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    };
  });
}

const CS_TITLES = [
  "렌터카 반납 시간 변경 문의",
  "숙소 체크인 시간 문의",
  "카드 결제 오류 발생",
  "예약 취소 및 환불 요청",
  "액티비티 날씨로 인한 취소",
  "파트너 업체 연락처 문의",
  "할인 코드 적용 안됨",
  "결제 후 예약 확인 안됨",
];

export function getCSTickets(count = 10): CSTicket[] {
  const cats: CSTicket["category"][] = ["예약문의", "환불요청", "불만", "기타"];
  const pris: CSTicket["priority"][] = ["높음", "보통", "보통", "낮음"];
  const stats: CSTicket["status"][] = ["대기", "대기", "처리중", "완료"];

  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setHours(d.getHours() - Math.floor(Math.random() * 48));
    return {
      id: `CS-${String(5000 + i).slice(1)}`,
      title: CS_TITLES[Math.floor(Math.random() * CS_TITLES.length)],
      category: cats[Math.floor(Math.random() * cats.length)],
      status: stats[Math.floor(Math.random() * stats.length)],
      priority: pris[Math.floor(Math.random() * pris.length)],
      createdAt: d.toISOString(),
      customerName: NAMES[Math.floor(Math.random() * NAMES.length)],
    };
  });
}
