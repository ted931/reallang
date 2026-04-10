"use client";

import { useState, useEffect } from "react";
import { saveWeather } from "@/lib/shared-state";

interface LocationWeather {
  name: string;
  emoji: string;
  lat: number;
  lng: number;
  temperature: string;
  humidity: string;
  rainfall: string;
  windSpeed: string;
  windDirection: string;
  sky: string;
}

export default function WeatherPage() {
  const [locations, setLocations] = useState<LocationWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [selected, setSelected] = useState<LocationWeather | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/weather`)
      .then((r) => r.json())
      .then((data) => {
        const locs = data.locations || [];
        setLocations(locs);
        setUpdatedAt(data.updatedAt || "");
        // 날씨 요약을 공유 상태에 저장 → 코스/플래너에서 활용
        const sunny = locs.filter((l: LocationWeather) => parseFloat(l.rainfall) === 0);
        const rainy = locs.filter((l: LocationWeather) => parseFloat(l.rainfall) > 0);
        const temps = locs.map((l: LocationWeather) => parseFloat(l.temperature) || 0);
        saveWeather({
          sunnyAreas: sunny.map((l: LocationWeather) => l.name),
          rainyAreas: rainy.map((l: LocationWeather) => l.name),
          avgTemp: temps.length > 0 ? temps.reduce((a: number, b: number) => a + b, 0) / temps.length : 0,
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getTemperatureColor = (temp: string) => {
    const t = parseFloat(temp);
    if (t >= 30) return "text-red-600 bg-red-50";
    if (t >= 25) return "text-orange-600 bg-orange-50";
    if (t >= 20) return "text-yellow-600 bg-yellow-50";
    if (t >= 15) return "text-green-600 bg-green-50";
    if (t >= 10) return "text-cyan-600 bg-cyan-50";
    return "text-blue-600 bg-blue-50";
  };

  const getRainfallBadge = (rainfall: string) => {
    const r = parseFloat(rainfall);
    if (r > 0) return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">비 {rainfall}mm</span>;
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-sky-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🌤️ 제주 실시간 날씨</h1>
              <p className="text-sm text-gray-500 mt-0.5">제주도 10개 지역 기상 현황</p>
            </div>
            {updatedAt && (
              <div className="text-right">
                <p className="text-[10px] text-gray-400">마지막 업데이트</p>
                <p className="text-xs text-gray-600">{new Date(updatedAt).toLocaleString("ko-KR")}</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-4">날씨 데이터를 불러오고 있습니다...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌫️</p>
            <p className="text-gray-500">날씨 데이터를 가져올 수 없습니다.</p>
            <p className="text-xs text-gray-400 mt-2">API 키를 확인해주세요.</p>
          </div>
        ) : (
          <>
            {/* 전체 요약 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 border border-sky-100 text-center">
                <p className="text-xs text-gray-500">최고 기온</p>
                <p className="text-2xl font-bold text-red-500">
                  {Math.max(...locations.map((l) => parseFloat(l.temperature) || 0)).toFixed(1)}°
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-sky-100 text-center">
                <p className="text-xs text-gray-500">최저 기온</p>
                <p className="text-2xl font-bold text-blue-500">
                  {Math.min(...locations.map((l) => parseFloat(l.temperature) || 99)).toFixed(1)}°
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-sky-100 text-center">
                <p className="text-xs text-gray-500">평균 습도</p>
                <p className="text-2xl font-bold text-cyan-500">
                  {(locations.reduce((acc, l) => acc + (parseFloat(l.humidity) || 0), 0) / locations.length).toFixed(0)}%
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-sky-100 text-center">
                <p className="text-xs text-gray-500">강수 지역</p>
                <p className="text-2xl font-bold text-indigo-500">
                  {locations.filter((l) => parseFloat(l.rainfall) > 0).length}곳
                </p>
              </div>
            </div>

            {/* 맑은 곳 / 비 오는 곳 요약 + CTA */}
            {(() => {
              const sunny = locations.filter((l) => parseFloat(l.rainfall) === 0);
              const rainy = locations.filter((l) => parseFloat(l.rainfall) > 0);
              return (
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {sunny.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">☀️</span>
                        <h3 className="font-bold text-gray-900">지금 맑은 곳</h3>
                        <span className="text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{sunny.length}곳</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {sunny.map((l) => l.name).join(", ")}
                      </p>
                      <a
                        href={`/course?theme=자연&region=${encodeURIComponent(sunny[0]?.name || "제주")}&weather=sunny`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        이 지역 코스 만들기 →
                      </a>
                    </div>
                  )}
                  {rainy.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🌧️</span>
                        <h3 className="font-bold text-gray-900">비 오는 곳</h3>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{rainy.length}곳</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {rainy.map((l) => `${l.name}(${l.rainfall}mm)`).join(", ")}
                      </p>
                      <a
                        href="/course?theme=카페&indoor=true"
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        실내 코스 보기 →
                      </a>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* 지역별 카드 */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => setSelected(selected?.name === loc.name ? null : loc)}
                  className={`text-left bg-white rounded-xl border p-5 hover:shadow-md transition-all ${
                    selected?.name === loc.name ? "border-sky-400 shadow-md ring-2 ring-sky-100" : "border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{loc.emoji}</span>
                      <h3 className="font-bold text-gray-900">{loc.name}</h3>
                    </div>
                    <span className="text-lg">{loc.sky.split(" ")[0]}</span>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <span className={`text-3xl font-bold ${getTemperatureColor(loc.temperature).split(" ")[0]}`}>
                        {loc.temperature}°
                      </span>
                      <span className="text-sm text-gray-500 ml-1">{loc.sky.split(" ").slice(1).join(" ")}</span>
                    </div>
                    {getRainfallBadge(loc.rainfall)}
                  </div>

                  {/* 상세 (선택 시) */}
                  {selected?.name === loc.name && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-400 text-xs">습도</p>
                        <p className="font-medium text-gray-700">💧 {loc.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">풍속</p>
                        <p className="font-medium text-gray-700">💨 {loc.windSpeed}m/s</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">강수량</p>
                        <p className="font-medium text-gray-700">🌧️ {loc.rainfall}mm</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">풍향</p>
                        <p className="font-medium text-gray-700">🧭 {loc.windDirection}°</p>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 안내 */}
            <div className="mt-8 p-4 bg-sky-50 rounded-xl text-center">
              <p className="text-xs text-sky-600">데이터 출처: 기상청 초단기실황 (공공데이터포털) · 10분마다 자동 업데이트</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
