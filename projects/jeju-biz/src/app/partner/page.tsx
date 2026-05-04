"use client";

import { useState } from "react";

// ─── 타입 ──────────────────────────────────────────────────────
interface Offer {
  id: string;
  bizName: string;
  bizType: string;
  location: string;
  discount: string;
  categories: string[];
  validUntil: string;
  plan: "free" | "basic" | "featured";
  active: boolean;
  impressions: number;
  codeCopies: number;
}

// ─── 더미 데이터 ───────────────────────────────────────────────
const WEEKLY_IMPRESSIONS = [
  { day: "월", v: 142 }, { day: "화", v: 178 }, { day: "수", v: 203 },
  { day: "목", v: 167 }, { day: "금", v: 241 }, { day: "토", v: 312 },
  { day: "일", v: 289 },
];
const PREV_MONTH_IMPRESSIONS = 1043;
const THIS_MONTH_IMPRESSIONS = 1247;

const INITIAL_OFFERS: Offer[] = [
  {
    id: "OFF-001",
    bizName: "서퍼스 게스트하우스",
    bizType: "accommodation",
    location: "제주시 구좌읍 월정리",
    discount: "파티 참가자 15% 할인 + 웰컴 드링크",
    categories: ["surfing", "party"],
    validUntil: "2026-06-30",
    plan: "featured",
    active: true,
    impressions: 1247,
    codeCopies: 43,
  },
  {
    id: "OFF-002",
    bizName: "서퍼스 게스트하우스 (봄 시즌)",
    bizType: "accommodation",
    location: "제주시 구좌읍 월정리",
    discount: "2박 이상 10% 추가 할인",
    categories: ["stay", "family"],
    validUntil: "2026-05-31",
    plan: "basic",
    active: false,
    impressions: 340,
    codeCopies: 8,
  },
];

const BUSINESS_TYPES = [
  { id: "accommodation", label: "숙박", emoji: "🏨" },
  { id: "restaurant",   label: "음식점", emoji: "🍽️" },
  { id: "cafe",         label: "카페",   emoji: "☕" },
  { id: "activity",     label: "체험",   emoji: "🏄" },
  { id: "transport",    label: "교통",   emoji: "🚗" },
  { id: "shop",         label: "쇼핑",   emoji: "🛍️" },
];

const CATEGORY_OPTIONS = [
  { id: "surfing", label: "서핑" }, { id: "hiking", label: "하이킹" },
  { id: "party",   label: "파티" }, { id: "food",   label: "맛집/카페" },
  { id: "stay",    label: "숙박" }, { id: "culture",label: "문화/예술" },
  { id: "family",  label: "가족" }, { id: "solo",   label: "솔로" },
];

const PLAN_COMPARE = {
  rows: [
    { label: "Basic 카드 노출",      free: true,  basic: true,  featured: true  },
    { label: "할인코드 발급",         free: false, basic: true,  featured: true  },
    { label: "월간 통계 리포트",      free: false, basic: true,  featured: true  },
    { label: "카테고리 우선 노출",    free: false, basic: true,  featured: true  },
    { label: "Featured 강조 카드",   free: false, basic: false, featured: true  },
    { label: "상세 ROI 분석",        free: false, basic: false, featured: true  },
    { label: "이미지/배지 슬롯",     free: false, basic: false, featured: true  },
    { label: "CS 전담 응대",         free: false, basic: false, featured: true  },
  ],
  plans: [
    { id: "free",     name: "프리",   price: "무료",         color: "gray",  current: true  },
    { id: "basic",    name: "베이직", price: "30,000원/월",  color: "indigo", current: false },
    { id: "featured", name: "피처드", price: "100,000원/월", color: "amber",  current: false },
  ],
};

// ─── 서브 컴포넌트 ─────────────────────────────────────────────

function WeeklyChart() {
  const max = Math.max(...WEEKLY_IMPRESSIONS.map((d) => d.v));
  return (
    <div className="flex items-end gap-1.5 h-16">
      {WEEKLY_IMPRESSIONS.map((d) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${(d.v / max) * 52}px`,
              backgroundColor: d.day === "일" ? "#f59e0b" : "#e0e7ff",
            }}
          />
          <span className="text-[9px] text-gray-400">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ active, plan }: { active: boolean; plan: string }) {
  if (!active)
    return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-semibold rounded-full">일시정지</span>;
  if (plan === "featured")
    return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase">Featured</span>;
  if (plan === "basic")
    return <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-semibold rounded-full">Basic</span>;
  return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded-full">Free</span>;
}

function FeaturedPreviewCard({ bizName, bizType, location, discount }: { bizName: string; bizType: string; location: string; discount: string }) {
  const typeInfo = BUSINESS_TYPES.find((b) => b.id === bizType);
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center gap-1 mb-3">
        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">Featured</span>
        <span className="text-[10px] text-amber-700 font-medium">{typeInfo?.emoji} {typeInfo?.label}</span>
      </div>
      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{bizName || "업체명"}</h3>
      {location && <p className="text-xs text-gray-500 mb-3">📍 {location}</p>}
      <div className="bg-white rounded-xl px-4 py-3 border border-amber-200">
        <p className="text-xs text-amber-700 font-semibold">파티 참가자 특별 혜택</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">{discount || "할인 내용을 입력하세요"}</p>
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center">jeju-party 여행자에게 노출 중</p>
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-3">
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white text-xs">✕</button>
    </div>
  );
}

// ─── 메인 ──────────────────────────────────────────────────────
export default function PartnerPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>(INITIAL_OFFERS);
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    bizName: "", bizType: "accommodation", location: "",
    discount: "", categories: [] as string[], validUntil: "",
  });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const toggleCategory = (id: string) =>
    setForm((p) => ({ ...p, categories: p.categories.includes(id) ? p.categories.filter((c) => c !== id) : [...p.categories, id] }));

  const toggleOffer = (id: string) =>
    setOffers((prev) => prev.map((o) => o.id === id ? { ...o, active: !o.active } : o));

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    showToast("오퍼가 삭제되었습니다.");
  };

  const handleSubmit = () => {
    if (!form.bizName.trim()) { showToast("업체명을 입력해주세요."); return; }
    const newOffer: Offer = {
      id: `OFF-${Date.now()}`,
      ...form,
      plan: "free",
      active: true,
      impressions: 0,
      codeCopies: 0,
    };
    setOffers((prev) => [...prev, newOffer]);
    setForm({ bizName: "", bizType: "accommodation", location: "", discount: "", categories: [], validUntil: "" });
    setShowForm(false);
    showToast("오퍼가 등록되었습니다. 검토 후 24시간 내 게재 예정입니다.");
  };

  const pctChange = Math.round(((THIS_MONTH_IMPRESSIONS - PREV_MONTH_IMPRESSIONS) / PREV_MONTH_IMPRESSIONS) * 100);
  const activeOffers = offers.filter((o) => o.active);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 to-white">

      {/* ── 헤더 ──────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📣 파트너 광고 센터</h1>
              <p className="text-sm text-gray-500 mt-1">jeju-party 여행자에게 내 업체를 노출하세요</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">무료 · 프리</span>
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">💳 베이직 · 30,000원/월</span>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">⭐ 피처드 · 100,000원/월</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-12">

        {/* ── 1. 내 광고 현황 ──────────────────────────────── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-4">내 광고 현황 <span className="text-xs font-normal text-gray-400 ml-1">이번 달</span></h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* 노출수 — 차트 포함 */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-400">이번 달 노출수</p>
                  <p className="text-3xl font-bold text-gray-900 mt-0.5">{THIS_MONTH_IMPRESSIONS.toLocaleString()}회</p>
                  <p className={`text-xs font-medium mt-1 ${pctChange >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {pctChange >= 0 ? "▲" : "▼"} 전월 대비 {Math.abs(pctChange)}%
                  </p>
                </div>
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg bg-indigo-50 text-indigo-700">👁️</div>
              </div>
              <WeeklyChart />
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg bg-emerald-50 text-emerald-700 mb-3">📋</div>
              <p className="text-xs text-gray-400 mb-0.5">코드 복사수</p>
              <p className="text-2xl font-bold text-gray-900">43회</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">▲ 전월 대비 12%</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg bg-amber-50 text-amber-700 mb-3">📈</div>
              <p className="text-xs text-gray-400 mb-0.5">광고비 ROI</p>
              <p className="text-2xl font-bold text-gray-900">340%</p>
              <p className="text-xs text-gray-400 font-medium mt-1">예상 방문 전환 8명</p>
            </div>
          </div>
        </section>

        {/* ── 2. 오퍼 관리 ──────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">
              등록된 오퍼 관리
              <span className="ml-2 text-xs font-normal text-gray-400">{activeOffers.length}개 게재 중</span>
            </h2>
            <button
              onClick={() => { setShowForm(true); setEditingId(null); }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
              style={{ backgroundColor: "#f59e0b" }}
            >
              + 새 오퍼 등록
            </button>
          </div>

          {offers.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
              <p className="text-3xl mb-3">📋</p>
              <p className="font-semibold text-gray-700">등록된 오퍼가 없어요</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">첫 번째 오퍼를 등록하고 여행자에게 노출하세요</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-amber-500 hover:bg-amber-600 transition-colors"
              >
                오퍼 등록하기
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className={`bg-white rounded-2xl border p-5 transition-opacity ${offer.active ? "border-gray-100" : "border-gray-100 opacity-60"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <StatusBadge active={offer.active} plan={offer.plan} />
                        {offer.active && (
                          <span className="text-[10px] text-emerald-600 font-semibold">● 게재 중</span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {offer.bizName}
                        <span className="text-gray-400 font-normal"> — </span>
                        <span className="font-medium text-gray-700">{offer.discount}</span>
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>📅 {offer.validUntil}</span>
                        {offer.location && <span>📍 {offer.location}</span>}
                        <span>👁️ {offer.impressions.toLocaleString()}회 노출</span>
                        <span>📋 {offer.codeCopies}회 복사</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleOffer(offer.id)}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors border ${
                          offer.active
                            ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                            : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                        }`}
                      >
                        {offer.active ? "일시정지" : "재개"}
                      </button>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="px-3 py-2 bg-gray-50 text-gray-400 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-200"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 3. 이렇게 노출돼요 ──────────────────────────────── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">이렇게 노출돼요</h2>
          <p className="text-sm text-gray-400 mb-5">jeju-party 여행자가 실제로 보는 화면입니다</p>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* 파티 상세 — Featured */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">① 파티 상세 페이지 — Featured 카드</p>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
                {/* 파티 컨텍스트 */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">🏄</span>
                    <span className="text-xs font-bold text-gray-800">협재 해변 서핑 파티</span>
                    <span className="ml-auto text-[10px] text-gray-400">3/6명</span>
                  </div>
                  <p className="text-[10px] text-gray-400">5/11(일) · 한림읍</p>
                </div>
                {/* 혜택 섹션 */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-3">
                  <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded-full">FEATURED</span>
                  <h4 className="font-bold text-sm text-gray-900 mt-1.5">서퍼스 게스트하우스</h4>
                  <p className="text-[10px] text-gray-500 mb-2">📍 제주시 구좌읍 월정리</p>
                  <div className="bg-white rounded-lg px-3 py-2 border border-amber-200">
                    <p className="text-[9px] text-amber-700 font-semibold">파티 참가자 특별 혜택</p>
                    <p className="text-xs font-bold text-gray-900 mt-0.5">15% 할인 + 웰컴 드링크</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">SURFER15</span>
                    <button className="text-[9px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">복사</button>
                  </div>
                </div>
              </div>
            </div>

            {/* 메인 피드 — Basic 배너 */}
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">② 메인 피드 — 파트너 혜택 배너</p>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
                {/* 파티 카드 */}
                <div className="bg-white rounded-xl border border-gray-100 p-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🥾</span>
                    <span className="text-xs font-bold text-gray-800">성산 일출봉 트레킹 파티</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">5/10(토) · 성산읍 · 4/8명</p>
                </div>
                {/* 파트너 배너 */}
                <div className="bg-white rounded-xl border border-orange-100 p-3">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs">🤝</span>
                    <span className="text-[10px] font-bold text-gray-700">파트너 혜택</span>
                    <span className="ml-auto text-[9px] text-gray-400">광고</span>
                  </div>
                  <div className="flex gap-2 overflow-hidden">
                    {[
                      { name: "서퍼스 게스트하우스", discount: "15% 할인", emoji: "🏨" },
                      { name: "성산 장비 렌탈",      discount: "10% 할인", emoji: "🏕️" },
                    ].map((b) => (
                      <div key={b.name} className="min-w-[110px] bg-gray-50 rounded-lg border border-gray-100 p-2 flex-shrink-0">
                        <span className="text-base">{b.emoji}</span>
                        <p className="text-[10px] font-semibold text-gray-800 mt-1 leading-tight">{b.name}</p>
                        <p className="text-[9px] text-orange-600 font-bold">{b.discount}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 참여 완료 모달 */}
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-gray-600 mb-2">③ 파티 참여 완료 모달 — 혜택 강조 노출</p>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 max-w-sm mx-auto">
                <div className="text-center mb-3">
                  <p className="text-2xl mb-1">🎉</p>
                  <p className="text-sm font-bold text-gray-900">참여 완료!</p>
                  <p className="text-[10px] text-gray-400">결제가 완료되었습니다</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3">
                  <p className="text-[10px] font-bold text-orange-700 mb-2">🎁 이 혜택도 챙겨가세요</p>
                  <div className="bg-white rounded-lg p-2.5 border border-amber-200">
                    <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">FEATURED</span>
                    <p className="text-xs font-bold text-gray-900 mt-1.5">서퍼스 게스트하우스</p>
                    <p className="text-[10px] text-orange-700 font-semibold">파티 참가자 15% 할인</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. 요금제 비교표 ──────────────────────────────── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-4">요금제 비교</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 w-1/2">기능</th>
                  {PLAN_COMPARE.plans.map((plan) => {
                    const colorMap: Record<string, string> = {
                      gray: "text-gray-700", indigo: "text-indigo-700", amber: "text-amber-700",
                    };
                    const bgMap: Record<string, string> = {
                      gray: "bg-gray-50", indigo: "bg-indigo-50", amber: "bg-amber-50",
                    };
                    return (
                      <th key={plan.id} className={`text-center px-3 py-4 ${bgMap[plan.color]}`}>
                        <div className={`text-xs font-bold ${colorMap[plan.color]}`}>{plan.name}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5 font-normal">{plan.price}</div>
                        {plan.current && (
                          <span className="inline-block mt-1 text-[9px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full">현재</span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {PLAN_COMPARE.rows.map((row, i) => (
                  <tr key={row.label} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="px-5 py-3 text-xs text-gray-700">{row.label}</td>
                    {(["free", "basic", "featured"] as const).map((planId) => {
                      const val = row[planId];
                      const bgMap: Record<string, string> = { free: "", indigo: "bg-indigo-50/50", amber: "bg-amber-50/50" };
                      const plan = PLAN_COMPARE.plans.find((p) => p.id === planId)!;
                      return (
                        <td key={planId} className={`text-center px-3 py-3 ${bgMap[plan.color] || ""}`}>
                          {val
                            ? <span className="text-emerald-500 font-bold text-base">✓</span>
                            : <span className="text-gray-200 text-base">—</span>
                          }
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="px-5 py-4" />
                  {PLAN_COMPARE.plans.map((plan) => {
                    const btnMap: Record<string, string> = {
                      gray:   "bg-gray-100 text-gray-600 hover:bg-gray-200",
                      indigo: "bg-indigo-600 text-white hover:bg-indigo-700",
                      amber:  "bg-amber-500 text-white hover:bg-amber-600",
                    };
                    return (
                      <td key={plan.id} className="text-center px-3 py-4">
                        <button
                          onClick={() => !plan.current && showToast("준비 중입니다.")}
                          disabled={plan.current}
                          className={`w-full py-2 rounded-xl text-xs font-semibold transition-colors ${btnMap[plan.color]} disabled:opacity-60 disabled:cursor-default`}
                        >
                          {plan.current ? "현재 플랜" : "업그레이드"}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">데모 데이터로 표시 중 · 실제 결제 시스템은 준비 중입니다</p>
        </section>

      </main>

      {/* ── 새 오퍼 등록 슬라이드업 ──────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-40 bg-black/50 flex items-end sm:items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-base">새 오퍼 등록</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">업체명 *</label>
                <input value={form.bizName} onChange={(e) => setForm({ ...form, bizName: e.target.value })}
                  placeholder="예: 서퍼스 게스트하우스"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">위치</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="예: 제주시 구좌읍 월정리"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">업종</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {BUSINESS_TYPES.map((bt) => (
                  <button key={bt.id} type="button" onClick={() => setForm({ ...form, bizType: bt.id })}
                    className={`p-3 rounded-xl text-center transition-all border-2 ${form.bizType === bt.id ? "border-amber-500 bg-amber-50" : "border-transparent bg-gray-50 hover:bg-gray-100"}`}>
                    <div className="text-xl">{bt.emoji}</div>
                    <div className="text-[10px] font-medium text-gray-700 mt-1">{bt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">할인 내용 *</label>
              <input value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })}
                placeholder="예: 파티 참가자 15% 할인 + 웰컴 드링크"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 매칭 <span className="text-xs text-gray-400 font-normal">(복수 선택)</span></label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => (
                  <button key={cat.id} type="button" onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${form.categories.includes(cat.id) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">유효기간</label>
              <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 outline-none" />
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => setShowPreview(true)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                미리보기
              </button>
              <button type="button" onClick={handleSubmit}
                className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm">
                등록 신청
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 미리보기 모달 ─────────────────────────────────── */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPreview(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Featured 카드 미리보기</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <FeaturedPreviewCard bizName={form.bizName} bizType={form.bizType} location={form.location} discount={form.discount} />
            <p className="text-[10px] text-gray-400 text-center mt-4">피처드 플랜 기준 노출 형태입니다</p>
            <button onClick={() => setShowPreview(false)}
              className="mt-3 w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              닫기
            </button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
