import Link from "next/link";

export const metadata = { title: "업체 대시보드 — 피싱로그" };

const MONTHLY_STATS = [
  { month: "1월", reservations: 42, revenue: 2310000, catchCount: 8 },
  { month: "2월", reservations: 38, revenue: 2090000, catchCount: 6 },
  { month: "3월", reservations: 61, revenue: 3355000, catchCount: 14 },
  { month: "4월", reservations: 87, revenue: 4785000, catchCount: 19 },
  { month: "5월", reservations: 54, revenue: 2970000, catchCount: 11 },
];

const RECENT_RESERVATIONS = [
  { id: "R001", name: "김민준", date: "2026-05-17", time: "05:00", people: 2, status: "확정", amount: 110000 },
  { id: "R002", name: "이서연", date: "2026-05-18", time: "05:00", people: 4, status: "대기", amount: 220000 },
  { id: "R003", name: "박도윤", date: "2026-05-19", time: "05:00", people: 1, status: "확정", amount: 55000 },
  { id: "R004", name: "최유나", date: "2026-05-20", time: "06:00", people: 3, status: "확정", amount: 165000 },
  { id: "R005", name: "정현우", date: "2026-05-21", time: "05:00", people: 2, status: "취소", amount: 110000 },
];

const RECENT_CATCHES = [
  { author: "서귀포갯바위왕", fish: "참돔 51cm, 감성돔 38cm×2", rating: 5, date: "2026-05-08", linked: true },
  { author: "좌대매니아", fish: "벵에돔 30cm×4, 볼락 23cm×8", rating: 4, date: "2026-05-06", linked: true },
  { author: "한림좌대단골", fish: "참돔 45cm×2, 벵에돔 32cm×5", rating: 5, date: "2026-04-27", linked: true },
];

const REVIEWS = [
  { author: "좌대매니아", rating: 5, text: "직원분이 처음부터 끝까지 도와주셔서 참돔 51cm 잡았어요. 다음에 또 올게요!", date: "2026-05-08" },
  { author: "제주여행가족", rating: 5, text: "아이랑 같이 갔는데 너무 좋았어요. 즉석 회도 맛있었습니다.", date: "2026-04-27" },
  { author: "낚시초보탈출", rating: 4, text: "처음 좌대인데 잘 안내해줘서 감사했어요. 다만 화장실이 좀 좁았어요.", date: "2026-04-15" },
];

const maxReservation = Math.max(...MONTHLY_STATS.map(m => m.reservations));

export default function BizDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-black text-ocean-50">서귀포 황금좌대</h1>
            <span className="text-xs bg-hook/20 text-hook border border-hook/30 px-2 py-0.5 rounded-full font-bold">⭐ 프리미엄</span>
          </div>
          <p className="text-sm text-slate-400">사장님 안녕하세요, 황금수산 대표님 👋</p>
        </div>
        <div className="flex gap-2">
          <Link href="/jwaedae/jw1">
            <button className="px-4 py-2 bg-ocean-800 hover:bg-ocean-700 text-slate-300 rounded-xl text-sm transition-colors border border-ocean-700">
              내 업체 보기
            </button>
          </Link>
          <button className="px-4 py-2 bg-hook hover:bg-hook-light text-ocean-950 rounded-xl text-sm font-bold transition-colors">
            정보 수정
          </button>
        </div>
      </div>

      {/* KPI 카드 4개 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { icon: "📅", label: "이번 달 예약", value: "54건", sub: "▲ 전월 대비 +8건", color: "text-teal-400" },
          { icon: "💰", label: "이번 달 매출", value: "2,970만원", sub: "1인 평균 55,000원", color: "text-hook" },
          { icon: "👁", label: "업체 페이지 조회", value: "1,284회", sub: "이번 달 누적", color: "text-ocean-400" },
          { icon: "⭐", label: "평균 별점", value: "4.8", sub: "후기 142개", color: "text-hook" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-ocean-800 bg-ocean-900 p-4">
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <div className={`text-xl font-black ${kpi.color}`}>{kpi.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{kpi.label}</div>
            <div className="text-[10px] text-slate-600 mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 월별 예약 차트 */}
        <div className="lg:col-span-2 rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
            📊 월별 예약 현황
            <span className="text-xs text-slate-500 font-normal ml-auto">2026년</span>
          </h2>
          <div className="flex items-end gap-3 h-36">
            {MONTHLY_STATS.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-teal-400 font-bold">{m.reservations}</span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-ocean-600 to-ocean-400 transition-all"
                  style={{ height: `${(m.reservations / maxReservation) * 100}%` }}
                />
                <span className="text-[10px] text-slate-500">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-ocean-800 flex items-center justify-between text-xs text-slate-500">
            <span>1~5월 누계 예약: <span className="text-slate-300 font-bold">282건</span></span>
            <span>누계 매출: <span className="text-hook font-bold">1억 551만원</span></span>
          </div>
        </div>

        {/* 잔여석 현황 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-4">🛖 잔여석 현황</h2>
          <div className="space-y-3">
            {[
              { date: "5/17(토)", capacity: 30, booked: 22 },
              { date: "5/18(일)", capacity: 30, booked: 26 },
              { date: "5/19(월)", capacity: 30, booked: 9 },
              { date: "5/20(화)", capacity: 30, booked: 14 },
              { date: "5/21(수)", capacity: 30, booked: 18 },
            ].map(({ date, capacity, booked }) => {
              const rate = booked / capacity;
              const remaining = capacity - booked;
              return (
                <div key={date}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{date}</span>
                    <span className={remaining <= 5 ? "text-rose-400 font-bold" : "text-teal-400"}>
                      잔여 {remaining}석
                    </span>
                  </div>
                  <div className="h-2 bg-ocean-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${rate >= 0.9 ? "bg-rose-500" : rate >= 0.7 ? "bg-hook" : "bg-ocean-500"}`}
                      style={{ width: `${rate * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full mt-4 py-2 border border-ocean-700 hover:border-ocean-500 text-slate-400 hover:text-slate-200 rounded-xl text-xs transition-colors">
            일정 전체 관리 →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* 최근 예약 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <h2 className="font-bold text-slate-200 mb-4">📋 최근 예약</h2>
          <div className="space-y-2">
            {RECENT_RESERVATIONS.map((r) => {
              const statusStyle = {
                "확정": "bg-teal-900/60 text-teal-300 border-teal-800",
                "대기": "bg-hook/10 text-hook border-hook/30",
                "취소": "bg-rose-900/60 text-rose-400 border-rose-800",
              }[r.status];
              return (
                <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-ocean-800/40 hover:bg-ocean-800 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{r.name}</span>
                      <span className="text-xs text-slate-500">{r.people}명</span>
                    </div>
                    <div className="text-xs text-slate-500">{r.date} {r.time}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-hook">{r.amount.toLocaleString()}원</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusStyle}`}>{r.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 연결된 조황 리포트 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-200">🐟 연결된 조황 리포트</h2>
            <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">자동 연결</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">우리 업체 방문 낚시꾼이 올린 조황이 자동으로 연결돼요.</p>
          <div className="space-y-3">
            {RECENT_CATCHES.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-ocean-800/40 border border-ocean-800">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-slate-200">{c.author}</span>
                  <span className="text-xs text-hook">{"★".repeat(c.rating)}</span>
                </div>
                <p className="text-xs text-slate-400 mb-1">{c.fish}</p>
                <span className="text-[10px] text-slate-600">{c.date}</span>
              </div>
            ))}
          </div>
          <Link href="/catch">
            <button className="w-full mt-3 py-2 border border-ocean-700 hover:border-ocean-500 text-slate-400 hover:text-slate-200 rounded-xl text-xs transition-colors">
              전체 조황 보기 →
            </button>
          </Link>
        </div>
      </div>

      {/* 최근 리뷰 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-200">⭐ 최근 리뷰</h2>
          <div className="text-sm text-hook font-black">★ 4.8 <span className="text-slate-500 font-normal text-xs">(142개)</span></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {REVIEWS.map((r, i) => (
            <div key={i} className="p-3 rounded-xl bg-ocean-800/40">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-slate-200">{r.author}</span>
                <span className="text-xs text-hook">{"★".repeat(r.rating)}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">"{r.text}"</p>
              <span className="text-[10px] text-slate-600 mt-2 block">{r.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 프리미엄 업그레이드 배너 (무료 플랜일 때 표시) */}
      <div className="rounded-2xl border border-hook/30 bg-hook/5 p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <div className="font-bold text-hook mb-1">⭐ 프리미엄으로 업그레이드</div>
          <p className="text-sm text-slate-400">홈 메인 추천 업체 노출 + 검색 상단 고정. 월 39,000원으로 경쟁 업체보다 먼저 보입니다.</p>
        </div>
        <button className="shrink-0 px-6 py-2.5 bg-hook hover:bg-hook-light text-ocean-950 font-bold rounded-xl transition-colors text-sm">
          업그레이드 →
        </button>
      </div>
    </div>
  );
}
