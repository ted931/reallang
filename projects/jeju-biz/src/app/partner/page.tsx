"use client";

import { useState } from "react";

// ─── 더미 데이터 ──────────────────────────────────────────────
const MOCK_STATS = {
  impressions: 1247,
  codeCopies: 43,
  estimatedVisits: 8,
  roi: 340,
};

const REGISTERED_OFFER = {
  id: "OFF-001",
  bizName: "서퍼스 게스트하우스",
  discount: "파티 참가자 15% 할인",
  status: "게재 중 (Featured)",
  validUntil: "2026-06-30",
  categories: ["숙박", "파티"],
  plan: "featured",
};

const BUSINESS_TYPES = [
  { id: "accommodation", label: "숙박", emoji: "🏨" },
  { id: "restaurant", label: "음식점", emoji: "🍽️" },
  { id: "cafe", label: "카페", emoji: "☕" },
  { id: "activity", label: "체험/액티비티", emoji: "🏄" },
  { id: "transport", label: "교통/렌터카", emoji: "🚗" },
  { id: "shop", label: "기념품/쇼핑", emoji: "🛍️" },
];

const CATEGORY_OPTIONS = [
  { id: "surfing", label: "서핑" },
  { id: "hiking", label: "하이킹/오름" },
  { id: "party", label: "파티/소셜" },
  { id: "food", label: "맛집/카페" },
  { id: "stay", label: "숙박" },
  { id: "culture", label: "문화/예술" },
  { id: "family", label: "가족여행" },
  { id: "solo", label: "솔로여행" },
];

const PLANS = [
  {
    id: "free",
    name: "프리",
    price: "무료",
    color: "gray",
    features: [
      "Basic 카드 노출",
      "업체명·할인 내용 표시",
      "월 통계 미제공",
    ],
    highlight: false,
  },
  {
    id: "basic",
    name: "베이직",
    price: "월 30,000원",
    color: "indigo",
    features: [
      "Basic 카드 노출",
      "할인코드 발급",
      "월간 통계 리포트",
      "카테고리 우선 노출",
    ],
    highlight: false,
  },
  {
    id: "featured",
    name: "피처드",
    price: "월 100,000원",
    color: "amber",
    features: [
      "Featured 카드 강조 노출",
      "상세 리포트 + ROI 분석",
      "배지·이미지 슬롯 제공",
      "CS 전담 응대",
    ],
    highlight: true,
  },
];

// ─── 서브 컴포넌트: FeaturedPartnerCard 미리보기 ──────────────
function FeaturedPreviewCard({
  bizName,
  bizType,
  location,
  discount,
}: {
  bizName: string;
  bizType: string;
  location: string;
  discount: string;
}) {
  const typeInfo = BUSINESS_TYPES.find((b) => b.id === bizType);
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5 shadow-lg max-w-sm mx-auto">
      <div className="flex items-center gap-1 mb-3">
        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wide">
          Featured
        </span>
        <span className="text-[10px] text-amber-700 font-medium">{typeInfo?.emoji} {typeInfo?.label}</span>
      </div>
      <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">
        {bizName || "업체명"}
      </h3>
      {location && (
        <p className="text-xs text-gray-500 mb-3">📍 {location}</p>
      )}
      <div className="bg-white rounded-xl px-4 py-3 border border-amber-200">
        <p className="text-xs text-amber-700 font-semibold">파티 참가자 특별 혜택</p>
        <p className="text-sm font-bold text-gray-900 mt-0.5">{discount || "할인 내용을 입력하세요"}</p>
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-center">jeju-party 여행자에게 노출 중</p>
    </div>
  );
}

// ─── 토스트 ──────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-3 animate-fade-in">
      <span>{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white text-xs">✕</button>
    </div>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────
export default function PartnerPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 폼 상태
  const [form, setForm] = useState({
    bizName: "",
    bizType: "accommodation",
    location: "",
    discount: "",
    categories: [] as string[],
    validUntil: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  const handleSubmit = () => {
    if (!form.bizName.trim()) {
      showToast("업체명을 입력해주세요.");
      return;
    }
    setSubmitted(true);
  };

  const statCards = [
    { label: "이번 달 노출수", value: MOCK_STATS.impressions.toLocaleString() + "회", icon: "👁️", color: "bg-indigo-50 text-indigo-700" },
    { label: "코드 복사수", value: MOCK_STATS.codeCopies + "회", icon: "📋", color: "bg-emerald-50 text-emerald-700" },
    { label: "예상 방문 전환", value: MOCK_STATS.estimatedVisits + "명", icon: "🚶", color: "bg-purple-50 text-purple-700" },
    { label: "광고비 ROI", value: MOCK_STATS.roi + "%", icon: "📈", color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 to-white">
      {/* ── 섹션 1: 헤더 ─────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📣 파트너 광고 센터</h1>
              <p className="text-sm text-gray-500 mt-1">jeju-party 여행자에게 내 업체를 노출하세요</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                무료 · 프리
              </span>
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                💳 베이직 · 30,000원/월
              </span>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                ⭐ 피처드 · 100,000원/월
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-10">

        {/* ── 섹션 2: 내 광고 현황 ─────────────────────── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-4">내 광고 현황 <span className="text-xs font-normal text-gray-400 ml-1">이번 달</span></h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card) => (
              <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-lg ${card.color} mb-3`}>
                  {card.icon}
                </div>
                <p className="text-xs text-gray-400 mb-0.5">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 섹션 3: 등록된 오퍼 관리 ─────────────────── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-4">등록된 오퍼 관리</h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase">Featured</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">● {REGISTERED_OFFER.status}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {REGISTERED_OFFER.bizName}
                    <span className="text-gray-400 font-normal"> — </span>
                    {REGISTERED_OFFER.discount}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span>📅 유효기간: {REGISTERED_OFFER.validUntil}</span>
                    <span>🏷️ 매칭 카테고리: {REGISTERED_OFFER.categories.join(", ")}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => showToast("준비 중입니다.")}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => showToast("준비 중입니다.")}
                    className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors border border-orange-200"
                  >
                    일시정지
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 섹션 4: 새 오퍼 등록 폼 ──────────────────── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-4">새 오퍼 등록</h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
              <p className="text-3xl mb-3">✅</p>
              <p className="font-bold text-emerald-800 text-base">등록 신청이 완료되었습니다!</p>
              <p className="text-sm text-emerald-700 mt-1">검토 후 24시간 내 게재 예정입니다</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ bizName: "", bizType: "accommodation", location: "", discount: "", categories: [], validUntil: "" }); }}
                className="mt-5 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                새 오퍼 등록하기
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              {/* 업체명 + 위치 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="bizName">업체명 *</label>
                  <input
                    id="bizName"
                    value={form.bizName}
                    onChange={(e) => setForm({ ...form, bizName: e.target.value })}
                    placeholder="예: 서퍼스 게스트하우스"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="location">위치</label>
                  <input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="예: 제주시 구좌읍 월정리"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                  />
                </div>
              </div>

              {/* 업종 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">업종</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {BUSINESS_TYPES.map((bt) => (
                    <button
                      key={bt.id}
                      type="button"
                      onClick={() => setForm({ ...form, bizType: bt.id })}
                      className={`p-3 rounded-xl text-center transition-all border-2 ${
                        form.bizType === bt.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-transparent bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-xl">{bt.emoji}</div>
                      <div className="text-[10px] font-medium text-gray-700 mt-1">{bt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 할인 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="discount">할인 내용 *</label>
                <input
                  id="discount"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  placeholder="예: 파티 참가자 15% 할인 + 웰컴 드링크"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                />
              </div>

              {/* 카테고리 매칭 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 매칭 <span className="text-xs text-gray-400 font-normal">(복수 선택)</span></label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                        form.categories.includes(cat.id)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 유효기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5" htmlFor="validUntil">유효기간</label>
                <input
                  id="validUntil"
                  type="date"
                  value={form.validUntil}
                  onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 outline-none"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200"
                >
                  미리보기
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors shadow-sm"
                >
                  등록 신청
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── 섹션 5: 요금제 안내 ──────────────────────── */}
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-4">요금제 안내</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const colorMap: Record<string, { header: string; badge: string; btn: string; border: string }> = {
                gray:   { header: "bg-gray-50",   badge: "bg-gray-200 text-gray-600",    btn: "bg-gray-800 text-white hover:bg-gray-700",      border: "border-gray-100" },
                indigo: { header: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700", btn: "bg-indigo-600 text-white hover:bg-indigo-700",  border: "border-indigo-100" },
                amber:  { header: "bg-amber-50",  badge: "bg-amber-100 text-amber-700",   btn: "bg-amber-500 text-white hover:bg-amber-600",    border: "border-amber-200" },
              };
              const c = colorMap[plan.color];
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-2xl border-2 ${plan.highlight ? "border-amber-300 shadow-md" : c.border} overflow-hidden flex flex-col`}
                >
                  {plan.highlight && (
                    <div className="bg-amber-500 text-white text-center text-[10px] font-bold py-1 tracking-widest uppercase">
                      추천
                    </div>
                  )}
                  <div className={`${c.header} px-5 py-5`}>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${c.badge} mb-2`}>{plan.name}</span>
                    <p className="text-xl font-bold text-gray-900">{plan.price}</p>
                  </div>
                  <div className="px-5 py-5 flex-1">
                    <ul className="space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="px-5 pb-5">
                    <button
                      onClick={() => showToast("준비 중입니다.")}
                      className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${c.btn}`}
                    >
                      {plan.id === "free" ? "현재 플랜" : "신청하기"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">데모 데이터로 표시 중 · 실제 결제 시스템은 준비 중입니다</p>
        </section>
      </main>

      {/* ── 미리보기 모달 ─────────────────────────────── */}
      {showPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="오퍼 미리보기"
          className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowPreview(false); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Featured 카드 미리보기</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
            </div>
            <FeaturedPreviewCard
              bizName={form.bizName}
              bizType={form.bizType}
              location={form.location}
              discount={form.discount}
            />
            <p className="text-[10px] text-gray-400 text-center mt-4">피처드 플랜 기준 노출 형태입니다</p>
            <button
              onClick={() => setShowPreview(false)}
              className="mt-3 w-full py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* ── 토스트 ────────────────────────────────────── */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
