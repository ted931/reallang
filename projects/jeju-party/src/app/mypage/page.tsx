"use client";

import { useState } from "react";

// ── 더미 데이터 ────────────────────────────────────────────────────────────────

const UPCOMING = [
  {
    icon: "🏄",
    region: "협재",
    date: "5/10 (토) 10:00",
    title: "서핑 입문 클래스",
    host: "서핑왕민준",
    dDay: 4,
    status: "확정" as const,
  },
  {
    icon: "⛰",
    region: "성산",
    date: "5/15 (목) 05:30",
    title: "성산일출봉 일출 가이드",
    host: "제주토박이",
    dDay: 9,
    status: "확정" as const,
  },
  {
    icon: "☕",
    region: "애월",
    date: "5/18 (일) 12:00",
    title: "감성 카페 5곳 호핑",
    host: "카페조이",
    dDay: 12,
    status: "대기 중" as const,
  },
];

const PAST = [
  { icon: "🚴", region: "우도", date: "4/12 (일)", title: "우도 전기자전거", stars: 5, reviewed: true },
  { icon: "☕", region: "서귀포", date: "4/05 (토)", title: "서귀포 카페 호핑", stars: 4, reviewed: true },
  { icon: "📷", region: "동복", date: "3/28 (금)", title: "동복 포토 출사", stars: 0, reviewed: false },
];

const HOSTING = [
  {
    icon: "🚴",
    region: "한림",
    date: "5/22 (금)",
    title: "한림 자전거 라이딩 — 초보환영",
    joined: 3,
    max: 6,
    status: "모집중",
  },
];

const FAVORITES = [
  { icon: "🤿", region: "성산", title: "제주 해녀 체험", price: 120000 },
  { icon: "🏄", region: "협재", title: "서핑 데이 패스", price: 55000 },
  { icon: "⛰", region: "한라산", title: "백록담 당일 등반", price: 80000 },
  { icon: "☕", region: "애월", title: "책방 + 흑돼지 + 자전거", price: 120000 },
];

const STATS = [
  { value: "12", label: "참여한 파티" },
  { value: "3", label: "만든 파티" },
  { value: "9", label: "작성한 후기" },
  { value: "4.9", label: "받은 별점" },
];

type TabId = "upcoming" | "past" | "hosting" | "favorites";

const TABS: { id: TabId; label: string; count: number }[] = [
  { id: "upcoming", label: "예정 일정", count: UPCOMING.length },
  { id: "past", label: "지난 일정", count: PAST.length },
  { id: "hosting", label: "내가 만든 파티", count: HOSTING.length },
  { id: "favorites", label: "찜", count: FAVORITES.length },
];

// ── 플레이스홀더 이미지 스타일 ────────────────────────────────────────────────
const PLACEHOLDER_STYLE = {
  background: "repeating-linear-gradient(45deg,#fef3e8,#fef3e8 8px,#fed7aa 8px,#fed7aa 16px)",
} as const;

// ── 컴포넌트 ────────────────────────────────────────────────────────────────

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("upcoming");

  return (
    <div className="min-h-screen bg-slate-50">

      {/* 앱 내비 */}
      <nav className="px-6 h-14 border-b border-slate-200 bg-white flex items-center justify-between sticky top-[36px] z-40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 grid place-items-center text-white font-black text-sm select-none">
            P
          </div>
          <span className="font-extrabold text-slate-900">jeju.party</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-sm font-bold text-slate-700">
          <a href={process.env.NEXT_PUBLIC_BASE_PATH || "/"} className="hover:text-orange-600 transition-colors">홈</a>
          <a href="#" className="hover:text-orange-600 transition-colors">파티</a>
          <a href="#" className="hover:text-orange-600 transition-colors">AI 일정</a>
          <a href="#" className="hover:text-orange-600 transition-colors">렌터카</a>
          <a href="#" className="hover:text-orange-600 transition-colors">카페패스</a>
        </div>
        <div className="w-8 h-8 rounded-full bg-amber-300 grid place-items-center text-white font-black text-xs cursor-pointer">
          민
        </div>
      </nav>

      {/* 프로필 헤더 */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-400 text-white px-6 md:px-10 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start gap-4 flex-wrap">
            <div
              className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur grid place-items-center text-2xl font-black border-2 border-white/40 flex-shrink-0"
              aria-label="프로필 아바타"
            >
              민
            </div>
            <div className="flex-1 min-w-[180px]">
              <h1 className="text-2xl font-black">민지</h1>
              <p className="text-sm opacity-90 mt-0.5">jeju.party 가입 4개월차 · 서울에서 자주 와요</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="font-mono text-[10px] px-2 py-1 rounded bg-white/20 backdrop-blur border border-white/30 font-bold">
                  ⭐ 호스트 4.9
                </span>
                <span className="font-mono text-[10px] px-2 py-1 rounded bg-white/20 backdrop-blur border border-white/30 font-bold">
                  참여 12회
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="px-3 py-2 bg-white/20 backdrop-blur border border-white/30 rounded-lg text-xs font-bold hover:bg-white/30 transition-colors">
                프로필 수정
              </button>
              <button className="px-3 py-2 bg-white text-orange-600 rounded-lg text-xs font-extrabold hover:bg-orange-50 transition-colors">
                호스트 모드 →
              </button>
            </div>
          </div>

          {/* 통계 그리드 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-3"
              >
                <p className="text-2xl font-black tabular-nums">{value}</p>
                <p className="text-[10px] font-mono uppercase tracking-widest opacity-70 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 탭 바 */}
      <div className="bg-white border-b border-slate-200 sticky top-[86px] z-30">
        <div className="max-w-3xl mx-auto px-6 flex gap-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab) => {
            const isOn = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 py-4 text-sm font-bold border-b-2 -mb-px transition-colors ${
                  isOn
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
                aria-selected={isOn}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-1.5 font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                      isOn ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <main className="max-w-3xl mx-auto px-6 py-6 space-y-3">
        {/* 예정 일정 */}
        {activeTab === "upcoming" && (
          <>
            {UPCOMING.map((p, i) => (
              <article
                key={i}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:border-orange-300 transition-colors"
              >
                <div className="grid grid-cols-[100px_1fr_auto]">
                  {/* D-Day 컬럼 */}
                  <div
                    className={`p-4 grid place-items-center text-white ${
                      p.status === "확정" ? "bg-orange-500" : "bg-amber-400"
                    }`}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-widest opacity-80">D-{p.dDay}</p>
                    <p className="text-3xl font-black mt-0.5 tabular-nums">{p.dDay}</p>
                    <p className="text-[10px] font-mono mt-0.5 opacity-90">{p.status}</p>
                  </div>
                  {/* 정보 */}
                  <div className="p-4">
                    <p className="text-[11px] font-mono text-slate-500">
                      {p.region} · {p.date}
                    </p>
                    <h3 className="font-extrabold text-slate-900 mt-1 leading-snug flex items-center gap-2">
                      <span className="text-xl">{p.icon}</span>
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">호스트 {p.host}</p>
                  </div>
                  {/* 액션 */}
                  <div className="p-4 flex flex-col gap-2 justify-center">
                    <button className="px-4 py-1.5 text-xs font-bold border border-slate-200 rounded-lg whitespace-nowrap hover:border-slate-300 transition-colors">
                      상세
                    </button>
                    <button className="px-4 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 rounded-lg whitespace-nowrap hover:bg-rose-50 transition-colors">
                      취소
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </>
        )}

        {/* 지난 일정 */}
        {activeTab === "past" && (
          <>
            {PAST.map((p, i) => (
              <article
                key={i}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center"
              >
                <div
                  className="w-12 h-12 rounded-xl grid place-items-center text-2xl flex-shrink-0"
                  style={PLACEHOLDER_STYLE}
                >
                  {p.icon}
                </div>
                <div>
                  <p className="text-[11px] font-mono text-slate-500">
                    {p.region} · {p.date}
                  </p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{p.title}</h3>
                  {p.reviewed ? (
                    <p className="text-amber-400 text-sm mt-1">
                      {"★".repeat(p.stars)}
                      <span className="text-slate-200">{"★".repeat(5 - p.stars)}</span>
                    </p>
                  ) : (
                    <p className="text-slate-300 text-sm mt-1">★★★★★</p>
                  )}
                </div>
                {p.reviewed ? (
                  <span className="font-mono text-[10px] px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-bold whitespace-nowrap">
                    후기 작성 완료
                  </span>
                ) : (
                  <button className="px-3 py-2 bg-orange-500 text-white text-xs font-extrabold rounded-lg whitespace-nowrap hover:bg-orange-600 transition-colors active:scale-95">
                    후기 쓰기 →
                  </button>
                )}
              </article>
            ))}
          </>
        )}

        {/* 내가 만든 파티 */}
        {activeTab === "hosting" && (
          <>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
              <p className="text-sm text-slate-700">
                현재 운영 중인 파티{" "}
                <strong className="text-orange-600">{HOSTING.length}개</strong> · 슈퍼호스트까지 5건 남음
              </p>
              <button className="px-4 py-2 bg-orange-500 text-white text-sm font-extrabold rounded-lg hover:bg-orange-600 transition-colors active:scale-95">
                새 파티 만들기 +
              </button>
            </div>
            {HOSTING.map((p, i) => {
              const fillPct = (p.joined / p.max) * 100;
              return (
                <article
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 grid grid-cols-[auto_1fr_180px] gap-4 items-center"
                >
                  <div
                    className="w-12 h-12 rounded-xl grid place-items-center text-2xl flex-shrink-0"
                    style={PLACEHOLDER_STYLE}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-slate-500">
                      {p.region} · {p.date}
                    </p>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">{p.title}</h3>
                    <span className="mt-1.5 inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      {p.status}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className="text-slate-500">
                        {p.joined}/{p.max}명
                      </span>
                      <span className="text-orange-600 font-bold">{p.max - p.joined}자리</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-orange-500 transition-all"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <button className="w-full mt-2 py-1.5 text-xs font-extrabold border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                      관리
                    </button>
                  </div>
                </article>
              );
            })}
          </>
        )}

        {/* 찜한 파티 */}
        {activeTab === "favorites" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FAVORITES.map((p, i) => (
              <article
                key={i}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all"
              >
                <div className="relative h-32" style={PLACEHOLDER_STYLE}>
                  <div className="absolute inset-0 grid place-items-center text-4xl opacity-30">
                    {p.icon}
                  </div>
                  <button
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 grid place-items-center text-rose-500 hover:bg-white transition-colors"
                    aria-label="찜 해제"
                  >
                    ♥
                  </button>
                </div>
                <div className="p-3.5">
                  <p className="text-[10px] font-mono text-slate-500">{p.region}</p>
                  <h3 className="font-extrabold text-slate-900 text-sm mt-0.5 line-clamp-2 min-h-[2.5em]">
                    {p.title}
                  </h3>
                  <p className="text-sm font-extrabold tabular-nums mt-2">
                    ₩{(p.price / 1000).toFixed(0)}K
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 설정 · 로그아웃 */}
      <section className="max-w-3xl mx-auto px-6 pb-10">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">설정</h2>
        <div className="space-y-2">
          {(
            [
              ["👤", "계정 정보", "이메일·비밀번호·휴대폰"],
              ["🔔", "알림", "파티 알림 / 마감 알림 / 마케팅"],
              ["💳", "결제 수단", "카드 2장 · 카카오페이 연결됨"],
              ["📍", "관심 지역 / 활동", "맞춤 추천 정확도 향상"],
              ["🛡", "보안", "2FA · 로그인 기록"],
              ["📜", "약관 / 개인정보처리방침", ""],
              ["🚪", "로그아웃", ""],
            ] as [string, string, string][]
          ).map(([icon, title, sub]) => (
            <button
              key={title}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 hover:border-orange-300 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 grid place-items-center text-xl flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-slate-900 text-sm">{title}</p>
                {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
              </div>
              <span className="text-slate-300 text-sm">→</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
