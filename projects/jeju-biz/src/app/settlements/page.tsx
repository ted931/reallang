"use client";

import { useState } from "react";
import { DevNav } from "@/components/dev-nav";

// ── 타입 ──────────────────────────────────────────────────────────────────────

type SettlementTab = "settlements" | "fees";

interface MonthData {
  m: string;
  gross: number;
  fee: number;
  net: number;
  h: number;
  current?: boolean;
}

interface Transaction {
  d: string;
  id: string;
  who: string;
  party: string;
  gross: number;
  fee: number;
  net: number;
  status: "정산완료" | "정산예정" | "환불";
}

// ── 더미 데이터 ───────────────────────────────────────────────────────────────

const MONTHS: MonthData[] = [
  { m: "12월", gross: 1820, fee: 182, net: 1638, h: 36 },
  { m: "1월",  gross: 980,  fee: 98,  net: 882,  h: 20 },
  { m: "2월",  gross: 1240, fee: 124, net: 1116, h: 25 },
  { m: "3월",  gross: 1680, fee: 168, net: 1512, h: 34 },
  { m: "4월",  gross: 2240, fee: 224, net: 2016, h: 46 },
  { m: "5월",  gross: 1055, fee: 105, net: 950,  h: 22, current: true },
];

const TRANSACTIONS: Transaction[] = [
  { d: "5/06", id: "TX-2031", who: "윤도현", party: "서핑 입문",  gross: 380000, fee: 38000, net: 342000, status: "정산완료" },
  { d: "5/05", id: "TX-2028", who: "한지우", party: "서핑 입문",  gross: 190000, fee: 19000, net: 171000, status: "정산완료" },
  { d: "5/04", id: "TX-2024", who: "최동현", party: "서핑 중급",  gross: 160000, fee: 16000, net: 144000, status: "정산예정" },
  { d: "5/03", id: "TX-2019", who: "이재훈", party: "서핑 입문",  gross: 65000,  fee: 6500,  net: 58500,  status: "정산예정" },
  { d: "5/03", id: "TX-2018", who: "김민지", party: "서핑 입문",  gross: 130000, fee: 13000, net: 117000, status: "정산예정" },
  { d: "4/30", id: "TX-2002", who: "박서연", party: "서핑 + BBQ", gross: 285000, fee: 28500, net: 256500, status: "환불" },
];

const FEE_HISTORY = [
  { d: "5/06", id: "FE-0511", desc: "서핑 입문 클래스 (윤도현)", gross: 380000, rate: "10%", fee: 38000 },
  { d: "5/05", id: "FE-0508", desc: "서핑 입문 클래스 (한지우)", gross: 190000, rate: "10%", fee: 19000 },
  { d: "5/04", id: "FE-0507", desc: "서핑 중급 클래스 (최동현)", gross: 160000, rate: "10%", fee: 16000 },
  { d: "5/03", id: "FE-0504", desc: "서핑 입문 클래스 (이재훈)", gross: 65000,  rate: "10%", fee: 6500  },
  { d: "5/03", id: "FE-0503", desc: "서핑 입문 클래스 (김민지)", gross: 130000, rate: "10%", fee: 13000 },
];

const TX_STATUS_CLS: Record<Transaction["status"], string> = {
  정산완료: "bg-emerald-100 text-emerald-700 border-emerald-200",
  정산예정: "bg-blue-100 text-blue-700 border-blue-200",
  환불:     "bg-slate-100 text-slate-500 border-slate-200",
};

// ── 월별 바 차트 ──────────────────────────────────────────────────────────────

function MonthlyChart() {
  const maxGross = Math.max(...MONTHS.map((m) => m.gross));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-extrabold text-slate-900">월별 매출 추이</h3>
        <div className="flex gap-3 font-mono text-[10px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm bg-blue-500 inline-block" />
            총매출
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-sm bg-emerald-400 inline-block" />
            순지급
          </span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 items-end h-48">
        {MONTHS.map((m) => {
          const grossH = (m.gross / maxGross) * 100;
          const netH   = (m.net   / maxGross) * 100;
          return (
            <div key={m.m} className="flex flex-col items-center justify-end h-full gap-1.5">
              <div className="flex items-end gap-1 h-full w-full justify-center">
                <div
                  className={`w-4 rounded-t transition-all ${
                    m.current ? "bg-blue-600 ring-2 ring-blue-200" : "bg-blue-400"
                  }`}
                  style={{ height: `${grossH}%` }}
                />
                <div
                  className={`w-4 rounded-t transition-all ${
                    m.current ? "bg-emerald-500 ring-2 ring-emerald-200" : "bg-emerald-400"
                  }`}
                  style={{ height: `${netH}%` }}
                />
              </div>
              <p className={`font-mono text-[10px] ${m.current ? "text-blue-700 font-extrabold" : "text-slate-500"}`}>
                {m.m}
              </p>
              <p className="font-mono text-[10px] tabular-nums text-slate-400">{m.gross}K</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 정산 내역 탭 ──────────────────────────────────────────────────────────────

function SettlementsTab({ query }: { query: string }) {
  const filtered = TRANSACTIONS.filter(
    (tx) =>
      !query ||
      tx.who.includes(query) ||
      tx.party.includes(query) ||
      tx.id.includes(query)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-extrabold text-slate-900">거래 내역 · {filtered.length}건</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left">
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">날짜</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">거래번호</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">예약자 / 파티</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">총매출</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">수수료</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">순지급</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{tx.d}</td>
                <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{tx.id}</td>
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-900">{tx.who}</p>
                  <p className="text-[11px] text-slate-500">{tx.party}</p>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                  ₩{tx.gross.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-amber-600">
                  −₩{tx.fee.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-extrabold text-emerald-700">
                  ₩{tx.net.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${TX_STATUS_CLS[tx.status]}`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── 수수료 내역 탭 ────────────────────────────────────────────────────────────

function FeesTab() {
  const totalFee = FEE_HISTORY.reduce((s, f) => s + f.fee, 0);

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600">5월 누적 수수료</p>
            <p className="text-3xl font-extrabold text-amber-700 tabular-nums mt-1">
              ₩{totalFee.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-amber-600">수수료율</p>
            <p className="text-2xl font-extrabold text-amber-700">10%</p>
            <p className="text-[11px] text-amber-600 mt-0.5">플랫폼 표준 요율 적용</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="font-extrabold text-slate-900">수수료 내역 · {FEE_HISTORY.length}건</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left">
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">날짜</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">번호</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500">내역</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">총매출</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">수수료율</th>
                <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-slate-500 text-right">수수료</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {FEE_HISTORY.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{f.d}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{f.id}</td>
                  <td className="px-4 py-3 text-slate-800">{f.desc}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                    ₩{f.gross.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                      {f.rate}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums font-extrabold text-amber-600">
                    ₩{f.fee.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 bg-slate-50">
              <tr>
                <td colSpan={5} className="px-4 py-3 font-bold text-slate-700 text-right">합계</td>
                <td className="px-4 py-3 text-right tabular-nums font-extrabold text-amber-700">
                  ₩{totalFee.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4">
        <p className="text-sm font-bold text-blue-800 mb-1.5">수수료 정책 안내</p>
        <ul className="space-y-1 text-xs text-blue-700/90">
          <li>· 플랫폼 수수료는 결제 완료 금액의 10%가 적용됩니다</li>
          <li>· 취소·환불 건은 수수료에서 제외되며 환불 처리됩니다</li>
          <li>· 수수료율은 계약 등급에 따라 달라질 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────────────────────────────────

export default function SettlementsPage() {
  const [activeTab, setActiveTab] = useState<SettlementTab>("settlements");
  const [searchQuery, setSearchQuery] = useState("");

  const TABS: { id: SettlementTab; label: string }[] = [
    { id: "settlements", label: "정산 내역" },
    { id: "fees",        label: "수수료 내역" },
  ];

  // 이번 달 요약 계산
  const currentMonth = MONTHS.find((m) => m.current)!;
  const pendingTx    = TRANSACTIONS.filter((tx) => tx.status === "정산예정");
  const nextPayout   = pendingTx.reduce((s, tx) => s + tx.net, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <DevNav />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* 페이지 헤더 */}
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate-500">
              2026 — 5월
            </p>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">정산 / 수수료</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-sm font-bold border border-slate-200 bg-white rounded-xl hover:bg-slate-50 transition-colors">
              기간 선택
            </button>
            <button className="px-3 py-2 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              CSV 다운로드
            </button>
          </div>
        </div>

        {/* 히어로 정산 카드 */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-300/30">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-blue-200">
                다음 정산 예정
              </p>
              <p className="text-4xl md:text-5xl font-extrabold mt-1 tabular-nums">
                ₩{nextPayout.toLocaleString()}
              </p>
              <p className="text-sm text-blue-100 mt-1">
                5월 10일 (월) 입금 예정 · 농협 ****-1234
              </p>
              <div className="flex gap-2 mt-4">
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/15 backdrop-blur">
                  D-4
                </span>
                <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/15 backdrop-blur">
                  {pendingTx.length}건 합산
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-200">5월 누적 순지급액</p>
              <p className="text-2xl font-extrabold tabular-nums">
                ₩{(currentMonth.net * 1000).toLocaleString()}
              </p>
              <p className="text-xs text-blue-200 mt-3">전월 대비</p>
              <p className="text-base font-bold text-emerald-300">↑ ₩68K (+7.7%)</p>
            </div>
          </div>
        </div>

        {/* 수수료 구조 시각화 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <div>
              <h3 className="font-extrabold text-slate-900">수수료 구조 · 5월</h3>
              <p className="text-xs text-slate-500 mt-0.5">gross 매출에서 수수료 10%를 차감하고 정산</p>
            </div>
            <button className="text-xs font-mono text-blue-600 hover:text-blue-700 underline underline-offset-2">
              수수료 정책 →
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">
                총 매출 (Gross)
              </p>
              <p className="text-2xl font-extrabold tabular-nums mt-1 text-slate-900">₩1,055K</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600">
                − 플랫폼 수수료 10%
              </p>
              <p className="text-2xl font-extrabold text-amber-700 tabular-nums mt-1">₩105K</p>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-700">
                = 순지급액 (Net)
              </p>
              <p className="text-2xl font-extrabold text-emerald-700 tabular-nums mt-1">₩950K</p>
            </div>
          </div>
          {/* 비율 바 */}
          <div className="mt-4 h-3 rounded-full overflow-hidden flex bg-slate-100">
            <div className="bg-emerald-400 transition-all" style={{ width: "90%" }} />
            <div className="bg-amber-400 transition-all" style={{ width: "10%" }} />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-slate-500 mt-1.5">
            <span>당신 몫 90%</span>
            <span>플랫폼 10%</span>
          </div>
        </div>

        {/* 월별 차트 */}
        <MonthlyChart />

        {/* 출금 신청 버튼 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="font-extrabold text-slate-900">정산 출금 신청</p>
            <p className="text-sm text-slate-500 mt-0.5">
              정산 예정 금액 ₩{nextPayout.toLocaleString()}을 즉시 출금 신청할 수 있어요
            </p>
          </div>
          <a
            href="/biz/settlements/withdraw"
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-extrabold rounded-xl hover:bg-blue-700 transition-colors shadow shadow-blue-200/60"
          >
            출금 신청하기 →
          </a>
        </div>

        {/* 탭 */}
        <div className="border-b border-slate-200">
          <div className="flex gap-6">
            {TABS.map((tab) => {
              const on = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 text-sm font-bold transition-colors ${
                    on ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                  {on && (
                    <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 콘텐츠: 정산 내역 */}
        {activeTab === "settlements" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <input
                type="text"
                placeholder="예약자, 파티명 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-xl w-52 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>
            <SettlementsTab query={searchQuery} />
          </div>
        )}

        {/* 탭 콘텐츠: 수수료 내역 */}
        {activeTab === "fees" && <FeesTab />}

      </main>
    </div>
  );
}
