import type { MetadataRoute } from 'next';
import { getShops } from '@/lib/store';

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
  ];
}
