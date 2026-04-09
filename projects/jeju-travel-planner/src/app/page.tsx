"use client";

import { useState } from "react";
import type { TravelPlan } from "@/lib/types";

const STYLE_OPTIONS = [
  { id: "healing", label: "힐링", emoji: "🧘" },
  { id: "activity", label: "액티비티", emoji: "🏄" },
  { id: "food", label: "맛집탐방", emoji: "🍊" },
  { id: "cafe", label: "카페투어", emoji: "☕" },
  { id: "nature", label: "자연/올레길", emoji: "🌿" },
  { id: "culture", label: "문화/역사", emoji: "🏛️" },
  { id: "photo", label: "포토스팟", emoji: "📸" },
  { id: "family", label: "가족여행", emoji: "👨‍👩‍👧‍👦" },
];

const QUICK_PROMPTS = [
  "2박3일 커플 힐링 여행, 예산 50만원",
  "3박4일 아이 둘 가족여행, 70만원",
  "1박2일 혼자 올레길 걷기, 30만원",
  "2박3일 친구 4명 맛집+액티비티, 80만원",
];

const CATEGORY_COLORS: Record<string, string> = {
  숙소: "bg-purple-100 text-purple-700",
  식당: "bg-orange-100 text-orange-700",
  카페: "bg-amber-100 text-amber-700",
  관광지: "bg-emerald-100 text-emerald-700",
  액티비티: "bg-blue-100 text-blue-700",
  이동: "bg-gray-100 text-gray-500",
};

export default function PlannerPage() {
  const [prompt, setPrompt] = useState("");
  const [nights, setNights] = useState(2);
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(50);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDay, setActiveDay] = useState(0);

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleQuickPrompt = (qp: string) => {
    setPrompt(qp);
  };

  const handleSubmit = async () => {
    if (!prompt.trim() && selectedStyles.length === 0) {
      setError("여행 스타일을 선택하거나 원하는 여행을 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
    setPlan(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || `${nights + 1}일${nights}박 제주 여행`,
          nights,
          travelers,
          budget: budget * 10000,
          style: selectedStyles,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "일정 생성에 실패했습니다.");
      }

      const data = await res.json();
      setPlan(data.plan);
      setActiveDay(0);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-emerald-100">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-gray-900">✈️ AI 제주 여행 플래너</h1>
          <p className="text-sm text-gray-500 mt-1">원하는 여행을 말씀하시면 AI가 맞춤 일정을 만들어드립니다</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {!plan ? (
          /* ── 입력 폼 ── */
          <div className="space-y-6">
            {/* 빠른 입력 */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">빠른 선택</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((qp) => (
                  <button
                    key={qp}
                    onClick={() => handleQuickPrompt(qp)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      prompt === qp
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-600 hover:border-emerald-300"
                    }`}
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>

            {/* 자연어 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                어떤 제주 여행을 원하시나요?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="예: 3박4일 아이 둘과 함께 자연 위주 여행, 예산 70만원, 숙소는 애월쪽 선호"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none resize-none text-sm"
              />
            </div>

            {/* 옵션 슬라이더 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500 mb-1">숙박</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setNights(Math.max(1, nights - 1))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">{nights}박</span>
                  <button
                    onClick={() => setNights(Math.min(7, nights + 1))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500 mb-1">인원</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">{travelers}명</span>
                  <button
                    onClick={() => setTravelers(Math.min(10, travelers + 1))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <p className="text-xs text-gray-500 mb-1">예산</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBudget(Math.max(10, budget - 10))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-12 text-center">{budget}만</span>
                  <button
                    onClick={() => setBudget(Math.min(300, budget + 10))}
                    className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 여행 스타일 */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">여행 스타일 (복수 선택)</p>
              <div className="flex flex-wrap gap-2">
                {STYLE_OPTIONS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedStyles.includes(style.id)
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"
                    }`}
                  >
                    {style.emoji} {style.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 에러 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {/* 생성 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI가 일정을 만들고 있습니다...
                </span>
              ) : (
                "일정 만들기"
              )}
            </button>
          </div>
        ) : (
          /* ── 결과 표시 ── */
          <div className="space-y-6">
            {/* 헤더 + 뒤로가기 */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{plan.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{plan.summary}</p>
              </div>
              <button
                onClick={() => setPlan(null)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200"
              >
                다시 만들기
              </button>
            </div>

            {/* 요약 카드 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-400">일정</p>
                <p className="text-lg font-bold text-gray-900">{plan.nights + 1}일 {plan.nights}박</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-400">인원</p>
                <p className="text-lg font-bold text-gray-900">{plan.travelers}명</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-xs text-gray-400">예상 경비</p>
                <p className="text-lg font-bold text-emerald-600">{formatCost(plan.totalBudget)}</p>
              </div>
            </div>

            {/* 날짜 탭 */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {plan.schedule.map((day, i) => (
                <button
                  key={day.day}
                  onClick={() => setActiveDay(i)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeDay === i
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-300"
                  }`}
                >
                  Day {day.day}
                  <span className="block text-[10px] opacity-75">{day.theme}</span>
                </button>
              ))}
            </div>

            {/* 일정 타임라인 */}
            {plan.schedule[activeDay] && (
              <div className="space-y-3">
                {plan.schedule[activeDay].spots.map((spot, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4 hover:shadow-sm transition-shadow"
                  >
                    {/* 시간 */}
                    <div className="w-14 flex-shrink-0 text-center">
                      <p className="text-sm font-bold text-gray-900">{spot.time}</p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          CATEGORY_COLORS[spot.category] || "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {spot.category}
                      </span>
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900">{spot.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{spot.description}</p>
                      {spot.address && (
                        <p className="text-xs text-gray-400 mt-1">{spot.address}</p>
                      )}
                      {spot.tip && (
                        <p className="text-xs text-emerald-600 mt-1 bg-emerald-50 px-2 py-1 rounded-lg inline-block">
                          TIP: {spot.tip}
                        </p>
                      )}
                    </div>

                    {/* 비용 */}
                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {spot.estimatedCost > 0 ? formatCost(spot.estimatedCost) : "무료"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 예산 분석 */}
            {plan.budgetBreakdown && plan.budgetBreakdown.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3">예산 분석</h3>
                <div className="space-y-2">
                  {plan.budgetBreakdown.map((item) => {
                    const pct = plan.totalBudget > 0 ? (item.amount / plan.totalBudget) * 100 : 0;
                    return (
                      <div key={item.category} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-16">{item.category}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-400 rounded-full"
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

            {/* 준비물/팁 */}
            {plan.packingTips && plan.packingTips.length > 0 && (
              <div className="bg-emerald-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-900 mb-2">준비물 & 꿀팁</h3>
                <ul className="space-y-1">
                  {plan.packingTips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-emerald-500">-</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
