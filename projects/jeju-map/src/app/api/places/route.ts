import { NextRequest, NextResponse } from "next/server";

// 한국관광공사 관광정보 API — 제주도 지역 코드: 39
const AREA_CODE = "39"; // 제주도
const BASE_URL = "https://apis.data.go.kr/B551011/KorService1";

interface TourItem {
  contentid: string;
  title: string;
  addr1: string;
  addr2?: string;
  tel?: string;
  firstimage?: string;
  mapx: string; // longitude
  mapy: string; // latitude
  contenttypeid: string;
  cat1?: string;
  cat2?: string;
  cat3?: string;
}

// 콘텐츠타입 → 카테고리 매핑
function mapCategory(contenttypeid: string, cat2?: string, cat3?: string): string {
  switch (contenttypeid) {
    case "12": return "attraction"; // 관광지
    case "14": return "attraction"; // 문화시설
    case "28": return "activity";   // 레포츠
    case "32": return "stay";       // 숙박
    case "38": return "restaurant"; // 쇼핑 (→ 편의시설로 분류)
    case "39": // 음식점
      if (cat3?.includes("카페") || cat3?.includes("커피")) return "cafe";
      return "restaurant";
    default: return "attraction";
  }
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.DATA_GO_KR_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not set" }, { status: 500 });
  }

  const { searchParams } = req.nextUrl;
  const contentTypeId = searchParams.get("type") || ""; // 12,14,28,32,39
  const keyword = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  try {
    let url: string;

    if (keyword) {
      // 키워드 검색
      const params = new URLSearchParams({
        serviceKey: apiKey,
        MobileOS: "ETC",
        MobileApp: "JejuMap",
        _type: "json",
        numOfRows: "50",
        pageNo: page,
        areaCode: AREA_CODE,
        keyword: keyword,
      });
      url = `${BASE_URL}/searchKeyword1?${params}`;
    } else {
      // 지역 기반 조회
      const params = new URLSearchParams({
        serviceKey: apiKey,
        MobileOS: "ETC",
        MobileApp: "JejuMap",
        _type: "json",
        numOfRows: "50",
        pageNo: page,
        areaCode: AREA_CODE,
        ...(contentTypeId ? { contentTypeId } : {}),
      });
      url = `${BASE_URL}/areaBasedList1?${params}`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } }); // 1시간 캐시
    const data = await res.json();

    const items: TourItem[] = data?.response?.body?.items?.item || [];

    const places = items
      .filter((item) => item.mapx && item.mapy && parseFloat(item.mapx) > 0)
      .map((item) => ({
        id: item.contentid,
        name: item.title,
        category: mapCategory(item.contenttypeid, item.cat2, item.cat3),
        lat: parseFloat(item.mapy),
        lng: parseFloat(item.mapx),
        address: `${item.addr1 || ""} ${item.addr2 || ""}`.trim(),
        phone: item.tel || "",
        image: item.firstimage || "",
        description: "",
      }));

    return NextResponse.json({
      places,
      total: data?.response?.body?.totalCount || 0,
      page: parseInt(page),
    });
  } catch (err) {
    console.error("Places API error:", err);
    return NextResponse.json({ error: "데이터를 가져올 수 없습니다." }, { status: 500 });
  }
}
