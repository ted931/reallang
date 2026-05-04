import type { MetadataRoute } from 'next';
import { getShops } from '@/lib/store';
import { CATEGORIES, REGIONS } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shops = await getShops();

  const shopUrls: MetadataRoute.Sitemap = shops
    .filter((shop) => shop.isPublished)
    .map((shop) => ({
      url: `https://jejupass.com/web/shop/${shop.slug}`,
      lastModified: new Date(shop.updatedAt || shop.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [
    {
      url: 'https://jejupass.com/web',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://jejupass.com/web/explore',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://jejupass.com/web/register',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...shopUrls,
    // 카테고리별 탐색 페이지
    ...CATEGORIES.map((c) => ({
      url: `https://jejupass.com/web/explore/${c.value}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // 카테고리 × 지역 조합 (롱테일 키워드)
    ...CATEGORIES.flatMap((c) =>
      REGIONS.map((r) => ({
        url: `https://jejupass.com/web/explore/${c.value}?region=${r.value}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    ),
  ];
}
