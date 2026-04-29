'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CATEGORY_MAP, REGION_MAP, DAYS_KR, BRAND } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import type { Shop } from '@/lib/types';

// ── 더미 파티 데이터 ──────────────────────────────────────────────
const DUMMY_PARTIES = [
  { id: 'p1', title: '성산 일출봉 트레킹 파티', category: 'hiking', currentMembers: 4, maxMembers: 8, date: '5/10(토)', location: '성산읍' },
  { id: 'p2', title: '협재 해변 서핑 입문 파티', category: 'surfing', currentMembers: 3, maxMembers: 6, date: '5/11(일)', location: '한림읍' },
  { id: 'p3', title: '애월 카페투어 파티', category: 'cafe', currentMembers: 5, maxMembers: 10, date: '5/12(월)', location: '애월읍' },
  { id: 'p4', title: '한라산 자전거 파티', category: 'cycling', currentMembers: 2, maxMembers: 6, date: '5/17(토)', location: '서귀포시' },
  { id: 'p5', title: '제주 로컬 쿠킹 클래스', category: 'cooking', currentMembers: 3, maxMembers: 8, date: '5/14(수)', location: '제주시' },
];

// 가게 카테고리 → 파티 카테고리 매핑
const CATEGORY_TO_PARTY: Record<string, string[]> = {
  cafe: ['cafe', 'cycling'],
  restaurant: ['cafe', 'cooking'],
  dessert: ['cafe', 'cooking'],
  bakery: ['cafe', 'cooking'],
  brunch: ['cafe', 'cooking'],
  bar: ['cafe', 'cycling'],
  activity: ['surfing', 'hiking', 'running'],
  rental: ['cycling', 'surfing'],
  stay: ['hiking', 'surfing'],
  etc: ['cafe', 'hiking'],
};

// 파티 카테고리 이모지
const PARTY_EMOJI: Record<string, string> = {
  hiking: '🥾', surfing: '🏄', cafe: '☕', cycling: '🚴', cooking: '👨‍🍳', running: '🏃',
};

// ── 공유 버튼 (클라이언트 컴포넌트) ──────────────────────────────
function ShareButtons({ shopId }: { shopId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = window.location.href;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
      >
        🔗 {copied ? '복사됨!' : '링크 복사'}
      </button>
      <a
        href={`/dashboard/sns?shopId=${shopId}`}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
      >
        📸 SNS 공유
      </a>
    </div>
  );
}

// ── 메인 페이지 컴포넌트 ──────────────────────────────────────────
export default function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    params.then(({ slug: s }) => {
      setSlug(s);
      fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/shops/slug/${encodeURIComponent(s)}`)
        .then((r) => {
          if (!r.ok) return null;
          return r.json();
        })
        .then((data) => {
          setShop(data?.shop ?? null);
        })
        .finally(() => setLoading(false));
    });
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-400 text-sm">불러오는 중...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">가게를 찾을 수 없습니다.</p>
        <Link href="/explore" className="text-sm" style={{ color: BRAND.color }}>탐색으로 돌아가기</Link>
      </div>
    );
  }

  const categoryLabel = CATEGORY_MAP[shop.category] || shop.category;
  const regionLabel = REGION_MAP[shop.region] || shop.region;
  const primaryPhoto = shop.photos.find((p) => p.isPrimary) || shop.photos[0];

  const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  const todayHours = shop.businessHours[todayKey];
  const isOpen = todayHours && todayHours !== '휴무';

  // 파티 매칭
  const partyCategories = CATEGORY_TO_PARTY[shop.category] ?? [];
  const matchedParties = DUMMY_PARTIES.filter((p) => partyCategories.includes(p.category)).slice(0, 2);

  // ── Schema.org JSON-LD ─────────────────────────────────────────────
  const DAY_MAP: Record<string, string> = {
    mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
    fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
  };
  const CATEGORY_SCHEMA_TYPE: Record<string, string> = {
    cafe: 'CafeOrCoffeeShop',
    restaurant: 'Restaurant',
    dessert: 'Bakery',
    bakery: 'Bakery',
    brunch: 'Restaurant',
    bar: 'BarOrPub',
    etc: 'LocalBusiness',
  };
  const openingHoursSpec = Object.entries(shop.businessHours)
    .filter(([, hours]) => hours && hours !== '휴무')
    .map(([day, hours]) => {
      const [opensAt, closesAt] = hours.split('-').map((t: string) => t.trim());
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${DAY_MAP[day] ?? day}`,
        opens: opensAt ?? '00:00',
        closes: closesAt ?? '23:59',
      };
    });
  const shopJsonLd = {
    "@context": "https://schema.org",
    "@type": CATEGORY_SCHEMA_TYPE[shop.category] ?? 'LocalBusiness',
    name: shop.name,
    description: shop.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: shop.address,
      addressLocality: shop.region === 'seogwipo' ? '서귀포시' : '제주시',
      addressRegion: "제주특별자치도",
      addressCountry: "KR",
      postalCode: "63000",
    },
    telephone: shop.phone || undefined,
    openingHoursSpecification: openingHoursSpec,
    servesCuisine: categoryLabel,
    priceRange: "₩~₩₩",
    image: shop.photos.map((p) => p.url),
    url: `https://jejupass.com/web/shop/${slug}`,
    sameAs: [`https://jejupass.com/web/shop/${slug}`],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopJsonLd) }}
      />
      {/* Hero */}
      <div className="relative bg-gray-200 h-64 sm:h-80">
        {primaryPhoto ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${primaryPhoto.url})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
            <span className="text-6xl">{categoryLabel === '카페' ? '☕' : '🍽️'}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur rounded text-xs font-medium mb-2">
              {categoryLabel} · {regionLabel}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold">{shop.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-20">
        {/* Info Card */}
        <div className="bg-white rounded-xl shadow-sm -mt-4 relative z-10 p-5 space-y-3">
          {shop.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{shop.description}</p>
          )}

          <div className="space-y-2 text-sm">
            {/* 주소 + 카카오맵 */}
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-5 text-center">📍</span>
              <span className="text-gray-700">{shop.address}</span>
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(shop.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 text-xs font-medium px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
              >
                지도보기
              </a>
            </div>

            {shop.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400 w-5 text-center">📞</span>
                <a href={`tel:${shop.phone}`} className="text-blue-600 hover:underline">
                  {shop.phone}
                </a>
              </div>
            )}

            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-5 text-center">🕐</span>
              <div>
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {isOpen ? '영업중' : '휴무'}
                </span>
                {todayHours && todayHours !== '휴무' && (
                  <span className="text-gray-500 ml-2">{todayHours}</span>
                )}
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <details className="text-sm">
            <summary className="text-gray-500 cursor-pointer hover:text-gray-700">
              전체 영업시간 보기
            </summary>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              {Object.entries(shop.businessHours).map(([day, hours]) => (
                <div key={day} className={`flex justify-between px-2 py-1 rounded ${day === todayKey ? 'bg-orange-50 font-medium' : ''}`}>
                  <span className="text-gray-500">{DAYS_KR[day] || day}</span>
                  <span className={hours === '휴무' ? 'text-red-400' : 'text-gray-700'}>{hours}</span>
                </div>
              ))}
            </div>
          </details>

          {/* 공유 버튼 */}
          <ShareButtons shopId={shop.id} />
        </div>

        {/* Menu */}
        {shop.menus.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">메뉴</h2>
            <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
              {shop.menus.map((menu) => (
                <div key={menu.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2">
                    {menu.isPopular && (
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                        인기
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-800">{menu.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{formatPrice(menu.price)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 이 가게 들르는 파티 */}
        {matchedParties.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">🎉 이 가게 들르는 여행 파티</h2>
              <a
                href="http://localhost:3010"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium hover:underline"
                style={{ color: BRAND.color }}
              >
                더 보기 →
              </a>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {matchedParties.map((party) => (
                <div
                  key={party.id}
                  onClick={() => window.open(`http://localhost:3010/party/${party.id}`, '_blank')}
                  className="min-w-[180px] bg-white rounded-xl border border-gray-100 shadow-sm p-3 cursor-pointer hover:shadow-md hover:border-orange-200 transition-all flex-shrink-0"
                >
                  <div className="text-2xl mb-2">{PARTY_EMOJI[party.category] ?? '🎉'}</div>
                  <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{party.title}</p>
                  <p className="text-xs text-gray-400 mt-1">{party.date} · {party.location}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(party.currentMembers / party.maxMembers) * 100}%`,
                          backgroundColor: BRAND.color,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-500 font-medium whitespace-nowrap">
                      {party.currentMembers}/{party.maxMembers}명
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photos */}
        {shop.photos.length > 1 && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">사진</h2>
            <div className="grid grid-cols-3 gap-2">
              {shop.photos.map((photo) => (
                <div key={photo.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${photo.url})` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* JejuPass Badge */}
        <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
          <p className="text-sm font-bold text-orange-700">제주패스에서 더 많은 가게를 만나보세요</p>
          <p className="text-xs text-orange-500 mt-1">{BRAND.url}</p>
        </div>
      </div>
    </div>
  );
}
