'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CATEGORIES, REGIONS, CATEGORY_MAP, REGION_MAP, BRAND } from '@/lib/constants';
import { formatPrice, getCategoryEmoji } from '@/lib/utils';
import type { Shop } from '@/lib/types';

// 파티 참여 가능 카테고리
const PARTY_CATEGORIES = new Set(['cafe', 'activity', 'rental']);

const exploreJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "제주 카페·맛집·액티비티 탐색",
  description: "제주도 카페, 맛집, 액티비티를 지역별·카테고리별로 탐색하세요.",
  url: "https://jejupass.com/web/explore",
  isPartOf: {
    "@type": "WebSite",
    name: "제주패스",
    url: "https://jejupass.com/web",
  },
};

// 오늘 요일키 (컴포넌트 외부에서 한 번만 계산)
const TODAY_KEY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];

function isShopOpen(businessHours: Record<string, string>): boolean {
  const hours = businessHours[TODAY_KEY];
  return !!hours && hours !== '휴무';
}

export default function ExplorePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  // API는 category/region으로만 서버 필터링, 검색은 클라이언트
  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (region) params.set('region', region);

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/shops?${params}`)
      .then((r) => r.json())
      .then((data) => setShops(data.shops))
      .finally(() => setLoading(false));
  }, [category, region]);

  // 검색어 클라이언트 필터
  const filteredShops = useMemo(() => {
    if (!query.trim()) return shops;
    const q = query.trim().toLowerCase();
    return shops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        (s.description ?? '').toLowerCase().includes(q),
    );
  }, [shops, query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(exploreJsonLd) }}
      />
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900">가게 등록</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">제주 가게 탐색</h1>

        {/* 검색창 */}
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="가게명, 메뉴, 위치 검색"
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
            style={{ '--tw-ring-color': BRAND.color } as React.CSSProperties}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setCategory('')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
              !category ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
            style={!category ? { backgroundColor: BRAND.color } : {}}
          >
            전체
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(category === c.value ? '' : c.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                category === c.value ? 'text-white' : 'bg-white text-gray-600 border border-gray-200'
              }`}
              style={category === c.value ? { backgroundColor: BRAND.color } : {}}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Region Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mt-2 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setRegion('')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
              !region ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            전 지역
          </button>
          {REGIONS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRegion(region === r.value ? '' : r.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                region === r.value ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* 검색 결과 수 */}
        {!loading && query.trim() && (
          <p className="mt-3 text-xs text-gray-400">
            "{query}" 검색 결과 {filteredShops.length}개
          </p>
        )}

        {/* Results */}
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">불러오는 중...</div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {query.trim() ? `"${query}"에 해당하는 가게가 없습니다.` : '등록된 가게가 없습니다.'}
              </p>
              {!query.trim() && (
                <Link href="/register" className="text-sm mt-2 inline-block" style={{ color: BRAND.color }}>
                  내 가게 등록하기 →
                </Link>
              )}
            </div>
          ) : (
            filteredShops.map((shop) => {
              const open = isShopOpen(shop.businessHours);
              const canParty = PARTY_CATEGORIES.has(shop.category);

              return (
                <Link key={shop.id} href={`/shop/${shop.slug}`} className="block group">
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {/* Photo */}
                    <div className="h-40 bg-gray-200 relative overflow-hidden">
                      {shop.photos[0] ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                          style={{ backgroundImage: `url(${shop.photos[0].url})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-4xl">
                          {getCategoryEmoji(shop.category)}
                        </div>
                      )}

                      {/* 영업 상태 뱃지 */}
                      <span
                        className={`absolute top-2 left-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          open ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
                        }`}
                      >
                        {open ? '영업중' : '휴무'}
                      </span>

                      {/* hover 오버레이 */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 px-4 py-1.5 rounded-full">
                          자세히 보기
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900">{shop.name}</h3>
                        {canParty && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                            🎉 파티 참여 가능
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {CATEGORY_MAP[shop.category]} · {REGION_MAP[shop.region]}
                      </p>
                      {shop.description && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{shop.description}</p>
                      )}
                      {shop.menus.filter((m) => m.isPopular).length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {shop.menus
                            .filter((m) => m.isPopular)
                            .slice(0, 2)
                            .map((m) => (
                              <span key={m.id} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded">
                                {m.name} {formatPrice(m.price)}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
