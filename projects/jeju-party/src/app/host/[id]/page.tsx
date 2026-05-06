"use client";

import { useState } from "react";

// ── 더미 데이터 ────────────────────────────────────────────────────────────────

const HOST = {
  initial: "민",
  name: "서핑왕민준",
  badges: ["⭐ 슈퍼호스트", "신원확인 ✓"] as const,
  bio: "함덕에서 만나, 협재로 옮겨와 5년째 서핑을 가르치고 있어요. 처음 파도를 잡는 그 순간을 가장 좋아합니다. 초보자도 4시간 안에 라이딩 가능하게 돕는 게 목표예요.",
  location: "제주 협재 거주 · 서핑 강사 5년차 · 한국어/영어/일본어",
};

const METRICS = [
  { value: "4.92", label: "평균 별점", sub: "★ 178개 후기" },
  { value: "98%", label: "응답률", sub: "평균 12분 내" },
  { value: "<1%", label: "취소율", sub: "업계 평균 4.3%" },
  { value: "127", label: "진행 파티", sub: "최근 1년" },
];

const PARTIES = [
  { icon: "🏄", region: "협재", date: "5/10 (토)", title: "서핑 입문 클래스", joined: 5, max: 6, price: 65000 },
  {
    icon: "🏄",
    region: "함덕",
    date: "5/15 (목)",
    title: "서핑 중급반 — 라이딩 자세 교정",
    joined: 3,
    max: 4,
    price: 80000,
  },
  { icon: "🏄", region: "협재", date: "5/22 (금)", title: "서핑 + 노을 BBQ", joined: 2, max: 6, price: 95000 },
];

const REVIEWS = [
  {
    who: "민지 · 서울",
    date: "4/28",
    stars: 5,
    text: "완전 초보였는데 4시간 안에 첫 라이딩 성공! 호스트분이 너무 친절하시고 잘 가르쳐주셔서 너무 좋았어요.",
  },
  {
    who: "재훈 · 부산",
    date: "4/15",
    stars: 5,
    text: "장비도 다 챙겨주시고, 사진도 직접 찍어주시고 — 가격 대비 만족도 최고.",
  },
  {
    who: "은채 · 대구",
    date: "4/02",
    stars: 5,
    text: "무서워했는데 안전하게 단계별로 알려주셔서 자신감 생겼어요. 다음에도 신청할 듯.",
  },
  {
    who: "동현 · 인천",
    date: "3/20",
    stars: 4,
    text: "재밌었어요. 다만 인원이 좀 많아서 한 명씩 봐주는 시간이 짧았던 게 아쉬움.",
  },
];

const ABOUT_ITEMS = [
  { label: "전문 분야", value: "서핑 입문 / 중급 / 보드 코칭" },
  { label: "경력", value: "5년차 · 누적 1,200+ 클래스 · 안전사고 0건" },
  { label: "자격", value: "대한서핑협회 공인 강사 / 응급처치 자격" },
  { label: "언어", value: "한국어 (모국어), 영어 (유창), 일본어 (회화)" },
  { label: "주 활동 지역", value: "협재, 함덕, 중문 (이동 가능)" },
  { label: "한 줄 모토", value: '"두려움 없이 첫 파도를 잡게 도와드려요"' },
];

const STAR_DIST: [number, number][] = [
  [5, 92],
  [4, 6],
  [3, 1],
  [2, 0],
  [1, 1],
];

// ── 플레이스홀더 이미지 스타일 ────────────────────────────────────────────────
const PLACEHOLDER_STYLE = {
  background: "repeating-linear-gradient(45deg,#fef3e8,#fef3e8 8px,#fed7aa 8px,#fed7aa 16px)",
} as const;

type TabId = "parties" | "reviews" | "about";

const TABS: { id: TabId; label: string; count?: number | string }[] = [
  { id: "parties", label: "운영 중인 파티", count: PARTIES.length },
  { id: "reviews", label: "후기", count: "178+" },
  { id: "about", label: "호스트 소개" },
];

// ── 컴포넌트 ────────────────────────────────────────────────────────────────

export default function HostProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("parties");

  return (
    <div className="min-h-screen bg-slate-50">

      {/* 커버 이미지 */}
      <div className="h-48 w-full" style={PLACEHOLDER_STYLE} />

      {/* 프로필 카드 — 커버 위 오버랩 */}
      <section className="px-4 md:px-10 -mt-16 relative z-10 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-start">
          {/* 아바타 */}
          <div className="w-24 h-24 rounded-2xl bg-cyan-400 grid place-items-center text-3xl font-black text-white border-4 border-white shadow-lg flex-shrink-0">
            {HOST.initial}
          </div>

          {/* 이름 + 소개 */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">{HOST.name}</h1>
              <span className="font-mono text-[11px] px-2 py-1 rounded bg-slate-900 text-amber-300 font-extrabold">
                {HOST.badges[0]}
              </span>
              <span className="font-mono text-[11px] px-2 py-1 rounded bg-emerald-100 text-emerald-700 font-extrabold">
                {HOST.badges[1]}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1.5">{HOST.location}</p>
            <p className="text-sm text-slate-700 mt-3 leading-relaxed max-w-2xl">{HOST.bio}</p>
          </div>

          {/* CTA 버튼 */}
          <div className="flex md:flex-col gap-2 flex-shrink-0">
            <button className="px-4 py-2 bg-orange-500 text-white text-sm font-extrabold rounded-lg whitespace-nowrap hover:bg-orange-600 transition-colors active:scale-95">
              메시지 보내기
            </button>
            <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg whitespace-nowrap hover:border-slate-300 transition-colors">
              팔로우
            </button>
          </div>
        </div>
      </section>

      {/* 신뢰 지표 */}
      <section className="max-w-4xl mx-auto px-4 md:px-10 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {METRICS.map(({ value, label, sub }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
              <p className="text-2xl md:text-3xl font-black text-slate-900 tabular-nums">{value}</p>
              <p className="text-xs font-bold text-slate-700 mt-1">{label}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 탭 바 */}
      <div className="bg-white border-b border-slate-200 sticky top-[36px] z-30">
        <div className="max-w-4xl mx-auto px-4 md:px-10 flex gap-6 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
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
                {tab.count !== undefined && (
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
      <main className="max-w-4xl mx-auto px-4 md:px-10 py-6">
        {/* 운영 중인 파티 */}
        {activeTab === "parties" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PARTIES.map((p, i) => {
              const left = p.max - p.joined;
              return (
                <article
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden hover:border-orange-300 hover:shadow-lg transition-all"
                >
                  <div className="relative h-36" style={PLACEHOLDER_STYLE}>
                    <div className="absolute inset-0 grid place-items-center text-4xl opacity-40">
                      {p.icon}
                    </div>
                    <span className="absolute top-2 right-2 font-mono text-[10px] px-2 py-0.5 rounded bg-rose-500 text-white font-extrabold">
                      {left}자리
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-mono text-slate-500">
                      {p.region} · {p.date}
                    </p>
                    <h3 className="font-extrabold text-slate-900 mt-1 leading-snug line-clamp-2 min-h-[2.5em]">
                      {p.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-500 tabular-nums">
                        {p.joined}/{p.max}명
                      </p>
                      <p className="text-base font-extrabold tabular-nums">
                        ₩{(p.price / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* 후기 */}
        {activeTab === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
            {/* 별점 분포 */}
            <aside>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sticky top-[100px]">
                <p className="text-5xl font-black text-slate-900">4.92</p>
                <p className="text-amber-400 text-sm mt-1">★★★★★</p>
                <p className="text-xs text-slate-500 mt-1">178개 후기</p>
                <div className="mt-5 space-y-1.5">
                  {STAR_DIST.map(([s, pct]) => (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      <span className="w-3 font-mono">{s}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right font-mono text-slate-500 tabular-nums">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* 리뷰 목록 */}
            <div className="space-y-3">
              {REVIEWS.map((r, i) => (
                <article key={i} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{r.who}</p>
                        <p className="text-amber-400 text-xs">
                          {"★".repeat(r.stars)}
                          <span className="text-slate-200">{"★".repeat(5 - r.stars)}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{r.date}</span>
                  </div>
                  <p className="text-sm text-slate-700 mt-3 leading-relaxed">{r.text}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* 호스트 소개 */}
        {activeTab === "about" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {ABOUT_ITEMS.map(({ label, value }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-400">{label}</p>
                <p className="font-bold text-slate-900 mt-1.5">{value}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 파티 신청하기 — 고정 CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-t border-slate-200 px-4 py-3 flex items-center justify-between gap-3 max-w-4xl mx-auto">
        <div>
          <p className="text-xs text-slate-500">서핑왕민준의 파티</p>
          <p className="text-sm font-extrabold text-slate-900">
            ₩{(PARTIES[0].price / 1000).toFixed(0)}K ~
            <span className="text-xs font-normal text-slate-400 ml-1">1인 기준</span>
          </p>
        </div>
        <button className="px-6 py-3 bg-orange-500 text-white font-extrabold rounded-xl hover:bg-orange-600 transition-colors active:scale-95 shadow-sm">
          파티 신청하기
        </button>
      </div>

      {/* CTA 높이만큼 하단 여백 */}
      <div className="h-20" />
    </div>
  );
}
