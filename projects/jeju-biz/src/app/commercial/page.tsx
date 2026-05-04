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
      { id: "r1", name: "이민준", members: 2, paid: true, contact: "010-1234-5678" },
      { id: "r2", name: "박서연", members: 1, paid: true, contact: "010-2345-6789" },
      { id: "r3", name: "최지호", members: 1, paid: false, contact: "010-3456-7890" },
      { id: "r4", name: "김하은", members: 1, paid: true, contact: "010-4567-8901" },
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
      { id: "r5", name: "정유진", members: 2, paid: true, contact: "010-5678-9012" },
      { id: "r6", name: "강민재", members: 2, paid: true, contact: "010-6789-0123" },
      { id: "r7", name: "윤소희", members: 1, paid: true, contact: "010-7890-1234" },
      { id: "r8", name: "임도현", members: 1, paid: false, contact: "010-8901-2345" },
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
      { id: "r9", name: "오태양", members: 1, paid: true, contact: "010-9012-3456" },
      { id: "r10", name: "한가람", members: 1, paid: false, contact: "010-0123-4567" },
    ],
  },
];

const MONTHLY_SETTLEMENT = [
  { month: "2026년 4월", count: 8, revenue: 432000, fee: 51840, net: 380160 },
  { month: "2026년 3월", count: 11, revenue: 594000, fee: 71280, net: 522720 },
  { month: "2026년 2월", count: 7, revenue: 378000, fee: 45360, net: 332640 },
  { month: "2026년 1월", count: 5, revenue: 270000, fee: 32400, net: 237600 },
];

// ── 유틸 ─────────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  recruiting: { label: "모집중", color: "bg-blue-100 text-blue-700" },
  closed: { label: "마감", color: "bg-gray-100 text-gray-600" },
  in_progress: { label: "진행중", color: "bg-green-100 text-green-700" },
  done: { label: "완료", color: "bg-purple-100 text-purple-700" },
  cancelled: { label: "취소", color: "bg-red-100 text-red-600" },
};

// ── 컴포넌트 ─────────────────────────────────────────────────────────────────

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

  return (
    <div className="min-h-screen bg-amber-50/30">
      <DevNav />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">사업자 파티 관리</h1>
            <p className="text-sm text-gray-500 mt-0.5">내 파티 예약 현황 및 정산 내역</p>
          </div>
          <a
            href="http://localhost:3010/create?type=commercial"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow shadow-blue-200"
          >
            + 파티 등록
          </a>
        </div>

        {/* 요약 카드 4개 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[11px] text-gray-400 mb-1">이번 달 총 예약</p>
            <p className="text-2xl font-bold text-gray-900">23건</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[11px] text-gray-400 mb-1">이번 달 매출</p>
            <p className="text-2xl font-bold text-amber-600">₩1,247,000</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[11px] text-gray-400 mb-1">플랫폼 수수료 (12%)</p>
            <p className="text-2xl font-bold text-red-500">₩149,640</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-[11px] text-gray-400 mb-1">정산 예정</p>
            <p className="text-2xl font-bold text-green-600">₩1,097,360</p>
          </div>
        </div>

        {/* 탭 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab("parties")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "parties"
                ? "bg-blue-600 text-white shadow"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            내 파티 목록
          </button>
          <button
            onClick={() => setActiveTab("settlement")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === "settlement"
                ? "bg-amber-500 text-white shadow"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            수수료 내역
          </button>
        </div>

        {/* 탭 콘텐츠: 파티 목록 */}
        {activeTab === "parties" && (
          <div className="space-y-4">
            {parties.map((party) => {
              const bookedCount = party.reservations.reduce((s, r) => s + r.members, 0);
              const paidCount = party.reservations
                .filter((r) => r.paid)
                .reduce((s, r) => s + r.members, 0);
              const isExpanded = expandedIds.has(party.id);
              const underMin = bookedCount < party.minMembers;
              const statusInfo = STATUS_LABELS[party.status] ?? STATUS_LABELS.recruiting;

              return (
                <div
                  key={party.id}
                  className={`bg-white rounded-2xl border ${
                    underMin ? "border-red-200" : "border-gray-100"
                  } overflow-hidden`}
                >
                  {/* 카드 헤더 */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{party.emoji}</span>
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {party.title}
                          </h3>
                          <span
                            className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>📅 {party.dayLabel}</span>
                          <span>👥 {bookedCount}/{party.maxMembers}명</span>
                          <span>💰 ₩{party.pricePerSeat.toLocaleString()}/인</span>
                        </div>
                        {underMin && party.status === "recruiting" && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500 font-medium">
                            <span>⚠️</span>
                            <span>
                              최소 {party.minMembers}명 미달 — 현재 {bookedCount}명 (
                              {party.minMembers - bookedCount}명 더 필요)
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">
                          ₩{(paidCount * party.pricePerSeat).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400">결제 완료</p>
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => toggleExpand(party.id)}
                        className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                      >
                        예약자 목록 {isExpanded ? "▲" : "▼"}
                      </button>
                      {party.status === "recruiting" && (
                        <>
                          <button
                            onClick={() => handleConfirm(party.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                          >
                            확정
                          </button>
                          <button
                            onClick={() => handleCancel(party.id)}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            취소
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 예약자 아코디언 */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      <div className="px-5 py-3 bg-gray-50/50">
                        <p className="text-xs font-bold text-gray-500 mb-2">예약자 목록</p>
                        <div className="divide-y divide-gray-100">
                          {party.reservations.map((r) => (
                            <div key={r.id} className="py-2.5 flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {r.name}
                                  </span>
                                  <span className="text-xs text-gray-500">{r.members}명</span>
                                  {r.paid ? (
                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">
                                      결제완료 ✓
                                    </span>
                                  ) : (
                                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">
                                      대기중 ⏳
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-400 mt-0.5">{r.contact}</p>
                              </div>
                              <div className="text-right text-xs text-gray-600 font-medium">
                                ₩{(r.members * party.pricePerSeat).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            합계 {bookedCount}명 · 결제 {paidCount}명
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            ₩{(paidCount * party.pricePerSeat).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 탭 콘텐츠: 수수료 내역 */}
        {activeTab === "settlement" && (
          <div className="space-y-4">
            {/* 이번 달 요약 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-3">이번 달 현황 (2026년 5월)</h3>
              <div className="divide-y divide-gray-100">
                <div className="py-2.5 flex justify-between text-sm">
                  <span className="text-gray-500">총 예약</span>
                  <span className="font-bold text-gray-900">{totalReservations}건</span>
                </div>
                <div className="py-2.5 flex justify-between text-sm">
                  <span className="text-gray-500">결제 완료 매출</span>
                  <span className="font-bold text-amber-600">
                    ₩{totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between text-sm">
                  <span className="text-gray-500">플랫폼 수수료 (12%)</span>
                  <span className="font-bold text-red-500">₩{totalFee.toLocaleString()}</span>
                </div>
                <div className="py-2.5 flex justify-between text-sm">
                  <span className="text-gray-700 font-bold">정산 예정액</span>
                  <span className="font-bold text-green-600 text-base">
                    ₩{totalNet.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 월별 정산 내역 테이블 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-700">월별 정산 내역</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-5 py-3 text-xs font-bold text-gray-500">월</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">예약</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">매출</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">수수료(12%)</th>
                      <th className="text-right px-5 py-3 text-xs font-bold text-gray-500">정산액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {MONTHLY_SETTLEMENT.map((row) => (
                      <tr key={row.month} className="hover:bg-gray-50/50">
                        <td className="px-5 py-3 font-medium text-gray-900">{row.month}</td>
                        <td className="px-4 py-3 text-right text-gray-600">{row.count}건</td>
                        <td className="px-4 py-3 text-right text-gray-800 font-medium">
                          ₩{row.revenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-red-500">
                          ₩{row.fee.toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right font-bold text-green-600">
                          ₩{row.net.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 안내 */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-amber-800 mb-1">정산 안내</p>
              <ul className="space-y-1">
                <li className="text-xs text-amber-700">• 정산은 매월 말일 기준으로 익월 10일에 지급됩니다</li>
                <li className="text-xs text-amber-700">• 플랫폼 수수료 12%는 결제 완료 금액에 적용됩니다</li>
                <li className="text-xs text-amber-700">• 취소된 예약은 정산 대상에서 제외됩니다</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
