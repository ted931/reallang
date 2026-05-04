import { NextResponse } from "next/server";
import {
  JEJU_LOCATIONS,
  fetchWeatherForLocation,
  parseWeatherItems,
  getSkyDescription,
  DUMMY_WEATHER,
  type LocationWeather,
} from "@/lib/weather-api";

export const revalidate = 600; // 10분 캐시

export async function GET() {
  const apiKey = process.env.DATA_GO_KR_KEY || process.env.WEATHER_API_KEY;

  // API 키 없으면 더미 데이터 반환
  if (!apiKey) {
    return NextResponse.json({
      locations: DUMMY_WEATHER,
      updatedAt: new Date().toISOString(),
      isDummy: true,
    });
  }

  try {
    const results: LocationWeather[] = await Promise.all(
      JEJU_LOCATIONS.map(async (loc) => {
        try {
          const items = await fetchWeatherForLocation(loc.nx, loc.ny, apiKey);
          const parsed = parseWeatherItems(items);
          const temp = parseFloat(parsed.temperature || "0");

          // 실제 데이터가 없으면 더미 사용
          if (!parsed.temperature) {
            const dummy = DUMMY_WEATHER.find((d) => d.name === loc.name);
            return dummy || {
              name: loc.name, emoji: loc.emoji, lat: loc.lat, lng: loc.lng,
              temperature: "20", humidity: "60", rainfall: "0",
              windSpeed: "3", windDirection: "180", sky: "☀️ 맑음",
            };
          }

          return {
            name: loc.name,
            emoji: loc.emoji,
            lat: loc.lat,
            lng: loc.lng,
            temperature: parsed.temperature || "-",
            humidity: parsed.humidity || "-",
            rainfall: parsed.rainfall || "0",
            windSpeed: parsed.windSpeed || "-",
            windDirection: parsed.windDirection || "-",
            sky: getSkyDescription(parsed.precipType || "0", temp),
          };
        } catch {
          const dummy = DUMMY_WEATHER.find((d) => d.name === loc.name);
          return dummy || {
            name: loc.name, emoji: loc.emoji, lat: loc.lat, lng: loc.lng,
            temperature: "20", humidity: "60", rainfall: "0",
            windSpeed: "3", windDirection: "180", sky: "☀️ 맑음",
          };
        }
      })
    );

    return NextResponse.json({
      locations: results,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Weather fetch error:", err);
    // 에러 시 더미 데이터로 폴백
    return NextResponse.json({
      locations: DUMMY_WEATHER,
      updatedAt: new Date().toISOString(),
      isDummy: true,
    });
  }
}
