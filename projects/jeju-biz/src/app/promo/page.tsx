"use client";

import { useState } from "react";

interface ShopInfo {
  name: string;
  category: string;
  description: string;
  phone: string;
  address: string;
  hours: string;
  menus: { name: string; price: string; popular?: boolean }[];
  photos: string[];
}

const CATEGORY_OPTIONS = [
  { id: "restaurant", label: "음식점", emoji: "🍽️" },
  { id: "cafe", label: "카페", emoji: "☕" },
  { id: "activity", label: "체험/액티비티", emoji: "🏄" },
  { id: "accommodation", label: "숙박", emoji: "🏨" },
  { id: "shop", label: "기념품/쇼핑", emoji: "🛍️" },
  { id: "other", label: "기타", emoji: "📍" },
];

const SAMPLE_MENUS = [
  { name: "", price: "", popular: false },
];

export default function PromoPage() {
  const [step, setStep] = useState<"list" | "create" | "preview" | "done">("list");
  const [shop, setShop] = useState<ShopInfo>({
    name: "", category: "restaurant", description: "",
    phone: "", address: "", hours: "09:00 - 21:00",
    menus: [...SAMPLE_MENUS], photos: [],
  });
  const [savedShops, setSavedShops] = useState<ShopInfo[]>([
    {
      name: "흑돼지 본가",
      category: "restaurant",
      description: "30년 전통 제주 흑돼지 전문점. 숯불 직화로 구워 육즙이 살아있습니다.",
      phone: "064-722-1234",
      address: "제주시 탑동로 12-3",
      hours: "11:00 - 22:00 (매주 화요일 휴무)",
      menus: [
        { name: "흑돼지 목살 200g", price: "18,000원", popular: true },
        { name: "흑돼지 삼겹살 200g", price: "16,000원" },
        { name: "모둠 구이 (2인)", price: "42,000원", popular: true },
        { name: "멜젓 찌개", price: "8,000원" },
      ],
      photos: ["meat1", "meat2"],
    },
    {
      name: "해녀카페 우도점",
      category: "cafe",
      description: "우도 바다가 한눈에 보이는 오션뷰 카페. 제주 당근 라떼가 인기!",
      phone: "064-784-5678",
      address: "제주시 우도면 해안길 45",
      hours: "10:00 - 18:00",
      menus: [
        { name: "당근 라떼", price: "6,500원", popular: true },
        { name: "한라봉 에이드", price: "7,000원", popular: true },
        { name: "아메리카노", price: "5,000원" },
      ],
      photos: ["cafe1"],
    },
  ]);

  const addMenu = () => {
    setShop({ ...shop, menus: [...shop.menus, { name: "", price: "", popular: false }] });
  };

  const updateMenu = (idx: number, field: string, value: string | boolean) => {
    const updated = [...shop.menus];
    (updated[idx] as any)[field] = value;
    setShop({ ...shop, menus: updated });
  };

  const removeMenu = (idx: number) => {
    setShop({ ...shop, menus: shop.menus.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    if (!shop.name.trim()) return;
    setSavedShops([shop, ...savedShops]);
    setStep("done");
  };

  const catInfo = (id: string) => CATEGORY_OPTIONS.find((c) => c.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="bg-white/80 backdrop-blur border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🏪 홍보 페이지 관리</h1>
              <p className="text-sm text-gray-500 mt-0.5">무료 가게 홍보 페이지를 만들고 관리하세요</p>
            </div>
            {step === "list" && (
              <button
                onClick={() => setStep("create")}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                + 새 홍보 페이지
              </button>
            )}
            {step !== "list" && step !== "done" && (
              <button
                onClick={() => setStep("list")}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                목록으로
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {step === "list" && (
          <div className="space-y-4">
            {savedShops.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🏪</p>
                <p className="text-gray-500">등록된 홍보 페이지가 없습니다</p>
                <button
                  onClick={() => setStep("create")}
                  className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600"
                >
                  첫 홍보 페이지 만들기
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500">{savedShops.length}개 홍보 페이지</p>
                {savedShops.map((s, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setShop(s);
                      setStep("preview");
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{catInfo(s.category)?.emoji}</span>
                      <div>
                        <h3 className="font-bold text-gray-900">{s.name}</h3>
                        <p className="text-xs text-gray-400">{catInfo(s.category)?.label} · {s.address}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">공개중</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{s.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex gap-2">
                        <span className="text-[10px] text-gray-400">메뉴 {s.menus.length}개</span>
                        <span className="text-[10px] text-gray-400">· {s.hours}</span>
                      </div>
                      <a
                        href="http://localhost:3001/register"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                      >
                        ⭐ 제주패스 정식등록 →
                      </a>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {step === "create" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-5">
              <h2 className="font-bold text-gray-900">기본 정보</h2>

              {/* 가게명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">가게명 *</label>
                <input
                  value={shop.name}
                  onChange={(e) => setShop({ ...shop, name: e.target.value })}
                  placeholder="예: 흑돼지 본가"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">업종</label>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setShop({ ...shop, category: cat.id })}
                      className={`p-3 rounded-xl text-center transition-all border-2 ${
                        shop.category === cat.id
                          ? "border-amber-500 bg-amber-50"
                          : "border-transparent bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-xl">{cat.emoji}</div>
                      <div className="text-xs font-medium text-gray-700 mt-1">{cat.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 소개 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">가게 소개</label>
                <textarea
                  value={shop.description}
                  onChange={(e) => setShop({ ...shop, description: e.target.value })}
                  placeholder="간단한 가게 소개를 작성해주세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none resize-none"
                />
              </div>

              {/* 연락처/주소/영업시간 */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                  <input
                    value={shop.phone}
                    onChange={(e) => setShop({ ...shop, phone: e.target.value })}
                    placeholder="064-000-0000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">영업시간</label>
                  <input
                    value={shop.hours}
                    onChange={(e) => setShop({ ...shop, hours: e.target.value })}
                    placeholder="09:00 - 21:00"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                <input
                  value={shop.address}
                  onChange={(e) => setShop({ ...shop, address: e.target.value })}
                  placeholder="제주시 000로 00-0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-amber-400 outline-none"
                />
              </div>
            </div>

            {/* 메뉴 */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">메뉴/서비스</h2>
                <button onClick={addMenu} className="text-sm text-amber-600 hover:text-amber-700 font-medium">+ 추가</button>
              </div>
              <div className="space-y-3">
                {shop.menus.map((menu, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      value={menu.name}
                      onChange={(e) => updateMenu(i, "name", e.target.value)}
                      placeholder="메뉴명"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-400 outline-none"
                    />
                    <input
                      value={menu.price}
                      onChange={(e) => updateMenu(i, "price", e.target.value)}
                      placeholder="가격"
                      className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-400 outline-none"
                    />
                    <button
                      onClick={() => updateMenu(i, "popular", !menu.popular)}
                      className={`px-2 py-2 rounded-lg text-xs ${menu.popular ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`}
                      title="인기메뉴"
                    >
                      ⭐
                    </button>
                    {shop.menus.length > 1 && (
                      <button onClick={() => removeMenu(i)} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 저장 */}
            <button
              onClick={handleSave}
              disabled={!shop.name.trim()}
              className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-lg hover:bg-amber-600 disabled:opacity-50 transition-colors"
            >
              홍보 페이지 생성하기
            </button>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-6">
            {/* 미리보기 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* 헤더 */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{catInfo(shop.category)?.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{shop.name}</h2>
                    <p className="text-white/80 text-sm">{catInfo(shop.category)?.label}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* 소개 */}
                <p className="text-gray-700">{shop.description}</p>

                {/* 정보 */}
                <div className="space-y-2">
                  {shop.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">📍</span>
                      <span className="text-gray-700">{shop.address}</span>
                    </div>
                  )}
                  {shop.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400">📞</span>
                      <a href={`tel:${shop.phone}`} className="text-blue-600">{shop.phone}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">🕐</span>
                    <span className="text-gray-700">{shop.hours}</span>
                  </div>
                </div>

                {/* 메뉴 */}
                {shop.menus.filter((m) => m.name).length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">메뉴</h3>
                    <div className="space-y-2">
                      {shop.menus.filter((m) => m.name).map((m, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{m.name}</span>
                            {m.popular && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">인기</span>}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{m.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400 mb-3">이 홍보 페이지는 여행자 지도에 자동 노출됩니다</p>
              <button
                onClick={() => setStep("list")}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                목록으로 돌아가기
              </button>
            </div>

            {/* 업그레이드 CTA */}
            <div className="bg-white rounded-2xl border border-amber-100 p-5">
              <p className="text-sm font-bold text-gray-800 mb-1">더 많은 고객을 만나고 싶으신가요?</p>
              <p className="text-xs text-gray-500 mb-4">무료 홍보 페이지에서 제주패스 정식 등록으로 업그레이드하면 리뷰 관리, 카페패스 연동, 파티 경유지 노출이 가능합니다.</p>
              <div className="space-y-2">
                <a
                  href="http://localhost:3001/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-amber-500 hover:bg-amber-600 transition-colors text-white"
                >
                  <span className="text-xl">⭐</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold">제주패스 정식 가게 등록</p>
                    <p className="text-xs text-amber-100">리뷰·예약·SNS 관리 + 지도 노출</p>
                  </div>
                  <span className="text-xs font-bold shrink-0">무료 →</span>
                </a>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="http://localhost:3001/cafepass"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors"
                  >
                    <span className="text-lg">☕</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">카페패스</p>
                      <p className="text-[10px] text-gray-500 truncate">패스 고객 자동 유입</p>
                    </div>
                  </a>
                  <a
                    href="http://localhost:3010"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors"
                  >
                    <span className="text-lg">🎉</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-900">여행 파티</p>
                      <p className="text-[10px] text-gray-500 truncate">경유지로 가게 노출</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── 완료 스텝 ─── */}
        {step === "done" && (
          <div className="flex items-center justify-center py-8">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900">홍보 페이지 생성 완료!</h2>
              <p className="text-gray-500 mt-2 text-sm">
                <span className="font-semibold text-gray-800">{shop.name || savedShops[0]?.name}</span>의 홍보 페이지가
                여행자 지도에 자동으로 노출됩니다.
              </p>

              <div className="mt-6 space-y-3 text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide text-center mb-2">더 많은 고객을 만나려면</p>

                {/* 정식 등록 */}
                <a
                  href="http://localhost:3001/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 transition-colors"
                >
                  <span className="text-2xl">⭐</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">제주패스 정식 등록 (무료)</p>
                    <p className="text-xs text-gray-500 mt-0.5">리뷰 관리 · 사진 등록 · 예약 연동</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 shrink-0">등록 →</span>
                </a>

                {/* 카페패스 */}
                <a
                  href="http://localhost:3001/cafepass"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <span className="text-2xl">☕</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">카페패스에 가게 추가</p>
                    <p className="text-xs text-gray-500 mt-0.5">패스 구매자에게 자동 노출 · 결제 수수료 0%</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 shrink-0">신청 →</span>
                </a>

                {/* 렌터카 */}
                <a
                  href="http://localhost:3001/rentcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <span className="text-2xl">🚗</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">렌터카 고객 유입 연계</p>
                    <p className="text-xs text-gray-500 mt-0.5">제주패스 렌터카 예약자에게 가게 추천 노출</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 shrink-0">신청 →</span>
                </a>

                {/* 파티 */}
                <a
                  href="http://localhost:3010"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <span className="text-2xl">🎉</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">제주 파티 경유지로 등록</p>
                    <p className="text-xs text-gray-500 mt-0.5">여행 파티가 내 가게를 코스에 포함</p>
                  </div>
                  <span className="text-xs font-bold text-purple-600 shrink-0">보기 →</span>
                </a>
              </div>

              <button
                onClick={() => {
                  setShop({ name: "", category: "restaurant", description: "", phone: "", address: "", hours: "09:00 - 21:00", menus: [...SAMPLE_MENUS], photos: [] });
                  setStep("list");
                }}
                className="mt-6 w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                목록으로 돌아가기
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
