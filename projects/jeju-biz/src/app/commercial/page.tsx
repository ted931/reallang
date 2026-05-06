"use client";

import { useState } from "react";
import { DevNav } from "@/components/dev-nav";

// ── 타입 ─────────────────────────────────────────────────────────────────────

type PartyStatus = "recruiting" | "closed" | "in_progress" | "done" | "cancelled";

interface Reservation {
  id: string;
  name: string;
  members: number;
  paid: boolean;
  contact: string;
}

interface Party {
  id: string;
  title: string;
  date: string;
  dayLabel: string;
  category: string;
  emoji: string;
  maxMembers: number;
  minMembers: number;
  pricePerSeat: number;
  status: PartyStatus;
  reservations: Reservation[];
}

// ── 더미 데이터 ─────────────────────────────────────────────────────────────

const DUMMY_PARTIES: Party[] = [
  {
    id: "p1",
    title: "서핑 입문 클래스",
    date: "2026-05-10",
    dayLabel: "5/10 토",
    category: "서핑",
    emoji: "🏄",
    maxMembers: 8,
    minMembers: 4,
    pricePerSeat: 65000,
    status: "recruiting" as const,
    reservations: [
      { id: "r1", name: "이민준", members: 2, paid: true, contact: "010-1234-****" },
      { id: "r2", name: "박서연", members: 1, paid: true, contact: "010-2345-****" },
      { id: "r3", name: "최지호", members: 1, paid: false, contact: "010-3456-****" },
      { id: "r4", name: "김하은", members: 1, paid: true, contact: "010-4567-****" },
    ],
  },
  {
    id: "p2",
    title: "성산 일출 투어",
    date: "2026-05-11",
    dayLabel: "5/11 일",
    category: "관광",
    emoji: "🌅",
    maxMembers: 10,
    minMembers: 4,
    pricePerSeat: 45000,
    status: "recruiting" as const,
    reservations: [
      { id: "r5", name: "정유진", members: 2, paid: true, contact: "010-5678-****" },
      { id: "r6", name: "강민재", members: 2, paid: true, contact: "010-6789-****" },
      { id: "r7", name: "윤소희", members: 1, paid: true, contact: "010-7890-****" },
      { id: "r8", name: "임도현", members: 1, paid: false, contact: "010-8901-****" },
    ],
  },
  {
    id: "p3",
    title: "한라산 가이드 등반",
    date: "2026-05-17",
    dayLabel: "5/17 토",
    category: "등산",
    emoji: "⛰️",
    maxMembers: 6,
    minMembers: 3,
    pricePerSeat: 80000,
    status: "recruiting" as const,
    reservations: [
      { id: "r9", name: "오태양", members: 1, paid: true, contact: "010-9012-****" },
      { id: "r10", name: "한가람", members: 1, paid: false, contact: "010-0123-****" },
    ],
  },
];

const MONTHLY_SETTLEMENT = [
  { month: "2025년 11월", count: 6, revenue: 312000 },
  { month: "2025년 12월", count: 9, revenue: 486000 },
  { month: "2026년 1월", count: 5, revenue: 270000 },
  { month: "2026년 2월", count: 7, revenue: 378000 },
  { month: "2026년 3월", count: 11, revenue: 594000 },
  { month: "2026년 4월", count: 8, revenue: 432000 },
];

// ── 상태 뱃지 ─────────────────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: PartyStatus;
  isUnderMin: boolean;
}

function StatusBadge({ status, isUnderMin }: StatusBadgeProps) {
  if (isUnderMin) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200 inline-flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        인원 부족
      </span>
    );
  }

  const config: Record<PartyStatus, { label: string; dot: string; bg: string; text: string; ring: string }> = {
    recruiting: { label: "모집중", dot: "#10B981", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
    closed:     { label: "마감",   dot: "#94A3B8", bg: "bg-slate-100",  text: "text-slate-600",  ring: "ring-slate-200" },
    in_progress:{ label: "진행중", dot: "#3B82F6", bg: "bg-blue-50",    text: "text-blue-700",   ring: "ring-blue-200" },
    done:       { label: "완료",   dot: "#A855F7", bg: "bg-violet-50",  text: "text-violet-700", ring: "ring-violet-200" },
    cancelled:  { label: "취소",   dot: "#EF4444", bg: "bg-rose-50",    text: "text-rose-600",   ring: "ring-rose-200" },
  };

  const c = config[status] ?? config.recruiting;
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text} ring-1 ${c.ring} inline-flex items-center gap-1`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

// ── 요약 카드 ─────────────────────────────────────────────────────────────────

interface SummaryCard {
  key: string;
  label: string;
  value: string;
  delta: string;
  up: boolean;
  sub: string;
  icon: string;
  bg: string;
  color: string;
}

function SummaryCards({ data }: { data: SummaryCard[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {data.map((s) => (
        <div key={s.key} className="bg-white rounded-2xl border border-slate-200 p-4 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div
              className="w-9 h-9 rounded-lg grid place-items-center text-base"
              style={{ background: s.bg, color: s.color }}
            >
              {s.icon}
            </div>
            <span className={`text-[10px] font-bold flex items-center gap-0.5 ${s.up ? "text-emerald-600" : "text-rose-500"}`}>
              {s.up ? "▲" : "▼"} {s.delta}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">{s.label}</p>
          <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5 tabular-nums">{s.value}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ── 탭 (Underline 스타일) ─────────────────────────────────────────────────────

interface TabsProps {
  activeTab: "parties" | "settlement";
  setActiveTab: (tab: "parties" | "settlement") => void;
  partyCount: number;
}

function UnderlineTabs({ activeTab, setActiveTab, partyCount }: TabsProps) {
  const items = [
    { id: "parties" as const, label: "내 파티 목록", count: partyCount },
    { id: "settlement" as const, label: "수수료 내역", count: null },
  ];
  return (
    <div className="border-b border-slate-200">
      <div className="flex gap-6">
        {items.map((it) => {
          const on = activeTab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setActiveTab(it.id)}
              className={`relative pb-3 text-sm font-bold transition-colors ${
                on ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <span className="flex items-center gap-1.5">
                {it.label}
                {it.count != null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      on ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {it.count}
                  </span>
                )}
              </span>
              {on && (
                <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 파티 카드 ─────────────────────────────────────────────────────────────────

interface PartyCardProps {
  party: Party;
  isExpanded: boolean;
  onToggle: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function PartyCard({ party, isExpanded, onToggle, onConfirm, onCancel }: PartyCardProps) {
  const booked = party.reservations.reduce((s, r) => s + r.members, 0);
  const paid = party.reservations.filter((r) => r.paid).reduce((s, r) => s + r.members, 0);
  const fillPct = Math.min(100, (booked / party.maxMembers) * 100);
  const minPct = (party.minMembers / party.maxMembers) * 100;
  const underMin = booked < party.minMembers;

  return (
    <div
      className={`bg-white rounded-2xl border ${
        underMin ? "border-amber-300" : "border-slate-200"
      } overflow-hidden`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          {/* 왼쪽: 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xl leading-none">{party.emoji}</span>
              <h3 className="text-base font-extrabold text-slate-900 truncate">{party.title}</h3>
              <StatusBadge status={party.status} isUnderMin={underMin} />
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <span className="text-slate-300">📅</span>
                {party.dayLabel}
              </span>
              <span className="flex items-center gap-1">
                <span className="text-slate-300">👥</span>
                {booked}/{party.maxMembers}명
              </span>
              <span className="flex items-center gap-1">
                <span className="text-slate-300">💰</span>
                ₩{party.pricePerSeat.toLocaleString()}/인
              </span>
            </div>

            {/* 예약 진행 막대 */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[10px] mb-1.5">
                <span className="text-slate-400">예약 현황</span>
                <span className={underMin ? "text-amber-600 font-bold" : "text-emerald-600 font-bold"}>
                  {underMin
                    ? `최소 ${party.minMembers}명까지 ${party.minMembers - booked}명 부족`
                    : `최소 인원 충족 ✓`}
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full ${
                    underMin ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                  style={{ width: `${fillPct}%` }}
                />
                <div
                  className="absolute inset-y-0 w-0.5 bg-slate-400"
                  style={{ left: `${minPct}%` }}
                  title="최소 인원 라인"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>0</span>
                <span style={{ marginLeft: "auto" }}>min · {party.minMembers}</span>
                <span className="ml-3">max · {party.maxMembers}</span>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 금액 */}
          <div className="text-right shrink-0">
            <p className="text-xs text-slate-400">결제 완료</p>
            <p className="text-base font-extrabold text-slate-900 tabular-nums">
              ₩{(paid * party.pricePerSeat).toLocaleString()}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
              paid {paid}/{booked}
            </p>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onToggle}
            className="flex-1 py-2 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            예약자 {party.reservations.length}명
            <span className={`transition-transform inline-block ${isExpanded ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>
          {party.status === "recruiting" && (
            <>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                확정
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-rose-50 hover:text-rose-500 transition-colors"
              >
                취소
              </button>
            </>
          )}
        </div>
      </div>

      {/* 예약자 아코디언 */}
      {isExpanded && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-500">예약자 목록</p>
              <button className="text-[11px] text-blue-600 font-medium hover:text-blue-700">
                전체 연락처 복사
              </button>
            </div>

            {/* 테이블 */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_auto] gap-3 px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
                <span>이름</span>
                <span>인원</span>
                <span>연락처</span>
                <span>상태</span>
                <span className="text-right">금액</span>
              </div>
              {party.reservations.map((r) => (
                <div
                  key={r.id}
                  className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr_auto] gap-3 px-4 py-2.5 text-sm items-center border-b border-slate-50 last:border-b-0"
                >
                  <span className="font-medium text-slate-900 truncate">{r.name}</span>
                  <span className="text-slate-600">{r.members}명</span>
                  <span className="text-slate-500 font-mono text-xs">{r.contact}</span>
                  <span>
                    {r.paid ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                        결제완료 ✓
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                        대기 ⏳
                      </span>
                    )}
                  </span>
                  <span className="text-right font-bold text-slate-900 tabular-nums">
                    ₩{(r.members * party.pricePerSeat).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between px-1">
              <span className="text-xs text-slate-500">
                합계 {booked}명 · 결제 {paid}명
              </span>
              <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                ₩{(paid * party.pricePerSeat).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 수수료 탭: 바 차트 ────────────────────────────────────────────────────────

function SettlementChart() {
  const max = Math.max(...MONTHLY_SETTLEMENT.map((m) => m.revenue));
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-900">월별 매출 추이</h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">최근 6개월 · 결제 완료 기준</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-blue-600 tabular-nums">₩432K</p>
          <p className="text-[11px] text-emerald-600 font-bold">▲ +14% vs 전월 평균</p>
        </div>
      </div>
      <div className="flex items-end gap-2 h-32 mt-2">
        {MONTHLY_SETTLEMENT.map((m, i) => {
          const isLast = i === MONTHLY_SETTLEMENT.length - 1;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                ₩{(m.revenue / 1000).toFixed(0)}K
              </span>
              <div
                className="w-full rounded-t-lg relative"
                style={{
                  height: `${(m.revenue / max) * 100}%`,
                  background: isLast
                    ? "linear-gradient(180deg,#3b82f6,#1d4ed8)"
                    : "linear-gradient(180deg,#bfdbfe,#93c5fd)",
                }}
              >
                {isLast && (
                  <div className="absolute -top-2 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white" />
                )}
              </div>
              <span
                className={`text-[10px] font-mono ${
                  isLast ? "text-blue-600 font-bold" : "text-slate-400"
                }`}
              >
                {m.month.slice(-3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 수수료 탭 전체 ────────────────────────────────────────────────────────────

interface SettlementViewProps {
  totalReservations: number;
  totalRevenue: number;
  totalFee: number;
  totalNet: number;
}

function SettlementView({ totalReservations, totalRevenue, totalFee, totalNet }: SettlementViewProps) {
  const max = Math.max(...MONTHLY_SETTLEMENT.map((r) => r.revenue));

  return (
    <div className="space-y-5">
      <SettlementChart />

      {/* 이번 달 정산 요약 */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-700">이번 달 정산 (2026년 5월)</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
            예정 6/10 지급
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "총 예약", value: `${totalReservations}건`, color: "text-slate-900", highlight: false },
            { label: "결제 매출", value: `₩${totalRevenue.toLocaleString()}`, color: "text-slate-900", highlight: false },
            { label: "수수료 (12%)", value: `₩${totalFee.toLocaleString()}`, color: "text-rose-500", highlight: false },
            { label: "정산 예정", value: `₩${totalNet.toLocaleString()}`, color: "text-emerald-600", highlight: true },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl p-3 ${
                item.highlight
                  ? "bg-emerald-50 border border-emerald-200"
                  : "bg-slate-50 border border-slate-100"
              }`}
            >
              <p className="text-[10px] text-slate-500 font-mono">{item.label}</p>
              <p className={`text-base font-extrabold tabular-nums mt-1 ${item.color}`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 월별 정산 테이블 */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-700">월별 정산 내역</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">월</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">예약</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">매출</th>
                <th className="text-right px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">수수료</th>
                <th className="text-right px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-500">정산액</th>
                <th className="text-left px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 w-28">분포</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MONTHLY_SETTLEMENT.map((row) => {
                const fee = Math.floor(row.revenue * 0.12);
                const net = row.revenue - fee;
                return (
                  <tr key={row.month} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-900">{row.month}</td>
                    <td className="px-4 py-3 text-right text-slate-600 tabular-nums">{row.count}건</td>
                    <td className="px-4 py-3 text-right text-slate-800 font-medium tabular-nums">
                      ₩{row.revenue.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-rose-500 tabular-nums">
                      ₩{fee.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right font-extrabold text-emerald-600 tabular-nums">
                      ₩{net.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${(row.revenue / max) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 정산 안내 */}
      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
        <p className="text-sm font-bold text-blue-800 mb-1.5">💡 정산 안내</p>
        <ul className="space-y-1 text-xs text-blue-700/90">
          <li>· 정산은 매월 말일 기준 익월 10일에 지급됩니다</li>
          <li>· 플랫폼 수수료 12%는 결제 완료 금액에 적용됩니다</li>
          <li>· 취소된 예약은 정산 대상에서 제외됩니다</li>
        </ul>
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

export default function CommercialPage() {
  const [activeTab, setActiveTab] = useState<"parties" | "settlement">("parties");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [parties, setParties] = useState<Party[]>(DUMMY_PARTIES);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalReservations = parties.reduce(
    (sum, p) => sum + p.reservations.reduce((s, r) => s + r.members, 0),
    0
  );
  const totalRevenue = parties.reduce(
    (sum, p) =>
      sum +
      p.reservations
        .filter((r) => r.paid)
        .reduce((s, r) => s + r.members * p.pricePerSeat, 0),
    0
  );
  const totalFee = Math.floor(totalRevenue * 0.12);
  const totalNet = totalRevenue - totalFee;

  const handleConfirm = (partyId: string) => {
    setParties((prev) =>
      prev.map((p) => (p.id === partyId ? { ...p, status: "in_progress" as const } : p))
    );
  };

  const handleCancel = (partyId: string) => {
    setParties((prev) =>
      prev.map((p) => (p.id === partyId ? { ...p, status: "cancelled" as const } : p))
    );
  };

  const summaryCards: SummaryCard[] = [
    { key: "res", label: "이번 달 총 예약", value: "23건",     delta: "+6",   up: true,  sub: "전월 17건",     icon: "📅", bg: "#EFF6FF", color: "#2563EB" },
    { key: "rev", label: "이번 달 매출",    value: "₩1,247K", delta: "+18%", up: true,  sub: "전월 ₩1,055K", icon: "💰", bg: "#FEF3C7", color: "#B45309" },
    { key: "fee", label: "플랫폼 수수료",   value: "₩149K",   delta: "-2%",  up: false, sub: "12% 적용",      icon: "📉", bg: "#FFE4E6", color: "#BE123C" },
    { key: "net", label: "정산 예정",       value: "₩1,097K", delta: "+19%", up: true,  sub: "6/10 지급",     icon: "✓", bg: "#DCFCE7", color: "#15803D" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <DevNav />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">사업자 파티 관리</h1>
            <p className="text-sm text-slate-500 mt-0.5">내 파티 예약 현황 및 정산 내역</p>
          </div>
          <a
            href="http://localhost:3010/create?type=commercial"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-blue-600 text-white text-sm font-extrabold rounded-xl hover:bg-blue-700 transition-colors shadow shadow-blue-200/60"
          >
            + 파티 등록
          </a>
        </div>

        {/* 요약 카드 4개 */}
        <SummaryCards data={summaryCards} />

        {/* 탭 */}
        <UnderlineTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          partyCount={parties.length}
        />

        {/* 탭 콘텐츠: 파티 목록 */}
        {activeTab === "parties" && (
          <div className="space-y-3">
            {parties.length === 0 ? (
              <div className="bg-white rounded-3xl border-2 border-dashed border-blue-200 p-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 grid place-items-center text-3xl">
                  🎉
                </div>
                <p className="text-slate-900 font-bold text-lg mt-4">등록된 파티가 없어요</p>
                <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto">
                  서핑·등산·투어 등 사업자 파티를 등록하면 jeju-party 사용자에게 노출됩니다.
                </p>
                <button className="mt-5 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow shadow-blue-200/60">
                  + 파티 등록하기
                </button>
              </div>
            ) : (
              parties.map((party) => (
                <PartyCard
                  key={party.id}
                  party={party}
                  isExpanded={expandedIds.has(party.id)}
                  onToggle={() => toggleExpand(party.id)}
                  onConfirm={() => handleConfirm(party.id)}
                  onCancel={() => handleCancel(party.id)}
                />
              ))
            )}
          </div>
        )}

        {/* 탭 콘텐츠: 수수료 내역 */}
        {activeTab === "settlement" && (
          <SettlementView
            totalReservations={totalReservations}
            totalRevenue={totalRevenue}
            totalFee={totalFee}
            totalNet={totalNet}
          />
        )}
      </main>
    </div>
  );
}
