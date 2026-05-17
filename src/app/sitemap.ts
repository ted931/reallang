import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE = "https://realang.store";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/blog`,    lastModified: new Date(), priority: 0.9, changeFrequency: "daily" },
    { url: `${BASE}/travel`,  lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/course`,  lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/map`,     lastModified: new Date(), priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE}/travel-pick`, lastModified: new Date(), priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/car-report`,  lastModified: new Date(), priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE}/car-pick`,    lastModified: new Date(), priority: 0.7, changeFrequency: "weekly" },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    priority: 0.85,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...blogRoutes];
}
