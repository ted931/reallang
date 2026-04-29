import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Yeti', // 네이버봇
        allow: '/',
      },
    ],
    sitemap: 'https://jejupass.com/web/sitemap.xml',
    host: 'https://jejupass.com',
  };
}
