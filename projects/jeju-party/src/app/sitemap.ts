import type { MetadataRoute } from "next";
import { DUMMY_PARTIES } from "@/lib/dummy-parties";
import { HOBBY_CATEGORIES, REGIONS } from "@/lib/types";

const BASE = "https://jejupass.com/party";

export default function sitemap(): MetadataRoute.Sitemap {
  const partyEntries: MetadataRoute.Sitemap = DUMMY_PARTIES.map((p) => ({
    url: `${BASE}/party/${p.id}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // 카테고리별 (롱테일: "제주 서핑 파티", "제주 자전거 모임")
  const categoryEntries: MetadataRoute.Sitemap = HOBBY_CATEGORIES.map((cat) => ({
    url: `${BASE}?category=${cat.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 지역별 (롱테일: "애월 파티 모집", "성산 모임")
  const regionEntries: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${BASE}?region=${encodeURIComponent(r)}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE}/create`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    ...partyEntries,
    ...categoryEntries,
    ...regionEntries,
  ];
}
