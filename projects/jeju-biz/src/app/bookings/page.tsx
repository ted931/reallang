"use client";

import { useState } from "react";
import { DevNav } from "@/components/dev-nav";

// ── 타입 ──────────────────────────────────────────────────────────────────────

type BookingStatus = "confirmed" | "pending" | "cancelled";
type ViewMode = "table" | "cards";
type FilterKey = "all" | BookingStatus;

interface Booking {
  id: string;
  who: string;
  phone: string;
  party: string;
  date: string;
  n: number;
  paid: number;
  status: BookingStatus;
  stamp: string;
}

// ── 더미 데이터 ───────────────────────────────────────────────────────────────

const BOOKINGS: Booking[] = [
  { id: "BK-1024", who: "김민지", phone: "010-2345-****", party: "서핑 입문 클래스", date: "5/12 (월)", n: 2, paid: 130000, status: "confirmed", stamp: "5/3 14:22" },
  { id: "BK-1025", who: "이재훈", phone: "010-9912-****", party: "서핑 입문 클래스", date: "5/12 (월)", n: 1, paid: 65000,  status: "confirmed", stamp: "5/3 16:08" },
  { id: "BK-1026", who: "박은채", phone: "010-7732-****", party: "서핑 입문 클래스", date: "5/12 (월)", n: 3, paid: 195000, status: "pending",   stamp: "5/4 09:14" },
  { id: "BK-1027", who: "최동현", phone: "010-4421-****", party: "서핑 중급 클래스", date: "5/15 (목)", n: 2, paid: 160000, status: "confirmed", stamp: "5/4 11:42" },
  { id: "BK-1028", who: "장서윤", phone: "010-8821-****", party: "서핑 중급 클래스", date: "5/15 (목)", n: 1, paid: 80000,  status: "cancelled", stamp: "5/5 08:30" },
  { id: "BK-1029", who: "한지우", phone: "010-3318-****", party: "성산 일출 투어",   date: "5/22 (금)", n: 2, paid: 190000, status: "confirmed", stamp: "5/5 19:55" },
  { id: "BK-1030", who: "윤도현", phone: "010-1188-****", party: "성산 일출 투어",   date: "5/22 (금)", n: 4, paid: 380000, status: "confirmed", stamp: "5/6 07:12" },
  { id: "BK-1031", who: "오태양", phone: "010-9023-****", party: "한라산 가이드 등반", date: "5/24 (일)", n: 1, paid: 80000, status: "pending",   stamp: "5/6 10:30" },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; cls: string }> = {
  confirmed: { label: "확정",    cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  pending:   { label: "결제대기", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  cancelled: { label: "취소",    cls: "bg-rose-100 text-rose-500 border-rose-200" },
};

const KPI_CARDS = [
  { label: "오늘 예약",   value: "3건",      sub: "5월 6일 기준",       tone: "bg-blue-50 text-blue-700" },
  { label: "이번 달 총 예약", value: "14명",  sub: "5월 누적",           tone: "bg-emerald-50 text-emerald-700" },
  { label: "결제 대기",  value: "2건",       sub: "24시간 내 확정 필요", tone: "bg-amber-50 text-amber-700" },
  { label: "취소율",     value: "7.1%",      sub: "업계 평균 대비 낮음", tone: "bg-slate-50 text-slate-700" },
];

const FILTER_TABS: { id: FilterKey; label: string }[] = [
  { id: "all",       label: "전체" },
  { id: "confirmed", label: "확정" },
  { id: "pending",   label: "결제대기" },
  { id: "cancelled", label: "취소" },
];

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const [filter, setFilter]           = useState<FilterKey>("all");
  const [view, setView]               = useState<ViewMode>("table");
  const [bookings, setBookings]       = useState<Booking[]>(BOOKINGS);
  const [partyFilter, setPartyFilter] = useState<string>("");
  const [dateFilter, setDateFilter]   = useState<string>("");

  // 필터 적용
  const filtered = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (partyFilter && !b.party.includes(partyFilter)) return false;
    if (dateFilter && !b.date.includes(dateFilter)) return false;
    return true;
  });

  const counts: Record<FilterKey, number> = {
    all:       bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const handleConfirm = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "confirmed" as const } : b))
    );
  };

  const handleCancel = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <DevNav />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* 페이지 헤더 */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
              서핑 입문 클래스 · 5월 일정
            </p>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">예약자 관리</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-sm font-bold border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors">
              CSV 내보내기
            </button>
            <button className="px-3 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              + 수동 예약 추가
            </button>
          </div>
        </div>

        {/* KPI 요약 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {KPI_CARDS.map((k) => (
            <div key={k.label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{k.label}</p>
              <p className="text-2xl font-extrabold mt-1 tabular-nums text-slate-900">{k.value}</p>
              <span className={`mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded ${k.tone}`}>
                {k.sub}
              </span>
            </div>
          ))}
        </div>

        {/* 필터 바 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="파티명 검색"
              value={partyFilter}
              onChange={(e) => setPartyFilter(e.target.value)}
              className="flex-1 min-w-[140px] px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
            <input
              type="text"
              placeholder="날짜 (예: 5/12)"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex-1 min-w-[140px] px-3 py-2 text-sm border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            {/* 상태 필터 탭 */}
            <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
              {FILTER_TABS.map((f) => {
                const on = filter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors ${
                      on ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {f.label}
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        on ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {counts[f.id]}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 뷰 토글 */}
            <div className="flex gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1">
              {(["table", "cards"] as const).map((v) => {
                const on = view === v;
                return (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      on ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    {v === "table" ? "≡ 테이블" : "⊞ 카드"}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="text-5xl mb-3 opacity-40">📭</div>
            <p className="font-bold text-slate-700">해당 조건의 예약이 없어요</p>
            <p className="text-sm text-slate-500 mt-1">필터 조건을 변경해보세요</p>
          </div>
        ) : view === "table" ? (
          /* 테이블 뷰 */
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" className="rounded border-slate-300" />
                    </th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">예약번호</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">예약자</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">파티명</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">일정</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">인원</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">결제금액</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">상태</th>
                    <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((b) => {
                    const cfg = STATUS_CONFIG[b.status];
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-slate-300" />
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{b.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-200 grid place-items-center text-[10px] font-extrabold text-slate-600 shrink-0">
                              {b.who[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{b.who}</p>
                              <p className="text-[11px] font-mono text-slate-400">{b.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-700">{b.party}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">{b.date}</td>
                        <td className="px-4 py-3 text-right tabular-nums text-slate-700">{b.n}명</td>
                        <td className="px-4 py-3 text-right tabular-nums font-extrabold text-slate-900">
                          ₩{b.paid.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${cfg.cls}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {b.status === "pending" && (
                              <button
                                onClick={() => handleConfirm(b.id)}
                                className="text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                              >
                                확정
                              </button>
                            )}
                            {b.status !== "cancelled" && (
                              <button
                                onClick={() => handleCancel(b.id)}
                                className="text-[11px] font-bold px-2 py-1 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                              >
                                취소
                              </button>
                            )}
                            <button className="text-[11px] font-bold px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                              상세
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 bg-slate-50/50">
              <span className="text-xs text-slate-500 font-mono">
                {filtered.length}건 중 1–{filtered.length} 표시
              </span>
              <div className="flex gap-1">
                <button className="px-2 py-1 border border-slate-200 rounded text-slate-400 text-xs">◀</button>
                <button className="px-2 py-1 border border-blue-500 bg-blue-500 text-white rounded text-xs font-bold">1</button>
                <button className="px-2 py-1 border border-slate-200 rounded text-slate-400 text-xs">▶</button>
              </div>
            </div>
          </div>
        ) : (
          /* 카드 뷰 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((b) => {
              const cfg = STATUS_CONFIG[b.status];
              return (
                <article
                  key={b.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-slate-200 grid place-items-center text-xs font-extrabold text-slate-600 shrink-0">
                        {b.who[0]}
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900">{b.who}</p>
                        <p className="text-[10px] font-mono text-slate-400">{b.id}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${cfg.cls}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <dl className="mt-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">파티명</dt>
                      <dd className="font-medium text-slate-800 text-right max-w-[60%] truncate">{b.party}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">일정</dt>
                      <dd className="font-mono">{b.date}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">인원</dt>
                      <dd className="tabular-nums">{b.n}명</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">결제금액</dt>
                      <dd className="font-extrabold tabular-nums text-slate-900">₩{b.paid.toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">예약시각</dt>
                      <dd className="font-mono text-slate-400">{b.stamp}</dd>
                    </div>
                  </dl>

                  <div className="grid grid-cols-2 gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {b.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleConfirm(b.id)}
                          className="py-1.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          확정
                        </button>
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="py-1.5 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-colors"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="py-1.5 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                          메시지
                        </button>
                        <button className="py-1.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                          상세
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
