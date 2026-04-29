"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { saveSelectedCar } from "@/lib/shared-state";

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

interface PartyItem {
  id: string; title: string; category: string;
  currentMembers: number; maxMembers: number;
  date: string; location: string;
}

const DUMMY_PARTIES: PartyItem[] = [
  { id: "p1", title: "성산 일출봉 트레킹 파티",   category: "hiking",   currentMembers: 4, maxMembers: 8,  date: "5/10(토)", location: "성산읍" },
  { id: "p2", title: "협재 해변 서핑 입문 파티",  category: "surfing",  currentMembers: 3, maxMembers: 6,  date: "5/11(일)", location: "한림읍" },
  { id: "p3", title: "애월 카페투어 파티",         category: "cafe",     currentMembers: 5, maxMembers: 10, date: "5/12(월)", location: "애월읍" },
  { id: "p4", title: "한라산 둘레길 자전거 파티",  category: "cycling",  currentMembers: 2, maxMembers: 6,  date: "5/17(토)", location: "서귀포시" },
  { id: "p5", title: "우도 스노클링 파티",         category: "activity", currentMembers: 4, maxMembers: 8,  date: "5/18(일)", location: "우도면" },
  { id: "p6", title: "제주 로컬 쿠킹 클래스",     category: "cooking",  currentMembers: 3, maxMembers: 8,  date: "5/14(수)", location: "제주시" },
];

const PURPOSE_CATEGORY_MAP: Record<string, string[]> = {
  drive:    ["cycling", "photo"],
  healing:  ["cafe", "cooking"],
  hiking:   ["hiking"],
  activity: ["surfing", "running"],
  family:   ["cycling", "cafe"],
};

const CATEGORY_EMOJI: Record<string, string> = {
  hiking: "🥾", surfing: "🏄", cafe: "☕", cycling: "🚴",
  activity: "🎯", cooking: "🍳", photo: "📷", running: "🏃",
};

const PURPOSES = [
  { id: "healing",  label: "힐링/휴양",   emoji: "🧘", desc: "카페·드라이브·휴식" },
  { id: "drive",    label: "드라이브",    emoji: "🚗", desc: "해안도로·야경·감성" },
  { id: "hiking",   label: "올레길/등산", emoji: "🥾", desc: "한라산·트레킹·자연" },
  { id: "food",     label: "맛집투어",    emoji: "🍊", desc: "로컬 식당·제주 맛집" },
  { id: "family",   label: "가족여행",    emoji: "👨‍👩‍👧‍👦", desc: "키즈 친화·넓은 공간" },
  { id: "camping",  label: "캠핑",        emoji: "⛺", desc: "캠핑장·야외 액티비티" },
  { id: "activity", label: "액티비티",    emoji: "🏄", desc: "서핑·승마·스쿠버" },
];

const LUGGAGE_OPTIONS = [
  { id: "캐리어 1개",          label: "캐리어 1개",       icon: "🧳" },
  { id: "캐리어 2개",          label: "캐리어 2개",       icon: "🧳🧳" },
  { id: "캐리어 3개 이상",     label: "캐리어 3개+",      icon: "📦" },
  { id: "캐리어 + 등산/서핑 장비", label: "캐리어 + 장비", icon: "🏕️" },
  { id: "짐 거의 없음",        label: "짐 거의 없음",     icon: "🎒" },
];

function CarPickContent() {
  const searchParams = useSearchParams();

  const fromParty = searchParams.get("from") === "party";
  const partyName = searchParams.get("partyName") || "";

  const initTravelers = Math.min(parseInt(searchParams.get("travelers") || "2"), 7);
  const initDays      = Math.min(parseInt(searchParams.get("days")      || "3"), 7);
  const initPurpose   = PURPOSES.find(p => p.id === searchParams.get("purpose")) ? (searchParams.get("purpose") || "healing") : "healing";

  const [travelers, setTravelers] = useState(initTravelers);
  const [days,      setDays]      = useState(initDays);
  const [luggage,   setLuggage]   = useState("캐리어 2개");
  const [purpose,   setPurpose]   = useState(initPurpose);
  const [budget,    setBudget]    = useState("");
  const [loading,   setLoading]   = useState(false);
  const [result,    setResult]    = useState<Recommendation | null>(null);

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
          purpose: PURPOSES.find(p => p.id === purpose)?.label || purpose,
          budget: budget ? parseInt(budget) * 10000 : undefined,
        }),
      });
      const data = await res.json();
      setResult(data);
      if (data.recommendation?.car) {
        saveSelectedCar({
          carId: data.recommendation.car.id,
          carName: data.recommendation.car.name,
          pricePerDay: data.recommendation.car.pricePerDay,
          fuelType: data.recommendation.car.fuelType,
          days,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-950 text-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-end gap-3">
            <div>
              <p className="text-blue-400 text-xs font-semibold tracking-widest uppercase mb-1">AI Rental Car Concierge</p>
              <h1 className="text-2xl font-bold tracking-tight">제주 렌터카 차종 추천</h1>
            </div>
            {fromParty && (
              <div className="ml-auto flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 rounded-xl px-4 py-2">
                <span className="text-lg">🎉</span>
                <div>
                  <p className="text-[10px] text-orange-300 font-medium">파티 연동</p>
                  <p className="text-xs text-white font-semibold truncate max-w-[160px]">{partyName || "파티 조건 자동 입력됨"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── 왼쪽: 입력 폼 ── */}
          <div className="space-y-4">

            {/* 인원 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">인원</p>
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4,5,6,7].map(n => (
                  <button key={n} onClick={() => setTravelers(n)}
                    className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${
                      travelers === n
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}>
                    {n}{n >= 7 ? "+" : ""}
                  </button>
                ))}
              </div>
            </div>

            {/* 여행 일수 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">여행 일수</p>
              <div className="flex gap-2 flex-wrap">
                {[1,2,3,4,5,7].map(d => (
                  <button key={d} onClick={() => setDays(d)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      days === d
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}>
                    {d}일
                  </button>
                ))}
              </div>
            </div>

            {/* 짐 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">짐</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {LUGGAGE_OPTIONS.map(opt => (
                  <button key={opt.id} onClick={() => setLuggage(opt.id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                      luggage === opt.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}>
                    <span className="text-base">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 여행 목적 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">여행 목적</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {PURPOSES.map(p => (
                  <button key={p.id} onClick={() => setPurpose(p.id)}
                    className={`p-3 rounded-xl text-left transition-all border-2 ${
                      purpose === p.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-transparent bg-slate-50 hover:bg-slate-100"
                    }`}>
                    <div className="text-xl mb-1">{p.emoji}</div>
                    <div className="text-xs font-bold text-slate-800">{p.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 예산 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                렌터카 예산 <span className="text-slate-300 font-normal normal-case">(선택)</span>
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number" value={budget} onChange={e => setBudget(e.target.value)}
                  placeholder="예: 15"
                  className="w-28 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-slate-50 text-center font-semibold"
                />
                <span className="text-sm text-slate-500">만원 이하</span>
                {budget && (
                  <span className="text-xs text-blue-600 font-medium ml-auto">
                    총 {(parseInt(budget) * 10000 * days).toLocaleString()}원 이내
                  </span>
                )}
              </div>
            </div>

            {/* 추천 버튼 */}
            <button
              onClick={handleRecommend}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-base hover:from-blue-500 hover:to-blue-600 disabled:opacity-60 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI가 분석 중...
                </>
              ) : (
                <>
                  <span>✨</span> 차종 추천받기
                </>
              )}
            </button>
          </div>

          {/* ── 오른쪽: 결과 ── */}
          <div className="space-y-4">
            {!result && !loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="text-6xl mb-4">🚗</div>
                <p className="text-slate-800 font-bold text-lg mb-1">조건을 입력하면</p>
                <p className="text-slate-400 text-sm">AI가 최적 차종을 추천해드려요</p>
                <div className="mt-6 flex justify-center gap-4 text-xs text-slate-300">
                  <span>인원 {travelers}명</span>
                  <span>·</span>
                  <span>{days}일</span>
                  <span>·</span>
                  <span>{PURPOSES.find(p => p.id === purpose)?.label}</span>
                </div>
              </div>
            )}

            {loading && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600 font-semibold">AI가 최적 차종 분석 중</p>
                <p className="text-slate-400 text-sm mt-1">{travelers}명 · {days}일 · {PURPOSES.find(p => p.id === purpose)?.label}</p>
              </div>
            )}

            {result && (
              <>
                {/* AI 요약 */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200">
                  <p className="text-xs font-semibold text-blue-200 mb-1">AI 분석 결과</p>
                  <p className="text-sm font-medium leading-relaxed">{result.summary}</p>
                </div>

                {/* 1순위 추천 */}
                {result.recommendation?.car && (
                  <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-200 p-6">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">1순위 추천</span>
                      <span className="text-xs text-slate-400">AI 최적 매칭</span>
                    </div>

                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-5xl border border-slate-100 flex-shrink-0">
                        {result.recommendation.car.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-900">{result.recommendation.car.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{result.recommendation.car.category}</span>
                          <span className="text-xs text-slate-400">{result.recommendation.car.seats}인승</span>
                          <span className="text-xs text-slate-400">{result.recommendation.car.fuelType}</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-2xl font-bold text-blue-600">{result.recommendation.car.pricePerDay.toLocaleString()}</span>
                          <span className="text-sm text-slate-400">원/일</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed mb-4 bg-slate-50 rounded-xl p-4">
                      {result.recommendation.reason}
                    </p>

                    <div className="text-xs text-slate-400 mb-4 font-medium">{result.recommendation.costBreakdown}</div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {result.recommendation.car.features.map(f => (
                        <span key={f} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium">{f}</span>
                      ))}
                    </div>

                    {result.recommendation.tips?.length > 0 && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-amber-700 mb-2">💡 제주 여행 팁</p>
                        <ul className="space-y-1">
                          {result.recommendation.tips.map((tip, i) => (
                            <li key={i} className="text-xs text-amber-700 flex gap-1.5">
                              <span className="text-amber-400 flex-shrink-0">·</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 대안 */}
                {result.alternative?.car && (
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full">대안 차종</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-3xl border border-slate-100 flex-shrink-0">
                        {result.alternative.car.image}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800">{result.alternative.car.name}</p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          일 {result.alternative.car.pricePerDay.toLocaleString()}원 · {result.alternative.priceDiff}
                        </p>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{result.alternative.reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 파티 추천 섹션 */}
                {(() => {
                  const categories = PURPOSE_CATEGORY_MAP[purpose] ?? [];
                  const matched = DUMMY_PARTIES.filter(p => categories.includes(p.category)).slice(0, 3);
                  if (matched.length === 0) return null;
                  return (
                    <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-2xl p-4 mt-6">
                      <p className="text-sm font-bold text-slate-800 mb-3">🎉 이 차로 어떤 파티 어때요?</p>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {matched.map(party => (
                          <div
                            key={party.id}
                            onClick={() => window.open(`http://localhost:3010/party/${party.id}`, "_blank")}
                            className="min-w-[200px] bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition"
                          >
                            <div className="text-2xl mb-2">{CATEGORY_EMOJI[party.category] ?? "🎪"}</div>
                            <p className="text-xs font-bold text-slate-800 leading-snug mb-2">{party.title}</p>
                            <p className="text-[11px] text-slate-400">{party.date} · {party.location}</p>
                            <p className="text-[11px] text-violet-600 font-semibold mt-1">{party.currentMembers}/{party.maxMembers}명 참가 중</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <button
                          onClick={() => window.open("http://localhost:3010", "_blank")}
                          className="border border-violet-300 text-violet-700 rounded-full px-6 py-2 text-sm hover:bg-violet-50 transition"
                        >
                          더 많은 파티 보기
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* 다음 단계 CTA */}
                <div className="grid grid-cols-2 gap-3">
                  <a href="/fuel" className="flex flex-col items-center justify-center gap-1 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:border-amber-400 hover:bg-amber-50 transition-all group">
                    <span className="text-2xl">⛽</span>
                    <span className="text-xs font-bold group-hover:text-amber-600">주유 가이드</span>
                    <span className="text-[10px] text-slate-400">반납 전 주유소 찾기</span>
                  </a>
                  <a href="/cost" className="flex flex-col items-center justify-center gap-1 py-4 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:border-emerald-400 hover:bg-emerald-50 transition-all group">
                    <span className="text-2xl">💰</span>
                    <span className="text-xs font-bold group-hover:text-emerald-600">비용 계산</span>
                    <span className="text-[10px] text-slate-400">보험·옵션 포함 총액</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarPickPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    }>
      <CarPickContent />
    </Suspense>
  );
}
