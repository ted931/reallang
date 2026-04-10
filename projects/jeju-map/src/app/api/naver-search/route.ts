import { NextRequest, NextResponse } from "next/server";
import type { MapPin } from "@/lib/categories";

// 네이버 좌표 → 일반 좌표 변환 (카텍/TM → WGS84 근사)
function naverToWgs84(mapx: string, mapy: string): { lat: number; lng: number } {
  // 네이버 좌표는 10자리 정수 (예: 1265056541 → 126.5056541)
  const lng = parseInt(mapx) / 10000000;
  const lat = parseInt(mapy) / 10000000;
  return { lat, lng };
}

// HTML 태그 제거
function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

// 검색어 → 카테고리 매핑
function guessCategory(query: string, category: string): string {
  if (query.includes("카페") || category.includes("카페")) return "cafe";
  if (query.includes("맛집") || query.includes("식당") || category.includes("음식")) return "restaurant";
  if (query.includes("숙소") || query.includes("호텔") || query.includes("펜션")) return "stay";
  if (query.includes("관광") || query.includes("명소")) return "attraction";
  if (query.includes("해변") || query.includes("해수욕장")) return "beach";
  if (query.includes("서핑")) return "surfing";
  if (query.includes("낚시")) return "fishing";
  if (query.includes("주유소")) return "convenience";
  if (query.includes("주차")) return "parking";
  return "attraction";
}

export async function GET(req: NextRequest) {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "네이버 API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const { searchParams } = req.nextUrl;
  const query = searchParams.get("q") || "제주 카페";
  const page = parseInt(searchParams.get("page") || "1");
  const size = Math.min(parseInt(searchParams.get("size") || "20"), 100);

  try {
    const start = (page - 1) * size + 1;
    const url = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query)}&display=${size}&start=${start}&sort=random`;

    const res = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    const data = await res.json();

    if (data.errorCode) {
      return NextResponse.json({ error: data.errorMessage }, { status: 400 });
    }

    const category = guessCategory(query, "");

    const places: MapPin[] = (data.items || [])
      .filter((item: any) => item.mapx && item.mapy && parseInt(item.mapx) > 0)
      .map((item: any, i: number) => {
        const { lat, lng } = naverToWgs84(item.mapx, item.mapy);
        return {
          id: `naver-${start + i}`,
          name: stripHtml(item.title),
          category,
          lat,
          lng,
          address: item.address || item.roadAddress || "",
          phone: item.telephone || "",
          description: item.category || "",
        };
      })
      .filter((p: MapPin) => p.lat > 33 && p.lat < 34 && p.lng > 126 && p.lng < 127); // 제주도 범위만

    return NextResponse.json({
      places,
      total: data.total || 0,
      page,
      query,
    });
  } catch (err) {
    console.error("Naver search error:", err);
    return NextResponse.json({ error: "검색 중 오류가 발생했습니다." }, { status: 500 });
  }
}
