"use client";

import { useState, useMemo, useEffect } from "react";
import { HOBBY_CATEGORIES, REGIONS, type Party } from "@/lib/types";
import { DUMMY_PARTIES } from "@/lib/dummy-parties";
import { PARTNER_OFFERS } from "@/lib/dummy-partners";
import { BasicPartnerCard } from "@/components/partner-offer-card";

// ── 카테고리 큐레이션 (홈 전용 — 대표 8종) ──────────────────────────────
const CURATED_CATS = [
  { id: "cycling",  icon: "🚴", label: "자전거",       color: "sky"     },
  { id: "hiking",   icon: "⛰️", label: "등산/오름",    color: "emerald" },
  { id: "fishing",  icon: "🎣", label: "낚시",         color: "blue"    },
  { id: "surfing",  icon: "🏄", label: "서핑",         color: "cyan"    },
  { id: "running",  icon: "🏃", label: "러닝",         color: "rose"    },
  { id: "cafe",     icon: "☕", label: "카페투어",     color: "amber"   },
  { id: "photo",    icon: "📸", label: "포토투어",     color: "violet"  },
  { id: "diving",   icon: "🤿", label: "스노클/다이빙", color: "teal"   },
] as const;

// 필터 칩 설정 ──────────────────────────────────────────────────────────────
const EXTRA_FILTERS = [
  { id: "free",      label: "무료",       emoji: "🎁" },
  { id: "beginner",  label: "초보환영",   emoji: "🌱" },
  { id: "dawn",      label: "새벽",       emoji: "🌅" },
  { id: "superhost", label: "슈퍼호스트", emoji: "⭐" },
] as const;

export default function PartyFeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion,   setSelectedRegion]   = useState<string>("");
  const [filterPet,        setFilterPet]        = useState(false);
  const [filterStay,       setFilterStay]       = useState(false);
  const [parties]                               = useState<Party[]>(DUMMY_PARTIES);
  const [shopMap, setShopMap]                   = useState<Record<string, { name: string; slug: string; category: string }>>({});

  // 추가 필터 (무료 / 초보환영 / 새벽 / 슈퍼호스트)
  const [extraFilters, setExtraFilters] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("http://localhost:3001/api/shops")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, { name: string; slug: string; category: string }> = {};
        (data.shops || []).filter((s: any) => s.isPublished).forEach((s: any) => {
          map[s.slug] = { name: s.name, slug: s.slug, category: s.category };
        });
        setShopMap(map);
      })
      .catch(() => {});
  }, []);

  const toggleExtra = (id: string) =>
    setExtraFilters((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    return parties.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedRegion   && p.region   !== selectedRegion)   return false;
      if (filterPet  && !p.petFriendly)           return false;
      if (filterStay && p.stayMode !== "stay")    return false;
      if (extraFilters.has("free")      && p.costType !== "free")                          return false;
      if (extraFilters.has("beginner")  && !p.tags.some((t) => t.includes("초보")))       return false;
      if (extraFilters.has("dawn")      && !p.tags.some((t) => t.includes("새벽")))       return false;
      if (extraFilters.has("superhost") && !(p.hostRating >= 4.8 && p.hostPartyCount >= 10)) return false;
      return true;
    });
  }, [parties, selectedCategory, selectedRegion, filterPet, filterStay, extraFilters]);

  // 인기 파티 (잔여석 2자리 이하인 파티 최대 4개)
  const hotParties = useMemo(() =>
    parties
      .filter((p) => p.maxMembers - p.currentMembers <= 2)
      .slice(0, 4),
    [parties]
  );

  const formatDate = (d: string) => {
    const date = new Date(d);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
  };

  const getCat = (id: string) => HOBBY_CATEGORIES.find((c) => c.id === id);

  const getPartnerBannerOffers = (slotIndex: number) => {
    const pool = selectedCategory
      ? PARTNER_OFFERS.filter(
          (o) => o.targetCategories.includes(selectedCategory) || o.targetCategories.includes("all")
        )
      : PARTNER_OFFERS.filter((o) => o.targetCategories.includes("all"));
    if (pool.length === 0) return [];
    const start = (slotIndex * 3) % pool.length;
    return [...pool.slice(start, start + 3), ...pool.slice(0, Math.max(0, start + 3 - pool.length))].slice(0, 3);
  };

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // 카테고리 버튼 클릭 시 필터 섹션으로 스크롤
  const handleCatClick = (id: string) => {
    setSelectedCategory(id === selectedCategory ? "" : id);
    document.getElementById("party-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── 헤더 ─────────────────────────────────────────────────────────── */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 grid place-items-center text-white font-black text-sm select-none">
                P
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 leading-none">
                  jeju<span className="text-orange-500">.party</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">같이 놀 사람 찾기</p>
              </div>
            </div>
            <a
              href={`${basePath}/create`}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
            >
              + 파티 만들기
            </a>
          </div>
        </div>
      </header>

      {/* ── 히어로 ───────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 75% 30%, #fed7aa 0%, transparent 55%), radial-gradient(ellipse at 15% 85%, #ffedd5 0%, transparent 50%), #fff7ed",
        }}
      >
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-600 font-bold mb-4">
            🌿 제주에서 함께 즐길 사람을 찾아요
          </span>

          <h2 className="text-3xl font-black text-slate-900 leading-[1.15] tracking-tight mb-3">
            혼자 와도<br />
            <span className="text-orange-500">함께 떠나는</span> 제주 여행
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-sm mb-6">
            자전거·서핑·오름·카페투어 — 같은 시간, 같은 코스를 함께할 친구를 매칭해드려요.
          </p>

          {/* 검색 바 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-1 shadow-xl shadow-orange-500/10 mb-4">
            <input
              className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"
              placeholder="어떤 파티 찾으세요? '서핑', '한라산', '카페투어'..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (v) document.getElementById("party-list")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-5 py-2.5 rounded-xl text-sm transition-colors">
              검색
            </button>
          </div>

          {/* 빠른 검색어 */}
          <div className="flex flex-wrap gap-1.5 text-xs items-center">
            <span className="text-slate-400 font-medium">자주 찾는:</span>
            {["일출 가이드", "서핑 입문", "카페투어", "한라산"].map((v) => (
              <button
                key={v}
                className="text-orange-600 font-bold hover:underline"
                onClick={() =>
                  document.getElementById("party-list")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                #{v}
              </button>
            ))}
          </div>
        </div>

        {/* 통계 바 */}
        <div className="border-t border-orange-200/60 bg-white/40 backdrop-blur">
          <div className="max-w-3xl mx-auto px-4 py-4 grid grid-cols-4 gap-2 text-center">
            {[
              ["148", "진행 중인 파티"],
              ["2,340명", "이번 달 매칭"],
              ["67명", "슈퍼호스트"],
              ["4.86 ★", "평균 별점"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-lg font-black text-slate-900 tabular-nums leading-none">{v}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 카테고리 큐레이션 ─────────────────────────────────────────────── */}
      <section className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">카테고리별 둘러보기</h2>
              <p className="text-xs text-slate-500 mt-0.5">관심 가는 활동을 골라 바로 시작해요.</p>
            </div>
            <button
              className="text-xs font-bold text-orange-600 hover:underline"
              onClick={() =>
                document.getElementById("party-list")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              전체 보기 →
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {CURATED_CATS.map((c) => {
              const count = parties.filter((p) => p.category === c.id).length;
              const isActive = selectedCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleCatClick(c.id)}
                  className={`rounded-2xl p-3 text-center hover:-translate-y-0.5 transition-all border ${
                    isActive
                      ? "border-orange-400 bg-orange-50 shadow-sm"
                      : "border-slate-200 bg-white hover:border-orange-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 grid place-items-center text-xl mx-auto mb-2">
                    {c.icon}
                  </div>
                  <p className="text-xs font-extrabold text-slate-900 leading-tight">{c.label}</p>
                  <p className="text-[9px] font-mono text-slate-400 mt-0.5">{count}개</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 마감 임박 HOT 섹션 ───────────────────────────────────────────── */}
      {hotParties.length > 0 && (
        <section className="py-8 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-end justify-between mb-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-rose-100 text-rose-600 font-bold">
                  🔥 마감 임박
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1.5">
                  놓치면 후회할 파티
                </h2>
              </div>
              <button
                className="text-xs font-bold text-orange-600 hover:underline"
                onClick={() =>
                  document.getElementById("party-list")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                더 보기 →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {hotParties.map((p) => {
                const cat = getCat(p.category);
                const spotsLeft = p.maxMembers - p.currentMembers;
                const isCommercial = p.partyType === "commercial";
                return (
                  <a
                    key={p.id}
                    href={`${basePath}/party/${p.id}`}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all block"
                  >
                    {/* 플레이스홀더 이미지 */}
                    <div
                      className="relative h-28"
                      style={{
                        background:
                          "repeating-linear-gradient(45deg,#fef3e8,#fef3e8 8px,#fed7aa 8px,#fed7aa 16px)",
                      }}
                    >
                      <div className="absolute inset-0 grid place-items-center text-4xl opacity-30">
                        {cat?.emoji}
                      </div>
                      <span className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500 text-white font-extrabold animate-pulse">
                        {spotsLeft}자리
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-[9px] font-mono text-slate-500">{p.region}</p>
                      <h3 className="font-extrabold text-slate-900 text-xs mt-0.5 leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 grid place-items-center text-[9px] font-extrabold text-white">
                            {p.hostName[0]}
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 truncate max-w-[60px]">
                            {p.hostName}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold tabular-nums text-orange-600">
                          {isCommercial && p.pricePerSeat
                            ? `₩${(p.pricePerSeat / 1000).toFixed(0)}K`
                            : p.costType === "free"
                            ? "무료"
                            : p.costAmount
                            ? `₩${(p.costAmount / 1000).toFixed(0)}K`
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── AI 일정 + 서비스 배너 ──────────────────────────────────────────── */}
      <section className="py-8 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4">
          {/* AI 배너 */}
          <div
            className="rounded-2xl overflow-hidden p-6 text-white mb-4"
            style={{
              background:
                "linear-gradient(135deg, #7c3aed 0%, #ea580c 60%, #f59e0b 100%)",
            }}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-80">
              ✨ AI · 일정 짜기
            </span>
            <h3 className="text-xl font-black mt-1.5 leading-tight">
              3분 만에 나만의 제주 일정
            </h3>
            <p className="text-sm opacity-90 mt-2 max-w-xs">
              날짜와 분위기만 알려주세요. AI가 카페·맛집·파티까지 동선 따라 짜드려요.
            </p>
            <button className="mt-4 px-5 py-2 bg-white text-orange-600 font-extrabold rounded-xl text-sm hover:bg-orange-50 transition-colors">
              AI 일정 만들기 →
            </button>
          </div>

          {/* 렌터카 + 카페패스 */}
          <div className="grid grid-cols-2 gap-3">
            <a className="group bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-4 transition-all flex gap-3 items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-100 grid place-items-center text-xl shrink-0">
                🚗
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-mono uppercase tracking-widest text-blue-600 font-bold">RENTCAR</p>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 leading-tight">렌터카 최저가</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">평균 32% 할인 →</p>
              </div>
            </a>
            <a className="group bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-4 transition-all flex gap-3 items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-100 grid place-items-center text-xl shrink-0">
                ☕
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-mono uppercase tracking-widest text-amber-600 font-bold">CAFE PASS</p>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5 leading-tight">카페패스 무제한</h4>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">3일권 ₩29,000 →</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── 파티 목록 ────────────────────────────────────────────────────── */}
      <main id="party-list" className="max-w-3xl mx-auto px-4 py-6">

        {/* 카테고리 필터 칩 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-1" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setSelectedCategory("")}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
              !selectedCategory
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            ✨ 전체
          </button>
          {HOBBY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-1" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setSelectedRegion("")}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
              !selectedRegion
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            전체 지역
          </button>
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(selectedRegion === r ? "" : r)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
                selectedRegion === r
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* 특수 필터 행 — 애견동반 / 한달살기 / 추가 필터 4종 */}
        <div className="flex gap-2 pb-3 mb-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <button
            onClick={() => setFilterPet(!filterPet)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
              filterPet
                ? "bg-amber-500 text-white border-amber-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            🐶 애견동반
          </button>
          <button
            onClick={() => setFilterStay(!filterStay)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
              filterStay
                ? "bg-teal-500 text-white border-teal-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            🏠 한달살기
          </button>
          {EXTRA_FILTERS.map((f) => {
            const on = extraFilters.has(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggleExtra(f.id)}
                className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
                  on
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                {f.emoji} {f.label}
              </button>
            );
          })}
        </div>

        {/* 결과 수 */}
        <p className="text-xs font-bold text-slate-400 mb-4 tabular-nums">
          <span className="text-slate-700 text-sm font-extrabold">{filtered.length}</span>개 파티
          {selectedCategory && (
            <span className="ml-1.5 text-slate-500">
              · {HOBBY_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </span>
          )}
          {selectedRegion && <span className="ml-1.5 text-slate-500">· {selectedRegion}</span>}
        </p>

        {/* ── 파티 카드 리스트 ──────────────────────────────────────────── */}
        <div className="space-y-3">
          {filtered.map((party, idx) => {
            const cat = getCat(party.category);
            const spotsLeft     = party.maxMembers - party.currentMembers;
            const showBanner    = (idx + 1) % 4 === 0 && idx < filtered.length - 1;
            const bannerOffers  = showBanner ? getPartnerBannerOffers(Math.floor(idx / 4)) : [];
            const isCommercial  = party.partyType === "commercial";
            const isStay        = party.stayMode === "stay";
            const commercialSpotsLeft = party.maxMembers - (party.reservedSeats || 0);
            const isFewSpots    = isCommercial ? commercialSpotsLeft <= 2 : spotsLeft <= 1;

            return (
              <div key={party.id}>
                <a
                  href={`${basePath}/party/${party.id}`}
                  className={`block bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden border ${
                    isCommercial
                      ? "border-blue-100 hover:border-blue-300"
                      : isStay
                      ? "border-teal-100 hover:border-teal-200"
                      : "border-slate-200 hover:border-orange-200"
                  }`}
                >
                  {/* 플레이스홀더 이미지 영역 */}
                  <div
                    className="relative h-36"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg,#fef3e8,#fef3e8 8px,#fed7aa 8px,#fed7aa 16px)",
                    }}
                  >
                    <div className="absolute inset-0 grid place-items-center text-5xl opacity-25">
                      {cat?.emoji}
                    </div>

                    {/* 카테고리 뱃지 */}
                    <span
                      className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-lg ${
                        isCommercial ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {cat?.emoji} {cat?.label}
                    </span>

                    {/* 잔여 자리 뱃지 */}
                    <span
                      className={`absolute top-2.5 right-2.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isFewSpots
                          ? "bg-rose-500 text-white animate-pulse"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {isCommercial
                        ? `잔여 ${commercialSpotsLeft}자리`
                        : `${spotsLeft}자리 남음`}
                    </span>

                    {/* 슈퍼호스트 뱃지 */}
                    {party.hostRating >= 4.8 && party.hostPartyCount >= 10 && (
                      <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 text-amber-300">
                        ⭐ 슈퍼호스트
                      </span>
                    )}

                    {/* 사업자 / 한달살기 배지 */}
                    {isCommercial && (
                      <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                        🏢 사업자{party.operatorVerified ? " · ✓인증" : ""}
                      </span>
                    )}
                    {isStay && !isCommercial && (
                      <span className="absolute bottom-2.5 right-2.5 text-[9px] font-bold px-2 py-0.5 rounded bg-teal-600 text-white">
                        🏠{" "}
                        {party.hostStayDays && party.hostStayDays >= 300
                          ? "일년살기"
                          : party.hostStayDays && party.hostStayDays >= 60
                          ? `${Math.round(party.hostStayDays / 30)}개월살기`
                          : "장기체류"}
                      </span>
                    )}
                  </div>

                  {/* 카드 본문 */}
                  <div className="p-4">
                    {/* 지역 + 날짜 */}
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 mb-1.5 flex-wrap">
                      <span>{party.region}</span>
                      <span>·</span>
                      <span>{formatDate(party.date)} {party.time}</span>
                      {isFewSpots && (
                        <span className="ml-auto text-rose-500 font-bold animate-pulse">⏰ 마감 임박</span>
                      )}
                    </div>

                    {/* 업체명 */}
                    {isCommercial && party.operatorName && (
                      <p className="text-[10px] text-blue-600 font-semibold mb-1">{party.operatorName}</p>
                    )}

                    {/* 제목 */}
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight mb-1.5 line-clamp-2">
                      {party.title}
                    </h3>

                    {/* 설명 */}
                    <p className="text-xs text-slate-500 line-clamp-1 mb-3 leading-relaxed">
                      {party.description}
                    </p>

                    {/* 가격 블록 (사업자) */}
                    {isCommercial && party.pricePerSeat ? (
                      <div className="flex items-center justify-between mb-3 px-3 py-2 bg-blue-50 rounded-xl">
                        <span className="text-lg font-extrabold text-blue-600 tabular-nums">
                          1인 ₩{party.pricePerSeat.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500">
                          잔여 {commercialSpotsLeft} / {party.maxMembers}자리
                        </span>
                      </div>
                    ) : null}

                    {/* 하단: 호스트 + 가격 (개인 파티) */}
                    {!isCommercial && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 grid place-items-center text-xs font-extrabold text-white shadow-sm shrink-0">
                            {party.hostName[0]}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-xs font-semibold text-slate-700">{party.hostName}</span>
                              <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-bold rounded-full">
                                📱 인증
                              </span>
                            </div>
                            <p className="text-[9px] text-slate-400">
                              ⭐{party.hostRating} · 파티 {party.hostPartyCount}회
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {party.cafePassEnabled && (
                            <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full font-medium">
                              ☕ 카페패스
                            </span>
                          )}
                          {party.rentalCarMode === "rent-together" && party.rentalCarPerPerson ? (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">
                              🚗 엔빵 {party.rentalCarPerPerson.toLocaleString()}원
                            </span>
                          ) : party.rentalCarMode === "own-car" ? (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">
                              🚗 동승가능
                            </span>
                          ) : party.hasRentalCar ? (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">
                              🚗 렌터카
                            </span>
                          ) : null}
                          <span className="text-sm font-extrabold tabular-nums text-orange-600">
                            {isStay
                              ? party.guestCanStayOver
                                ? `${party.guestNights}박 동행`
                                : "당일 동행"
                              : party.costType === "free"
                              ? "무료"
                              : party.costType === "split"
                              ? `엔빵 ~${((party.costAmount || 0) / 10000).toFixed(0)}만`
                              : `₩${(party.costAmount || 0).toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 번들 파티 */}
                    {party.bundleItems && party.bundleItems.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="text-[10px] text-violet-600 font-bold">🎯 번들 코스</span>
                          <span className="text-[10px] text-slate-400">{party.bundleItems.length}개 활동</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {party.bundleItems.map((item, i) => {
                            const itemCat = getCat(item.category);
                            return (
                              <span
                                key={item.id}
                                className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-100 rounded-full font-medium"
                              >
                                {i > 0 && <span className="text-violet-300">›</span>}
                                {itemCat?.emoji}{" "}
                                {item.title.length > 10 ? item.title.slice(0, 10) + "…" : item.title}
                                {item.cost !== undefined && item.cost > 0 && (
                                  <span className="text-violet-400 ml-0.5">
                                    {(item.cost / 10000).toFixed(item.cost % 10000 === 0 ? 0 : 1)}만
                                  </span>
                                )}
                                {item.cost === 0 && <span className="text-violet-400 ml-0.5">무료</span>}
                              </span>
                            );
                          })}
                        </div>
                        {party.rentalCoordEnabled && (
                          <div className="mt-2 flex items-center gap-1.5 text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg border border-blue-100">
                            <span>🚗</span>
                            <span className="font-medium">렌터카 같이 할 사람 구해요</span>
                            {party.rentalCoordSeats && (
                              <span className="ml-auto bg-blue-100 px-1.5 py-0.5 rounded-full font-bold">
                                {party.rentalCoordSeats}자리
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {party.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] rounded-full font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* 경유 가게 */}
                    {party.stopSlugs && party.stopSlugs.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <span className="text-[10px] text-orange-500 font-bold shrink-0">📍 경유</span>
                        {party.stopSlugs.map((slug) => {
                          const shop = shopMap[slug];
                          return shop ? (
                            <a
                              key={slug}
                              href={`http://localhost:3001/shop/${shop.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-100 rounded-full font-medium hover:bg-orange-100 transition-colors"
                            >
                              ⭐ {shop.name}
                            </a>
                          ) : (
                            <span
                              key={slug}
                              className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-400 border border-slate-100 rounded-full"
                            >
                              {slug}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </a>

                {/* 파트너 배너 */}
                {showBanner && bannerOffers.length > 0 && (
                  <div className="mt-3 bg-white rounded-2xl border border-orange-100 shadow-sm p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-sm">🤝</span>
                      <span className="text-xs font-bold text-slate-700">파트너 혜택</span>
                      <span className="ml-auto text-[10px] text-slate-400">광고</span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                      {bannerOffers.map((offer) => (
                        <BasicPartnerCard key={offer.id} offer={offer} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl mb-4 shadow-sm">
                🏝️
              </div>
              <p className="font-extrabold text-slate-900 mb-1">이 조건에 맞는 파티가 없어요</p>
              <p className="text-sm text-slate-400">직접 파티를 만들어보는 건 어때요?</p>
              <a
                href={`${basePath}/create`}
                className="inline-block mt-5 px-6 py-2.5 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
              >
                파티 만들기
              </a>
            </div>
          )}
        </div>
      </main>

      {/* ── 후기 섹션 ────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-10">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight mb-1">
            먼저 다녀온 사람들
          </h2>
          <p className="text-xs text-slate-500 mb-5">평균 별점 4.86 / 후기 1,240건</p>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                who: "민지 · 서울",
                cat: "서핑 입문",
                stars: 5,
                text: "혼자 왔는데 전혀 어색하지 않았어요. 호스트 분이 너무 잘 챙겨주셔서 다음에도 또 신청할 듯.",
              },
              {
                who: "재훈 · 부산",
                cat: "한라산 등반",
                stars: 5,
                text: "혼자 백록담 도전이 막막했는데 가이드가 있으니 안전했고, 일행도 좋은 분들 만나서 등산 친구 생김.",
              },
              {
                who: "은채 · 대구",
                cat: "카페 호핑",
                stars: 5,
                text: "카페 5곳을 차로 픽업 동선까지 짜주셔서 너무 편했어요. 사진 명소 골라주시는 게 큰 메리트.",
              },
            ].map((r, i) => (
              <article key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <p className="text-amber-400 text-sm">{"★".repeat(r.stars)}</p>
                <p className="text-sm text-slate-700 mt-2 leading-relaxed">"{r.text}"</p>
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-extrabold text-slate-900">{r.who}</span>
                  <span className="font-mono text-slate-400">#{r.cat}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 푸터 ─────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-300 px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-6 text-sm mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-orange-500 grid place-items-center text-white font-black text-xs select-none">
                  P
                </div>
                <span className="font-extrabold text-white">jeju.party</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                제주에서 함께할 친구를 찾는 가장 쉬운 방법.
              </p>
            </div>
            <div>
              <p className="font-bold text-white mb-2 text-xs">서비스</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>파티 찾기</li>
                <li>AI 일정</li>
                <li>렌터카</li>
                <li>카페패스</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-2 text-xs">고객지원</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>FAQ</li>
                <li>호스트 가이드</li>
                <li>안전 정책</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-white mb-2 text-xs">정책</p>
              <ul className="space-y-1.5 text-xs text-slate-400">
                <li>이용약관</li>
                <li>개인정보처리방침</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-5 text-xs text-slate-500 font-mono">
            © 2026 jeju.party — all rights reserved
          </div>
        </div>
      </footer>

      {/* ── 모바일 하단 고정 CTA ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 backdrop-blur border-t border-slate-100 px-4 py-3 flex gap-2 shadow-xl shadow-slate-900/10">
        <a
          href={`${basePath}/create`}
          className="flex-1 py-3 bg-orange-500 text-white text-sm font-extrabold rounded-xl text-center hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
        >
          + 파티 만들기
        </a>
        <button className="px-5 py-3 bg-slate-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-200 transition-all">
          ✨ AI 일정
        </button>
      </div>
    </div>
  );
}
