export type EscrowStatus = "holding" | "confirmed" | "completed" | "cancelled" | "refunded";

export interface Reservation {
  id: string;
  jwaedaeId: string;
  jwaedaeName: string;
  region: string;
  date: string;
  time: string;
  people: number;
  pricePerPerson: number;
  totalAmount: number;
  escrowStatus: EscrowStatus;
  escrowReleaseDate: string; // 업체 정산 예정일
  targetFish: string[];
  operatorPhone: string;
  cancelPolicy: string;
  createdAt: string;
}

export const DUMMY_RESERVATIONS: Reservation[] = [
  {
    id: "rsv1", jwaedaeId: "jw1", jwaedaeName: "서귀포 황금좌대", region: "서귀포",
    date: "2026-05-17", time: "05:00", people: 2, pricePerPerson: 55000, totalAmount: 110000,
    escrowStatus: "confirmed", escrowReleaseDate: "2026-05-19",
    targetFish: ["참돔", "감성돔"], operatorPhone: "064-732-0001",
    cancelPolicy: "출조 3일 전까지 70% 환불",
    createdAt: "2026-05-11T10:00:00Z",
  },
  {
    id: "rsv2", jwaedaeId: "jw4", jwaedaeName: "성산 일출 좌대", region: "성산",
    date: "2026-05-25", time: "04:30", people: 1, pricePerPerson: 60000, totalAmount: 60000,
    escrowStatus: "holding", escrowReleaseDate: "2026-05-27",
    targetFish: ["반열기", "참돔"], operatorPhone: "064-784-0004",
    cancelPolicy: "출조 7일 전까지 100% 환불",
    createdAt: "2026-05-10T14:00:00Z",
  },
  {
    id: "rsv3", jwaedaeId: "jw13", jwaedaeName: "서귀포 야간 갈치 좌대", region: "서귀포",
    date: "2026-04-20", time: "18:00", people: 3, pricePerPerson: 60000, totalAmount: 180000,
    escrowStatus: "completed", escrowReleaseDate: "2026-04-22",
    targetFish: ["갈치"], operatorPhone: "064-732-0013",
    cancelPolicy: "출조 당일 환불 불가",
    createdAt: "2026-04-15T09:00:00Z",
  },
];

export const ESCROW_STATUS_LABEL: Record<EscrowStatus, { label: string; color: string; desc: string }> = {
  holding:   { label: "에스크로 보관중", color: "text-hook bg-hook/10 border-hook/30", desc: "결제금이 퐁당에서 안전하게 보관 중입니다." },
  confirmed: { label: "출조 확정", color: "text-teal-300 bg-teal-900/40 border-teal-800", desc: "업체가 예약을 확정했습니다. 출조 후 자동 정산됩니다." },
  completed: { label: "정산 완료", color: "text-slate-400 bg-slate-800 border-slate-700", desc: "출조 완료 후 업체에 정산되었습니다." },
  cancelled: { label: "취소됨", color: "text-rose-400 bg-rose-900/40 border-rose-800", desc: "예약이 취소되었습니다." },
  refunded:  { label: "환불 완료", color: "text-blue-300 bg-blue-900/40 border-blue-800", desc: "환불이 완료되었습니다." },
};
