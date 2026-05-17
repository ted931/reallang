"use client";

import { useState } from "react";
import type { Course, CourseResult, CourseStop } from "@/lib/types";

/* ─────────────────────────────────────────────
   아이디어 2: 카페패스 감성 코스 데이터
   ───────────────────────────────────────────── */
const CAFE_THEMES = [
  { id: "부모님", emoji: "🧓", label: "부모님과 함께", keywords: ["주차 편함", "조용함", "의자 편안"] },
  { id: "노트북", emoji: "💻", label: "노트북 작업", keywords: ["WiFi 빠름", "콘센트", "오래 앉기 좋음"] },
  { id: "뷰맛집", emoji: "🌊", label: "뷰 맛집", keywords: ["오션뷰", "오름뷰", "인스타감성"] },
  { id: "커플", emoji: "💑", label: "커플 데이트", keywords: ["분위기 좋음", "조명 예쁨", "프라이빗"] },
  { id: "인스타", emoji: "📸", label: "인스타 감성", keywords: ["포토존", "감성 인테리어", "아이템 특이"] },
];

const CAFE_ROUTES: Record<string, { name: string; area: string; reviewSnippets: string[]; tags: string[]; lat: number; lng: number; waitMin: number; priceRange: string }[]> = {
  부모님: [
    { name: "카페 드 서귀", area: "서귀포", reviewSnippets: ["부모님 모시고 갔는데 주차 넓어서 편했어요", "의자가 편하고 조용해서 오래 앉아있었어요"], tags: ["주차 편함", "조용함", "넓은 좌석"], lat: 33.2541, lng: 126.5600, waitMin: 5, priceRange: "6,000~9,000원" },
    { name: "한라산 뷰 카페", area: "제주시", reviewSnippets: ["어머니가 한라산 보면서 커피 마시는 게 소원이셨는데 딱이었어요", "뷰가 넓어 어르신 모시기 좋아요"], tags: ["한라산뷰", "넓은 공간", "단체 가능"], lat: 33.4996, lng: 126.5312, waitMin: 10, priceRange: "7,000~10,000원" },
    { name: "사계 해변 브런치", area: "안덕", reviewSnippets: ["바다 보이는 창가에서 부모님이랑 여유롭게 시간 보냈어요", "직원분들이 친절해서 좋았어요"], tags: ["오션뷰", "친절한 서비스", "브런치"], lat: 33.2285, lng: 126.3102, waitMin: 15, priceRange: "12,000~18,000원" },
  ],
  노트북: [
    { name: "와이파이 스튜디오 제주", area: "제주시 연동", reviewSnippets: ["WiFi 빠르고 콘센트 많아서 하루종일 작업했어요", "에스프레소 진하고 좋음"], tags: ["WiFi 빠름", "콘센트 많음", "조용함"], lat: 33.4890, lng: 126.4983, waitMin: 0, priceRange: "5,000~8,000원" },
    { name: "북카페 오름", area: "조천", reviewSnippets: ["책도 있고 조용해서 집중 잘돼요", "카공족들한테 눈치 안 줘서 편해요"], tags: ["카공 OK", "조용함", "책 구비"], lat: 33.5341, lng: 126.6431, waitMin: 5, priceRange: "6,000~10,000원" },
    { name: "에러 제로 카페", area: "서귀포 혁신도시", reviewSnippets: ["개발자들이 자주 온다는 소문 들었는데 확실히 환경이 좋아요", "밤 늦게까지 열어요"], tags: ["24시간", "콘센트", "WiFi"], lat: 33.2601, lng: 126.4721, waitMin: 0, priceRange: "4,500~7,000원" },
  ],
  뷰맛집: [
    { name: "카페 이음", area: "성산", reviewSnippets: ["성산일출봉 정면으로 보이는 자리에 앉으면 말 잃어요", "일출 때 오면 진짜 소름"], tags: ["성산일출봉뷰", "일출 명소", "인스타 핫플"], lat: 33.4609, lng: 126.9425, waitMin: 30, priceRange: "8,000~14,000원" },
    { name: "협재 선셋 테라스", area: "협재", reviewSnippets: ["해질녘 협재 바다 뷰가 압도적이에요", "비양도까지 보여서 환상적이에요"], tags: ["오션뷰", "선셋 명소", "테라스"], lat: 33.3942, lng: 126.2397, waitMin: 20, priceRange: "9,000~15,000원" },
    { name: "사려니 숲 카페", area: "봉개", reviewSnippets: ["숲 속에서 마시는 커피가 이런 맛이구나 싶었어요", "피톤치드 맡으며 힐링 가능"], tags: ["숲뷰", "힐링", "조용함"], lat: 33.4211, lng: 126.6542, waitMin: 10, priceRange: "7,000~11,000원" },
  ],
  커플: [
    { name: "달빛 다락방", area: "한경", reviewSnippets: ["조명이 너무 예쁘고 2인 프라이빗 좌석이 있어요", "남자친구가 여기 좋아해서 단골이에요"], tags: ["프라이빗", "조명 예쁨", "와인바 겸"], lat: 33.3301, lng: 126.1822, waitMin: 10, priceRange: "10,000~18,000원" },
    { name: "하도 리조트 카페", area: "구좌 하도", reviewSnippets: ["바다 보이는 풀장 옆에서 커피 마심. 커플 성지", "예약 필수지만 절대 후회 없어요"], tags: ["풀사이드", "오션뷰", "예약 필수"], lat: 33.5212, lng: 126.8913, waitMin: 40, priceRange: "14,000~22,000원" },
    { name: "구좌 당근 카페", area: "구좌", reviewSnippets: ["당근 케이크 맛있고 인테리어 너무 이뻐요", "커플끼리 오기 딱 좋은 분위기"], tags: ["당근 테마", "감성 인테리어", "디저트"], lat: 33.5410, lng: 126.8231, waitMin: 20, priceRange: "7,000~12,000원" },
  ],
  인스타: [
    { name: "핑크뮬리 정원 카페", area: "표선", reviewSnippets: ["가을에 오면 핑크뮬리밭이 배경이 되는 카페", "포토존 줄 서서 찍어야 하지만 결과물이 미쳐요"], tags: ["포토존", "정원", "핑크뮬리"], lat: 33.3241, lng: 126.8102, waitMin: 25, priceRange: "8,000~13,000원" },
    { name: "오래된 집 감성 카페", area: "애월", reviewSnippets: ["돌담 옛날 제주 집 개조한 카페인데 소품 하나하나 다 예뻐요", "외관 사진만 100장은 찍었어요"], tags: ["제주 돌담", "복고 감성", "외관 포토존"], lat: 33.4613, lng: 126.3122, waitMin: 15, priceRange: "7,000~11,000원" },
    { name: "거울 정원 Miroir", area: "서귀포 중문", reviewSnippets: ["거울 설치 예술 작품이 카페 안에 있어서 사진 찍기 최고", "SNS에서 보고 왔는데 기대 이상이에요"], tags: ["미러 아트", "설치 예술", "인스타 핫플"], lat: 33.2501, lng: 126.4102, waitMin: 35, priceRange: "12,000~18,000원" },
  ],
};

/* ─────────────────────────────────────────────
   아이디어 3: 렌터카 연계 루트 데이터
   ───────────────────────────────────────────── */
const PICKUP_LOCATIONS = [
  { id: "airport", label: "제주국제공항", area: "제주시 북부", lat: 33.5113, lng: 126.4930 },
  { id: "seogwipo", label: "서귀포 항만", area: "서귀포 시내", lat: 33.2400, lng: 126.5600 },
  { id: "jungmun", label: "중문 관광단지", area: "서귀포 서부", lat: 33.2501, lng: 126.4100 },
  { id: "sungsan", label: "성산항", area: "제주 동부", lat: 33.4742, lng: 126.9251 },
];

const RETURN_TIMES = ["14:00", "16:00", "18:00", "20:00", "22:00"];

const ACCOMMODATION_AREAS = [
  "제주시 시내", "애월", "한림", "협재", "서귀포 시내", "중문", "성산", "표선", "구좌",
];

type RouteStop = {
  name: string; area: string; type: "카페" | "카페패스"; driveMin: number;
  stayMin: number; tags: string[]; cafepassMark: boolean; couponValue?: number;
};

function buildCarRoute(pickupId: string, returnTime: string, accomArea: string): RouteStop[] {
  const hourMap: Record<string, number> = { "14:00": 14, "16:00": 16, "18:00": 18, "20:00": 20, "22:00": 22 };
  const returnHour = hourMap[returnTime] ?? 18;
  const slots = Math.max(2, Math.floor((returnHour - 10) / 2));

  const ROUTE_DB: Record<string, RouteStop[]> = {
    airport: [
      { name: "도두봉 뷰 카페", area: "제주시", type: "카페패스", driveMin: 8, stayMin: 50, tags: ["한라산뷰", "카페패스 가맹"], cafepassMark: true, couponValue: 6500 },
      { name: "이호테우 해변 카페", area: "이호동", type: "카페패스", driveMin: 12, stayMin: 60, tags: ["오션뷰", "카페패스 가맹"], cafepassMark: true, couponValue: 7000 },
      { name: "애월 인스타 카페", area: "애월", type: "카페", driveMin: 25, stayMin: 50, tags: ["오션뷰", "포토존"], cafepassMark: false },
      { name: "협재 선셋 카페패스", area: "협재", type: "카페패스", driveMin: 40, stayMin: 60, tags: ["선셋 명소", "카페패스 가맹"], cafepassMark: true, couponValue: 8500 },
    ],
    seogwipo: [
      { name: "외돌개 뷰 카페패스", area: "서귀포", type: "카페패스", driveMin: 10, stayMin: 50, tags: ["외돌개뷰", "카페패스 가맹"], cafepassMark: true, couponValue: 7500 },
      { name: "정방폭포 카페", area: "서귀포", type: "카페", driveMin: 8, stayMin: 40, tags: ["폭포뷰", "브런치"], cafepassMark: false },
      { name: "중문 테라스 카페패스", area: "중문", type: "카페패스", driveMin: 20, stayMin: 60, tags: ["리조트뷰", "카페패스 가맹"], cafepassMark: true, couponValue: 9000 },
    ],
    jungmun: [
      { name: "중문 오션테라스 카페패스", area: "중문", type: "카페패스", driveMin: 5, stayMin: 60, tags: ["오션뷰", "카페패스 가맹"], cafepassMark: true, couponValue: 9000 },
      { name: "산방산 뷰 카페패스", area: "안덕", type: "카페패스", driveMin: 20, stayMin: 50, tags: ["산방산뷰", "카페패스 가맹"], cafepassMark: true, couponValue: 7000 },
      { name: "사계 해변 카페", area: "안덕", type: "카페", driveMin: 12, stayMin: 45, tags: ["오션뷰", "브런치"], cafepassMark: false },
    ],
    sungsan: [
      { name: "성산일출봉 뷰 카페패스", area: "성산", type: "카페패스", driveMin: 5, stayMin: 60, tags: ["일출봉뷰", "카페패스 가맹"], cafepassMark: true, couponValue: 8500 },
      { name: "섭지코지 테라스 카페패스", area: "성산", type: "카페패스", driveMin: 10, stayMin: 50, tags: ["섭지뷰", "카페패스 가맹"], cafepassMark: true, couponValue: 7000 },
      { name: "하도 당근 카페", area: "구좌", type: "카페", driveMin: 15, stayMin: 45, tags: ["감성 인테리어", "디저트"], cafepassMark: false },
      { name: "세화 벽화 카페패스", area: "구좌", type: "카페패스", driveMin: 20, stayMin: 50, tags: ["벽화 포토존", "카페패스 가맹"], cafepassMark: true, couponValue: 6500 },
    ],
  };

  const pool = ROUTE_DB[pickupId] ?? ROUTE_DB["airport"];
  return pool.slice(0, Math.min(slots, pool.length));
}

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

export default function CourseMakerPage() {
  const [activeTab, setActiveTab] = useState<"ai" | "cafe" | "car">("ai");

  // AI 코스 상태
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

  // 카페패스 감성 코스 상태
  const [cafeTheme, setCafeTheme] = useState<string>("");
  const [cafeCount, setCafeCount] = useState(3);
  const [cafeResult, setCafeResult] = useState<typeof CAFE_ROUTES[string] | null>(null);

  // 렌터카 연계 상태
  const [pickupId, setPickupId] = useState("airport");
  const [returnTime, setReturnTime] = useState("18:00");
  const [accomArea, setAccomArea] = useState("애월");
  const [carRouteResult, setCarRouteResult] = useState<ReturnType<typeof buildCarRoute> | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-violet-100">
        <div className="max-w-3xl mx-auto px-6 pt-6 pb-0">
          <h1 className="text-2xl font-bold text-gray-900">🗺️ AI 제주 코스 메이커</h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">취향을 말씀하시면 3가지 최적 코스를 추천합니다</p>

          {/* 탭 */}
          <div className="flex gap-0 border-b border-gray-100">
            {([
              { key: "ai", label: "AI 코스", emoji: "✨" },
              { key: "cafe", label: "카페패스 감성 코스", emoji: "☕" },
              { key: "car", label: "렌터카 연계 루트", emoji: "🚗" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-violet-500 text-violet-600"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* ══ 탭 2: 카페패스 감성 코스 ══ */}
        {activeTab === "cafe" && (
          <div className="space-y-6">
            {!cafeResult ? (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">여행 테마를 선택하세요</p>
                  <p className="text-xs text-gray-400 mb-4">카페패스 실제 리뷰 500개+ 감성 분석 기반</p>
                  <div className="flex flex-col gap-3">
                    {CAFE_THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setCafeTheme(t.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                          cafeTheme === t.id
                            ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                            : "border-gray-100 bg-white hover:border-violet-200"
                        }`}
                      >
                        <span className="text-2xl">{t.emoji}</span>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{t.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{t.keywords.join(" · ")}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500 mb-3">카페 수</p>
                  <div className="flex items-center gap-3">
                    {[2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => setCafeCount(n)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          cafeCount === n
                            ? "bg-violet-500 text-white shadow-md"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {n}곳
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!cafeTheme}
                  onClick={() => setCafeResult((CAFE_ROUTES[cafeTheme] ?? []).slice(0, cafeCount))}
                  className="w-full py-4 rounded-xl bg-violet-500 text-white font-bold text-base hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-violet-200"
                >
                  {cafeTheme ? `"${CAFE_THEMES.find(t => t.id === cafeTheme)?.label}" 카페 코스 보기` : "테마를 선택해주세요"}
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {CAFE_THEMES.find(t => t.id === cafeTheme)?.emoji} {CAFE_THEMES.find(t => t.id === cafeTheme)?.label} 코스
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">리뷰 감성 분석 기반 · 카페패스 가맹점 우선</p>
                  </div>
                  <button onClick={() => setCafeResult(null)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs hover:bg-gray-200">
                    다시 선택
                  </button>
                </div>

                <div className="space-y-0">
                  {cafeResult.map((cafe, i) => (
                    <div key={cafe.name}>
                      {i > 0 && (
                        <div className="flex items-center gap-2 py-2 pl-6">
                          <div className="w-px h-4 bg-gray-200" />
                          <span className="text-[10px] text-gray-400">🚗 이동 {cafe.driveMin}분</span>
                        </div>
                      )}
                      <div className={`rounded-xl border p-4 ${cafe.cafepassMark ? "border-violet-200 bg-violet-50" : "border-gray-100 bg-white"}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{cafe.name}</span>
                              {cafe.cafepassMark && (
                                <span className="px-2 py-0.5 bg-violet-500 text-white text-[10px] font-bold rounded-full">카페패스</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{cafe.area} · 체류 약 {cafe.stayMin}분</p>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {cafe.tags.map((tag) => (
                                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">{tag}</span>
                              ))}
                            </div>
                            {cafe.reviewSnippets.slice(0, 1).map((r, ri) => (
                              <p key={ri} className="text-xs text-gray-500 italic bg-gray-50 px-3 py-2 rounded-lg border-l-2 border-gray-200">
                                "{r}"
                              </p>
                            ))}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs text-gray-400">{cafe.priceRange}</p>
                            {cafe.waitMin > 0 && <p className="text-[10px] text-orange-500 mt-0.5">대기 ~{cafe.waitMin}분</p>}
                            {cafe.cafepassMark && cafe.couponValue && (
                              <p className="text-[10px] text-violet-600 font-bold mt-1">쿠폰 {cafe.couponValue.toLocaleString()}원</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {cafeResult.some(c => c.cafepassMark) && (
                  <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl p-5 text-white">
                    <p className="font-bold text-sm mb-1">
                      ☕ 카페패스 쿠폰으로 절약 가능
                    </p>
                    <p className="text-white/80 text-xs mb-3">
                      이 코스 내 카페패스 가맹점 {cafeResult.filter(c => c.cafepassMark).length}곳 ·
                      예상 절약 {cafeResult.filter(c => c.cafepassMark).reduce((s, c) => s + (c.couponValue ?? 0), 0).toLocaleString()}원
                    </p>
                    <a href="/jejupass/" className="inline-block px-4 py-2 bg-white text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-50 transition-colors">
                      카페패스 구매하기 →
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ══ 탭 3: 렌터카 연계 루트 ══ */}
        {activeTab === "car" && (
          <div className="space-y-6">
            {!carRouteResult ? (
              <>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">렌터카 인수 장소</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PICKUP_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setPickupId(loc.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          pickupId === loc.id
                            ? "border-violet-400 bg-violet-50 ring-2 ring-violet-100"
                            : "border-gray-100 bg-white hover:border-violet-200"
                        }`}
                      >
                        <p className="font-bold text-gray-900 text-sm">{loc.label}</p>
                        <p className="text-xs text-gray-400">{loc.area}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500 mb-3">반납 예정 시간</p>
                  <div className="flex gap-2 flex-wrap">
                    {RETURN_TIMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setReturnTime(t)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          returnTime === t
                            ? "bg-violet-500 text-white shadow-md"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <p className="text-xs text-gray-500 mb-3">숙소 지역</p>
                  <div className="flex flex-wrap gap-2">
                    {ACCOMMODATION_AREAS.map((area) => (
                      <button
                        key={area}
                        onClick={() => setAccomArea(area)}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                          accomArea === area
                            ? "bg-violet-500 text-white shadow-md"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setCarRouteResult(buildCarRoute(pickupId, returnTime, accomArea))}
                  className="w-full py-4 rounded-xl bg-violet-500 text-white font-bold text-base hover:bg-violet-600 transition-colors shadow-lg shadow-violet-200"
                >
                  🚗 렌터카 동선 카페 루트 짜기
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {PICKUP_LOCATIONS.find(l => l.id === pickupId)?.label} 출발 루트
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      반납 {returnTime} · 숙소 {accomArea} 기준 최적 카페패스 동선
                    </p>
                  </div>
                  <button onClick={() => setCarRouteResult(null)} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs hover:bg-gray-200">
                    다시 설정
                  </button>
                </div>

                {/* 타임라인 */}
                <div className="space-y-0">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2">
                    <span className="text-lg">🚗</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {PICKUP_LOCATIONS.find(l => l.id === pickupId)?.label} 인수
                      </p>
                      <p className="text-xs text-gray-400">출발 기준점</p>
                    </div>
                  </div>

                  {carRouteResult.map((stop, i) => (
                    <div key={stop.name}>
                      <div className="flex items-center gap-2 py-2 pl-5">
                        <div className="w-px h-4 bg-gray-200" />
                        <span className="text-[10px] text-gray-400">🚗 {stop.driveMin}분</span>
                      </div>
                      <div className={`rounded-xl border p-4 ${stop.cafepassMark ? "border-violet-200 bg-violet-50" : "border-gray-100 bg-white"}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900">{stop.name}</span>
                              {stop.cafepassMark && (
                                <span className="px-2 py-0.5 bg-violet-500 text-white text-[10px] font-bold rounded-full">카페패스</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{stop.area} · 약 {stop.stayMin}분 체류</p>
                            <div className="flex flex-wrap gap-1.5">
                              {stop.tags.map((tag) => (
                                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full">{tag}</span>
                              ))}
                            </div>
                          </div>
                          {stop.cafepassMark && stop.couponValue && (
                            <div className="text-right ml-3">
                              <p className="text-xs text-violet-600 font-bold">쿠폰</p>
                              <p className="text-sm font-bold text-violet-700">{stop.couponValue.toLocaleString()}원</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 py-2 pl-5">
                    <div className="w-px h-4 bg-gray-200" />
                    <span className="text-[10px] text-gray-400">이동</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-lg">🏨</span>
                    <div>
                      <p className="text-sm font-bold text-gray-900">숙소 도착 · {accomArea}</p>
                      <p className="text-xs text-gray-400">체크인</p>
                    </div>
                  </div>
                </div>

                {/* 절약 요약 */}
                {carRouteResult.some(s => s.cafepassMark) && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                      <p className="text-xs text-gray-400">카페패스 가맹점</p>
                      <p className="text-xl font-bold text-violet-600">
                        {carRouteResult.filter(s => s.cafepassMark).length}곳
                      </p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                      <p className="text-xs text-gray-400">예상 쿠폰 절약</p>
                      <p className="text-xl font-bold text-violet-600">
                        {carRouteResult.filter(s => s.cafepassMark).reduce((s, c) => s + (c.couponValue ?? 0), 0).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl p-5 text-white">
                  <p className="font-bold text-sm mb-1">이 동선, 카페패스로 본전 뽑기</p>
                  <p className="text-white/80 text-xs mb-3">
                    렌터카 이동 중 카페패스 가맹점만 들러도
                    구매 금액의 {Math.round(carRouteResult.filter(s => s.cafepassMark).reduce((s, c) => s + (c.couponValue ?? 0), 0) / 29000 * 100)}% 회수 가능
                  </p>
                  <a href="/jejupass/" className="inline-block px-4 py-2 bg-white text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-50 transition-colors">
                    카페패스 구매하기 →
                  </a>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══ 탭 1: 기존 AI 코스 ══ */}
        {activeTab === "ai" && (!result ? (
          /* ── 입력 폼 ── */
          <div className="space-y-6">
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
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={`/travel?nights=${(selectedCourse.days.length - 1) || 1}&budget=${selectedCourse.totalCost}&style=${encodeURIComponent(selectedCourse.name)}`}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 transition-colors"
                  >
                    ✈️ 이 코스로 일정 만들기
                  </a>
                  <a
                    href="/map"
                    className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                  >
                    🗺️ 지도에서 장소 보기
                  </a>
                </div>

                {/* 렌터카 예약 배너 */}
                <div className="bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">🚗 이 코스, 렌터카가 필요해요</p>
                      <p className="text-sm text-white/80 mt-0.5">
                        총 {selectedCourse.totalDriveKm}km 이동 · 제주패스 렌터카 최저가 보장
                      </p>
                    </div>
                    <a
                      href="/jejupass"
                      className="px-5 py-2.5 bg-white text-violet-600 rounded-lg font-bold text-sm hover:bg-violet-50 transition-colors flex-shrink-0"
                    >
                      렌터카 예약
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </main>
    </div>
  );
}
