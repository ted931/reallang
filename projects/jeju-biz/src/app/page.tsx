"use client";

import { useState, useEffect } from "react";
import {
  getWeeklyStats,
  getRecentReservations,
  getCSTickets,
  type DailyStat,
  type Reservation,
  type CSTicket,
} from "@/lib/mock-data";

const STATUS_COLORS: Record<string, string> = {
  확정: "bg-emerald-100 text-emerald-700",
  대기: "bg-yellow-100 text-yellow-700",
  취소: "bg-red-100 text-red-700",
  완료: "bg-gray-100 text-gray-500",
  처리중: "bg-blue-100 text-blue-700",
};

const PRIORITY_COLORS: Record<string, string> = {
  높음: "bg-red-100 text-red-600",
  보통: "bg-yellow-100 text-yellow-600",
  낮음: "bg-gray-100 text-gray-500",
};

const CAT_COLORS: Record<string, string> = {
  렌터카: "bg-blue-100 text-blue-700",
  숙소: "bg-purple-100 text-purple-700",
  액티비티: "bg-orange-100 text-orange-700",
  패키지: "bg-emerald-100 text-emerald-700",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DailyStat[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tickets, setTickets] = useState<CSTicket[]>([]);
  const [tab, setTab] = useState<"overview" | "reservations" | "cs">("overview");

  useEffect(() => {
    setStats(getWeeklyStats());
    setReservations(getRecentReservations(15));
    setTickets(getCSTickets(10));
  }, []);

  const todayStat = stats[stats.length - 1];
  const yesterdayStat = stats[stats.length - 2];

  const weekRevenue = stats.reduce((s, d) => s + d.revenue, 0);
  const weekReservations = stats.reduce((s, d) => s + d.reservations, 0);
  const weekCancels = stats.reduce((s, d) => s + d.cancelations, 0);
  const cancelRate = weekReservations > 0 ? ((weekCancels / weekReservations) * 100).toFixed(1) : "0";

  const fmt = (n: number) => {
    if (n >= 100000000) return `${(n / 100000000).toFixed(1)}억`;
    if (n >= 10000) return `${(n / 10000).toFixed(0)}만`;
    return n.toLocaleString();
  };

  const fmtFull = (n: number) => n.toLocaleString() + "원";

  const pctChange = (a?: number, b?: number) => {
    if (!a || !b || b === 0) return null;
    const pct = ((a - b) / b) * 100;
    return pct;
  };

  const PctBadge = ({ val }: { val: number | null }) => {
    if (val === null) return null;
    const positive = val >= 0;
    return (
      <span className={`text-[10px] font-medium ${positive ? "text-emerald-600" : "text-red-500"}`}>
        {positive ? "+" : ""}{val.toFixed(1)}%
      </span>
    );
  };

  // 간이 바 차트
  const maxRevenue = Math.max(...stats.map((s) => s.revenue), 1);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">📊 제주패스 통합 대시보드</h1>
            <p className="text-xs text-gray-400 mt-0.5">실시간 운영 현황 (데모 데이터)</p>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(["overview", "reservations", "cs"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  tab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "overview" ? "전체 현황" : t === "reservations" ? "예약 관리" : "CS 현황"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {tab === "overview" && (
          <div className="space-y-6">
            {/* KPI 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400">오늘 매출</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {todayStat ? fmt(todayStat.revenue) : "-"}
                </p>
                <PctBadge val={pctChange(todayStat?.revenue, yesterdayStat?.revenue)} />
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400">오늘 예약</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">
                  {todayStat ? `${todayStat.reservations}건` : "-"}
                </p>
                <PctBadge val={pctChange(todayStat?.reservations, yesterdayStat?.reservations)} />
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400">주간 매출</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{fmt(weekRevenue)}</p>
                <span className="text-[10px] text-gray-400">최근 7일</span>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <p className="text-xs text-gray-400">취소율</p>
                <p className="text-2xl font-bold text-orange-500 mt-1">{cancelRate}%</p>
                <span className="text-[10px] text-gray-400">{weekCancels}건 / {weekReservations}건</span>
              </div>
            </div>

            {/* 매출 차트 (bar) */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">주간 매출 추이</h3>
              <div className="flex items-end gap-3 h-40">
                {stats.map((s, i) => {
                  const h = (s.revenue / maxRevenue) * 100;
                  const isToday = i === stats.length - 1;
                  return (
                    <div key={s.date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500">{fmt(s.revenue)}</span>
                      <div
                        className={`w-full rounded-t-lg transition-all ${isToday ? "bg-indigo-500" : "bg-indigo-200"}`}
                        style={{ height: `${h}%`, minHeight: 4 }}
                      />
                      <span className="text-[10px] text-gray-400">
                        {s.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* 최근 예약 */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3">최근 예약</h3>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {reservations.slice(0, 8).map((r) => (
                    <div key={r.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CAT_COLORS[r.category] || "bg-gray-100"}`}>
                        {r.category}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{r.product}</p>
                        <p className="text-xs text-gray-400">{r.customerName} · {r.date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-medium">{fmtFull(r.amount)}</p>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CS 현황 */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3">CS 현황</h3>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <p className="text-lg font-bold text-yellow-600">{tickets.filter((t) => t.status === "대기").length}</p>
                    <p className="text-[10px] text-gray-500">대기</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{tickets.filter((t) => t.status === "처리중").length}</p>
                    <p className="text-[10px] text-gray-500">처리중</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-500">{tickets.filter((t) => t.status === "완료").length}</p>
                    <p className="text-[10px] text-gray-500">완료</p>
                  </div>
                </div>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {tickets.filter((t) => t.status !== "완료").map((t) => (
                    <div key={t.id} className="flex items-center gap-2 py-2 border-b border-gray-50 last:border-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${PRIORITY_COLORS[t.priority]}`}>
                        {t.priority}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">{t.title}</p>
                        <p className="text-xs text-gray-400">{t.customerName} · {t.id}</p>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "reservations" && (
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">전체 예약 목록</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">ID</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">고객</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">상품</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">카테고리</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">금액</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">상태</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-gray-400 font-mono text-xs">{r.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{r.customerName}</td>
                      <td className="px-5 py-3 text-gray-700">{r.product}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CAT_COLORS[r.category]}`}>{r.category}</span>
                      </td>
                      <td className="px-5 py-3 font-medium">{fmtFull(r.amount)}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "cs" && (
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">CS 티켓 목록</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">ID</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">제목</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">고객</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">카테고리</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">우선순위</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">상태</th>
                    <th className="px-5 py-3 text-xs font-medium text-gray-500">생성일</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3 text-gray-400 font-mono text-xs">{t.id}</td>
                      <td className="px-5 py-3 font-medium text-gray-900">{t.title}</td>
                      <td className="px-5 py-3 text-gray-700">{t.customerName}</td>
                      <td className="px-5 py-3 text-gray-500">{t.category}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${PRIORITY_COLORS[t.priority]}`}>{t.priority}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${STATUS_COLORS[t.status]}`}>{t.status}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(t.createdAt).toLocaleDateString("ko-KR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 하단 안내 */}
        <div className="mt-8 p-4 bg-indigo-50 rounded-xl text-center">
          <p className="text-xs text-indigo-600">데모 데이터로 표시 중 · Supabase 연동 시 실시간 업데이트됩니다</p>
        </div>
      </main>
    </div>
  );
}
