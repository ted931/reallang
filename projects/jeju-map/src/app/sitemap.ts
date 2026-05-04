import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";

const BASE = "https://jejupass.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE}/map?category=${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    { url: `${BASE}/map`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/map/list`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    ...categoryEntries,
  ];
}
