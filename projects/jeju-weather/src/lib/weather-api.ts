// 기상청 초단기실황 API (공공데이터포털)
// 제주도 주요 지점 격자 좌표 (nx, ny)

export const JEJU_LOCATIONS = [
  { name: "제주시", nx: 53, ny: 38, lat: 33.5104, lng: 126.5319, emoji: "🏙️" },
  { name: "서귀포", nx: 52, ny: 33, lat: 33.2541, lng: 126.5600, emoji: "🌊" },
  { name: "애월", nx: 50, ny: 38, lat: 33.4631, lng: 126.3313, emoji: "🌅" },
  { name: "한림", nx: 48, ny: 37, lat: 33.4120, lng: 126.2654, emoji: "🏖️" },
  { name: "함덕", nx: 56, ny: 39, lat: 33.5432, lng: 126.6698, emoji: "🏄" },
  { name: "성산", nx: 60, ny: 36, lat: 33.4584, lng: 126.9272, emoji: "🌋" },
  { name: "중문", nx: 51, ny: 33, lat: 33.2490, lng: 126.4122, emoji: "🌴" },
  { name: "표선", nx: 58, ny: 34, lat: 33.3225, lng: 126.8233, emoji: "🐚" },
  { name: "한라산", nx: 53, ny: 35, lat: 33.3616, lng: 126.5292, emoji: "⛰️" },
  { name: "우도", nx: 62, ny: 36, lat: 33.5066, lng: 126.9514, emoji: "🐴" },
] as const;

interface WeatherItem {
  category: string;
  obsrValue: string;
}

export interface LocationWeather {
  name: string;
  emoji: string;
  lat: number;
  lng: number;
  temperature: string;
  humidity: string;
  rainfall: string;
  windSpeed: string;
  windDirection: string;
  sky: string; // 맑음, 구름많음, 흐림
}

// 카테고리 코드 매핑
const CATEGORY_MAP: Record<string, string> = {
  T1H: "temperature",     // 기온 (℃)
  RN1: "rainfall",        // 1시간 강수량 (mm)
  REH: "humidity",        // 습도 (%)
  WSD: "windSpeed",       // 풍속 (m/s)
  VEC: "windDirection",   // 풍향 (°)
  PTY: "precipType",      // 강수형태 (0없음,1비,2비/눈,3눈,5빗방울,6빗방울/눈날림,7눈날림)
};

function getBaseDateTime(): { baseDate: string; baseTime: string } {
  const now = new Date();
  // 초단기실황: 매시 40분 발표, 정시 관측
  // 안전하게 1시간 전 데이터 사용
  now.setHours(now.getHours() - 1);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");

  return {
    baseDate: `${year}${month}${day}`,
    baseTime: `${hour}00`,
  };
}

export async function fetchWeatherForLocation(
  nx: number,
  ny: number,
  apiKey: string
): Promise<WeatherItem[]> {
  const { baseDate, baseTime } = getBaseDateTime();

  const params = new URLSearchParams({
    serviceKey: apiKey,
    numOfRows: "10",
    pageNo: "1",
    dataType: "JSON",
    base_date: baseDate,
    base_time: baseTime,
    nx: String(nx),
    ny: String(ny),
  });

  const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?${params}`;

  const res = await fetch(url, { next: { revalidate: 600 } }); // 10분 캐시
  const data = await res.json();

  if (data.response?.header?.resultCode !== "00") {
    console.error("Weather API error:", data.response?.header);
    return [];
  }

  return data.response?.body?.items?.item || [];
}

export function parseWeatherItems(items: WeatherItem[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const item of items) {
    const key = CATEGORY_MAP[item.category];
    if (key) {
      result[key] = item.obsrValue;
    }
  }
  return result;
}

export function getSkyDescription(precipType: string, temperature: number): string {
  switch (precipType) {
    case "1": return "🌧️ 비";
    case "2": return "🌨️ 비/눈";
    case "3": return "❄️ 눈";
    case "5": return "🌦️ 빗방울";
    case "6": return "🌨️ 눈날림";
    case "7": return "🌨️ 눈날림";
    default:
      if (temperature >= 20) return "☀️ 맑음";
      if (temperature >= 10) return "🌤️ 맑음";
      return "⛅ 쌀쌀";
  }
}
