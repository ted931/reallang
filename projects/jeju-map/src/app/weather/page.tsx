"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function WeatherPage() {
  const [locations, setLocations] = useState<LocationWeather[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState("");
  const [isDummy, setIsDummy] = useState(false);
  const [selected, setSelected] = useState<LocationWeather | null>(null);

  useEffect(() => {
    fetch(`${basePath}/api/weather`)
      .then((r) => r.json())
      .then((data) => {
        setLocations(data.locations || []);
        setUpdatedAt(data.updatedAt || "");
        setIsDummy(!!data.isDummy);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getTempColor = (temp: string) => {
    const t = parseFloat(temp);
    if (t >= 30) return "text-red-600";
    if (t >= 25) return "text-orange-500";
    if (t >= 20) return "text-yellow-600";
    if (t >= 15) return "text-emerald-600";
    if (t >= 10) return "text-cyan-600";
    return "text-blue-600";
  };

  const isRainy = (loc: LocationWeather) => parseFloat(loc.rainfall) > 0;

  const sunny = locations.filter((l) => !isRainy(l));
  const rainy = locations.filter((l) => isRainy(l));

  const maxTemp = locations.length ? Math.max(...locations.map((l) => parseFloat(l.temperature) || 0)) : 0;
  const minTemp = locations.length ? Math.min(...locations.map((l) => parseFloat(l.temperature) || 99)) : 0;
  const avgHumidity = locations.length
    ? Math.round(locations.reduce((acc, l) => acc + (parseFloat(l.humidity) || 0), 0) / locations.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur border-b border-sky-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href={`${basePath}/`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              지도
            </Link>
            <div className="w-px h-4 bg-gray-200" />
            <div>
              <h1 className="text-base font-bold text-gray-900">제주 실시간 날씨</h1>
              {updatedAt && (
                <p className="text-[10px] text-gray-400">
                  {new Date(updatedAt).toLocaleString("ko-KR")} 업데이트
                  {isDummy && <span className="ml-1 text-amber-500">(테스트 데이터)</span>}
                </p>
              )}
            </div>
          </div>
          <Link
            href={`${basePath}/drive`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors whitespace-nowrap"
          >
            🚗 드라이브 코스 짜기
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-4">날씨 데이터를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {/* 요약 카드 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl p-3.5 border border-sky-100 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 mb-0.5">최고 기온</p>
                <p className="text-2xl font-bold text-red-500">{maxTemp.toFixed(1)}°</p>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-sky-100 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 mb-0.5">최저 기온</p>
                <p className="text-2xl font-bold text-blue-500">{minTemp.toFixed(1)}°</p>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-sky-100 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 mb-0.5">평균 습도</p>
                <p className="text-2xl font-bold text-cyan-500">{avgHumidity}%</p>
              </div>
              <div className="bg-white rounded-xl p-3.5 border border-sky-100 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 mb-0.5">강수 지역</p>
                <p className="text-2xl font-bold text-indigo-500">{rainy.length}곳</p>
              </div>
            </div>

            {/* 맑은 곳 / 비 오는 곳 섹션 */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {sunny.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">☀️</span>
                    <h3 className="font-bold text-gray-900 text-sm">지금 맑은 곳</h3>
                    <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full font-medium">{sunny.length}곳</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {sunny.map((l) => l.name).join(", ")}
                  </p>
                  <Link
                    href={`${basePath}/drive?pref=바다드라이브&region=${encodeURIComponent(sunny[0]?.name || "제주")}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    이 지역 드라이브 코스 →
                  </Link>
                </div>
              )}
              {rainy.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🌧️</span>
                    <h3 className="font-bold text-gray-900 text-sm">비 오는 곳</h3>
                    <span className="text-[10px] text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">{rainy.length}곳</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {rainy.map((l) => `${l.name}(${l.rainfall}mm)`).join(", ")}
                  </p>
                  <Link
                    href={`${basePath}/drive?pref=실내위주`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    실내 코스 짜기 →
                  </Link>
                </div>
              )}
            </div>

            {/* 지역별 카드 */}
            <h2 className="text-sm font-bold text-gray-700 mb-3">지역별 날씨 상세</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {locations.map((loc) => {
                const isSelected = selected?.name === loc.name;
                const rainy = isRainy(loc);
                return (
                  <button
                    key={loc.name}
                    onClick={() => setSelected(isSelected ? null : loc)}
                    className={`text-left bg-white rounded-xl border p-4 hover:shadow-md transition-all ${
                      isSelected
                        ? "border-emerald-400 shadow-md ring-2 ring-emerald-100"
                        : rainy
                        ? "border-blue-100"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl">{loc.emoji}</span>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm leading-tight">{loc.name}</h3>
                          <p className="text-[10px] text-gray-400">{loc.sky.split(" ").slice(1).join(" ")}</p>
                        </div>
                      </div>
                      <span className="text-xl">{loc.sky.split(" ")[0]}</span>
                    </div>

                    <div className="flex items-end justify-between">
                      <span className={`text-3xl font-bold ${getTempColor(loc.temperature)}`}>
                        {loc.temperature}°
                      </span>
                      <div className="text-right">
                        {rainy && (
                          <span className="block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full mb-1">
                            비 {loc.rainfall}mm
                          </span>
                        )}
                        <span className="text-[10px] text-gray-400">습도 {loc.humidity}%</span>
                      </div>
                    </div>

                    {/* 상세 (선택 시) */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-400 text-[10px]">습도</p>
                            <p className="font-semibold text-gray-700">💧 {loc.humidity}%</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-400 text-[10px]">풍속</p>
                            <p className="font-semibold text-gray-700">💨 {loc.windSpeed}m/s</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-400 text-[10px]">강수량</p>
                            <p className="font-semibold text-gray-700">🌧️ {loc.rainfall}mm</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2">
                            <p className="text-gray-400 text-[10px]">풍향</p>
                            <p className="font-semibold text-gray-700">🧭 {loc.windDirection}°</p>
                          </div>
                        </div>
                        <Link
                          href={`${basePath}/?lat=${loc.lat}&lng=${loc.lng}&zoom=13`}
                          className="flex items-center justify-center gap-1.5 w-full py-2 bg-emerald-500 text-white text-xs font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          🗺️ 지도에서 {loc.name} 보기
                        </Link>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 드라이브 CTA */}
            <div className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white text-center shadow-lg">
              <p className="text-base font-bold mb-1">지금 날씨로 드라이브 코스 짜기</p>
              <p className="text-xs text-emerald-100 mb-3">AI가 현재 날씨를 분석해서 최적의 제주 드라이브 코스를 추천합니다</p>
              <Link
                href={`${basePath}/drive`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-600 text-sm font-bold rounded-xl hover:bg-emerald-50 transition-colors"
              >
                🚗 드라이브 코스 추천받기
              </Link>
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-4">
              데이터 출처: 기상청 초단기실황 (공공데이터포털) · 10분마다 업데이트
            </p>
          </>
        )}
      </main>
    </div>
  );
}
