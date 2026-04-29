import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://jejupass.com/weather',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: 'https://jejupass.com/weather/forecast',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
  ];
}
