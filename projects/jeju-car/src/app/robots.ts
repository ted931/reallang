import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: 'Yeti', allow: '/' },
    ],
    sitemap: 'https://jejupass.com/car/sitemap.xml',
    host: 'https://jejupass.com',
  };
}
