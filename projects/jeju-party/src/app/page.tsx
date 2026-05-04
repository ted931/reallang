"use client";

import { useState, useMemo, useEffect } from "react";
import { HOBBY_CATEGORIES, REGIONS, type Party } from "@/lib/types";
import { DUMMY_PARTIES } from "@/lib/dummy-parties";
import { PARTNER_OFFERS } from "@/lib/dummy-partners";
import { BasicPartnerCard } from "@/components/partner-offer-card";

const COST_LABEL: Record<string, string> = {
  split: "엔빵",
  free: "무료",
  fixed: "정해진 금액",
};

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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">🎉 제주 취미 파티</h1>
              <p className="text-xs text-gray-400 mt-0.5">같이 놀 사람 찾기</p>
            </div>
            <a
              href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/create`}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors"
            >
              + 파티 만들기
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">
        {/* 카테고리 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-2">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              !selectedCategory ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            전체
          </button>
          {HOBBY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? "" : cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                selectedCategory === cat.id ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* 지역 필터 */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          <button
            onClick={() => setSelectedRegion("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
              !selectedRegion ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-500"
            }`}
          >
            전체 지역
          </button>
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRegion(selectedRegion === r ? "" : r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                selectedRegion === r ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-500"
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
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all border ${
              filterPet ? "bg-amber-500 text-white border-amber-500" : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            🐶 애견동반
          </button>
          <button
            onClick={() => setFilterStay(!filterStay)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all border ${
              filterStay ? "bg-teal-500 text-white border-teal-500" : "bg-white border-gray-200 text-gray-500"
            }`}
          >
            🏠 한달살기
          </button>
        </div>

        {/* 결과 수 */}
        <p className="text-xs text-gray-400 mb-4">{filtered.length}개 파티</p>

        {/* 파티 카드 리스트 */}
        <div className="space-y-4">
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
                  className={`block bg-white rounded-2xl p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all ${
                    isCommercial
                      ? "border border-blue-100 hover:border-blue-300"
                      : "border border-gray-100"
                  }`}
                >
                  {/* 사업자 뱃지 (commercial만) */}
                  {isCommercial && (
                    <div className="flex items-center gap-2 mb-2">
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
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-teal-600 text-white text-[10px] font-bold rounded-md">
                        🏠 {party.hostStayDays && party.hostStayDays >= 300 ? "일년살기" : party.hostStayDays && party.hostStayDays >= 60 ? `${Math.round(party.hostStayDays / 30)}개월살기` : "장기체류중"}
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
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                        isCommercial ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {cat?.emoji} {cat?.label}
                      </span>
                      <span className="text-xs text-gray-400">{party.region}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600">{formatDate(party.date)} {party.time}</span>
                      {isCommercial ? (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          commercialSpotsLeft <= 2 ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"
                        }`}>
                          잔여 {commercialSpotsLeft}자리
                        </span>
                      ) : (
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          spotsLeft <= 1 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {spotsLeft}자리 남음
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{party.title}</h3>

                  {/* 업체명 (commercial만) */}
                  {isCommercial && party.operatorName && (
                    <p className="text-xs text-blue-600 font-medium mb-2">{party.operatorName}</p>
                  )}

                  {/* 설명 (2줄 제한) */}
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{party.description}</p>

                  {/* 사업자 파티: 가격 크게 + 잔여 자리 */}
                  {isCommercial && party.pricePerSeat ? (
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-blue-600">
                          1인 ₩{party.pricePerSeat.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">잔여 {commercialSpotsLeft} / {party.maxMembers}자리</span>
                        {party.minMembers && (
                          <p className="text-[10px] text-gray-400">최소 {party.minMembers}명</p>
                        )}
                      </div>
                    </div>
                  ) : null}

                  {/* 하단: 호스트 + 비용 + 렌터카 (개인 파티) */}
                  {!isCommercial && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                        {party.hostName[0]}
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-700">{party.hostName}</span>
                        <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-bold rounded-full ml-1">📱 인증</span>
                        <span className="text-[10px] text-gray-400 ml-1">
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
                        <span className="text-sm font-bold text-teal-600">
                          {party.guestCanStayOver ? `${party.guestNights}박 동행` : "당일 동행"}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-orange-600">
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
                    <div className="mt-3">
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="text-[10px] text-purple-600 font-bold">🎯 번들 코스</span>
                        <span className="text-[10px] text-gray-400">{party.bundleItems.length}개 활동</span>
                      </div>
                      <div className="flex gap-1.5 flex-wrap">
                        {party.bundleItems.map((item, i) => {
                          const cat = getCat(item.category);
                          return (
                            <span key={item.id} className="flex items-center gap-1 text-[10px] px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full font-medium">
                              {i > 0 && <span className="text-purple-300">›</span>}
                              {cat?.emoji} {item.title.length > 10 ? item.title.slice(0, 10) + "…" : item.title}
                              {item.cost !== undefined && item.cost > 0 && (
                                <span className="text-purple-400 ml-0.5">{(item.cost / 10000).toFixed(item.cost % 10000 === 0 ? 0 : 1)}만</span>
                              )}
                              {item.cost === 0 && <span className="text-purple-400 ml-0.5">무료</span>}
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
                            <span className="ml-auto bg-blue-100 px-1.5 py-0.5 rounded-full font-bold">{party.rentalCoordSeats}자리</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {party.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* 경유 가게 chips */}
                  {party.stopSlugs && party.stopSlugs.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
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
                          <span key={slug} className="text-[10px] px-2 py-0.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-full">
                            {slug}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </a>

                {/* 파트너 배너 — 4번째 카드 뒤 */}
                {showBanner && bannerOffers.length > 0 && (
                  <div className="mt-4 bg-white rounded-2xl border border-orange-100 p-4">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-sm">🤝</span>
                      <span className="text-xs font-bold text-gray-700">파트너 혜택</span>
                      <span className="ml-auto text-[10px] text-gray-400">광고</span>
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

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏝️</p>
              <p className="text-gray-500">이 조건에 맞는 파티가 없어요</p>
              <p className="text-sm text-gray-400 mt-1">직접 파티를 만들어보는 건 어때요?</p>
              <a
                href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/create`}
                className="inline-block mt-4 px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl"
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
