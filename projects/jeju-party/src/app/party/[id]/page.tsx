"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HOBBY_CATEGORIES } from "@/lib/types";
import { DUMMY_PARTIES } from "@/lib/dummy-parties";
import { CAFE_PASSES, CAFE_TOURS } from "@/lib/dummy-cafe-tours";
import { CARS } from "@/lib/car-data";
import PhoneVerify, { usePhoneVerified } from "@/components/phone-verify";
import { PARTNER_OFFERS } from "@/lib/dummy-partners";
import { FeaturedPartnerCard, BasicPartnerCard } from "@/components/partner-offer-card";

function getInitParam(key: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

export default function PartyDetailPage() {
  const params = useParams();
  const party = DUMMY_PARTIES.find((p) => p.id === params.id);

  // DevNav: URL 파라미터로 모달/스텝 상태 제어
  const qModal = getInitParam("modal");
  const qStep = getInitParam("step");

  const initJoinModal = qModal === "join";
  const initPassModal = qModal === "pass";
  const initPaymentStep = (qStep as "info" | "paying" | "done" | "pass-offer") || "info";
  const initPassStep = (qStep as "select" | "paying" | "done") || "select";
  const initJoined = qStep === "done" || qStep === "pass-offer";

  const [joined, setJoined] = useState(initJoined);
  const [showJoinModal, setShowJoinModal] = useState(initJoinModal);
  const [paymentStep, setPaymentStep] = useState<"info" | "paying" | "done" | "pass-offer">(initJoinModal ? initPaymentStep : "info");
  const [payerName, setPayerName] = useState(qModal ? "테스터" : "");
  const [payerPhone, setPayerPhone] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [selectedPass, setSelectedPass] = useState<string>("pass-3d");
  const [showPassModal, setShowPassModal] = useState(initPassModal);
  const [passStep, setPassStep] = useState<"select" | "paying" | "done">(initPassModal ? initPassStep : "select");
  const [passProcessing, setPassProcessing] = useState(false);
  const [purchasedPass, setPurchasedPass] = useState<string | null>(null);
  const [showPhoneVerify, setShowPhoneVerify] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [showHostMenu, setShowHostMenu] = useState(false);
  const [joinWithCar, setJoinWithCar] = useState(true);
  const [commercialSeats, setCommercialSeats] = useState(1);
  const [stopShops, setStopShops] = useState<{ id: string; name: string; slug: string; category: string; address: string; description?: string; photos?: { url: string; isPrimary?: boolean }[] }[]>([]);
  const phoneVerified = usePhoneVerified();

  useEffect(() => {
    if (!party?.stopSlugs?.length) return;
    fetch("http://localhost:3001/api/shops")
      .then((r) => r.json())
      .then((data) => {
        const slugSet = new Set(party.stopSlugs);
        const shops = (data.shops || [])
          .filter((s: any) => s.isPublished && slugSet.has(s.slug));
        setStopShops(shops);
      })
      .catch(() => {});
  }, [party?.id]);

  if (!party) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-5xl mb-4">🤷</p>
          <p className="text-gray-500 font-medium">파티를 찾을 수 없어요</p>
          <a href={process.env.NEXT_PUBLIC_BASE_PATH || "/"} className="text-orange-500 text-sm mt-3 inline-block hover:underline">
            ← 파티 목록으로
          </a>
        </div>
      </div>
    );
  }

  const cat = HOBBY_CATEGORIES.find((c) => c.id === party.category);
  const spotsLeft = party.maxMembers - party.currentMembers;
  const cafeTour = party.cafeTourId ? CAFE_TOURS.find((t) => t.id === party.cafeTourId) : null;
  const currentPass = CAFE_PASSES.find((p) => p.id === selectedPass);
  const rentalCar = party.rentalCarId ? CARS.find((c) => c.id === party.rentalCarId) : null;
  const rentalSeatsLeft = rentalCar ? rentalCar.seats - (party.rentalCarConfirmed || 0) : 0;

  const cafeCount = cafeTour?.cafes.length || 0;
  const estimatedNormal = cafeCount * 5000;
  const savings = currentPass ? estimatedNormal - currentPass.price : 0;

  const formatDate = (d: string) => {
    const date = new Date(d);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}(${days[date.getDay()]})`;
  };

  const handlePassPurchase = async () => {
    if (!currentPass) return;
    setPassProcessing(true);
    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
      await fetch(`${basePath}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cafe-pass-purchase",
          passId: currentPass.id,
          passName: currentPass.name,
          amount: currentPass.price,
          userName: payerName || "게스트",
          partyId: party.id,
        }),
      });
      setPurchasedPass(currentPass.id);
      setPassStep("done");
    } catch {
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setPassProcessing(false);
    }
  };

  const isCommercial = party.partyType === "commercial";

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'Noto Sans KR', system-ui, sans-serif" }}>
      {/* ── 상단 네비 ── */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <a
            href={process.env.NEXT_PUBLIC_BASE_PATH || "/"}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            ←
          </a>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-slate-900 truncate">{party.title}</p>
            <p className="text-[10px] text-slate-400 font-mono">{cat?.emoji} {cat?.label}</p>
          </div>
          <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors text-lg">
            ⋯
          </button>
        </div>
      </header>

      {/* ── 히어로 영역 ── */}
      <div className="relative h-52 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200 flex items-center justify-center overflow-hidden">
        <span className="text-8xl opacity-20 select-none">{cat?.emoji}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* 카테고리 칩 */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
            isCommercial
              ? "bg-blue-600 text-white"
              : "bg-white/95 text-orange-700"
          }`}>
            {cat?.emoji} {cat?.label}
            {isCommercial && <span className="ml-1 opacity-80">· 사업자</span>}
          </span>
        </div>
        {/* 잔여 자리 칩 */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
            spotsLeft <= 1 ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
          }`}>
            {spotsLeft}자리 남음
          </span>
        </div>
        {/* 카페패스 뱃지 */}
        {party.cafePassEnabled && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/90 text-white text-[10px] font-bold backdrop-blur-sm">
              ☕ 카페패스 파티
            </span>
          </div>
        )}
      </div>

      <main className="max-w-3xl mx-auto px-4 pb-32 space-y-4 pt-5">

        {/* ── 제목 + 태그 카드 ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          {/* 해시태그 */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {party.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-bold">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 leading-tight mb-1">{party.title}</h1>
          <p className="text-xs text-slate-400 mb-4">{cat?.label} · 참여비 {party.costType === "free" ? "무료" : party.costType === "split" ? `엔빵 ~₩${(party.costAmount || 0).toLocaleString()}/인` : `₩${(party.costAmount || 0).toLocaleString()}`}</p>

          {/* 기본 정보 그리드 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 font-mono mb-1">📅 일시</p>
              <p className="text-xs font-bold text-slate-900">{formatDate(party.date)}</p>
              <p className="text-xs text-slate-600 font-mono mt-0.5">{party.time}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-[10px] text-slate-400 font-mono mb-1">📍 장소</p>
              <p className="text-xs font-bold text-slate-900 truncate">{party.location}</p>
              <a
                href={`https://map.kakao.com/link/to/${encodeURIComponent(party.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-orange-600 font-mono mt-0.5 hover:underline block"
              >
                지도 보기 →
              </a>
            </div>
          </div>

          {/* 예약 현황 */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-slate-700">예약 현황</p>
              <span className={`text-[10px] font-bold ${spotsLeft <= 1 ? "text-red-500" : "text-emerald-600"}`}>
                {spotsLeft}자리 남음
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${(party.currentMembers / party.maxMembers) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">{party.currentMembers}명 참여 중 · 최대 {party.maxMembers}명</p>
          </div>
        </div>

        {/* ── 호스트 카드 ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-extrabold text-slate-900">파티장</h2>
            <div className="relative">
              <button
                onClick={() => setShowHostMenu(!showHostMenu)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                &#x22EF;
              </button>
              {showHostMenu && (
                <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-10 w-36">
                  <button
                    onClick={() => { setShowHostMenu(false); setShowReportModal(true); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    🚨 신고하기
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-xl font-bold text-white shrink-0">
              {party.hostName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="font-extrabold text-slate-900">{party.hostName}</p>
                <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-bold rounded-full">📱 인증</span>
                {party.hostPartyCount >= 10 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 bg-violet-100 text-violet-700 text-[9px] font-bold rounded-full">⭐ 슈퍼호스트</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">★ {party.hostRating} · 파티 {party.hostPartyCount}회 개최</p>
              {party.hostBio && (
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{party.hostBio}</p>
              )}
            </div>
          </div>
        </div>

        {/* ── 사업자 파티 예약 섹션 ── */}
        {isCommercial && (
          <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-bold rounded-xl">🏢 사업자 파티</span>
              {party.operatorVerified && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-200">✓ 인증업체</span>
              )}
            </div>
            {party.operatorName && (
              <p className="text-sm font-bold text-blue-700 mb-4">업체명: {party.operatorName}</p>
            )}

            <div className="flex items-center justify-between py-3 border-t border-b border-slate-100 mb-4">
              <div>
                <p className="text-[10px] text-slate-400 mb-0.5">1인 요금</p>
                <p className="text-2xl font-extrabold text-blue-600">₩{(party.pricePerSeat || 0).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 mb-0.5">잔여 자리</p>
                <p className="text-lg font-bold text-slate-900">
                  {party.maxMembers - (party.reservedSeats || 0)} / {party.maxMembers}
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {party.includedItems && party.includedItems.length > 0 && (
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 shrink-0">포함 사항</span>
                  <span className="text-slate-700">{party.includedItems.join(", ")}</span>
                </div>
              )}
              {party.excludedItems && party.excludedItems.length > 0 && (
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 shrink-0">불포함</span>
                  <span className="text-slate-500">{party.excludedItems.join(", ")}</span>
                </div>
              )}
              {party.refundPolicy && (
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 shrink-0">환불 정책</span>
                  <span className="text-slate-600">{party.refundPolicy}</span>
                </div>
              )}
              {party.minMembers && (
                <div className="flex gap-2 text-sm">
                  <span className="text-slate-400 shrink-0">최소 인원</span>
                  <span className="text-orange-600 font-medium">{party.minMembers}명 (미달 시 자동 취소)</span>
                </div>
              )}
            </div>

            {/* 인원 선택 */}
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-2 font-medium">인원 선택</p>
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: Math.min(4, party.maxMembers - (party.reservedSeats || 0)) }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setCommercialSeats(n)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      commercialSeats === n
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {n}명
                  </button>
                ))}
              </div>
            </div>

            {/* 금액 계산 */}
            <div className="bg-blue-50 rounded-2xl p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">선입금</span>
                <span className="font-medium text-slate-900">
                  ₩{Math.round((party.pricePerSeat || 0) * commercialSeats * (party.depositRate ?? 100) / 100).toLocaleString()}
                  {(party.depositRate ?? 100) < 100 ? ` (${party.depositRate}%)` : " (전액)"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">플랫폼 수수료</span>
                <span className="font-medium text-slate-500">
                  ₩{Math.round((party.pricePerSeat || 0) * commercialSeats * (party.platformFeeRate ?? 10) / 100).toLocaleString()}
                  {` (${party.platformFeeRate ?? 10}%)`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="text-sm font-bold text-slate-900">총 결제액</span>
                <span className="text-lg font-extrabold text-blue-600">
                  ₩{Math.round((party.pricePerSeat || 0) * commercialSeats * (1 + (party.platformFeeRate ?? 10) / 100) * (party.depositRate ?? 100) / 100).toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-blue-400 text-right">플랫폼 수수료 포함</p>
            </div>

            <button
              onClick={() => {
                if (!phoneVerified) {
                  setShowPhoneVerify(true);
                } else {
                  setShowJoinModal(true);
                }
              }}
              className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-extrabold text-sm hover:bg-blue-700 transition-colors shadow-sm"
            >
              지금 예약하기 — ₩{Math.round((party.pricePerSeat || 0) * commercialSeats * (1 + (party.platformFeeRate ?? 10) / 100) * (party.depositRate ?? 100) / 100).toLocaleString()}
            </button>
          </div>
        )}

        {/* ── 파티 소개 ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h2 className="font-extrabold text-slate-900 mb-3">📖 파티 소개</h2>
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{party.description}</p>
        </div>

        {/* ── 번들 코스 ── */}
        {party.bundleItems && party.bundleItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🎯</span>
              <h2 className="font-extrabold text-slate-900">번들 코스</h2>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded-full">
                {party.bundleItems.length}개 활동
              </span>
              <span className="ml-auto text-[10px] text-slate-400">
                총 ~{(party.bundleItems.reduce((s, i) => s + (i.cost || 0), 0)).toLocaleString()}원/인
              </span>
            </div>
            <div className="space-y-3">
              {party.bundleItems.map((item, idx) => {
                const bCat = HOBBY_CATEGORIES.find((c) => c.id === item.category);
                const linked = item.commercialPartyId ? DUMMY_PARTIES.find((p) => p.id === item.commercialPartyId) : null;
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-600">
                        {idx + 1}
                      </div>
                      {idx < party.bundleItems!.length - 1 && (
                        <div className="w-0.5 h-4 bg-purple-100 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-medium text-slate-400">{item.time}</span>
                        <span className="text-sm font-bold text-slate-900">{bCat?.emoji} {item.title}</span>
                        {item.cost !== undefined && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${item.cost === 0 ? "bg-emerald-100 text-emerald-600" : "bg-purple-50 text-purple-600"}`}>
                            {item.cost === 0 ? "무료" : `₩${item.cost.toLocaleString()}/인`}
                          </span>
                        )}
                      </div>
                      {item.location && (
                        <p className="text-[10px] text-slate-400 mt-0.5">📍 {item.location}</p>
                      )}
                      {item.note && (
                        <p className="text-[10px] text-slate-500 mt-0.5">{item.note}</p>
                      )}
                      {linked && (
                        <a
                          href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/party/${linked.id}`}
                          className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full font-medium hover:bg-blue-100 transition-colors"
                        >
                          🏢 {linked.operatorName} 예약 바로가기 →
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {party.rentalCoordEnabled && (
              <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-1">
                  <span>🚗</span>
                  <span className="text-sm font-bold text-blue-700">렌터카 같이 할 사람 구해요</span>
                  {party.rentalCoordSeats && (
                    <span className="ml-auto text-[10px] bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                      동승 {party.rentalCoordSeats}자리
                    </span>
                  )}
                </div>
                {party.rentalCoordNote && (
                  <p className="text-xs text-blue-600">{party.rentalCoordNote}</p>
                )}
                <button className="mt-2 w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors">
                  렌터카 같이 타기 신청
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 경유 가게 ── */}
        {party.stopSlugs && party.stopSlugs.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📍</span>
              <h2 className="font-extrabold text-slate-900">경유 가게</h2>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">
                {party.stopSlugs.length}곳
              </span>
              <a
                href="http://localhost:3005"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[10px] text-indigo-500 hover:underline font-medium"
              >
                지도에서 보기 →
              </a>
            </div>
            {stopShops.length > 0 ? (
              <div className="space-y-2.5">
                {stopShops.map((shop, idx) => {
                  const primaryPhoto = shop.photos?.find((p) => p.isPrimary) || shop.photos?.[0];
                  return (
                    <div key={shop.id} className="flex items-center gap-3 p-3 bg-orange-50/60 rounded-2xl border border-orange-100">
                      <span className="text-sm font-bold text-orange-400 w-5 shrink-0 tabular-nums">{idx + 1}</span>
                      {primaryPhoto ? (
                        <div
                          className="w-12 h-12 rounded-xl bg-cover bg-center bg-slate-100 shrink-0"
                          style={{ backgroundImage: `url(${primaryPhoto.url})` }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0">☕</div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-bold text-slate-900 truncate">{shop.name}</span>
                          <span className="shrink-0 text-[9px] px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full font-bold">⭐ 제주패스</span>
                        </div>
                        {shop.description && (
                          <p className="text-xs text-slate-500 truncate">{shop.description}</p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">📍 {shop.address}</p>
                      </div>
                      <a
                        href={`http://localhost:3001/shop/${shop.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-xl border border-orange-300 text-orange-500 hover:bg-orange-50 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        보기
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {party.stopSlugs.map((slug) => (
                  <span key={slug} className="text-xs px-3 py-1.5 bg-orange-50 text-orange-400 border border-orange-100 rounded-full">
                    {slug}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── 카페투어 코스 ── */}
        {cafeTour && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{cafeTour.image}</span>
                  <h2 className="font-extrabold text-slate-900">{cafeTour.title}</h2>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>⭐ {cafeTour.rating} ({cafeTour.reviewCount})</span>
                  <span>·</span>
                  <span>{cafeTour.totalTime}</span>
                  <span>·</span>
                  <span>{cafeTour.distance}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {cafeTour.cafes.map((cafe, idx) => (
                <div key={idx} className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-medium text-amber-700 whitespace-nowrap">
                    ☕ {cafe.name}
                  </span>
                  {idx < cafeTour.cafes.length - 1 && (
                    <span className="text-slate-300 text-[10px]">→</span>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-0">
              {cafeTour.cafes.map((cafe, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-amber-100 flex-shrink-0 mt-1" />
                    {idx < cafeTour.cafes.length - 1 && (
                      <div className="w-px flex-1 bg-amber-200 min-h-[48px]" />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{cafe.name}</span>
                      {party.cafePassEnabled && (
                        <span className="text-[10px] text-sky-500 font-medium">패스 사용</span>
                      )}
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2.5 mt-1.5">
                      <p className="text-xs text-slate-600 font-medium">{cafe.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">⏱ 약 {cafe.stayMin}분</span>
                        {cafe.note && <span className="text-[10px] text-slate-400">· {cafe.note}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {cafeTour.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── 일정 타임라인 ── */}
        {party.schedule && party.schedule.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="font-extrabold text-slate-900 mb-4">⏰ 진행 일정</h2>
            <div className="relative">
              {/* 세로 점선 */}
              <div className="absolute left-[42px] top-2 bottom-2 w-px border-l-2 border-dashed border-slate-200 pointer-events-none" />
              <div className="space-y-0">
                {party.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 py-2 relative">
                    <span className="w-12 shrink-0 text-xs font-bold text-slate-600 font-mono tabular-nums pt-0.5">{item.time}</span>
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 ring-4 ring-white relative z-10 shrink-0 ${
                      item.memo?.includes("패스 사용")
                        ? "bg-sky-400"
                        : "bg-orange-500"
                    }`} />
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-medium text-slate-800 leading-tight">{item.place}</p>
                      {item.memo && (
                        <p className={`text-[10px] mt-0.5 ${
                          item.memo.includes("패스 사용") ? "text-sky-500" : "text-slate-400"
                        }`}>{item.memo}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 카페패스 ── */}
        {party.cafePassEnabled && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">☕</span>
              <h2 className="font-extrabold text-slate-900">카페패스</h2>
              <span className="text-[10px] px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full font-medium">선택</span>
            </div>

            {party.cafePassNote && (
              <div className="flex items-start gap-2 mt-3 mb-4 p-3 bg-amber-50 rounded-2xl">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600 shrink-0 mt-0.5">
                  {party.hostName[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">{party.hostName} 파티장</p>
                  <p className="text-xs text-slate-500 mt-0.5">&quot;{party.cafePassNote}&quot;</p>
                </div>
              </div>
            )}

            {cafeCount > 0 && savings > 0 && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-2xl mb-4">
                <div className="text-xs text-emerald-700">
                  <span className="font-medium">카페 {cafeCount}곳</span> 개별 구매 시 ~{estimatedNormal.toLocaleString()}원
                </div>
                <div className="text-sm font-bold text-emerald-600">
                  {savings.toLocaleString()}원 절약
                </div>
              </div>
            )}

            {purchasedPass ? (
              <div className="p-4 bg-sky-50 rounded-2xl text-center">
                <p className="text-lg mb-1">🎉</p>
                <p className="text-sm font-bold text-sky-700">카페패스 구매 완료!</p>
                <p className="text-xs text-sky-500 mt-1">{CAFE_PASSES.find((p) => p.id === purchasedPass)?.name} · 바로 사용 가능</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 bg-sky-500 rounded-lg flex items-center justify-center text-white text-[10px] font-bold">∞</span>
                    <span className="text-sm font-bold text-slate-900">무제한 이용권</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 ml-7">이용권 기간 내에 <span className="text-sky-600 font-medium">3시간마다 기본 음료 1잔</span> 무제한 이용</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CAFE_PASSES.filter((p) => p.type === "unlimited").map((pass) => (
                      <button
                        key={pass.id}
                        onClick={() => setSelectedPass(pass.id)}
                        className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                          selectedPass === pass.id
                            ? "border-sky-500 bg-white shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedPass === pass.id ? "border-sky-500" : "border-slate-300"
                          }`}>
                            {selectedPass === pass.id && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{pass.name}</span>
                          {pass.popular && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-500 text-[10px] font-bold rounded">인기</span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-sky-600">{pass.price.toLocaleString()}원</p>
                          <p className="text-[11px] text-slate-400">{pass.duration}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 bg-amber-500 rounded-lg flex items-center justify-center text-white text-[10px]">☕</span>
                    <span className="text-sm font-bold text-slate-900">잔 이용권</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-3 ml-7"><span className="text-amber-600 font-medium">필요한 만큼만</span> 구매해서 30일 이내 이용</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CAFE_PASSES.filter((p) => p.type === "cup").map((pass) => (
                      <button
                        key={pass.id}
                        onClick={() => setSelectedPass(pass.id)}
                        className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                          selectedPass === pass.id
                            ? "border-amber-500 bg-white shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedPass === pass.id ? "border-amber-500" : "border-slate-300"
                          }`}>
                            {selectedPass === pass.id && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{pass.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-bold text-amber-600">{pass.price.toLocaleString()}원</p>
                          <p className="text-[11px] text-slate-400">1잔당 {pass.unitPrice?.toLocaleString()}원</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setShowPassModal(true); setPassStep("select"); }}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-2xl font-bold text-sm hover:from-sky-600 hover:to-sky-700 transition-all shadow-sm"
                >
                  {currentPass?.name} — {currentPass?.price.toLocaleString()}원 구매하기
                </button>
                <p className="text-[10px] text-slate-400 text-center mt-2">결제 후 즉시 사용 가능 · 제주 전역 50+ 제휴 카페</p>
              </>
            )}
          </div>
        )}

        {/* ── 렌터카 / 장비 ── */}
        {(party.hasRentalCar || party.equipmentNeeded) && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            {party.rentalCarMode === "rent-together" && rentalCar ? (
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-3">🚗 렌터카 (같이 빌려요)</h3>
                <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rentalCar.image}</span>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{rentalCar.name}</p>
                        <p className="text-[10px] text-slate-400">{rentalCar.seats}인승 · {rentalCar.trunkCapacity} · {rentalCar.fuelType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{rentalCar.pricePerDay.toLocaleString()}원/일</p>
                      <p className="text-base font-bold text-blue-600">엔빵 {(party.rentalCarPerPerson || 0).toLocaleString()}원/인</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-500 mr-1">좌석</span>
                    {Array.from({ length: rentalCar.seats }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < (party.rentalCarConfirmed || 0) ? "text-blue-500" : "text-slate-300"}`}>
                        {i < (party.rentalCarConfirmed || 0) ? "●" : "○"}
                      </span>
                    ))}
                    {rentalSeatsLeft > 0 && (
                      <span className="text-[10px] text-orange-600 font-bold ml-auto">자리가 {rentalSeatsLeft}석 남았어요</span>
                    )}
                  </div>
                  <div className="flex gap-4 text-xs text-slate-500">
                    {party.rentalCarPickup && <span>픽업: {party.rentalCarPickup}</span>}
                    {party.rentalCarReturn && party.rentalCarReturn !== party.rentalCarPickup && <span>반납: {party.rentalCarReturn}</span>}
                  </div>
                </div>
                <a
                  href="http://localhost:3001/rentcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-between w-full px-4 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
                >
                  <div>
                    <p className="text-sm font-bold">🚗 제주패스에서 렌터카 예약</p>
                    <p className="text-[11px] text-blue-200 mt-0.5">최저가 보장 · 전 차종 풀커버 보험 포함</p>
                  </div>
                  <span className="text-blue-200 text-lg">→</span>
                </a>
              </div>
            ) : party.hasRentalCar && (
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">🚗 렌터카 {party.rentalCarMode === "own-car" ? "(동승 가능)" : ""}</h3>
                <p className="text-sm text-slate-600">{party.carInfo || "있음 (동승 가능)"}</p>
              </div>
            )}
            {party.equipmentNeeded && (
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1">🎒 준비물</h3>
                <p className="text-sm text-slate-600">{party.equipmentNeeded}</p>
              </div>
            )}
          </div>
        )}

        {/* ── 파트너 업체 오퍼 ── */}
        {(() => {
          const categoryOffers = PARTNER_OFFERS.filter((o) =>
            o.targetCategories.includes(party.category)
          );
          const allOffers = PARTNER_OFFERS.filter((o) =>
            o.targetCategories.includes("all")
          );
          const combined =
            categoryOffers.length >= 2
              ? categoryOffers
              : [...categoryOffers, ...allOffers.filter(
                  (o) => !categoryOffers.some((c) => c.id === o.id)
                )].slice(0, 4);
          const relevantOffers = combined
            .sort(
              (a, b) =>
                (b.sponsorLevel === "featured" ? 1 : 0) -
                (a.sponsorLevel === "featured" ? 1 : 0)
            )
            .slice(0, 4);

          if (relevantOffers.length === 0) return null;

          const featuredOffers = relevantOffers.filter((o) => o.sponsorLevel === "featured");
          const basicOffers = relevantOffers.filter((o) => o.sponsorLevel === "basic");

          return (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤝</span>
                  <h2 className="font-extrabold text-slate-900">파티 참가자 혜택</h2>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">
                    {relevantOffers.length}개 혜택
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-5 ml-7">이 파티 참가자에게만 제공되는 특별 오퍼</p>

              {featuredOffers.map((offer) => (
                <div key={offer.id} className="mb-4">
                  <FeaturedPartnerCard offer={offer} />
                </div>
              ))}

              {basicOffers.length > 0 && (
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                  {basicOffers.map((offer) => (
                    <BasicPartnerCard key={offer.id} offer={offer} />
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* ── AI 렌터카 추천 CTA ── */}
        {(() => {
          const purposeMap: Record<string, string> = {
            cycling: "drive", hiking: "hiking", surfing: "activity",
            running: "activity", fishing: "activity", photo: "drive",
            cafe: "healing", cooking: "healing",
          };
          const mappedPurpose = purposeMap[party.category] || "healing";
          const carUrl = `http://localhost:3021?travelers=${party.maxMembers}&days=1&purpose=${mappedPurpose}&from=party&partyName=${encodeURIComponent(party.title)}`;
          return (
            <div className="bg-gradient-to-r from-slate-800 to-blue-900 rounded-2xl p-5 text-white shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">AI 렌터카 추천</p>
                  <p className="text-sm font-extrabold mb-1">직접 이동하시나요?</p>
                  <p className="text-xs text-blue-200 leading-relaxed">
                    파티 인원 <span className="text-white font-bold">{party.maxMembers}명</span> 기준으로 AI가 최적 차종을 바로 추천해드려요
                  </p>
                </div>
                <a
                  href={carUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center gap-1.5 bg-white text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  🚗 차종 추천
                </a>
              </div>
            </div>
          );
        })()}

        {/* ── 법적 고지 ── */}
        <div className="text-[10px] text-slate-400 bg-slate-50 rounded-2xl p-4 leading-relaxed border border-slate-100">
          <p className="font-medium text-slate-500 mb-2">📋 이용 안내</p>
          {party.stayMode === "stay" && (
            <p className="text-amber-600 font-medium mb-1">
              ⚠️ 이 파티는 개인 장기 체류자가 단기 동행을 구하는 소셜 모임입니다. 숙박 공간의 전대차·상업적 재임대는 법적으로 금지되어 있으며, 위반 시 모든 책임은 당사자에게 있습니다.
            </p>
          )}
          {isCommercial && (
            <p className="text-blue-600 font-medium mb-1">
              ℹ️ 사업자 파티입니다. 업체의 관광사업자 등록 여부 및 보험 가입 여부를 직접 확인하시기 바랍니다.
            </p>
          )}
          <p>jeju-party는 개인 간 모임 연결 플랫폼으로, 모임 내 발생하는 사고·분쟁·불이행에 대해 법적 책임을 지지 않습니다. 문제 발생 시 즉시 <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/cs`} className="underline">고객센터</a>에 신고해주세요.</p>
        </div>
      </main>

      {/* ── Sticky CTA 하단 패널 ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex gap-3 items-center">
          {joined ? (
            <div className="flex-1 py-3.5 bg-emerald-100 text-emerald-700 rounded-2xl text-center font-bold text-sm">
              ✓ 참여 완료! 파티장이 승인하면 알려드릴게요
            </div>
          ) : (
            <>
              <div className="shrink-0">
                <p className="text-[10px] text-slate-400 font-mono">
                  {isCommercial ? "1인 요금" : "참여비"}
                </p>
                <p className="text-base font-extrabold text-slate-900 tabular-nums">
                  {isCommercial
                    ? `₩${(party.pricePerSeat || 0).toLocaleString()}`
                    : party.costType === "free"
                    ? "무료"
                    : `₩${(party.costAmount || 0).toLocaleString()}`}
                </p>
              </div>
              <a
                href={`https://map.kakao.com/link/to/${encodeURIComponent(party.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 border border-slate-200 text-slate-700 rounded-2xl text-sm font-medium hover:bg-slate-50 transition-colors shrink-0"
              >
                길찾기
              </a>
              <button
                onClick={() => {
                  if (!phoneVerified) {
                    setShowPhoneVerify(true);
                  } else {
                    setShowJoinModal(true);
                  }
                }}
                className={`flex-1 py-3.5 text-white rounded-2xl font-extrabold text-sm transition-colors shadow-sm ${
                  isCommercial
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isCommercial
                  ? `예약하기 — ₩${Math.round((party.pricePerSeat || 0) * commercialSeats * (1 + (party.platformFeeRate ?? 10) / 100) * (party.depositRate ?? 100) / 100).toLocaleString()}`
                  : `참여 신청 (${spotsLeft}자리)`}
              </button>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════
          참여 + 결제 모달
      ══════════════════════════════ */}
      {showJoinModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => { if (paymentStep === "info") { setShowJoinModal(false); setPaymentStep("info"); } }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            {/* STEP 1: 정보 입력 */}
            {paymentStep === "info" && (
              <>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">
                  {isCommercial ? "사업자 파티 예약" : "참여 신청"}
                </h3>
                <p className="text-sm text-slate-500 mb-5">
                  {isCommercial
                    ? `${party.operatorName || party.hostName}의 &ldquo;${party.title}&rdquo; 예약`
                    : `${party.hostName}님의 &ldquo;${party.title}&rdquo; 파티에 참여하시겠어요?`}
                </p>

                <div className="space-y-3 mb-4">
                  <input
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="이름"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                  <input
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="연락처 (선택)"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                  />
                </div>

                {/* 렌터카 동승 옵션 */}
                {party.rentalCarMode === "rent-together" && rentalCar && rentalSeatsLeft > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-500 mb-2">렌터카 동승</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setJoinWithCar(true)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all ${
                          joinWithCar ? "border-blue-500 bg-blue-50" : "border-slate-200"
                        }`}
                      >
                        <span className="block text-base mb-0.5">🚗</span>
                        <span className="text-xs font-medium">같이 타요</span>
                        <span className="block text-[10px] text-blue-600 font-bold">+{(party.rentalCarPerPerson || 0).toLocaleString()}원</span>
                      </button>
                      <button
                        onClick={() => setJoinWithCar(false)}
                        className={`p-3 rounded-2xl border-2 text-center transition-all ${
                          !joinWithCar ? "border-slate-500 bg-slate-50" : "border-slate-200"
                        }`}
                      >
                        <span className="block text-base mb-0.5">🚶</span>
                        <span className="text-xs font-medium">각자 이동</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 금액 요약 */}
                {isCommercial && party.pricePerSeat ? (
                  <div className="p-3.5 bg-blue-50 rounded-2xl mb-4 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">1인 요금 × {commercialSeats}명</span>
                      <span className="text-sm font-bold text-blue-700">{(party.pricePerSeat * commercialSeats).toLocaleString()}원</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">플랫폼 수수료 ({party.platformFeeRate ?? 10}%)</span>
                      <span className="text-sm font-bold text-slate-500">
                        {Math.round(party.pricePerSeat * commercialSeats * (party.platformFeeRate ?? 10) / 100).toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1.5 border-t border-blue-200">
                      <span className="text-sm font-extrabold text-blue-800">결제 금액</span>
                      <span className="text-lg font-extrabold text-blue-700">
                        {Math.round(party.pricePerSeat * commercialSeats * (1 + (party.platformFeeRate ?? 10) / 100) * (party.depositRate ?? 100) / 100).toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-[10px] text-blue-500">플랫폼 수수료 포함</p>
                  </div>
                ) : party.costType !== "free" ? (
                  <div className="p-3.5 bg-orange-50 rounded-2xl mb-4 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">파티비</span>
                      <span className="text-sm font-bold text-orange-700">{(party.costAmount || 0).toLocaleString()}원</span>
                    </div>
                    {party.rentalCarMode === "rent-together" && joinWithCar && party.rentalCarPerPerson && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-600">렌터카 엔빵</span>
                        <span className="text-sm font-bold text-blue-600">{party.rentalCarPerPerson.toLocaleString()}원</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1.5 border-t border-orange-200">
                      <span className="text-sm font-extrabold text-orange-800">합계</span>
                      <span className="text-lg font-extrabold text-orange-700">
                        {((party.costAmount || 0) + (party.rentalCarMode === "rent-together" && joinWithCar ? (party.rentalCarPerPerson || 0) : 0)).toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-[10px] text-orange-500">
                      {party.costType === "split" ? "인당 예상 금액 (엔빵)" : "고정 참여비"}
                    </p>
                  </div>
                ) : null}

                {party.costType === "free" && (
                  <div className="p-3.5 bg-emerald-50 rounded-2xl mb-4">
                    {party.rentalCarMode === "rent-together" && joinWithCar && party.rentalCarPerPerson ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-sm text-emerald-700">
                          <span>파티비</span><span className="font-medium">무료</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-blue-600">
                          <span>렌터카 엔빵</span>
                          <span className="font-bold">{party.rentalCarPerPerson.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-emerald-200 text-sm font-bold text-emerald-700">
                          <span>합계</span><span>{party.rentalCarPerPerson.toLocaleString()}원</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-emerald-700">무료 파티입니다</span>
                    )}
                  </div>
                )}

                <label className="flex items-start gap-2 mb-5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-400"
                  />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/terms`} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">이용약관</a> 및{" "}
                    <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/privacy`} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">개인정보처리방침</a>에 동의합니다 (만 14세 이상)
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowJoinModal(false); setPaymentStep("info"); }}
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={async () => {
                      if (!payerName.trim()) return;
                      if (party.costType === "free") {
                        setJoined(true);
                        if (party.cafePassEnabled && !purchasedPass) {
                          setPaymentStep("pass-offer");
                        } else {
                          setPaymentStep("done");
                        }
                      } else {
                        setPaymentStep("paying");
                      }
                    }}
                    disabled={!payerName.trim() || !consentChecked}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-extrabold text-sm disabled:opacity-50 hover:bg-orange-600 transition-colors"
                  >
                    {party.costType === "free" ? "참여합니다!" : "결제하고 참여"}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: 결제 진행 */}
            {paymentStep === "paying" && (
              <>
                <h3 className="text-lg font-extrabold text-slate-900 mb-4">결제</h3>
                <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">파티</span>
                    <span className="font-medium text-slate-900 text-right max-w-[180px] truncate">{party.title}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">참여자</span>
                    <span className="font-medium text-slate-900">{payerName}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-900 font-bold">결제 금액</span>
                    <span className="text-lg font-extrabold text-orange-600">
                      {(party.costAmount || 0).toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-2xl mb-4 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">🛡️</span>
                    <span className="text-xs font-bold text-emerald-700">에스크로 안전결제</span>
                  </div>
                  <p className="text-[11px] text-emerald-600">결제 금액은 파티 완료 시까지 플랫폼에 안전하게 보관됩니다</p>
                  <p className="text-[10px] text-emerald-500">환불 규정: 48시간 전 전액 / 24시간 전 50% / 당일 불가</p>
                </div>

                <p className="text-xs text-slate-400 mb-5 text-center">결제 게이트웨이 연동 준비 중입니다. 현재는 모의 결제로 참여가 처리됩니다.</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentStep("info")}
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    뒤로
                  </button>
                  <button
                    onClick={async () => {
                      setPaymentProcessing(true);
                      try {
                        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
                        await fetch(`${basePath}/api/payments`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            action: "initialize",
                            partyId: party.id,
                            partyTitle: party.title,
                            amount: party.costAmount || 0,
                            userName: payerName,
                            phone: payerPhone,
                          }),
                        });
                        await fetch(`${basePath}/api/payments`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "confirm", orderId: `PARTY-${party.id.slice(0, 8)}-${Date.now()}` }),
                        });
                        setJoined(true);
                        if (party.cafePassEnabled && !purchasedPass) {
                          setPaymentStep("pass-offer");
                        } else {
                          setPaymentStep("done");
                        }
                      } catch {
                        alert("결제 처리 중 오류가 발생했습니다.");
                      } finally {
                        setPaymentProcessing(false);
                      }
                    }}
                    disabled={paymentProcessing}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-extrabold text-sm disabled:opacity-50 hover:bg-orange-600 transition-colors"
                  >
                    {paymentProcessing ? "처리 중..." : "결제 완료"}
                  </button>
                </div>
              </>
            )}

            {/* STEP: 카페패스 업셀 */}
            {paymentStep === "pass-offer" && (
              <>
                <div className="text-center mb-5">
                  <p className="text-3xl mb-2">☕</p>
                  <h3 className="text-lg font-extrabold text-slate-900">카페패스로 더 알뜰하게!</h3>
                  <p className="text-sm text-slate-500 mt-1">이 파티 경유 카페에서 무료로 음료를 즐겨요</p>
                </div>

                {stopShops.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
                    {stopShops.slice(0, 4).map((shop) => (
                      <div key={shop.id} className="flex-shrink-0 flex flex-col items-center gap-1 w-16">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-lg">☕</div>
                        <span className="text-[9px] text-slate-500 text-center leading-tight line-clamp-2">{shop.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {cafeCount > 0 && savings > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-2xl mb-4 text-center">
                    <p className="text-xs text-emerald-600">이 코스에서 카페패스로</p>
                    <p className="text-lg font-extrabold text-emerald-700">약 {savings.toLocaleString()}원 절약</p>
                  </div>
                )}

                <div className="space-y-2 mb-5">
                  {CAFE_PASSES.filter((p) => p.popular || p.id === "pass-3c").map((pass) => (
                    <button
                      key={pass.id}
                      onClick={() => setSelectedPass(pass.id)}
                      className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                        selectedPass === pass.id
                          ? "border-sky-500 bg-sky-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPass === pass.id ? "border-sky-500" : "border-slate-300"
                        }`}>
                          {selectedPass === pass.id && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                        </div>
                        <span className="text-sm font-medium text-slate-900">{pass.name}</span>
                        {pass.popular && <span className="px-1.5 py-0.5 bg-red-100 text-red-500 text-[10px] font-bold rounded">인기</span>}
                      </div>
                      <span className="text-sm font-bold text-sky-600">{pass.price.toLocaleString()}원</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentStep("done")}
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    괜찮아요
                  </button>
                  <button
                    onClick={() => {
                      setPaymentStep("done");
                      setShowPassModal(true);
                      setPassStep("paying");
                    }}
                    className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-extrabold text-sm hover:bg-sky-600 transition-colors"
                  >
                    패스 구매하기
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: 완료 */}
            {paymentStep === "done" && (
              <div className="text-center py-4">
                <p className="text-5xl mb-3">🎉</p>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  {isCommercial ? "예약 완료!" : "참여 완료!"}
                </h3>
                <p className="text-sm text-slate-500 mb-1">
                  {isCommercial
                    ? "예약 완료! 업체에서 확인 후 연락드립니다"
                    : `${party.hostName}님이 승인하면 카카오톡으로 알려드릴게요`}
                </p>
                {isCommercial && party.pricePerSeat ? (
                  <p className="text-xs text-blue-600 mb-4">
                    결제 {Math.round(party.pricePerSeat * commercialSeats * (1 + (party.platformFeeRate ?? 10) / 100) * (party.depositRate ?? 100) / 100).toLocaleString()}원 완료
                  </p>
                ) : party.costType !== "free" ? (
                  <p className="text-xs text-emerald-600 mb-4">결제 {(party.costAmount || 0).toLocaleString()}원 완료</p>
                ) : null}

                {/* Featured 파트너 오퍼 */}
                {(() => {
                  const featuredOffer =
                    PARTNER_OFFERS.find(
                      (o) => o.sponsorLevel === "featured" && o.targetCategories.includes(party.category)
                    ) ||
                    PARTNER_OFFERS.find(
                      (o) => o.sponsorLevel === "featured" && o.targetCategories.includes("all")
                    );
                  if (!featuredOffer) return null;
                  return (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-4 text-left">
                      <p className="text-xs font-bold text-orange-700 mb-3">🎁 참가 확정! 이 혜택도 챙겨가세요</p>
                      <FeaturedPartnerCard offer={featuredOffer} />
                    </div>
                  );
                })()}

                {/* 안전 공유 */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-left">
                  <p className="text-xs font-bold text-slate-700 mb-1">🛡️ 안전 공유</p>
                  <p className="text-[11px] text-slate-500 mb-3">이 파티 정보를 믿을 수 있는 사람에게 공유하세요</p>
                  <button
                    onClick={async () => {
                      const shareText = `[제주 취미 파티] ${party.title}\n날짜: ${formatDate(party.date)} ${party.time}\n장소: ${party.location}\n파티장: ${party.hostName}`;
                      if (navigator.share) {
                        try {
                          await navigator.share({ title: party.title, text: shareText });
                        } catch { /* cancelled */ }
                      } else {
                        await navigator.clipboard.writeText(shareText);
                        alert("파티 정보가 클립보드에 복사되었습니다");
                      }
                    }}
                    className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    📤 파티 정보 공유하기
                  </button>
                </div>

                <button
                  onClick={() => { setShowJoinModal(false); setPaymentStep("info"); }}
                  className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-extrabold text-sm hover:bg-orange-600 transition-colors"
                >
                  확인
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          본인인증 모달
      ══════════════════════════════ */}
      {showPhoneVerify && (
        <PhoneVerify
          onVerified={() => {
            setShowPhoneVerify(false);
            setShowJoinModal(true);
          }}
          onClose={() => setShowPhoneVerify(false)}
        />
      )}

      {/* ══════════════════════════════
          신고 모달
      ══════════════════════════════ */}
      {showReportModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => { setShowReportModal(false); setReportSubmitted(false); setReportCategory(""); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            {reportSubmitted ? (
              <div className="text-center py-4">
                <p className="text-4xl mb-3">✅</p>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">신고가 접수되었습니다</h3>
                <p className="text-sm text-slate-500 mb-5">검토 후 조치하겠습니다</p>
                <button
                  onClick={() => { setShowReportModal(false); setReportSubmitted(false); setReportCategory(""); }}
                  className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-extrabold text-sm hover:bg-orange-600 transition-colors"
                >
                  확인
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">🚨 신고하기</h3>
                <p className="text-sm text-slate-500 mb-4">신고 사유를 선택해주세요</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["노쇼", "불쾌한 언행", "사기", "안전 우려", "기타"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setReportCategory(cat)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        reportCategory === cat
                          ? "bg-red-500 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowReportModal(false); setReportCategory(""); }}
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setReportSubmitted(true)}
                    disabled={!reportCategory}
                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-extrabold text-sm disabled:opacity-50 hover:bg-red-600 transition-colors"
                  >
                    신고 접수
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          카페패스 구매 모달
      ══════════════════════════════ */}
      {showPassModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          onClick={() => { if (passStep !== "paying") { setShowPassModal(false); setPassStep("select"); } }}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>

            {passStep === "select" && (
              <>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">☕ 카페패스 구매</h3>
                <p className="text-sm text-slate-500 mb-4">선택한 패스를 확인해주세요</p>

                <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">이용권</span>
                    <span className="font-medium text-slate-900">{currentPass?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-900 font-bold">결제 금액</span>
                    <span className="text-lg font-extrabold text-sky-600">{currentPass?.price.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowPassModal(false); setPassStep("select"); }}
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setPassStep("paying")}
                    className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-extrabold text-sm hover:bg-sky-600 transition-colors"
                  >
                    결제하기
                  </button>
                </div>
              </>
            )}

            {passStep === "paying" && (
              <>
                <h3 className="text-lg font-extrabold text-slate-900 mb-4">결제</h3>
                <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-500">카페패스</span>
                    <span className="font-medium text-slate-900">{currentPass?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                    <span className="text-slate-900 font-bold">결제 금액</span>
                    <span className="text-lg font-extrabold text-sky-600">{currentPass?.price.toLocaleString()}원</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5 text-center">결제 게이트웨이 연동 준비 중입니다. 현재는 모의 결제로 처리됩니다.</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPassStep("select")}
                    className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    뒤로
                  </button>
                  <button
                    onClick={handlePassPurchase}
                    disabled={passProcessing}
                    className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-extrabold text-sm disabled:opacity-50 hover:bg-sky-600 transition-colors"
                  >
                    {passProcessing ? "처리 중..." : "결제 완료"}
                  </button>
                </div>
              </>
            )}

            {passStep === "done" && (
              <div className="text-center py-4">
                <p className="text-4xl mb-3">☕</p>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">카페패스 구매 완료!</h3>
                <p className="text-sm text-slate-500 mb-1">
                  {currentPass?.name} · {currentPass?.price.toLocaleString()}원
                </p>
                <p className="text-xs text-sky-500 mb-5">제휴 카페에서 바로 사용할 수 있어요</p>
                <button
                  onClick={() => { setShowPassModal(false); setPassStep("select"); }}
                  className="px-8 py-3 bg-sky-500 text-white rounded-2xl font-extrabold text-sm hover:bg-sky-600 transition-colors"
                >
                  확인
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
