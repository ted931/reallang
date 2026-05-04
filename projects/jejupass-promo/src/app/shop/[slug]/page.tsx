import type { Metadata } from 'next';
import { getShopBySlug } from '@/lib/store';
import { CATEGORY_MAP, REGION_MAP } from '@/lib/constants';
import ShopClient from './ShopClient';

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);

  if (!shop) {
    return { title: '가게를 찾을 수 없습니다' };
  }

  const category = CATEGORY_MAP[shop.category] || shop.category;
  const region = REGION_MAP[shop.region] || shop.region;
  const primaryPhoto = shop.photos.find((p) => p.isPrimary) || shop.photos[0];
  const title = `${shop.name} — 제주 ${category}`;
  const description =
    shop.description ||
    `${region}에 위치한 제주 ${category}. 영업시간, 메뉴, 위치 정보를 확인하세요.`;

  const reviewCount = shop.reviews?.length ?? 0;
  const avgRating =
    reviewCount > 0
      ? (shop.reviews!.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(1)
      : null;

  return {
    title,
    description,
    keywords: [
      shop.name,
      `제주 ${category}`,
      `${region} ${category}`,
      region,
      '제주패스',
      '제주 여행',
      '제주 카페',
    ],
    alternates: {
      canonical: `https://jejupass.com/web/shop/${slug}`,
    },
    openGraph: {
      title: `${shop.name} | 제주패스`,
      description: avgRating
        ? `⭐ ${avgRating} · ${description}`
        : description,
      url: `https://jejupass.com/web/shop/${slug}`,
      type: 'website',
      siteName: '제주패스',
      locale: 'ko_KR',
      images: primaryPhoto
        ? [{ url: primaryPhoto.url, width: 1200, height: 630, alt: `${shop.name} 대표사진` }]
        : [{ url: '/og-image.png', width: 1200, height: 630, alt: '제주패스' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${shop.name} | 제주패스`,
      description,
      images: primaryPhoto ? [primaryPhoto.url] : ['/og-image.png'],
    },
  };
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shop = await getShopBySlug(slug);
  return <ShopClient params={params} initialShop={shop} />;
}
