import { notFound } from 'next/navigation';
import { getShopBySlug, getShops } from '@/lib/store';
import { CATEGORY_MAP, REGION_MAP, DAYS_KR, BRAND } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShopBySlug(decodeURIComponent(slug));
  if (!shop) return { title: '가게를 찾을 수 없습니다' };

  const categoryLabel = CATEGORY_MAP[shop.category] || shop.category;
  const regionLabel = REGION_MAP[shop.region] || shop.region;

  return {
    title: `${shop.name} — 제주 ${regionLabel} ${categoryLabel}`,
    description: shop.description || `${shop.name} - 제주 ${regionLabel}의 ${categoryLabel}. 메뉴, 가격, 리뷰를 확인하세요.`,
    openGraph: {
      title: `${shop.name} | 제주패스`,
      description: shop.description,
      images: shop.photos[0]?.url ? [shop.photos[0].url] : [],
    },
  };
}

export default async function ShopPage({ params }: Props) {
  const { slug } = await params;
  const shop = await getShopBySlug(decodeURIComponent(slug));
  if (!shop) notFound();

  const categoryLabel = CATEGORY_MAP[shop.category] || shop.category;
  const regionLabel = REGION_MAP[shop.region] || shop.region;
  const primaryPhoto = shop.photos.find((p) => p.isPrimary) || shop.photos[0];

  const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
  const todayHours = shop.businessHours[todayKey];
  const isOpen = todayHours && todayHours !== '휴무';

  return (
    <div className="min-h-screen bg-gray-50">
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
            <div className="flex items-start gap-2">
              <span className="text-gray-400 w-5 text-center">📍</span>
              <span className="text-gray-700">{shop.address}</span>
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

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': shop.category === 'cafe' ? 'CafeOrCoffeeShop' : 'Restaurant',
            name: shop.name,
            description: shop.description,
            address: {
              '@type': 'PostalAddress',
              streetAddress: shop.address,
              addressRegion: '제주특별자치도',
              addressCountry: 'KR',
            },
            telephone: shop.phone,
            image: primaryPhoto?.url,
            url: `https://jejupass.com/shop/${shop.slug}`,
          }),
        }}
      />
    </div>
  );
}
