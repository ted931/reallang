"use client";

import { useState, useMemo, useEffect } from "react";
import { HOBBY_CATEGORIES, REGIONS, type Party } from "@/lib/types";
import { DUMMY_PARTIES } from "@/lib/dummy-parties";
import { PARTNER_OFFERS } from "@/lib/dummy-partners";
import { BasicPartnerCard } from "@/components/partner-offer-card";

export default function PartyFeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [filterPet, setFilterPet] = useState(false);
  const [filterStay, setFilterStay] = useState(false);
  const [parties] = useState<Party[]>(DUMMY_PARTIES);
  const [shopMap, setShopMap] = useState<Record<string, { name: string; slug: string; category: string }>>({});

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

  const filtered = useMemo(() => {
    return parties.filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedRegion && p.region !== selectedRegion) return false;
      if (filterPet && !p.petFriendly) return false;
      if (filterStay && p.stayMode !== "stay") return false;
      return true;
    });
  }, [parties, selectedCategory, selectedRegion, filterPet, filterStay]);

  const formatDate = (d: string) => {
    const date = new Date(d);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getMonth() + 1}/${date.getDate()}(${days[date.getDay()]})`;
  };

  const getCat = (id: string) => HOBBY_CATEGORIES.find((c) => c.id === id);

  // 피드 슬롯별 파트너 오퍼 3개 반환 (카테고리 필터 반영, 슬롯마다 로테이션)
  const getPartnerBannerOffers = (slotIndex: number) => {
    const pool = selectedCategory
      ? PARTNER_OFFERS.filter(
          (o) =>
            o.targetCategories.includes(selectedCategory) ||
            o.targetCategories.includes("all")
        )
      : PARTNER_OFFERS.filter((o) => o.targetCategories.includes("all"));
    if (pool.length === 0) return [];
    const start = (slotIndex * 3) % pool.length;
    return [
      ...pool.slice(start, start + 3),
      ...pool.slice(0, Math.max(0, start + 3 - pool.length)),
    ].slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3.5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-slate-900">
                jeju<span className="text-orange-500">.party</span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">같이 놀 사람 찾기</p>
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/create`}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
            >
              + 파티 만들기
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5">
        {/* 카테고리 필터 */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-1"
          style={{ scrollbarWidth: "none" }}
        >
          <button
            onClick={() => setSelectedCategory("")}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
              !selectedCategory
                ? "bg-orange-50 text-orange-700 border-orange-500"
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
                  ? "bg-orange-50 text-orange-700 border-orange-500"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* 지역 필터 */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-1"
          style={{ scrollbarWidth: "none" }}
        >
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

        {/* 특수 필터 — 애견동반 / 한달살기 */}
        <div className="flex gap-2 pb-3 mb-1">
          <button
            onClick={() => setFilterPet(!filterPet)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
              filterPet
                ? "bg-amber-50 text-amber-700 border-amber-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            🐶 애견동반
          </button>
          <button
            onClick={() => setFilterStay(!filterStay)}
            className={`shrink-0 px-3.5 py-2 rounded-full text-sm font-bold border-2 whitespace-nowrap transition-all ${
              filterStay
                ? "bg-teal-50 text-teal-700 border-teal-500"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            🏠 한달살기
          </button>
        </div>

        {/* 결과 수 */}
        <p className="text-xs font-bold text-slate-400 mb-4 tabular-nums">
          {filtered.length}개 파티
        </p>

        {/* 파티 카드 리스트 */}
        <div className="space-y-3">
          {filtered.map((party, idx) => {
            const cat = getCat(party.category);
            const spotsLeft = party.maxMembers - party.currentMembers;
            const showBanner = (idx + 1) % 4 === 0 && idx < filtered.length - 1;
            const bannerOffers = showBanner ? getPartnerBannerOffers(Math.floor(idx / 4)) : [];

            const isCommercial = party.partyType === "commercial";
            const isStay = party.stayMode === "stay";
            const commercialSpotsLeft = party.maxMembers - (party.reservedSeats || 0);

            return (
              <div key={party.id}>
                <a
                  href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/party/${party.id}`}
                  className={`block bg-white rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 ${
                    isCommercial
                      ? "border border-blue-100 hover:border-blue-300"
                      : isStay
                      ? "border border-teal-100 hover:border-teal-200"
                      : "border border-slate-100 hover:border-orange-100"
                  }`}
                >
                  {/* 사업자 뱃지 (commercial만) */}
                  {isCommercial && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                        🏢 사업자
                      </span>
                      {party.operatorVerified && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-md border border-blue-200">
                          ✓ 인증업체
                        </span>
                      )}
                    </div>
                  )}

                  {/* 한달살기 뱃지 */}
                  {isStay && (
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="px-2 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded-md">
                        🏠{" "}
                        {party.hostStayDays && party.hostStayDays >= 300
                          ? "일년살기"
                          : party.hostStayDays && party.hostStayDays >= 60
                          ? `${Math.round(party.hostStayDays / 30)}개월살기`
                          : "장기체류중"}
                      </span>
                      <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-md border border-teal-200">
                        {party.guestCanStayOver ? `${party.guestNights}박 숙박 가능` : "당일 동행"}
                      </span>
                      {party.petFriendly && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-200">
                          🐶 애견동반 OK
                        </span>
                      )}
                    </div>
                  )}

                  {/* 상단: 카테고리 + 날짜 + 잔여 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                          isCommercial
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {cat?.emoji} {cat?.label}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{party.region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        {formatDate(party.date)} {party.time}
                      </span>
                      {isCommercial ? (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            commercialSpotsLeft <= 2
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          잔여 {commercialSpotsLeft}자리
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            spotsLeft <= 1
                              ? "bg-red-100 text-red-600"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {spotsLeft}자리 남음
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1 leading-tight">
                    {party.title}
                  </h3>

                  {/* 업체명 (commercial만) */}
                  {isCommercial && party.operatorName && (
                    <p className="text-xs text-blue-600 font-semibold mb-2">{party.operatorName}</p>
                  )}

                  {/* 설명 (2줄 제한) */}
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                    {party.description}
                  </p>

                  {/* 사업자 파티: 가격 크게 + 잔여 자리 */}
                  {isCommercial && party.pricePerSeat ? (
                    <div className="flex items-center justify-between mb-3 p-3 bg-blue-50 rounded-xl">
                      <div>
                        <span className="text-xl font-extrabold text-blue-600 tabular-nums">
                          1인 ₩{party.pricePerSeat.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-500">
                          잔여 {commercialSpotsLeft} / {party.maxMembers}자리
                        </span>
                        {party.minMembers && (
                          <p className="text-[10px] text-slate-400">최소 {party.minMembers}명</p>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* 하단: 호스트 + 비용 + 렌터카 (개인 파티) */}
                  {!isCommercial && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-xs font-extrabold text-white shadow-sm">
                          {party.hostName[0]}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-slate-700">
                            {party.hostName}
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-bold rounded-full ml-1">
                            📱 인증
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">
                            ⭐{party.hostRating} · 파티 {party.hostPartyCount}회
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                        {isStay ? (
                          <span className="text-sm font-extrabold text-teal-600">
                            {party.guestCanStayOver ? `${party.guestNights}박 동행` : "당일 동행"}
                          </span>
                        ) : (
                          <span className="text-sm font-extrabold text-orange-600 tabular-nums">
                            {party.costType === "free"
                              ? "무료"
                              : party.costType === "split"
                              ? `엔빵 ~${((party.costAmount || 0) / 10000).toFixed(0)}만`
                              : `₩${(party.costAmount || 0).toLocaleString()}`}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 번들 파티 활동 chips */}
                  {party.bundleItems && party.bundleItems.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1 mb-2">
                        <span className="text-[10px] text-violet-600 font-bold">🎯 번들 코스</span>
                        <span className="text-[10px] text-slate-400">
                          {party.bundleItems.length}개 활동
                        </span>
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
                              {item.title.length > 10
                                ? item.title.slice(0, 10) + "…"
                                : item.title}
                              {item.cost !== undefined && item.cost > 0 && (
                                <span className="text-violet-400 ml-0.5">
                                  {(item.cost / 10000).toFixed(item.cost % 10000 === 0 ? 0 : 1)}만
                                </span>
                              )}
                              {item.cost === 0 && (
                                <span className="text-violet-400 ml-0.5">무료</span>
                              )}
                            </span>
                          );
                        })}
                      </div>
                      {/* 렌터카 코디 */}
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
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {party.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-orange-50 text-orange-700 text-[10px] rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* 경유 가게 chips */}
                  {party.stopSlugs && party.stopSlugs.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="text-[10px] text-orange-500 font-bold shrink-0">
                        📍 경유
                      </span>
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
                </a>

                {/* 파트너 배너 — 4번째 카드 뒤 */}
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
                href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/create`}
                className="inline-block mt-5 px-6 py-2.5 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 active:scale-95 transition-all shadow-sm"
              >
                파티 만들기
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
