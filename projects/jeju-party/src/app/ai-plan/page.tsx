"use client";

import { useState, useEffect } from "react";

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
  { id: "힐링", emoji: "🌿" },
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

const CATEGORY_STYLE: Record<string, { color: string; icon: string; dot: string }> = {
  관광지: { color: "bg-emerald-100 text-emerald-700", icon: "🏝️", dot: "#10b981" },
  식당: { color: "bg-orange-100 text-orange-700", icon: "🍜", dot: "#f97316" },
  카페: { color: "bg-amber-100 text-amber-700", icon: "☕", dot: "#f59e0b" },
  액티비티: { color: "bg-blue-100 text-blue-700", icon: "🤿", dot: "#0ea5e9" },
  숙소: { color: "bg-purple-100 text-purple-700", icon: "🏨", dot: "#a855f7" },
  공항: { color: "bg-gray-100 text-gray-600", icon: "🛬", dot: "#6b7280" },
};

// 코스 ID별 테마 색상 (A=힐링 teal/emerald, B=액티브 orange, C=미식 amber)
const COURSE_THEME: Record<string, {
  badge: string; badgeText: string; border: string; bg: string; accent: string; label: string;
}> = {
  A: { badge: "bg-emerald-500", badgeText: "text-white", border: "border-emerald-400", bg: "bg-emerald-50", accent: "text-emerald-700", label: "힐링" },
  B: { badge: "bg-orange-500", badgeText: "text-white", border: "border-orange-400", bg: "bg-orange-50", accent: "text-orange-700", label: "액티브" },
  C: { badge: "bg-amber-500", badgeText: "text-white", border: "border-amber-400", bg: "bg-amber-50", accent: "text-amber-700", label: "미식" },
};

const MOVE_BADGE: Record<number, { label: string; cls: string }> = {
  0: { label: "도보", cls: "bg-slate-100 text-slate-600" },
};
function getMoveBadge(minutes: number): { label: string; cls: string } {
  if (minutes === 0) return { label: "도보", cls: "bg-slate-100 text-slate-600" };
  if (minutes <= 10) return { label: `🚶 ${minutes}분`, cls: "bg-slate-100 text-slate-600" };
  if (minutes <= 20) return { label: `🚗 ${minutes}분`, cls: "bg-sky-100 text-sky-700" };
  return { label: `🚗 ${minutes}분`, cls: "bg-blue-100 text-blue-700" };
}
// suppress unused warning
void MOVE_BADGE;

const LOADING_STEPS = [
  { label: "여행 스타일 분석 중...", icon: "🔍" },
  { label: "제주 명소 검색 중...", icon: "🗺️" },
  { label: "동선 최적화 중...", icon: "📍" },
  { label: "AI가 코스를 짜는 중...", icon: "✨" },
];

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

// ── 서브 컴포넌트 ─────────────────────────────────────────

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 ${
        active
          ? "bg-orange-500 border-orange-500 text-white shadow-sm shadow-orange-200/60"
          : "bg-white border-slate-200 text-slate-600 hover:border-orange-300 hover:text-orange-600"
      }`}
    >
      {children}
    </button>
  );
}

function LoadingScreen() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActiveIdx((a) => (a + 1) % LOADING_STEPS.length),
      1400
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center w-full max-w-sm shadow-sm">
        {/* 아이콘 오브 */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full opacity-40"
            style={{
              background: "conic-gradient(from 0deg, #FB923C, #A855F7, #FB923C)",
              filter: "blur(16px)",
            }}
          />
          <div
            className="relative w-24 h-24 rounded-full grid place-items-center text-5xl"
            style={{ background: "linear-gradient(135deg,#FFEDD5,#F3E8FF)" }}
          >
            <span
              className="inline-block"
              style={{
                animation: "pulseDot 1.4s ease-in-out infinite",
              }}
            >
              {LOADING_STEPS[activeIdx].icon}
            </span>
          </div>
        </div>

        <p className="text-lg font-extrabold text-slate-900">
          {LOADING_STEPS[activeIdx].label}
        </p>
        <p className="text-sm text-slate-500 mt-1">잠시만 기다려주세요</p>

        {/* 단계 체크리스트 */}
        <div className="mt-6 space-y-2.5 text-left max-w-xs mx-auto">
          {LOADING_STEPS.map((s, i) => (
            <div
              key={i}
              className={`flex items-center gap-2.5 text-sm transition-all ${
                i === activeIdx
                  ? "text-violet-600 font-bold"
                  : i < activeIdx
                  ? "text-emerald-600"
                  : "text-slate-400"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full grid place-items-center text-[10px] flex-shrink-0 ${
                  i === activeIdx
                    ? "bg-violet-100"
                    : i < activeIdx
                    ? "bg-emerald-100"
                    : "bg-slate-100"
                }`}
              >
                {i < activeIdx ? "✓" : i === activeIdx ? "●" : i + 1}
              </span>
              <span className="flex-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────

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

  const phase =
    courseCards.length === 0 ? "input" : detailPlan ? "detail" : "courses";

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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
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

  // ── 렌더 ────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* ── 헤더 ── */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={phase !== "input" ? handleReset : undefined}
            className="w-8 h-8 rounded-full bg-slate-100 grid place-items-center text-slate-600 hover:bg-slate-200 transition-colors flex-shrink-0"
            aria-label="뒤로"
          >
            ←
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-slate-900">AI 일정 만들기</p>
            <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
              {phase === "input"
                ? "Step 1 · 조건 입력"
                : phase === "courses"
                ? "Step 2 · 코스 선택"
                : "Step 3 · 상세 일정"}
            </p>
          </div>
          {phase !== "input" && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              ↻ 다시 만들기
            </button>
          )}
        </div>
      </header>

      {/* ── 로딩 ── */}
      {(loadingCourses || loadingDetail) && <LoadingScreen />}

      {/* ── 입력 폼 ── */}
      {!loadingCourses && !loadingDetail && phase === "input" && (
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {/* 스텝 타이틀 */}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-orange-600 mb-1">
              Step 1 of 3
            </p>
            <h2 className="text-2xl font-extrabold text-slate-900">
              어떤 여행을 원하세요?
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              분위기를 선택하면 AI가 맞춤 코스를 만들어 드려요
            </p>
          </div>

          {/* 여행 스타일 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-700 mb-3">
              여행 분위기{" "}
              <span className="text-slate-400 text-xs font-normal">
                (중복 선택 가능)
              </span>
            </p>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTIONS.map((s) => (
                <ChipButton
                  key={s.id}
                  active={selectedStyles.includes(s.id)}
                  onClick={() => toggleStyle(s.id)}
                >
                  {s.emoji} {s.id}
                  {selectedStyles.includes(s.id) && (
                    <span className="ml-1.5">✓</span>
                  )}
                </ChipButton>
              ))}
            </div>
          </div>

          {/* 동행 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-sm font-bold text-slate-700 mb-3">
              누구와 함께?
            </p>
            <div className="flex flex-wrap gap-2">
              {COMPANION_OPTIONS.map((opt) => (
                <ChipButton
                  key={opt.id}
                  active={companion === opt.id}
                  onClick={() => setCompanion(opt.id)}
                >
                  {opt.emoji} {opt.id}
                </ChipButton>
              ))}
            </div>
          </div>

          {/* 숙박 + 인원 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-3">기간</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNights(Math.max(1, nights - 1))}
                  className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 text-lg font-bold hover:bg-orange-100 transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="flex-1 text-center text-xl font-extrabold text-slate-900">
                  {nights}박
                </span>
                <button
                  onClick={() => setNights(Math.min(7, nights + 1))}
                  className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 text-lg font-bold hover:bg-orange-100 transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                {nights + 1}일 일정
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-3">인원</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTravelers(Math.max(1, travelers - 1))}
                  className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 text-lg font-bold hover:bg-orange-100 transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="flex-1 text-center text-xl font-extrabold text-slate-900">
                  {travelers}명
                </span>
                <button
                  onClick={() => setTravelers(Math.min(10, travelers + 1))}
                  className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 text-lg font-bold hover:bg-orange-100 transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                1~10명
              </p>
            </div>
          </div>

          {/* 자유 입력 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-3">
              추가 요청사항{" "}
              <span className="text-slate-400 text-xs font-normal">(선택)</span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="예: 바다 뷰 카페 꼭 가고 싶어요. 숙소는 애월쪽 선호. 맛집은 줄 안 서도 되는 곳으로."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none resize-none text-sm text-slate-700 placeholder:text-slate-300 transition-all"
            />
          </div>

          {/* 에러 */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 생성 버튼 */}
          <button
            onClick={handleGenerateCourses}
            disabled={loadingCourses}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold text-base hover:shadow-lg hover:shadow-orange-200/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-orange-200/60"
          >
            ✨ AI 코스 만들기
          </button>
        </main>
      )}

      {/* ── 코스 카드 선택 ── */}
      {!loadingCourses && !loadingDetail && phase === "courses" && (
        <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
          {/* 타이틀 */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-1 rounded-full bg-violet-100 text-violet-700 mb-2">
                <span>✨</span> AI 추천
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                3개 코스를 추천드려요
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                마음에 드는 코스를 선택하면 상세 일정을 만들어드립니다
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium border border-slate-200 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
            >
              ↻ 다시 생성
            </button>
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
              <span
                key={s}
                className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
              >
                {s}
              </span>
            ))}
          </div>

          {/* 코스 카드 목록 */}
          <div className="space-y-3">
            {courseCards.map((course) => {
              const isActive = selectedCourseId === course.id;
              const theme = COURSE_THEME[course.id] || COURSE_THEME["A"];
              return (
                <button
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  disabled={loadingDetail && isActive}
                  className={`w-full text-left rounded-2xl border-2 p-5 transition-all hover:shadow-md ${
                    isActive
                      ? `${theme.border} ${theme.bg} shadow-lg`
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* ID 뱃지 + 코스 라벨 */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <span
                          className={`w-10 h-10 rounded-xl font-extrabold text-sm flex items-center justify-center ${
                            isActive ? `${theme.badge} ${theme.badgeText}` : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {course.id}
                        </span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? theme.accent : "text-slate-400"}`}>
                          {theme.label}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-slate-900">
                            {course.name}
                          </h3>
                          {course.recommended && (
                            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-full">
                              ✨ AI 추천
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {course.description}
                        </p>
                      </div>
                    </div>
                    {/* 비용/이동 요약 */}
                    <div className="flex-shrink-0 text-right">
                      <p className={`text-sm font-extrabold ${isActive ? theme.accent : "text-slate-700"}`}>
                        {formatCost(course.totalCost)}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                        {course.totalDriveKm}km ·{" "}
                        {formatDriveTime(course.totalDriveMinutes)}
                      </p>
                    </div>
                  </div>

                  {/* 하이라이트 */}
                  {course.highlights?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {course.highlights.map((h, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                            isActive ? `${theme.bg} ${theme.accent} border border-current/20` : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 로딩 인디케이터 */}
                  {loadingDetail && isActive && (
                    <div className="flex items-center gap-2 mt-3 text-violet-500">
                      <span className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">
                        상세 일정 생성 중...
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
        </main>
      )}

      {/* ── 상세 일정 ── */}
      {!loadingCourses && !loadingDetail && phase === "detail" && detailPlan && (
        <main className="max-w-2xl mx-auto px-4 py-6 pb-32 space-y-5">
          {/* 선택 코스 요약 배너 */}
          {(() => {
            const course = courseCards.find((c) => c.id === selectedCourseId);
            const theme = COURSE_THEME[course?.id || "A"] || COURSE_THEME["A"];
            return course ? (
              <div className={`border-2 ${theme.border} ${theme.bg} rounded-2xl p-5 shadow-sm`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <span className={`w-10 h-10 rounded-xl ${theme.badge} ${theme.badgeText} font-extrabold text-sm flex items-center justify-center`}>
                        {course.id}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${theme.accent}`}>{theme.label}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-extrabold text-slate-900">
                          {course.name}
                        </h2>
                        {course.recommended && (
                          <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold rounded-full">
                            ✨ AI 추천
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {course.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setDetailPlan(null);
                      setActiveDay(0);
                    }}
                    className={`text-xs ${theme.accent} font-bold flex-shrink-0 border ${theme.border} px-3 py-1.5 rounded-lg transition-colors hover:opacity-80`}
                  >
                    다른 코스
                  </button>
                </div>

                {/* 요약 수치 */}
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-400 mb-1">일정</p>
                    <p className="text-sm font-extrabold text-slate-900">
                      {nights}박{nights + 1}일
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-400 mb-1">예상 비용</p>
                    <p className={`text-sm font-extrabold ${theme.accent}`}>
                      {formatCost(course.totalCost)}
                    </p>
                  </div>
                  <div className="bg-white/60 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-400 mb-1">총 이동</p>
                    <p className="text-sm font-extrabold text-slate-900">
                      {course.totalDriveKm}km
                    </p>
                  </div>
                </div>
              </div>
            ) : null;
          })()}

          {/* Day 탭 */}
          {(() => {
            const course = courseCards.find((c) => c.id === selectedCourseId);
            const theme = COURSE_THEME[course?.id || "A"] || COURSE_THEME["A"];
            return (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {detailPlan.days.map((day, i) => (
                  <button
                    key={day.day}
                    onClick={() => setActiveDay(i)}
                    className={`px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap flex-shrink-0 transition-all border-2 ${
                      activeDay === i
                        ? `${theme.border} ${theme.badge} text-white shadow-sm`
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    Day {day.day}
                    <span className="block text-[10px] opacity-75 font-normal">
                      {day.theme}
                    </span>
                  </button>
                ))}
              </div>
            );
          })()}

          {/* 세로 타임라인 */}
          {detailPlan.days[activeDay] && (() => {
            const course = courseCards.find((c) => c.id === selectedCourseId);
            const theme = COURSE_THEME[course?.id || "A"] || COURSE_THEME["A"];
            return (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Day {detailPlan.days[activeDay].day} · {detailPlan.days[activeDay].theme}
                    </h3>
                    <p className={`text-[11px] font-bold mt-0.5 ${theme.accent}`}>
                      {theme.label} 코스
                    </p>
                  </div>
                  <span className={`text-sm font-extrabold ${theme.accent}`}>
                    {formatCost(detailPlan.days[activeDay].dayCost)}
                  </span>
                </div>

                {/* 타임라인 본체 */}
                <div className="relative">
                  {/* 세로 점선 */}
                  <div className="absolute left-[68px] top-0 bottom-0 w-px border-l-2 border-dashed border-slate-200" />

                  {detailPlan.days[activeDay].stops.map((stop, i) => {
                    const styleInfo =
                      CATEGORY_STYLE[stop.category] || CATEGORY_STYLE["관광지"];
                    const moveBadge = stop.driveMinutes != null && stop.driveMinutes > 0
                      ? getMoveBadge(stop.driveMinutes)
                      : null;
                    return (
                      <div key={i}>
                        {/* 이동 구간 */}
                        {moveBadge && (
                          <div className="flex items-center gap-2 py-1.5 pl-[88px]">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${moveBadge.cls}`}>
                              {moveBadge.label}
                            </span>
                          </div>
                        )}

                        {/* 스팟 행 */}
                        <div className="flex items-start gap-3 pb-4 relative">
                          {/* 왼쪽 시간 컬럼 */}
                          <div className="w-14 shrink-0 text-right pt-0.5">
                            <p className="text-sm font-extrabold text-slate-900 tabular-nums font-mono">
                              {stop.time}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {stop.estimatedCost > 0
                                ? formatCost(stop.estimatedCost)
                                : "무료"}
                            </p>
                          </div>

                          {/* 카테고리 아이콘 노드 */}
                          <div className="relative shrink-0 z-10">
                            <div className={`w-9 h-9 rounded-full grid place-items-center text-lg bg-white border-2 shadow-sm`}
                              style={{ borderColor: styleInfo.dot }}>
                              {styleInfo.icon}
                            </div>
                          </div>

                          {/* 오른쪽 장소 카드 */}
                          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-slate-300 transition-colors">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <p className="font-extrabold text-slate-900 text-sm leading-snug">
                                  {stop.name}
                                </p>
                                {/* 카테고리 뱃지 + 소요시간 */}
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styleInfo.color}`}
                                  >
                                    {styleInfo.icon} {stop.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {stop.description && (
                              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                                {stop.description}
                              </p>
                            )}
                            {stop.address && (
                              <p className="text-[11px] text-slate-400 mt-1">
                                📍 {stop.address}
                              </p>
                            )}
                            {stop.tip && (
                              <p className={`text-[11px] mt-1.5 ${theme.accent} ${theme.bg} px-2.5 py-1.5 rounded-lg inline-block`}>
                                TIP: {stop.tip}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* 예산 분석 */}
          {detailPlan.budgetBreakdown?.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-extrabold text-slate-900 mb-4">예산 분석</h3>
              <div className="space-y-3">
                {detailPlan.budgetBreakdown.map((item) => {
                  const total = detailPlan.budgetBreakdown.reduce(
                    (s, b) => s + b.amount,
                    0
                  );
                  const pct = total > 0 ? (item.amount / total) * 100 : 0;
                  return (
                    <div key={item.category} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 w-16 shrink-0">
                        {item.category}
                      </span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full transition-all"
                          style={{ width: `${Math.min(pct, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-20 text-right shrink-0">
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
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="font-extrabold text-slate-900 mb-3">
                준비물 &amp; 꿀팁
              </h3>
              <ul className="space-y-2">
                {detailPlan.packingTips.map((tip, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-amber-500 mt-0.5 shrink-0">✦</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
        </main>
      )}

      {/* ── 하단 고정 CTA (detail 단계) ── */}
      {!loadingCourses &&
        !loadingDetail &&
        phase === "detail" &&
        detailPlan && (() => {
          const course = courseCards.find((c) => c.id === selectedCourseId);
          const theme = COURSE_THEME[course?.id || "A"] || COURSE_THEME["A"];
          return (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 p-3 safe-bottom">
              <div className="max-w-2xl mx-auto flex gap-2">
                <a
                  href="http://localhost:3001/rentcar"
                  className="flex-1 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
                >
                  🚗 렌터카 함께 예약
                </a>
                <button
                  onClick={handleCreateParty}
                  className={`flex-[1.5] py-3.5 rounded-xl ${theme.badge} text-white font-extrabold text-sm transition-colors shadow-md flex items-center justify-center gap-1.5 hover:opacity-90`}
                >
                  🎉 이 코스로 파티 만들기
                </button>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
