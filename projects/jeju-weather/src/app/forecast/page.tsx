"use client";

import { useState, useEffect } from "react";

interface ForecastSlot {
  date: string;
  time: string;
  temp: string;
  sky: string;
  skyEmoji: string;
  pop: string;
  humidity: string;
  windSpeed: string;
}

interface LocationForecast {
  name: string;
  emoji: string;
  forecast: ForecastSlot[];
}

export default function ForecastPage() {
  const [locations, setLocations] = useState<LocationForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/forecast`)
      .then((r) => r.json())
      .then((data) => setLocations(data.locations || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selected = locations[selectedIdx];

  const getTempColor = (t: string) => {
    const n = parseFloat(t);
    if (n >= 30) return "text-red-600";
    if (n >= 25) return "text-orange-500";
    if (n >= 20) return "text-yellow-600";
    if (n >= 15) return "text-green-600";
    if (n >= 10) return "text-cyan-600";
    return "text-blue-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white/80 backdrop-blur border-b border-sky-100">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">📊 제주 날씨 예보</h1>
          <p className="text-sm text-gray-500 mt-0.5">기상청 단기예보 — 3개 지점 시간별 예보</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-400 mt-4">예보 데이터를 불러오고 있습니다...</p>
          </div>
        ) : locations.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌫️</p>
            <p className="text-gray-500">예보 데이터를 가져올 수 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 지역 탭 */}
            <div className="flex gap-2 mb-6">
              {locations.map((loc, i) => (
                <button
                  key={loc.name}
                  onClick={() => setSelectedIdx(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedIdx === i
                      ? "bg-sky-500 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-sky-300"
                  }`}
                >
                  {loc.emoji} {loc.name}
                </button>
              ))}
            </div>

            {/* 시간별 예보 */}
            {selected && (
              <div className="space-y-2">
                {/* 헤더 */}
                <div className="grid grid-cols-7 gap-2 px-4 py-2 text-[10px] text-gray-400 font-medium">
                  <span>시간</span>
                  <span>날씨</span>
                  <span className="text-center">기온</span>
                  <span className="text-center">강수확률</span>
                  <span className="text-center">습도</span>
                  <span className="text-center">풍속</span>
                  <span></span>
                </div>

                {selected.forecast.map((slot, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-7 gap-2 items-center bg-white rounded-xl border border-gray-100 px-4 py-3 hover:shadow-sm transition-shadow"
                  >
                    <div>
                      <p className="text-xs text-gray-400">{slot.date}</p>
                      <p className="text-sm font-bold text-gray-900">{slot.time}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{slot.skyEmoji}</span>
                      <span className="text-xs text-gray-600">{slot.sky}</span>
                    </div>
                    <p className={`text-center text-lg font-bold ${getTempColor(slot.temp)}`}>
                      {slot.temp}°
                    </p>
                    <div className="text-center">
                      <span className={`text-sm font-medium ${
                        parseInt(slot.pop) >= 60 ? "text-blue-600" :
                        parseInt(slot.pop) >= 30 ? "text-sky-500" : "text-gray-400"
                      }`}>
                        {slot.pop}%
                      </span>
                    </div>
                    <p className="text-center text-sm text-gray-500">{slot.humidity}%</p>
                    <p className="text-center text-sm text-gray-500">{slot.windSpeed}m/s</p>
                    <div>
                      {parseInt(slot.pop) >= 60 && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] rounded-full">우산</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 p-4 bg-sky-50 rounded-xl text-center">
              <p className="text-xs text-sky-600">데이터 출처: 기상청 단기예보 (공공데이터포털) · 30분마다 업데이트</p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
