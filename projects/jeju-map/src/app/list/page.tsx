"use client";

import { useState, useEffect, useMemo } from "react";
import { CATEGORIES, DUMMY_PINS, EXTRA_PINS, type MapPin } from "@/lib/categories";

const ALL_PINS = [...DUMMY_PINS, ...EXTRA_PINS];

type SortKey = "default" | "name" | "jejupass";

const SHOP_CAT: Record<string, string> = {
  cafe: "cafe", restaurant: "restaurant", dessert: "cafe",
  bakery: "cafe", brunch: "cafe", bar: "restaurant", etc: "attraction",
};
const REGION_COORDS: Record<string, [number, number]> = {
  "jeju-si": [33.499, 126.531], seogwipo: [33.254, 126.560],
  aewol: [33.464, 126.332], hallim: [33.414, 126.260],
  hamdeok: [33.543, 126.670], seongsan: [33.458, 126.927],
  jungmun: [33.250, 126.412],
};

export default function ListPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("default");
  const [search, setSearch] = useState("");
  const [jejupassPins, setJejupassPins] = useState<MapPin[]>([]);
  const [showJejupassOnly, setShowJejupassOnly] = useState(false);

  // jejupass 가게 불러오기
  useEffect(() => {
    fetch("http://localhost:3001/api/shops")
      .then((r) => r.json())
      .then((data) => {
        const shops = (data.shops || []).filter((s: any) => s.isPublished);
        const pins: MapPin[] = shops.map((s: any) => {
          const primaryPhoto = s.photos?.find((p: any) => p.isPrimary) || s.photos?.[0];
          const avgRating = s.reviews?.length
            ? s.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / s.reviews.length
            : undefined;
          const coords = REGION_COORDS[s.region] ?? [33.38, 126.55];
          return {
            id: `jp_${s.id}`, name: s.name,
            category: SHOP_CAT[s.category] || "cafe",
            lat: coords[0], lng: coords[1],
            address: s.address, phone: s.phone, description: s.description,
            source: "jejupass" as const,
            rating: avgRating, reviewCount: s.reviews?.length ?? 0,
            photoUrl: primaryPhoto?.url, shopSlug: s.slug, shopId: s.id,
          };
        });
        setJejupassPins(pins);
      })
      .catch(() => {});
  }, []);

  const allPins = useMemo(() => {
    const jpIds = new Set(jejupassPins.map((p) => p.shopId));
    const base = ALL_PINS.map((p) => ({ ...p, source: p.source || "dummy" as const }));
    return [...jejupassPins, ...base.filter((p) => !jpIds.has(p.shopId))];
  }, [jejupassPins]);

  const filtered = useMemo(() => {
    let result = showJejupassOnly ? allPins.filter((p) => p.source === "jejupass") : allPins;
    if (activeCategory !== "all") result = result.filter((p) => p.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)
      );
    }
    if (sortKey === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    if (sortKey === "jejupass") result = [...result].sort((a, b) => (b.source === "jejupass" ? 1 : 0) - (a.source === "jejupass" ? 1 : 0));
    return result;
  }, [allPins, activeCategory, search, sortKey, showJejupassOnly]);

  const getCat = (id: string) => CATEGORIES.find((c) => c.id === id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">제주 장소 목록</h1>
          <p className="text-sm text-gray-400 mt-0.5">{filtered.length}개 장소</p>
        </div>
        <button
          onClick={() => setShowJejupassOnly((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
            showJejupassOnly
              ? "bg-orange-500 text-white border-orange-500 shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
          }`}
        >
          ⭐ 제주패스 등록
          {jejupassPins.length > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${showJejupassOnly ? "bg-white/30" : "bg-orange-100 text-orange-600"}`}>
              {jejupassPins.length}
            </span>
          )}
        </button>
      </div>

      {/* 검색 */}
      <div className="relative mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="장소 이름, 주소 검색..."
          className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-50 outline-none"
        />
        <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xs">✕</button>
        )}
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
            activeCategory === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          전체 ({allPins.filter((p) => !showJejupassOnly || p.source === "jejupass").length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = allPins.filter((p) => p.category === cat.id && (!showJejupassOnly || p.source === "jejupass")).length;
          if (count === 0) return null;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                activeCategory === cat.id ? "text-white" : "bg-gray-100 text-gray-600"
              }`}
              style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* 정렬 */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[11px] text-gray-400">정렬:</span>
        {(["default", "name", "jejupass"] as SortKey[]).map((key) => {
          const labels: Record<SortKey, string> = { default: "기본", name: "이름순", jejupass: "제주패스 우선" };
          return (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                sortKey === key ? "bg-indigo-100 text-indigo-700" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {labels[key]}
            </button>
          );
        })}
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm">검색 결과가 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((pin) => {
            const cat = getCat(pin.category);
            const isJejupass = pin.source === "jejupass";
            return (
              <div
                key={pin.id}
                className={`bg-white rounded-xl border p-4 hover:shadow-sm transition-all ${
                  isJejupass ? "border-orange-100 hover:border-orange-200" : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* 썸네일 or 이모지 */}
                  {isJejupass && pin.photoUrl ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${pin.photoUrl})` }} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: (cat?.color || "#9CA3AF") + "15" }}>
                      {cat?.emoji}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-bold text-gray-900 truncate">{pin.name}</h3>
                      {isJejupass && (
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">⭐ 제주패스</span>
                      )}
                      <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: cat?.color }}>
                        {cat?.label}
                      </span>
                    </div>
                    {/* 별점 */}
                    {isJejupass && (pin.rating !== undefined || (pin.reviewCount !== undefined && pin.reviewCount > 0)) && (
                      <div className="flex items-center gap-2 mb-1">
                        {pin.rating !== undefined && pin.reviewCount !== undefined && pin.reviewCount > 0 && (
                          <span className="text-xs font-semibold text-yellow-500">★ {pin.rating.toFixed(1)}</span>
                        )}
                        {pin.reviewCount !== undefined && (
                          <span className="text-[11px] text-gray-400">리뷰 {pin.reviewCount}개</span>
                        )}
                      </div>
                    )}
                    {pin.description && <p className="text-sm text-gray-500 truncate">{pin.description}</p>}
                    <p className="text-xs text-gray-400 mt-0.5 truncate">📍 {pin.address}</p>
                  </div>

                  {/* 제주패스 링크 */}
                  {isJejupass && pin.shopSlug && (
                    <a
                      href={`http://localhost:3001/shop/${pin.shopSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors"
                      style={{ borderColor: "#F97316", color: "#F97316" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      보기
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
