import { NextResponse } from "next/server";
import { JEJU_LOCATIONS } from "@/lib/weather-api";

export const revalidate = 1800; // 30분 캐시

interface ForecastItem {
  fcstDate: string;
  fcstTime: string;
  category: string;
  fcstValue: string;
}

function getBaseDateTime(): { baseDate: string; baseTime: string } {
  const now = new Date();
  // 단기예보 발표시각: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300
  const hours = [23, 20, 17, 14, 11, 8, 5, 2];
  let h = now.getHours();
  // 발표 후 10분 지나야 데이터 사용 가능
  if (now.getMinutes() < 10) h -= 1;

  let baseHour = 2;
  for (const bh of hours) {
    if (h >= bh) { baseHour = bh; break; }
  }

  const baseDate = baseHour > h
    ? new Date(now.getTime() - 86400000)
    : now;

  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, "0");
  const d = String(baseDate.getDate()).padStart(2, "0");

  return {
    baseDate: `${y}${m}${d}`,
    baseTime: String(baseHour).padStart(2, "0") + "00",
  };
}

async function fetchForecast(nx: number, ny: number, apiKey: string): Promise<ForecastItem[]> {
  const { baseDate, baseTime } = getBaseDateTime();
  const params = new URLSearchParams({
    serviceKey: apiKey,
    numOfRows: "300",
    pageNo: "1",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: String(nx),
    ny: String(ny),
  });

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?${params}`;
  const res = await fetch(url, { next: { revalidate: 1800 } });
  const data = await res.json();

  if (data.response?.header?.resultCode !== "00") {
    console.error("Forecast API error:", data.response?.header);
    return [];
  }
  return data.response?.body?.items?.item || [];
}

function parseForecastItems(items: ForecastItem[]) {
  // 날짜+시간별로 그룹핑
  const bySlot: Record<string, Record<string, string>> = {};
  for (const item of items) {
    const key = `${item.fcstDate}_${item.fcstTime}`;
    if (!bySlot[key]) bySlot[key] = { date: item.fcstDate, time: item.fcstTime };
    bySlot[key][item.category] = item.fcstValue;
  }

  return Object.values(bySlot).map((slot) => ({
    date: slot.date,
    time: slot.time,
    temp: slot.TMP || slot.T1H || "-",
    sky: slot.SKY || "1",       // 1맑음 3구름많음 4흐림
    pty: slot.PTY || "0",       // 강수형태
    pop: slot.POP || "0",       // 강수확률
    reh: slot.REH || "-",       // 습도
    wsd: slot.WSD || "-",       // 풍속
  }));
}

function skyLabel(sky: string, pty: string) {
  if (pty !== "0") {
    const ptyMap: Record<string, string> = { "1": "비", "2": "비/눈", "3": "눈", "4": "소나기" };
    return ptyMap[pty] || "비";
  }
  const skyMap: Record<string, string> = { "1": "맑음", "3": "구름많음", "4": "흐림" };
  return skyMap[sky] || "맑음";
}

function skyEmoji(sky: string, pty: string) {
  if (pty !== "0") {
    const m: Record<string, string> = { "1": "🌧️", "2": "🌨️", "3": "❄️", "4": "🌦️" };
    return m[pty] || "🌧️";
  }
  const m: Record<string, string> = { "1": "☀️", "3": "⛅", "4": "☁️" };
  return m[sky] || "☀️";
}

export async function GET() {
  const apiKey = process.env.DATA_GO_KR_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    // 제주시, 서귀포, 성산 3개 지점 예보
    const targets = [JEJU_LOCATIONS[0], JEJU_LOCATIONS[1], JEJU_LOCATIONS[5]];

    const results = await Promise.all(
      targets.map(async (loc) => {
        const items = await fetchForecast(loc.nx, loc.ny, apiKey);
        const parsed = parseForecastItems(items);
        return {
          name: loc.name,
          emoji: loc.emoji,
          forecast: parsed.slice(0, 24).map((s) => ({
            date: `${s.date.slice(4, 6)}/${s.date.slice(6)}`,
            time: `${s.time.slice(0, 2)}시`,
            temp: s.temp,
            sky: skyLabel(s.sky, s.pty),
            skyEmoji: skyEmoji(s.sky, s.pty),
            pop: s.pop,
            humidity: s.reh,
            windSpeed: s.wsd,
          })),
        };
      })
    );

    return NextResponse.json({ locations: results, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error("Forecast fetch error:", err);
    return NextResponse.json({ error: "예보 데이터를 가져올 수 없습니다." }, { status: 500 });
  }
}
