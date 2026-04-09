"use client";

import { useState, useEffect } from "react";

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
    fetch("/api/weather")
      .then((r) => r.json())
      .then((data) => {
        setLocations(data.locations || []);
        setUpdatedAt(data.updatedAt || "");
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
