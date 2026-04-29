import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', disallow: ['/'] },
    ],
    sitemap: 'https://jejupass.com/chatbot/sitemap.xml',
    host: 'https://jejupass.com',
  };
}
