"use client";

import { useState } from "react";

// ── 타입 ─────────────────────────────────────────────────

interface CourseCard {
  id: string;
  name: string;
  description: string;
  recommended: boolean;
  totalCost: number;
  totalDriveKm: number;
  totalDriveMinutes: number;
  highlights: string[];
}

interface Stop {
  time: string;
  name: string;
  category: string;
  description: string;
  estimatedCost: number;
  address?: string;
  tip?: string;
  driveMinutes?: number;
}

interface DayPlan {
  day: number;
  theme: string;
  stops: Stop[];
  dayCost: number;
}

interface BudgetItem {
  category: string;
  amount: number;
}

interface DetailPlan {
  days: DayPlan[];
  budgetBreakdown: BudgetItem[];
  packingTips: string[];
}

// ── 상수 ─────────────────────────────────────────────────

const STYLE_OPTIONS = [
  { id: "힐링", emoji: "🧘" },
  { id: "액티비티", emoji: "🏄" },
  { id: "맛집", emoji: "🍊" },
  { id: "카페", emoji: "☕" },
  { id: "자연", emoji: "🌿" },
  { id: "문화", emoji: "🏛️" },
  { id: "포토", emoji: "📸" },
  { id: "가족", emoji: "👨‍👩‍👧‍👦" },
];

const COMPANION_OPTIONS = [
  { id: "혼자", emoji: "🧳" },
  { id: "커플", emoji: "💑" },
  { id: "친구들", emoji: "👫" },
  { id: "가족", emoji: "👨‍👩‍👧‍👦" },
  { id: "효도여행", emoji: "🧓" },
];

const CATEGORY_STYLE: Record<string, { color: string; icon: string }> = {
  관광지: { color: "bg-emerald-100 text-emerald-700", icon: "🏝️" },
  식당: { color: "bg-orange-100 text-orange-700", icon: "🍜" },
  카페: { color: "bg-amber-100 text-amber-700", icon: "☕" },
  액티비티: { color: "bg-blue-100 text-blue-700", icon: "🤿" },
  숙소: { color: "bg-purple-100 text-purple-700", icon: "🏨" },
  공항: { color: "bg-gray-100 text-gray-600", icon: "🛬" },
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ── 유틸 ─────────────────────────────────────────────────

function formatCost(cost: number) {
  if (cost >= 10000) return `${(cost / 10000).toFixed(1)}만원`;
  return `${cost.toLocaleString()}원`;
}

function formatDriveTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}분`;
  return `${h}시간 ${m > 0 ? `${m}분` : ""}`.trim();
}

// ── 컴포넌트 ─────────────────────────────────────────────

export default function AIPlanPage() {
  // 입력 상태
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [companion, setCompanion] = useState("커플");
  const [nights, setNights] = useState(2);
  const [travelers, setTravelers] = useState(2);
  const [prompt, setPrompt] = useState("");

  // 결과 상태
  const [courseCards, setCourseCards] = useState<CourseCard[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [detailPlan, setDetailPlan] = useState<DetailPlan | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  // 로딩/에러 상태
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [error, setError] = useState("");

  const phase = courseCards.length === 0 ? "input" : detailPlan ? "detail" : "courses";

  // ── 핸들러 ─────────────────────────────────────────────

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleGenerateCourses = async () => {
    setLoadingCourses(true);
    setError("");
    setCourseCards([]);
    setDetailPlan(null);
    setSelectedCourseId("");

    try {
      const res = await fetch(`${BASE}/api/ai-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "courses",
          styles: selectedStyles,
          companion,
          nights,
          travelers,
          prompt,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "코스 생성에 실패했습니다.");
      }

      const data = await res.json();
      const courses: CourseCard[] = data.courses || [];
      setCourseCards(courses);

      // 추천 코스 자동 선택
      const rec = courses.find((c) => c.recommended);
      setSelectedCourseId(rec?.id || courses[0]?.id || "A");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleSelectCourse = async (course: CourseCard) => {
    setSelectedCourseId(course.id);
    setDetailPlan(null);
    setActiveDay(0);
    setLoadingDetail(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/api/ai-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "detail",
          courseId: course.id,
          courseName: course.name,
          courseDescription: course.description,
          nights,
          travelers,
          companion,
          styles: selectedStyles,
          prompt,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "상세 일정 생성에 실패했습니다.");
      }

      const data: DetailPlan = await res.json();
      setDetailPlan(data);
      setActiveDay(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreateParty = () => {
    if (!detailPlan) return;
    const selectedCourse = courseCards.find((c) => c.id === selectedCourseId);
    const payload = {
      courseName: selectedCourse?.name,
      courseDescription: selectedCourse?.description,
      nights,
      travelers,
      companion,
      styles: selectedStyles,
      days: detailPlan.days,
      totalCost: selectedCourse?.totalCost,
    };
    sessionStorage.setItem("ai_plan_data", JSON.stringify(payload));
    window.location.href = `${BASE}/create?from=ai-plan`;
  };

  const handleReset = () => {
    setCourseCards([]);
    setDetailPlan(null);
    setSelectedCourseId("");
    setError("");
  };

  // ── 렌더 ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">✈️ AI 제주 여행 플래너</h1>
            <p className="text-xs text-gray-400 mt-0.5">3가지 코스 추천 → 상세 일정 자동 생성</p>
          </div>
          {phase !== "input" && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              다시 만들기
            </button>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6">
        {/* ── 입력 폼 ── */}
        {phase === "input" && (
          <div className="space-y-6">
            {/* 여행 스타일 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">여행 스타일 (복수 선택)</p>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleStyle(s.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedStyles.includes(s.id)
                        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
                    }`}
                  >
                    {s.emoji} {s.id}
                  </button>
                ))}
              </div>
            </div>

            {/* 동행 */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">누구와 함께?</p>
              <div className="flex flex-wrap gap-2">
                {COMPANION_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCompanion(opt.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      companion === opt.id
                        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
                    }`}
                  >
                    {opt.emoji} {opt.id}
                  </button>
                ))}
              </div>
            </div>

            {/* 숙박일수 + 인원 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-2">숙박 일수</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNights(Math.max(1, nights - 1))}
                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-lg font-bold hover:bg-orange-200 transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-16 text-center">{nights}박</span>
                  <button
                    onClick={() => setNights(Math.min(7, nights + 1))}
                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-lg font-bold hover:bg-orange-200 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">{nights + 1}일 일정</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="text-xs text-gray-500 mb-2">인원</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-lg font-bold hover:bg-orange-200 transition-colors flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-900 w-16 text-center">{travelers}명</span>
                  <button
                    onClick={() => setTravelers(Math.min(10, travelers + 1))}
                    className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-lg font-bold hover:bg-orange-200 transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">1~10명</p>
              </div>
            </div>

            {/* 자유 입력 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                추가 요청 사항 <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 바다 뷰 카페 꼭 가고 싶어요. 숙소는 애월쪽 선호. 맛집은 줄 안 서도 되는 곳으로."
                rows={3}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none resize-none text-sm"
              />
            </div>

            {/* 에러 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 생성 버튼 */}
            <button
              onClick={handleGenerateCourses}
              disabled={loadingCourses}
              className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-200"
            >
              {loadingCourses ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI가 3가지 코스를 설계하고 있습니다...
                </span>
              ) : (
                "AI 코스 만들기"
              )}
            </button>
          </div>
        )}

        {/* ── 코스 카드 선택 ── */}
        {phase === "courses" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">AI 추천 코스 3가지</h2>
              <p className="text-sm text-gray-400 mt-0.5">마음에 드는 코스를 선택하면 상세 일정을 만들어드립니다</p>
            </div>

            {/* 조건 요약 뱃지 */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                {companion}
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                {nights}박{nights + 1}일
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                {travelers}명
              </span>
              {selectedStyles.map((s) => (
                <span key={s} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {s}
                </span>
              ))}
            </div>

            {/* 코스 카드 목록 */}
            <div className="space-y-3">
              {courseCards.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  disabled={loadingDetail && selectedCourseId === course.id}
                  className={`w-full text-left p-5 rounded-2xl border transition-all hover:shadow-md ${
                    selectedCourseId === course.id
                      ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100"
                      : "border-gray-100 bg-white hover:border-orange-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* ID 뱃지 */}
                      <span className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {course.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-gray-900">{course.name}</h3>
                          {course.recommended && (
                            <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">
                              추천
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{course.description}</p>
                      </div>
                    </div>
                    {/* 비용/이동 요약 */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-bold text-orange-600">{formatCost(course.totalCost)}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {course.totalDriveKm}km · {formatDriveTime(course.totalDriveMinutes)}
                      </p>
                    </div>
                  </div>

                  {/* 하이라이트 */}
                  {course.highlights?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {course.highlights.map((h, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 로딩 인디케이터 */}
                  {loadingDetail && selectedCourseId === course.id && (
                    <div className="flex items-center gap-2 mt-3 text-orange-500">
                      <span className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs">상세 일정 생성 중...</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── 상세 일정 ── */}
        {phase === "detail" && detailPlan && (
          <div className="space-y-6">
            {/* 선택 코스 요약 */}
            {(() => {
              const course = courseCards.find((c) => c.id === selectedCourseId);
              return course ? (
                <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
                          {course.id}
                        </span>
                        <h2 className="font-bold text-gray-900">{course.name}</h2>
                        {course.recommended && (
                          <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">
                            추천
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-9">{course.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        setDetailPlan(null);
                        setActiveDay(0);
                      }}
                      className="text-xs text-orange-500 hover:text-orange-700 font-medium flex-shrink-0"
                    >
                      다른 코스 선택
                    </button>
                  </div>

                  {/* 요약 수치 */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="bg-white rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400">일정</p>
                      <p className="text-sm font-bold text-gray-900">{nights}박{nights + 1}일</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400">총 비용</p>
                      <p className="text-sm font-bold text-orange-600">{formatCost(course.totalCost)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400">총 이동</p>
                      <p className="text-sm font-bold text-gray-900">{course.totalDriveKm}km</p>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}

            {/* Day 탭 */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {detailPlan.days.map((day, i) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                    activeDay === i
                      ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
                  }`}
                >
                  Day {day.day}
                  <span className="block text-[10px] opacity-75">{day.theme}</span>
                </button>
              ))}
            </div>

            {/* 타임라인 */}
            {detailPlan.days[activeDay] && (
              <div className="space-y-0">
                {detailPlan.days[activeDay].stops.map((stop, i) => {
                  const styleInfo = CATEGORY_STYLE[stop.category] || CATEGORY_STYLE["관광지"];
                  return (
                    <div key={i}>
                      {/* 이동 구간 표시 */}
                      {stop.driveMinutes != null && stop.driveMinutes > 0 && (
                        <div className="flex items-center gap-2 py-2 pl-8">
                          <div className="w-px h-4 bg-gray-200" />
                          <span className="text-[10px] text-gray-400">
                            🚗 {stop.driveMinutes}분 이동
                          </span>
                        </div>
                      )}
                      {/* 스팟 카드 */}
                      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-3 hover:shadow-sm transition-shadow">
                        <div className="w-12 flex-shrink-0 text-center pt-0.5">
                          <p className="text-sm font-bold text-gray-900">{stop.time}</p>
                          <span className="text-xl mt-0.5 block">{styleInfo.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-gray-900">{stop.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${styleInfo.color}`}>
                              {stop.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{stop.description}</p>
                          {stop.address && (
                            <p className="text-xs text-gray-400 mt-1">{stop.address}</p>
                          )}
                          {stop.tip && (
                            <p className="text-xs text-orange-600 mt-1.5 bg-orange-50 px-2.5 py-1.5 rounded-xl inline-block">
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
                <div className="mt-3 p-3 bg-orange-50 rounded-xl flex items-center justify-between">
                  <span className="text-sm text-orange-600 font-medium">
                    Day {detailPlan.days[activeDay].day} 예상 비용
                  </span>
                  <span className="text-sm font-bold text-orange-700">
                    {formatCost(detailPlan.days[activeDay].dayCost)}
                  </span>
                </div>
              </div>
            )}

            {/* 예산 분석 */}
            {detailPlan.budgetBreakdown?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3">예산 분석</h3>
                <div className="space-y-2">
                  {detailPlan.budgetBreakdown.map((item) => {
                    const total = detailPlan.budgetBreakdown.reduce((s, b) => s + b.amount, 0);
                    const pct = total > 0 ? (item.amount / total) * 100 : 0;
                    return (
                      <div key={item.category} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-20">{item.category}</span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-400 rounded-full"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-700 w-20 text-right">
                          {formatCost(item.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 준비물 & 꿀팁 */}
            {detailPlan.packingTips?.length > 0 && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <h3 className="font-bold text-gray-900 mb-2">준비물 & 꿀팁</h3>
                <ul className="space-y-1.5">
                  {detailPlan.packingTips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">-</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA 섹션 */}
            <div className="space-y-3">
              {/* 파티 만들기 CTA */}
              <button
                onClick={handleCreateParty}
                className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-base hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
              >
                🎉 이 일정으로 파티 만들기
              </button>

              {/* 렌터카 CTA */}
              <a
                href="http://localhost:3001/rentcar"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-base hover:opacity-90 transition-opacity shadow-lg flex items-center justify-center gap-2 block text-center"
              >
                🚗 이 코스, 렌터카로 이동하기
              </a>

              {/* 보조 링크 */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`${BASE}/`}
                  className="py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  🎉 파티 피드 보기
                </a>
                <button
                  onClick={() => {
                    setDetailPlan(null);
                    setActiveDay(0);
                  }}
                  className="py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  다른 코스 선택
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
