"use client";

import { useState } from "react";

interface CarInfo {
  id: string; name: string; category: string; seats: number;
  trunkCapacity: string; fuelType: string; pricePerDay: number;
  image: string; features: string[]; bestFor: string[];
}

interface Recommendation {
  recommendation: { carId: string; reason: string; tips: string[]; totalCost: number; costBreakdown: string; car?: CarInfo };
  alternative: { carId: string; reason: string; priceDiff: string; car?: CarInfo };
  summary: string;
}

const PURPOSES = [
  { id: "healing", label: "힐링/휴양", emoji: "🧘" },
  { id: "drive", label: "드라이브", emoji: "🚗" },
  { id: "hiking", label: "올레길/등산", emoji: "🥾" },
  { id: "food", label: "맛집투어", emoji: "🍊" },
  { id: "family", label: "가족여행", emoji: "👨‍👩‍👧‍👦" },
  { id: "camping", label: "캠핑", emoji: "⛺" },
];

const LUGGAGE_OPTIONS = [
  "캐리어 1개",
  "캐리어 2개",
  "캐리어 3개 이상",
  "캐리어 + 등산/서핑 장비",
  "짐 거의 없음",
];

export default function CarPickPage() {
  const [travelers, setTravelers] = useState(2);
  const [days, setDays] = useState(3);
  const [luggage, setLuggage] = useState("캐리어 2개");
  const [purpose, setPurpose] = useState("healing");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);

  const handleRecommend = async () => {
    setLoading(true);
    setResult(null);
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    try {
      const res = await fetch(`${basePath}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          travelers, days, luggage,
          purpose: PURPOSES.find((p) => p.id === purpose)?.label || purpose,
          budget: budget ? parseInt(budget) * 10000 : undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="bg-white/80 backdrop-blur border-b border-blue-100">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">🚗 AI 차종 추천</h1>
          <p className="text-sm text-gray-500 mt-0.5">여행 정보를 입력하면 최적의 제주 렌터카를 추천합니다</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
          {/* 인원 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">인원</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <button key={n} onClick={() => setTravelers(n)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${travelers === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {n}{n >= 7 ? "+" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* 일수 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">여행 일수</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 7].map((d) => (
                <button key={d} onClick={() => setDays(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${days === d ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {d}일
                </button>
              ))}
            </div>
          </div>

          {/* 짐 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">짐</label>
            <div className="flex flex-wrap gap-2">
              {LUGGAGE_OPTIONS.map((opt) => (
                <button key={opt} onClick={() => setLuggage(opt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${luggage === opt ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 목적 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">여행 목적</label>
            <div className="grid grid-cols-3 gap-2">
              {PURPOSES.map((p) => (
                <button key={p.id} onClick={() => setPurpose(p.id)}
                  className={`p-3 rounded-xl text-center transition-all ${purpose === p.id ? "bg-blue-50 border-2 border-blue-500" : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"}`}>
                  <div className="text-xl">{p.emoji}</div>
                  <div className="text-xs font-medium text-gray-700 mt-1">{p.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 예산 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">렌터카 예산 (선택)</label>
            <div className="flex items-center gap-2">
              <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)}
                placeholder="예: 15" className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
              <span className="text-sm text-gray-500">만원</span>
            </div>
          </div>

          {/* 추천 버튼 */}
          <button onClick={handleRecommend} disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-500 disabled:opacity-50 transition-all">
            {loading ? "AI가 분석 중..." : "차종 추천받기"}
          </button>
        </div>

        {/* 결과 */}
        {result && result.recommendation && (
          <div className="mt-8 space-y-4">
            {/* 요약 */}
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm font-medium text-blue-700">{result.summary}</p>
            </div>

            {/* 1순위 추천 */}
            {result.recommendation.car && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full">1순위 추천</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{result.recommendation.car.image}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{result.recommendation.car.name}</h3>
                    <p className="text-sm text-gray-500">{result.recommendation.car.category} · {result.recommendation.car.seats}인승 · {result.recommendation.car.fuelType}</p>
                    <p className="text-lg font-bold text-blue-600 mt-1">일 {result.recommendation.car.pricePerDay.toLocaleString()}원</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">{result.recommendation.reason}</p>
                <p className="text-xs text-gray-500 mb-3">{result.recommendation.costBreakdown}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {result.recommendation.car.features.map((f) => (
                    <span key={f} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">{f}</span>
                  ))}
                </div>
                {result.recommendation.tips && (
                  <div className="bg-amber-50 rounded-lg p-3 mt-3">
                    <p className="text-xs font-bold text-amber-700 mb-1">💡 제주 팁</p>
                    {result.recommendation.tips.map((tip, i) => (
                      <p key={i} className="text-xs text-amber-600">· {tip}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2순위 대안 */}
            {result.alternative?.car && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold bg-gray-200 text-gray-700 px-2 py-1 rounded-full">대안</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{result.alternative.car.image}</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{result.alternative.car.name}</h3>
                    <p className="text-sm text-gray-500">일 {result.alternative.car.pricePerDay.toLocaleString()}원 · {result.alternative.priceDiff}</p>
                    <p className="text-xs text-gray-600 mt-1">{result.alternative.reason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
