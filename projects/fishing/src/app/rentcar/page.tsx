"use client";
import { useState } from "react";
import { DUMMY_RENTCAR, REGION_LIST, CAR_TYPE_LABEL, type RentCar } from "@/lib/dummy-rentcar";

const SORT_OPTIONS = ["가격순", "할인율순"];
const TYPE_FILTERS: Array<RentCar["type"] | "전체"> = ["전체", "sedan", "suv", "van"];

function discountPct(regular: number, today: number) {
  return Math.round(((regular - today) / regular) * 100);
}

export default function RentCarPage() {
  const [region, setRegion] = useState("전체");
  const [typeFilter, setTypeFilter] = useState<RentCar["type"] | "전체">("전체");
  const [sort, setSort] = useState("가격순");
  const [reserved, setReserved] = useState<Set<string>>(new Set());

  const filtered = DUMMY_RENTCAR
    .filter((c) => {
      if (region !== "전체" && c.region !== region) return false;
      if (typeFilter !== "전체" && c.type !== typeFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "가격순") return a.todayPrice - b.todayPrice;
      return discountPct(b.regularPrice, b.todayPrice) - discountPct(a.regularPrice, a.todayPrice);
    });

  function handleReserve(id: string) {
    setReserved((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }

  return (
    <>
      {/* ── 히어로 ── */}
      <div className="fl-catch-hero">
        <div className="fl-catch-hero-glow" />
        <div className="fl-catch-hero-inner">
          <div className="fl-catch-hero-kicker">RENTCAR</div>
          <h1 className="fl-catch-hero-title">
            당일 <span className="fl-hero-accent">땡처리 렌트</span>
          </h1>
          <div className="fl-catch-hero-meta">
            <span>🚗 오늘 가용 {DUMMY_RENTCAR.length}대</span>
            <span className="fl-cond-sep" />
            <span>💸 최대 40% 할인</span>
            <span className="fl-cond-sep" />
            <span>📍 제주 전역</span>
          </div>

          {/* 긴급 타이머 배지 */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black"
            style={{
              background: "linear-gradient(135deg, var(--hook), #c0392b)",
              color: "#fff",
              boxShadow: "0 4px 16px rgba(233,78,59,0.45)",
            }}>
            <span className="animate-pulse">🔥</span>
            오늘만 이 가격! · 자정 자동 소멸
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </div>

      {/* ── 필터 영역 ── */}
      <div className="px-4 pt-5 pb-2 max-w-5xl mx-auto w-full">
        {/* 지역 필터 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-bold shrink-0" style={{ color: "var(--text-dim)" }}>📍 지역</span>
          <div className="flex gap-1.5 flex-wrap">
            {REGION_LIST.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  region === r
                    ? "bg-hook text-white"
                    : "bg-ocean-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 차종 + 정렬 */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold shrink-0" style={{ color: "var(--text-dim)" }}>🚘 차종</span>
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  typeFilter === t
                    ? "bg-hook text-white"
                    : "bg-ocean-800 text-slate-400 hover:text-slate-200"
                }`}
              >
                {t === "전체" ? "전체" : CAR_TYPE_LABEL[t]}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-1.5">
            {SORT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                  sort === s
                    ? "border-hook text-hook bg-hook/10"
                    : "border-ocean-700 text-slate-500 hover:text-slate-300"
                }`}
                style={{ background: sort === s ? "rgba(233,78,59,0.08)" : undefined }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 결과 수 */}
        <p className="text-xs mt-3" style={{ color: "var(--text-mute)" }}>
          <strong style={{ color: "var(--hook)" }}>{filtered.length}</strong>대의 땡처리 차량
        </p>
      </div>

      {/* ── 카드 그리드 ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--text-mute)" }}>
          조건에 맞는 차량이 없습니다
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-4 lg:px-0 pb-8 max-w-5xl mx-auto w-full">
          {filtered.map((car) => {
            const pct = discountPct(car.regularPrice, car.todayPrice);
            const done = reserved.has(car.id);
            return (
              <article
                key={car.id}
                className="rounded-2xl border p-4 flex flex-col gap-3 transition-colors"
                style={{
                  background: "var(--ocean-900)",
                  borderColor: car.fishingFriendly
                    ? "rgba(245,158,11,0.35)"
                    : "var(--line-2)",
                  boxShadow: car.fishingFriendly
                    ? "0 0 0 1px rgba(245,158,11,0.12), 0 6px 20px rgba(245,158,11,0.08)"
                    : "0 2px 8px var(--tint-05)",
                }}
              >
                {/* 상단 배지 행 */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{car.emoji}</span>
                    <div>
                      <div className="font-black text-base leading-tight" style={{ color: "var(--text-strong)" }}>
                        {car.name}
                      </div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                        {CAR_TYPE_LABEL[car.type]} · 최대 {car.seats}인 · {car.company}
                      </div>
                    </div>
                  </div>
                  {/* 할인율 배지 */}
                  <div
                    className="shrink-0 flex flex-col items-center px-2.5 py-1 rounded-xl font-black text-white text-center"
                    style={{
                      background: "linear-gradient(135deg, var(--hook), #c0392b)",
                      boxShadow: "0 3px 10px rgba(233,78,59,0.35)",
                      minWidth: 44,
                    }}
                  >
                    <span className="text-lg leading-none">-{pct}%</span>
                    <span className="text-[9px] font-semibold opacity-80 mt-0.5">오늘만</span>
                  </div>
                </div>

                {/* 픽업 위치 */}
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-dim)" }}>
                  <span>📍</span>
                  <span>{car.region}</span>
                  <span style={{ color: "var(--text-mute)" }}>·</span>
                  <span style={{ color: "var(--text)" }}>{car.pickupSpot}</span>
                </div>

                {/* 가격 */}
                <div className="flex items-end gap-2">
                  <span
                    className="text-2xl font-black leading-none"
                    style={{ color: "var(--hook)" }}
                  >
                    {car.todayPrice.toLocaleString()}원
                  </span>
                  <span className="text-xs pb-0.5 line-through" style={{ color: "var(--text-mute)" }}>
                    {car.regularPrice.toLocaleString()}원
                  </span>
                  <span className="text-[10px] pb-0.5 ml-auto" style={{ color: "var(--text-mute)" }}>
                    /1일
                  </span>
                </div>

                {/* 픽업 마감 시간 */}
                <div
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
                  style={{
                    background: "var(--tint-05)",
                    border: "1px solid var(--line)",
                    color: "var(--text-dim)",
                  }}
                >
                  <span className="text-yellow-400">⏰</span>
                  <span>오늘 <strong style={{ color: "var(--text-strong)" }}>{car.availableUntil}</strong>까지 픽업 가능</span>
                </div>

                {/* 피처 태그 */}
                <div className="flex flex-wrap gap-1">
                  {car.fishingFriendly && (
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                      style={{
                        background: "rgba(245,158,11,0.15)",
                        color: "#f59e0b",
                        border: "1px solid rgba(245,158,11,0.3)",
                      }}
                    >
                      🎣 낚시 최적
                    </span>
                  )}
                  {car.features.map((f) => (
                    <span
                      key={f}
                      className="text-[10px] px-2.5 py-1 rounded-full"
                      style={{
                        background: "var(--tint-06)",
                        color: "var(--text-dim)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* 예약 버튼 */}
                {done ? (
                  <div
                    className="w-full py-2.5 rounded-xl text-sm font-black text-center"
                    style={{
                      background: "rgba(22,163,74,0.15)",
                      color: "#4ade80",
                      border: "1px solid rgba(22,163,74,0.3)",
                    }}
                  >
                    ✓ 예약 완료
                  </div>
                ) : (
                  <button
                    onClick={() => handleReserve(car.id)}
                    className="w-full py-2.5 rounded-xl text-sm font-black transition-all active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, var(--hook), #c0392b)",
                      color: "#fff",
                      boxShadow: "0 4px 14px rgba(233,78,59,0.35)",
                    }}
                  >
                    지금 예약
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
