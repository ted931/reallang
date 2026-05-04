"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

interface DriveStop {
  order: number;
  name: string;
  category: string;
  description: string;
  driveMinutes: number;
  tip: string;
}

interface DriveCourse {
  courseName: string;
  description: string;
  weatherSummary: string;
  type: "outdoor" | "indoor" | "mixed";
  stops: DriveStop[];
  totalDriveMinutes: number;
  bestTimeToGo: string;
  isDummy?: boolean;
}

const PREFERENCES = [
  { id: "바다드라이브", label: "바다 드라이브", emoji: "🌊" },
  { id: "숲길", label: "숲길 힐링", emoji: "🌲" },
  { id: "카페투어", label: "카페 투어", emoji: "☕" },
  { id: "맛집", label: "맛집 순례", emoji: "🍜" },
  { id: "실내위주", label: "실내 위주", emoji: "🏛️" },
];

const CATEGORY_EMOJI: Record<string, string> = {
  관광지: "🗺️", 카페: "☕", 식당: "🍽️", 체험: "🎯", 해변: "🏖️", 박물관: "🏛️",
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

function DrivePageContent() {
  const searchParams = useSearchParams();
  const initialPref = searchParams.get("pref") || "";

  const [weather, setWeather] = useState<LocationWeather[]>([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [selectedPref, setSelectedPref] = useState<string>(initialPref);
  const [course, setCourse] = useState<DriveCourse | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${basePath}/api/weather`)
      .then((r) => r.json())
      .then((data) => setWeather(data.locations || []))
      .catch(console.error)
      .finally(() => setWeatherLoading(false));
  }, []);

  const sunnyLocations = weather.filter((l) => parseFloat(l.rainfall) === 0);
  const rainyLocations = weather.filter((l) => parseFloat(l.rainfall) > 0);
  const avgTemp = weather.length
    ? Math.round(weather.reduce((acc, l) => acc + (parseFloat(l.temperature) || 0), 0) / weather.length)
    : 0;

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setCourse(null);

    try {
      const res = await fetch(`${basePath}/api/drive-suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weatherData: weather,
          preference: selectedPref || "날씨에 맞게 최적 추천",
        }),
      });

      if (!res.ok) throw new Error("코스 생성에 실패했습니다.");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCourse(data);
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  const typeLabel = (type: string) => {
    if (type === "outdoor") return { label: "야외", color: "text-emerald-600 bg-emerald-50" };
    if (type === "indoor") return { label: "실내", color: "text-blue-600 bg-blue-50" };
    return { label: "혼합", color: "text-purple-600 bg-purple-50" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* 헤더 */}
      <header className="bg-white/90 backdrop-blur border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`${basePath}/`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            지도
          </Link>
          <div className="w-px h-4 bg-gray-200" />
          <h1 className="text-base font-bold text-gray-900">날씨 기반 드라이브 코스</h1>
          <div className="ml-auto">
            <Link href={`${basePath}/weather`} className="text-xs text-sky-600 hover:text-sky-700 transition-colors">
              🌤️ 날씨 상세
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* 날씨 요약 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">현재 제주 날씨</h2>
          {weatherLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              날씨 불러오는 중...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
                <span className="text-lg mt-0.5">☀️</span>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 mb-0.5">맑은 지역 ({sunnyLocations.length}곳)</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{sunnyLocations.map((l) => l.name).join(", ") || "없음"}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                <span className="text-lg mt-0.5">🌧️</span>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 mb-0.5">비 오는 지역 ({rainyLocations.length}곳)</p>
                  <p className="text-xs text-gray-700 leading-relaxed">{rainyLocations.map((l) => l.name).join(", ") || "없음"}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-center justify-between text-xs text-gray-500 px-1">
                <span>평균 기온 <strong className="text-gray-800">{avgTemp}°C</strong></span>
                <Link href={`${basePath}/weather`} className="text-[10px] text-sky-500 underline">
                  전체 날씨 보기
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 선호 선택 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">어떤 드라이브를 원하세요?</h2>
          <div className="flex flex-wrap gap-2">
            {PREFERENCES.map((pref) => (
              <button
                key={pref.id}
                onClick={() => setSelectedPref(selectedPref === pref.id ? "" : pref.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedPref === pref.id
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-gray-50 text-gray-700 border border-gray-100 hover:bg-gray-100"
                }`}
              >
                <span>{pref.emoji}</span>
                <span>{pref.label}</span>
              </button>
            ))}
          </div>
          {!selectedPref && (
            <p className="text-[10px] text-gray-400 mt-2">선택 없으면 AI가 현재 날씨에 맞게 자동으로 추천합니다</p>
          )}
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold rounded-2xl text-sm transition-colors flex items-center justify-center gap-2 shadow-md"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              드라이브 코스 생성 중...
            </>
          ) : (
            <>
              🚗 AI 드라이브 코스 생성
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 코스 결과 */}
        {course && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
            {/* 코스 헤더 */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 text-white">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-lg font-bold leading-tight">{course.courseName}</h2>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${typeLabel(course.type).color}`}>
                  {typeLabel(course.type).label}
                </span>
              </div>
              <p className="text-xs text-emerald-100 mb-3 leading-relaxed">{course.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-emerald-100">
                <span>🌤️ {course.weatherSummary}</span>
                <span>⏱️ 총 이동 {course.totalDriveMinutes}분</span>
                <span>🕐 {course.bestTimeToGo}</span>
              </div>
              {course.isDummy && (
                <p className="mt-2 text-[10px] text-emerald-200">* OpenAI 미설정 — 테스트 데이터입니다</p>
              )}
            </div>

            {/* 정류장 목록 */}
            <div className="p-4 space-y-3">
              {course.stops.map((stop, idx) => (
                <div key={stop.order} className="relative">
                  {/* 연결선 */}
                  {idx < course.stops.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-6 bg-emerald-100 z-0" />
                  )}
                  <div className="relative flex gap-3 bg-gray-50 rounded-xl p-3">
                    {/* 순서 번호 */}
                    <div className="flex-shrink-0 w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                      {stop.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-sm">{CATEGORY_EMOJI[stop.category] || "📍"}</span>
                        <h3 className="font-bold text-gray-900 text-sm">{stop.name}</h3>
                        <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded-full border border-gray-100">{stop.category}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{stop.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        {stop.driveMinutes > 0 && <span>🚗 이전 장소에서 {stop.driveMinutes}분</span>}
                        {stop.tip && <span>💡 {stop.tip}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 액션 버튼 */}
            <div className="px-4 pb-4 space-y-2">
              <Link
                href={`${basePath}/`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
              >
                🗺️ 지도에서 코스 보기
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="http://localhost:3001/rentcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors"
                >
                  🚗 제주패스 렌터카 예약
                </a>
                <a
                  href="http://localhost:3010/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 border-2 border-emerald-300 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors"
                >
                  🎉 이 코스로 파티 만들기
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 안내 문구 (코스 없을 때) */}
        {!course && !generating && (
          <div className="text-center py-6 text-gray-400">
            <p className="text-4xl mb-3">🗺️</p>
            <p className="text-sm font-medium text-gray-500 mb-1">날씨 기반 드라이브 코스 추천</p>
            <p className="text-xs">선호를 선택하고 AI 코스 생성 버튼을 눌러보세요</p>
            <p className="text-[10px] mt-1 text-gray-300">제주패스 렌터카로 더 편하게 이동하세요</p>
          </div>
        )}

        {/* 렌터카 배너 (하단 고정) */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">렌터카 없이 드라이브는 없다</p>
            <p className="text-xs text-gray-500">제주패스 최저가 렌터카 · 픽업/반납 편리</p>
          </div>
          <a
            href="http://localhost:3001/rentcar"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap"
          >
            렌터카 예약 →
          </a>
        </div>
      </main>
    </div>
  );
}

export default function DrivePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DrivePageContent />
    </Suspense>
  );
}
