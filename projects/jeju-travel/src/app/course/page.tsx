"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { Course, CourseResult, CourseStop } from "@/lib/types";
import { loadWeather, saveCourse } from "@/lib/shared-state";

const COMPANION_OPTIONS = [
  { id: "커플", emoji: "💑" },
  { id: "가족", emoji: "👨‍👩‍👧‍👦" },
  { id: "친구", emoji: "👫" },
  { id: "혼자", emoji: "🧳" },
  { id: "효도", emoji: "🧓" },
  { id: "단체", emoji: "🧑‍🤝‍🧑" },
];

const THEME_OPTIONS = [
  { id: "바다", emoji: "🌊" },
  { id: "산/숲", emoji: "🌿" },
  { id: "맛집", emoji: "🍊" },
  { id: "카페", emoji: "☕" },
  { id: "액티비티", emoji: "🏄" },
  { id: "문화", emoji: "🏛️" },
  { id: "힐링", emoji: "🧘" },
  { id: "포토", emoji: "📸" },
];

const CATEGORY_STYLE: Record<string, { color: string; icon: string }> = {
  관광지: { color: "bg-emerald-100 text-emerald-700", icon: "🏝️" },
  식당: { color: "bg-orange-100 text-orange-700", icon: "🍜" },
  카페: { color: "bg-amber-100 text-amber-700", icon: "☕" },
  액티비티: { color: "bg-blue-100 text-blue-700", icon: "🤿" },
  숙소: { color: "bg-purple-100 text-purple-700", icon: "🏨" },
  공항: { color: "bg-gray-100 text-gray-600", icon: "🛬" },
};

export default function CoursePage() {
  return (
    <Suspense>
      <CourseMakerPage />
    </Suspense>
  );
}

function CourseMakerPage() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [days, setDays] = useState(2);
  const [companions, setCompanions] = useState("커플");
  const [themes, setThemes] = useState<string[]>([]);
  const [budget, setBudget] = useState(50);
  const [hasRentalCar, setHasRentalCar] = useState(true);
  const [result, setResult] = useState<CourseResult | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("A");
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherHint, setWeatherHint] = useState("");

  // URL 파라미터 + 공유 날씨 데이터 로드
  useEffect(() => {
    // URL params: ?theme=자연&region=제주시&weather=sunny
    const theme = searchParams.get("theme");
    const region = searchParams.get("region");
    const weatherParam = searchParams.get("weather");

    if (theme && !themes.includes(theme)) {
      const match = THEME_OPTIONS.find((t) => t.id === theme);
      if (match) setThemes([match.id]);
    }

    // 날씨 공유 상태에서 힌트 생성
    const w = loadWeather();
    if (w) {
      const parts: string[] = [];
      if (w.rainyAreas.length > 0) {
        parts.push(`비 오는 곳(${w.rainyAreas.join(",")})은 실내 코스 위주`);
      }
      if (region && w.sunnyAreas.includes(region)) {
        parts.push(`${region}은 맑음 — 야외 코스 추천`);
      }
      if (parts.length > 0) setWeatherHint(parts.join(". "));

      // 날씨 기반 프롬프트 자동 생성
      if (weatherParam === "sunny" && region && !prompt) {
        setPrompt(`${region} 중심으로 맑은 날씨를 즐기는 야외 코스`);
      }
      if (weatherParam === "rainy" && !prompt) {
        setPrompt("비 오는 날 실내 위주 코스 (카페, 박물관, 실내 체험)");
        if (!themes.includes("카페")) setThemes((prev) => [...prev, "카페"]);
      }
    }
  }, []);

  const toggleTheme = (id: string) => {
    setThemes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || `${companions} ${days}일 제주 여행`,
          days,
          companions,
          themes,
          budget: budget * 10000,
          hasRentalCar,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "코스 생성에 실패했습니다.");
      }

      const data: CourseResult = await res.json();
      setResult(data);
      const rec = data.courses.find((c) => c.recommended);
      setSelectedCourseId(rec?.id || data.courses[0]?.id || "A");
      setActiveDayIdx(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCost = (cost: number) => {
    if (cost >= 10000) return `${(cost / 10000).toFixed(1)}만원`;
    return `${cost.toLocaleString()}원`;
  };

  const selectedCourse: Course | undefined = result?.courses.find((c) => c.id === selectedCourseId);

  // 코스 선택 변경 시 공유 상태에 저장
  useEffect(() => {
    if (!selectedCourse) return;
    const allSpots = selectedCourse.days.flatMap((d) =>
      d.stops.map((s) => ({ name: s.name, category: s.category }))
    );
    saveCourse({
      name: selectedCourse.name,
      days: selectedCourse.days.length,
      totalCost: selectedCourse.totalCost,
      companions,
      themes,
      spots: allSpots,
    });
  }, [selectedCourseId, result]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-violet-100">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">🗺️ AI 제주 코스 메이커</h1>
          <p className="text-sm text-gray-500 mt-1">취향을 말씀하시면 3가지 최적 코스를 추천합니다</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!result ? (
          /* ── 입력 폼 ── */
          <div className="space-y-6">
            {/* 날씨 연동 힌트 */}
            {weatherHint && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sm text-sky-700 flex items-center gap-2">
                <span>🌤️</span>
                <span>날씨 연동: {weatherHint}</span>
              </div>
            )}

            {/* 자연어 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                어떤 코스를 원하시나요? (선택사항)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 바다 좋아하고 맛있는 거 먹고 싶어요. 인스타 사진도 찍고 싶은데 너무 바쁜 건 싫어요"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none resize-none text-sm"
              />
            </div>

            {/* 일정 + 예산 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500 mb-2">일정</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >-</button>
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">{days}일</span>
                  <button
                    onClick={() => setDays(Math.min(5, days + 1))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >+</button>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500 mb-2">예산</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBudget(Math.max(10, budget - 10))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >-</button>
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">{budget}만</span>
                  <button
                    onClick={() => setBudget(Math.min(300, budget + 10))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >+</button>
                </div>
              </div>
            </div>

            {/* 동행 */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">누구와 함께?</p>
              <div className="flex flex-wrap gap-2">
                {COMPANION_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCompanions(opt.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      companions === opt.id
                        ? "bg-violet-500 text-white shadow-md shadow-violet-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300"
                    }`}
                  >
                    {opt.emoji} {opt.id}
                  </button>
                ))}
              </div>
            </div>

            {/* 테마 */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">선호 테마 (복수 선택)</p>
              <div className="flex flex-wrap gap-2">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => toggleTheme(opt.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      themes.includes(opt.id)
                        ? "bg-violet-500 text-white shadow-md shadow-violet-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300"
                    }`}
                  >
                    {opt.emoji} {opt.id}
                  </button>
                ))}
              </div>
            </div>

            {/* 렌터카 */}
            <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-4">
              <button
                onClick={() => setHasRentalCar(!hasRentalCar)}
                className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                  hasRentalCar ? "bg-violet-500" : "bg-gray-300"
                }`}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
                  style={{ transform: hasRentalCar ? "translateX(20px)" : "translateX(0)" }}
                />
              </button>
              <span className="text-sm text-gray-700">렌터카 이용 {hasRentalCar ? "🚗" : "🚌"}</span>
            </div>

            {/* 에러 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
            )}

            {/* 생성 */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-violet-500 text-white font-bold text-lg hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-violet-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI가 3가지 코스를 설계하고 있습니다...
                </span>
              ) : (
                "코스 만들기"
              )}
            </button>
          </div>
        ) : (
          /* ── 결과 ── */
          <div className="space-y-6">
            {/* 뒤로가기 */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">AI 추천 코스</h2>
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200"
              >
                다시 만들기
              </button>
            </div>

            {/* 코스 선택 카드 */}
            <div className="grid gap-3">
              {result.courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id);
                    setActiveDayIdx(0);
                  }}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    selectedCourseId === course.id
                      ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                      : "border-gray-100 bg-white hover:border-violet-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold text-sm flex items-center justify-center">
                        {course.id}
                      </span>
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {course.name}
                          {course.recommended && (
                            <span className="ml-2 px-2 py-0.5 bg-violet-500 text-white text-[10px] rounded-full">추천</span>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500">{course.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-violet-600">{formatCost(course.totalCost)}</p>
                      <p className="text-[10px] text-gray-400">
                        {course.totalDriveKm}km / {course.totalDriveMinutes}분
                      </p>
                    </div>
                  </div>
                  {/* 하이라이트 */}
                  {course.highlights && course.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {course.highlights.map((h, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* 선택된 코스 상세 */}
            {selectedCourse && (
              <>
                {/* Day 탭 */}
                {selectedCourse.days.length > 1 && (
                  <div className="flex gap-2">
                    {selectedCourse.days.map((d, i) => (
                      <button
                        key={d.day}
                        onClick={() => setActiveDayIdx(i)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          activeDayIdx === i
                            ? "bg-violet-500 text-white shadow-md"
                            : "bg-white border border-gray-200 text-gray-600 hover:border-violet-300"
                        }`}
                      >
                        Day {d.day}
                        <span className="block text-[10px] opacity-75">{d.theme}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 타임라인 */}
                {selectedCourse.days[activeDayIdx] && (
                  <div className="space-y-0">
                    {selectedCourse.days[activeDayIdx].stops.map((stop: CourseStop, i: number) => {
                      const style = CATEGORY_STYLE[stop.category] || CATEGORY_STYLE["관광지"];
                      return (
                        <div key={i}>
                          {/* 이동 표시 */}
                          {stop.driveMinutes != null && stop.driveMinutes > 0 && (
                            <div className="flex items-center gap-2 py-2 pl-6">
                              <div className="w-px h-4 bg-gray-200" />
                              <span className="text-[10px] text-gray-400">
                                🚗 {stop.driveMinutes}분
                              </span>
                            </div>
                          )}
                          {/* 스팟 카드 */}
                          <div className="bg-white rounded-xl border border-gray-100 p-4 flex gap-3 hover:shadow-sm transition-shadow">
                            <div className="w-12 flex-shrink-0 text-center">
                              <p className="text-sm font-bold text-gray-900">{stop.time}</p>
                              <span className="text-lg">{style.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-gray-900">{stop.name}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${style.color}`}>
                                  {stop.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-0.5">{stop.description}</p>
                              {stop.address && <p className="text-xs text-gray-400 mt-1">{stop.address}</p>}
                              {stop.tip && (
                                <p className="text-xs text-violet-600 mt-1 bg-violet-50 px-2 py-1 rounded-lg inline-block">
                                  TIP: {stop.tip}
                                </p>
                              )}
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-sm font-medium text-gray-700">
                                {stop.estimatedCost > 0 ? formatCost(stop.estimatedCost) : "무료"}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Day 비용 요약 */}
                    <div className="mt-3 p-3 bg-violet-50 rounded-xl flex items-center justify-between">
                      <span className="text-sm text-violet-600 font-medium">
                        Day {selectedCourse.days[activeDayIdx].day} 예상 비용
                      </span>
                      <span className="text-sm font-bold text-violet-700">
                        {formatCost(selectedCourse.days[activeDayIdx].dayCost)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 코스 요약 */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <p className="text-xs text-gray-400">총 비용</p>
                    <p className="text-lg font-bold text-violet-600">{formatCost(selectedCourse.totalCost)}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <p className="text-xs text-gray-400">총 이동</p>
                    <p className="text-lg font-bold text-gray-900">{selectedCourse.totalDriveKm}km</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                    <p className="text-xs text-gray-400">이동 시간</p>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.floor(selectedCourse.totalDriveMinutes / 60)}시간 {selectedCourse.totalDriveMinutes % 60}분
                    </p>
                  </div>
                </div>

                {/* 딥링크 CTA */}
                <div className="grid sm:grid-cols-3 gap-3">
                  <a
                    href={`/travel?nights=${(selectedCourse.days.length - 1) || 1}&budget=${selectedCourse.totalCost}&style=${encodeURIComponent(selectedCourse.name)}`}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 transition-colors"
                  >
                    ✈️ 일정 만들기
                  </a>
                  <a
                    href="/map"
                    className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    🗺️ 지도 보기
                  </a>
                  <button
                    onClick={() => {
                      const ogUrl = `${window.location.origin}/api/og?title=${encodeURIComponent(selectedCourse.name)}&days=${selectedCourse.days.length}&spots=${selectedCourse.days.reduce((a, d) => a + d.stops.length, 0)}&cost=${formatCost(selectedCourse.totalCost)}&type=course`;
                      const shareUrl = window.location.href;
                      if (navigator.share) {
                        navigator.share({ title: selectedCourse.name, text: `${selectedCourse.description} - ${formatCost(selectedCourse.totalCost)}`, url: shareUrl });
                      } else {
                        navigator.clipboard.writeText(shareUrl);
                        alert("링크가 복사되었습니다!");
                      }
                    }}
                    className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    공유하기
                  </button>
                </div>

                {/* 렌터카 비교하기 배너 */}
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">🚗 이 코스, 렌터카가 필요해요</p>
                      <p className="text-sm text-white/80 mt-0.5">
                        총 {selectedCourse.totalDriveKm}km 이동 · 제주패스 렌터카 최저가 보장
                      </p>
                    </div>
                    <a
                      href="/car/?utm_source=realang&utm_medium=course&utm_campaign=ai_result"
                      className="px-5 py-2.5 bg-white text-violet-600 rounded-lg font-bold text-sm hover:bg-violet-50 transition-colors flex-shrink-0"
                    >
                      렌터카 비교하기
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
