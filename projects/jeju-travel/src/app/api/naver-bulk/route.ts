import { NextResponse } from "next/server";
import type { MapPin } from "@/lib/categories";

function naverToWgs84(mapx: string, mapy: string) {
  return { lat: parseInt(mapy) / 10000000, lng: parseInt(mapx) / 10000000 };
}
function stripHtml(text: string) { return text.replace(/<[^>]*>/g, ""); }
function guessCategory(query: string): string {
  if (query.includes("카페")) return "cafe";
  if (query.includes("맛집") || query.includes("식당") || query.includes("횟집") || query.includes("흑돼지")) return "restaurant";
  if (query.includes("호텔") || query.includes("펜션") || query.includes("숙소") || query.includes("리조트")) return "stay";
  if (query.includes("관광") || query.includes("명소") || query.includes("박물관")) return "attraction";
  if (query.includes("해수욕장") || query.includes("해변")) return "beach";
  if (query.includes("서핑")) return "surfing";
  if (query.includes("올레")) return "trail";
  if (query.includes("주유소")) return "convenience";
  return "attraction";
}

// 서버에서 벌크로 수집하여 캐시
let cachedPins: MapPin[] = [];
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1시간

export async function GET() {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json({ places: [], error: "네이버 API 키 없음" });
  }

  // 캐시 유효하면 바로 반환
  if (cachedPins.length > 0 && Date.now() - cacheTime < CACHE_TTL) {
    return NextResponse.json({ places: cachedPins, cached: true });
  }

  const regions = ["제주시", "서귀포", "애월", "한림", "중문", "성산", "함덕", "표선", "구좌", "한경", "대정", "안덕", "조천"];
  const categories = ["카페", "맛집", "관광", "호텔", "해수욕장", "서핑", "펜션", "횟집", "흑돼지", "베이커리"];
  const queries = regions.flatMap((r) => categories.map((c) => `${r} ${c}`));

  const allPins: MapPin[] = [];
  const seen = new Set<string>();

  // 순차 호출 (네이버 rate limit 고려)
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(q)}&display=5&start=1`,
        { headers: { "X-Naver-Client-Id": clientId, "X-Naver-Client-Secret": clientSecret } }
      );
      const data = await res.json();
      const cat = guessCategory(q);

      for (const item of data.items || []) {
        if (!item.mapx || !item.mapy || parseInt(item.mapx) === 0) continue;
        const name = stripHtml(item.title);
        const key = `${name}-${item.address}`;
        if (seen.has(key)) continue;
        seen.add(key);

        const { lat, lng } = naverToWgs84(item.mapx, item.mapy);
        if (lat < 33 || lat > 34 || lng < 126 || lng > 127) continue; // 제주 범위

        allPins.push({
          id: `nv-${allPins.length}`,
          name,
          category: cat,
          lat, lng,
          address: item.roadAddress || item.address || "",
          phone: item.telephone || "",
          description: (item.category || "").replace(/>/g, " > "),
        });
      }
    } catch {
      // 개별 실패 무시
    }
  }

  cachedPins = allPins;
  cacheTime = Date.now();

  return NextResponse.json({ places: allPins, total: allPins.length, queries: queries.length });
}
