'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES, REGIONS, CATEGORY_MAP, REGION_MAP, BRAND } from '@/lib/constants';
import { formatPrice, getCategoryEmoji } from '@/lib/utils';
import type { Shop } from '@/lib/types';

export default function ExplorePage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');
  const [region, setRegion] = useState<string>('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (region) params.set('region', region);

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/shops?${params}`)
      .then((r) => r.json())
      .then((data) => setShops(data.shops))
      .finally(() => setLoading(false));
  }, [category, region]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <Link href="/register" className="text-sm text-gray-500 hover:text-gray-900">가게 등록</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 mb-4">제주 가게 탐색</h1>

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

        {/* Results */}
        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-gray-400">불러오는 중...</div>
          ) : shops.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">등록된 가게가 없습니다.</p>
              <Link href="/register" className="text-sm mt-2 inline-block" style={{ color: BRAND.color }}>
                내 가게 등록하기 →
              </Link>
            </div>
          ) : (
            shops.map((shop) => (
              <Link key={shop.id} href={`/shop/${shop.slug}`} className="block">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Photo */}
                  <div className="h-40 bg-gray-200 relative">
                    {shop.photos[0] ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${shop.photos[0].url})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">
                        {getCategoryEmoji(shop.category)}
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{shop.name}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {CATEGORY_MAP[shop.category]} · {REGION_MAP[shop.region]}
                    </p>
                    {shop.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{shop.description}</p>
                    )}
                    {shop.menus.filter((m) => m.isPopular).length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {shop.menus.filter((m) => m.isPopular).slice(0, 2).map((m) => (
                          <span key={m.id} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded">
                            {m.name} {formatPrice(m.price)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
