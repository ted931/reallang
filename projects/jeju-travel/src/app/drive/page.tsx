"use client";

import { useState, useEffect } from "react";

interface LocationWeather {
  name: string; emoji: string; temperature: string; humidity: string;
  rainfall: string; windSpeed: string; sky: string;
}

interface Stop {
  order: number; name: string; category: string;
  description: string; driveMinutes: number; tip: string;
}

interface Course {
  courseName: string; description: string; weatherSummary: string;
  type: string; stops: Stop[]; totalDriveMinutes: number; bestTimeToGo: string;
}

const PREFERENCES = [
  { id: "auto", label: "날씨에 맡기기", emoji: "🎲" },
  { id: "ocean", label: "바다 드라이브", emoji: "🌊" },
  { id: "forest", label: "숲길/올레길", emoji: "🌲" },
  { id: "cafe", label: "카페 투어", emoji: "☕" },
  { id: "food", label: "맛집 드라이브", emoji: "🍊" },
  { id: "indoor", label: "실내 위주", emoji: "🏛️" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "관광지": "bg-emerald-100 text-emerald-700",
  "카페": "bg-amber-100 text-amber-700",
  "식당": "bg-orange-100 text-orange-700",
  "체험": "bg-blue-100 text-blue-700",
  "해변": "bg-cyan-100 text-cyan-700",
  "박물관": "bg-purple-100 text-purple-700",
};

export default function WeatherDrivePage() {
  const [weather, setWeather] = useState<LocationWeather[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [preference, setPreference] = useState("auto");
  const [course, setCourse] = useState<Course | null>(null);
  const [generating, setGenerating] = useState(false);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  // 날씨 로드
  useEffect(() => {
    fetch(`${basePath}/api/weather`)
      .then((r) => r.json())
      .then((d) => setWeather(d.locations || []))
      .catch(console.error)
      .finally(() => setWeatherLoading(false));
  }, [basePath]);

  const sunnyAreas = weather.filter((l) => parseFloat(l.rainfall) === 0);
  const rainyAreas = weather.filter((l) => parseFloat(l.rainfall) > 0);

  const handleGenerate = async () => {
    setGenerating(true);
    setCourse(null);
    try {
      const prefLabel = PREFERENCES.find((p) => p.id === preference)?.label || "";
      const res = await fetch(`${basePath}/api/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherData: weather,
          preference: preference === "auto" ? "" : prefLabel,
        }),
      });
      const data = await res.json();
      setCourse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <header className="bg-white/80 backdrop-blur border-b border-sky-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🌤️🚗 날씨 드라이브 코스</h1>
          <p className="text-sm text-gray-500 mt-0.5">지금 제주 날씨에 맞는 최적 드라이브 코스를 AI가 추천</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* 현재 날씨 요약 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-900 mb-3">지금 제주 날씨</h2>
          {weatherLoading ? (
            <p className="text-sm text-gray-400">날씨 확인 중...</p>
          ) : (
            <div className="space-y-3">
              {sunnyAreas.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-3">
                  <span className="text-sm font-bold text-amber-700">☀️ 맑은 곳: </span>
                  <span className="text-sm text-amber-600">
                    {sunnyAreas.map((l) => `${l.name}(${l.temperature}°)`).join(", ")}
                  </span>
                </div>
              )}
              {rainyAreas.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <span className="text-sm font-bold text-blue-700">🌧️ 비 오는 곳: </span>
                  <span className="text-sm text-blue-600">
                    {rainyAreas.map((l) => `${l.name}(${l.rainfall}mm)`).join(", ")}
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {weather.map((l) => (
                  <span key={l.name} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
                    {l.sky.split(" ")[0]} {l.name} {l.temperature}°
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 선호 선택 */}
        <div className="bg-white rounded-2xl shadow-sm border p-5">
          <h2 className="font-bold text-gray-900 mb-3">어떤 드라이브를 원하세요?</h2>
          <div className="grid grid-cols-3 gap-2">
            {PREFERENCES.map((p) => (
              <button key={p.id} onClick={() => setPreference(p.id)}
                className={`p-3 rounded-xl text-center transition-all ${
                  preference === p.id ? "bg-sky-50 border-2 border-sky-500" : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}>
                <div className="text-xl">{p.emoji}</div>
                <div className="text-xs font-medium text-gray-700 mt-1">{p.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 생성 버튼 */}
        <button onClick={handleGenerate} disabled={generating || weatherLoading}
          className="w-full py-3 bg-sky-600 text-white rounded-xl font-semibold text-lg hover:bg-sky-500 disabled:opacity-50 transition-all">
          {generating ? "AI가 코스를 짜고 있어요..." : "날씨 맞춤 코스 추천받기"}
        </button>

        {/* 결과 */}
        {course && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  course.type === "outdoor" ? "bg-green-100 text-green-700" :
                  course.type === "indoor" ? "bg-purple-100 text-purple-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {course.type === "outdoor" ? "야외" : course.type === "indoor" ? "실내" : "복합"}
                </span>
                <span className="text-xs text-gray-400">총 {course.totalDriveMinutes}분 드라이브</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{course.courseName}</h3>
              <p className="text-sm text-gray-500 mt-1">{course.description}</p>
            </div>

            <div className="bg-sky-50 rounded-lg p-3">
              <p className="text-xs text-sky-700">🌤️ {course.weatherSummary}</p>
              <p className="text-xs text-sky-600 mt-1">🕐 추천 출발: {course.bestTimeToGo}</p>
            </div>

            {/* 코스 스탑 */}
            <div className="space-y-3">
              {course.stops.map((stop, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center text-sm font-bold">{stop.order}</div>
                    {i < course.stops.length - 1 && <div className="w-0.5 flex-1 bg-sky-200 my-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{stop.name}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[stop.category] || "bg-gray-100 text-gray-600"}`}>
                        {stop.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{stop.description}</p>
                    {stop.driveMinutes > 0 && <p className="text-xs text-gray-400 mt-1">🚗 이전에서 {stop.driveMinutes}분</p>}
                    {stop.tip && <p className="text-xs text-amber-600 mt-1">💡 {stop.tip}</p>}
                  </div>
                </div>
              ))}
            </div>

            <a href="/course" className="block w-full py-2.5 text-center border border-sky-200 text-sky-600 rounded-lg text-sm font-medium hover:bg-sky-50">
              더 상세한 코스 만들기 →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
