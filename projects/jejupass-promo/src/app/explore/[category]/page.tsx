import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { filterShops } from '@/lib/store';
import { CATEGORIES, REGIONS, CATEGORY_MAP, BRAND } from '@/lib/constants';
import { formatPrice, getCategoryEmoji } from '@/lib/utils';

const CATEGORY_SEO: Record<string, { title: string; desc: string; keywords: string[] }> = {
  cafe: {
    title: '제주 카페 추천',
    desc: '제주도 감성 카페 모음. 오션뷰 카페, 제주 감귤 라떼, 한라봉 음료 등 제주 특색 카페를 탐색하세요.',
    keywords: ['제주 카페', '제주 오션뷰 카페', '애월 카페', '서귀포 카페', '함덕 카페', '성산 카페', '제주 카페투어', '제주 감성 카페'],
  },
  restaurant: {
    title: '제주 맛집 추천',
    desc: '제주 흑돼지, 해산물, 오마카세 등 현지인도 인정하는 제주 맛집을 탐색하세요.',
    keywords: ['제주 맛집', '제주 흑돼지', '제주 해산물', '서귀포 맛집', '제주시 맛집', '제주 현지 맛집', '제주 여행 맛집'],
  },
  dessert: {
    title: '제주 디저트 카페',
    desc: '제주산 망고, 한라봉, 감귤로 만든 디저트 카페. 제주 특산물 디저트를 즐겨보세요.',
    keywords: ['제주 디저트', '제주 망고 빙수', '제주 감귤 디저트', '한라봉 디저트', '제주 빙수', '제주 디저트 카페'],
  },
  bakery: {
    title: '제주 베이커리 추천',
    desc: '제주 우유와 한라봉을 활용한 수제 베이커리. 제주 여행 중 들르기 좋은 빵집을 찾아보세요.',
    keywords: ['제주 베이커리', '제주 빵집', '한라봉 크림빵', '제주우유 식빵', '서귀포 베이커리', '제주 수제 빵'],
  },
  brunch: {
    title: '제주 브런치 카페',
    desc: '제주 오션뷰 브런치 카페. 에그베네딕트, 리코타 샐러드 등 감성 브런치를 즐겨보세요.',
    keywords: ['제주 브런치', '제주 브런치 카페', '애월 브런치', '제주 오션뷰 브런치', '제주 여행 브런치'],
  },
  bar: {
    title: '제주 바 & 칵테일',
    desc: '제주 한라봉과 감귤로 만든 시그니처 칵테일 바. 서귀포 야경을 즐기며 한 잔.',
    keywords: ['제주 바', '서귀포 루프탑 바', '제주 칵테일', '한라봉 칵테일', '제주 야경 바'],
  },
  etc: {
    title: '제주 기타 가게',
    desc: '제주도의 다양한 가게들을 탐색하세요.',
    keywords: ['제주 가게', '제주 여행', '제주패스'],
  },
};

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.value }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params;
  const seo = CATEGORY_SEO[category];
  if (!seo) return { title: '제주패스' };

  const emoji = getCategoryEmoji(category as any);
  return {
    title: `${seo.title} | 제주패스`,
    description: seo.desc,
    keywords: seo.keywords,
    alternates: {
      canonical: `https://jejupass.com/web/explore/${category}`,
    },
    openGraph: {
      title: `${emoji} ${seo.title} | 제주패스`,
      description: seo.desc,
      url: `https://jejupass.com/web/explore/${category}`,
      type: 'website',
      siteName: '제주패스',
      locale: 'ko_KR',
    },
  };
}

export default async function CategoryExplorePage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  const seo = CATEGORY_SEO[category];
  if (!seo) notFound();

  const shops = await filterShops({ category });
  const catLabel = CATEGORY_MAP[category as keyof typeof CATEGORY_MAP] || category;
  const emoji = getCategoryEmoji(category as any);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `제주 ${catLabel} 추천 — 제주패스`,
    description: seo.desc,
    url: `https://jejupass.com/web/explore/${category}`,
    numberOfItems: shops.length,
    itemListElement: shops.slice(0, 10).map((shop, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": shop.category === 'cafe' ? 'CafeOrCoffeeShop' : 'LocalBusiness',
        name: shop.name,
        description: shop.description,
        url: `https://jejupass.com/web/shop/${shop.slug}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: shop.address,
          addressRegion: "제주특별자치도",
          addressCountry: "KR",
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <Link href="/explore" className="hover:text-orange-500 transition-colors">탐색</Link>
            <span>›</span>
            <span className="text-gray-700 font-medium">{catLabel}</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">
            {emoji} 제주 {catLabel} 추천
          </h1>
          <p className="text-sm text-gray-500 mt-1">{seo.desc}</p>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
            <span className="font-medium text-orange-500">{shops.length}곳</span>
            <span>등록됨</span>
          </div>
        </div>
      </div>

      {/* 지역 필터 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          <Link
            href={`/explore/${category}`}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-500 text-white"
          >
            전체
          </Link>
          {REGIONS.map((r) => (
            <Link
              key={r.value}
              href={`/explore/${category}?region=${r.value}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="max-w-2xl mx-auto px-4 pt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {CATEGORIES.filter((c) => c.value !== 'etc').map((c) => (
          <Link
            key={c.value}
            href={`/explore/${c.value}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              c.value === category
                ? 'text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600'
            }`}
            style={c.value === category ? { backgroundColor: BRAND.color } : {}}
          >
            {c.emoji} {c.label}
          </Link>
        ))}
      </div>

      {/* 가게 목록 */}
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {shops.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">{emoji}</p>
            <p className="text-sm">아직 등록된 {catLabel}이 없어요</p>
            <Link href="/register" className="text-xs mt-2 inline-block hover:underline" style={{ color: BRAND.color }}>
              가게 등록하기 →
            </Link>
          </div>
        ) : (
          shops.map((shop) => {
            const primaryPhoto = shop.photos.find((p) => p.isPrimary) || shop.photos[0];
            const reviews = shop.reviews ?? [];
            const avgRating = reviews.length > 0
              ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
              : null;
            return (
              <Link
                key={shop.id}
                href={`/shop/${shop.slug}`}
                className="block bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
              >
                <div className="flex">
                  <div className="w-24 h-24 shrink-0 bg-gray-100 relative overflow-hidden">
                    {primaryPhoto ? (
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${primaryPhoto.url})` }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">{emoji}</div>
                    )}
                  </div>
                  <div className="flex-1 p-3 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h2 className="text-sm font-bold text-gray-900 truncate">{shop.name}</h2>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{shop.address}</p>
                      </div>
                      {avgRating && (
                        <div className="shrink-0 flex items-center gap-0.5 text-xs font-semibold text-yellow-500">
                          <span>★</span>
                          <span>{avgRating}</span>
                        </div>
                      )}
                    </div>
                    {shop.description && (
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{shop.description}</p>
                    )}
                    {shop.menus.length > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {shop.menus.filter((m) => m.isPopular).slice(0, 2).map((m) => (
                          <span key={m.id} className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded-full">
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

      {/* 가게 등록 CTA */}
      <div className="max-w-2xl mx-auto px-4 pb-10">
        <div className="rounded-xl p-4 text-center border border-dashed border-orange-200" style={{ backgroundColor: '#FFF3ED' }}>
          <p className="text-sm font-bold text-gray-800">내 가게도 제주패스에 등록하세요</p>
          <p className="text-xs text-gray-500 mt-0.5">무료 등록 · 리뷰 관리 · 파티 연계</p>
          <Link
            href="/register"
            className="inline-block mt-3 px-5 py-2 rounded-lg text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND.color }}
          >
            무료로 가게 등록하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
