import { NextResponse } from "next/server";
import {
  JEJU_LOCATIONS,
  fetchWeatherForLocation,
  parseWeatherItems,
  getSkyDescription,
  type LocationWeather,
} from "@/lib/weather-api";

export const revalidate = 600; // 10분 캐시

export async function GET() {
  const apiKey = process.env.DATA_GO_KR_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const results: LocationWeather[] = await Promise.all(
      JEJU_LOCATIONS.map(async (loc) => {
        const items = await fetchWeatherForLocation(loc.nx, loc.ny, apiKey);
        const parsed = parseWeatherItems(items);
        const temp = parseFloat(parsed.temperature || "0");

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
      })
    );

    return NextResponse.json({
      locations: results,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Weather fetch error:", err);
    return NextResponse.json({ error: "날씨 데이터를 가져올 수 없습니다." }, { status: 500 });
  }
}
