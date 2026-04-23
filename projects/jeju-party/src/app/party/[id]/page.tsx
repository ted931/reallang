"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HOBBY_CATEGORIES } from "@/lib/types";
import { DUMMY_PARTIES } from "@/lib/dummy-parties";
import { CAFE_PASSES, CAFE_TOURS } from "@/lib/dummy-cafe-tours";
import { CARS } from "@/lib/car-data";
import PhoneVerify, { usePhoneVerified } from "@/components/phone-verify";

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
  const phoneVerified = usePhoneVerified();

  if (!party) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🤷</p>
          <p className="text-gray-500">파티를 찾을 수 없어요</p>
          <a href={process.env.NEXT_PUBLIC_BASE_PATH || "/"} className="text-orange-500 text-sm mt-2 inline-block">
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

  // 카페 수 기반 절약 계산 (개별 구매 ~5,000원/잔 가정)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center gap-3">
          <a href={process.env.NEXT_PUBLIC_BASE_PATH || "/"} className="text-gray-400 hover:text-gray-600">
            ← 목록
          </a>
          <span className="text-sm text-gray-300">|</span>
          <span className="text-sm text-gray-500">{cat?.emoji} {cat?.label}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-6 space-y-5">
        {/* 제목 + 기본 정보 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg">
              {cat?.emoji} {cat?.label}
            </span>
            {party.cafePassEnabled && (
              <span className="px-2 py-0.5 bg-sky-100 text-sky-600 text-[10px] font-medium rounded-full">
                ☕ 카페패스
              </span>
            )}
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              spotsLeft <= 1 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
            }`}>
              {spotsLeft}자리 남음
            </span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">{party.title}</h1>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📅</span>
              <span className="text-gray-700">{formatDate(party.date)} {party.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">📍</span>
              <span className="text-gray-700">{party.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">👥</span>
              <span className="text-gray-700">{party.currentMembers}/{party.maxMembers}명</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">💰</span>
              <span className="text-gray-700 font-medium">
                {party.costType === "free"
                  ? "무료"
                  : party.costType === "split"
                  ? `엔빵 ~₩${(party.costAmount || 0).toLocaleString()}/인`
                  : `₩${(party.costAmount || 0).toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-3">파티 소개</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{party.description}</p>
        </div>

        {/* 카페투어 코스 정보 */}
        {cafeTour && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{cafeTour.image}</span>
                  <h2 className="font-bold text-gray-900">{cafeTour.title}</h2>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span>⭐ {cafeTour.rating} ({cafeTour.reviewCount})</span>
                  <span>·</span>
                  <span>{cafeTour.totalTime}</span>
                  <span>·</span>
                  <span>{cafeTour.distance}</span>
                </div>
              </div>
            </div>

            {/* 카페 수평 프리뷰 */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
              {cafeTour.cafes.map((cafe, idx) => (
                <div key={idx} className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-xs font-medium text-amber-700 whitespace-nowrap">
                    ☕ {cafe.name}
                  </span>
                  {idx < cafeTour.cafes.length - 1 && (
                    <span className="text-gray-300 text-[10px]">→</span>
                  )}
                </div>
              ))}
            </div>

            {/* 카페 상세 리스트 */}
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
                      <span className="text-sm font-medium text-gray-900">{cafe.name}</span>
                      {party.cafePassEnabled && (
                        <span className="text-[10px] text-sky-500 font-medium">패스 사용</span>
                      )}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 mt-1.5">
                      <p className="text-xs text-gray-600 font-medium">{cafe.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-gray-400">⏱ 약 {cafe.stayMin}분</span>
                        {cafe.note && <span className="text-[10px] text-gray-400">· {cafe.note}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {cafeTour.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">#{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* 일정 타임라인 */}
        {party.schedule && party.schedule.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">일정</h2>
            <div className="space-y-0">
              {party.schedule.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 border-2 ${
                      item.memo?.includes("패스 사용")
                        ? "bg-sky-400 border-sky-100"
                        : "bg-orange-400 border-orange-100"
                    }`} />
                    {idx < party.schedule!.length - 1 && (
                      <div className="w-px flex-1 bg-orange-200 min-h-[32px]" />
                    )}
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                        {item.time}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{item.place}</span>
                    </div>
                    {item.memo && (
                      <p className={`text-xs mt-0.5 ml-[52px] ${
                        item.memo.includes("패스 사용") ? "text-sky-500" : "text-gray-400"
                      }`}>{item.memo}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 카페패스 — cafePassEnabled일 때만 노출 */}
        {party.cafePassEnabled && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">☕</span>
                <h2 className="font-bold text-gray-900">카페패스</h2>
                <span className="text-[10px] px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full font-medium">선택</span>
              </div>
            </div>

            {/* 파티장 추천 멘트 */}
            {party.cafePassNote && (
              <div className="flex items-start gap-2 mb-4 mt-3 p-3 bg-amber-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600 flex-shrink-0 mt-0.5">
                  {party.hostName[0]}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">{party.hostName} 파티장</p>
                  <p className="text-xs text-gray-500 mt-0.5">&quot;{party.cafePassNote}&quot;</p>
                </div>
              </div>
            )}

            {/* 절약 계산 */}
            {cafeCount > 0 && savings > 0 && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl mb-4">
                <div className="text-xs text-emerald-700">
                  <span className="font-medium">카페 {cafeCount}곳</span> 개별 구매 시 ~{estimatedNormal.toLocaleString()}원
                </div>
                <div className="text-sm font-bold text-emerald-600">
                  {savings.toLocaleString()}원 절약
                </div>
              </div>
            )}

            {purchasedPass ? (
              <div className="p-4 bg-sky-50 rounded-xl text-center">
                <p className="text-lg mb-1">🎉</p>
                <p className="text-sm font-bold text-sky-700">카페패스 구매 완료!</p>
                <p className="text-xs text-sky-500 mt-1">{CAFE_PASSES.find((p) => p.id === purchasedPass)?.name} · 바로 사용 가능</p>
              </div>
            ) : (
              <>
                {/* 무제한 이용권 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 bg-sky-500 rounded-md flex items-center justify-center text-white text-[10px] font-bold">∞</span>
                    <span className="text-sm font-bold text-gray-900">무제한 이용권</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-3 ml-7">이용권 기간 내에 <span className="text-sky-600 font-medium">3시간마다 기본 음료 1잔</span> 무제한 이용 가능</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CAFE_PASSES.filter((p) => p.type === "unlimited").map((pass) => (
                      <button
                        key={pass.id}
                        onClick={() => setSelectedPass(pass.id)}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          selectedPass === pass.id
                            ? "border-sky-500 bg-white shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedPass === pass.id ? "border-sky-500" : "border-gray-300"
                          }`}>
                            {selectedPass === pass.id && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{pass.name}</span>
                          {pass.popular && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-500 text-[10px] font-bold rounded">인기</span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-sky-600">{pass.price.toLocaleString()}원</p>
                          <p className="text-[11px] text-gray-400">{pass.duration}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 잔 이용권 */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 bg-amber-500 rounded-md flex items-center justify-center text-white text-[10px]">☕</span>
                    <span className="text-sm font-bold text-gray-900">잔 이용권</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mb-3 ml-7"><span className="text-amber-600 font-medium">필요한 만큼만</span> 구매해서 30일 이내에 이용 가능</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {CAFE_PASSES.filter((p) => p.type === "cup").map((pass) => (
                      <button
                        key={pass.id}
                        onClick={() => setSelectedPass(pass.id)}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                          selectedPass === pass.id
                            ? "border-amber-500 bg-white shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedPass === pass.id ? "border-amber-500" : "border-gray-300"
                          }`}>
                            {selectedPass === pass.id && <div className="w-2 h-2 rounded-full bg-amber-500" />}
                          </div>
                          <span className="text-sm font-bold text-gray-900">{pass.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-600">{pass.price.toLocaleString()}원</p>
                          <p className="text-[11px] text-gray-400">1잔당 {pass.unitPrice?.toLocaleString()}원</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 구매 버튼 */}
                <button
                  onClick={() => { setShowPassModal(true); setPassStep("select"); }}
                  className="w-full py-3 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-bold text-sm hover:from-sky-600 hover:to-sky-700 transition-all shadow-sm"
                >
                  {currentPass?.name} — {currentPass?.price.toLocaleString()}원 구매하기
                </button>
                <p className="text-[10px] text-gray-400 text-center mt-2">결제 후 즉시 사용 가능 · 제주 전역 50+ 제휴 카페</p>
              </>
            )}
          </div>
        )}

        {/* 렌터카 / 장비 */}
        {(party.hasRentalCar || party.equipmentNeeded) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            {party.rentalCarMode === "rent-together" && rentalCar ? (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3">🚗 렌터카 (같이 빌려요)</h3>
                <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{rentalCar.image}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{rentalCar.name}</p>
                        <p className="text-[10px] text-gray-400">{rentalCar.seats}인승 · {rentalCar.trunkCapacity} · {rentalCar.fuelType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{rentalCar.pricePerDay.toLocaleString()}원/일</p>
                      <p className="text-base font-bold text-blue-600">엔빵 {(party.rentalCarPerPerson || 0).toLocaleString()}원/인</p>
                    </div>
                  </div>
                  {/* Seat visualization */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-500 mr-1">좌석</span>
                    {Array.from({ length: rentalCar.seats }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < (party.rentalCarConfirmed || 0) ? "text-blue-500" : "text-gray-300"}`}>
                        {i < (party.rentalCarConfirmed || 0) ? "●" : "○"}
                      </span>
                    ))}
                    {rentalSeatsLeft > 0 && (
                      <span className="text-[10px] text-orange-600 font-bold ml-auto">자리가 {rentalSeatsLeft}석 남았어요</span>
                    )}
                  </div>
                  {/* Pickup/Return */}
                  <div className="flex gap-4 text-xs text-gray-500">
                    {party.rentalCarPickup && <span>픽업: {party.rentalCarPickup}</span>}
                    {party.rentalCarReturn && party.rentalCarReturn !== party.rentalCarPickup && <span>반납: {party.rentalCarReturn}</span>}
                  </div>
                </div>
              </div>
            ) : party.hasRentalCar && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">🚗 렌터카 {party.rentalCarMode === "own-car" ? "(동승 가능)" : ""}</h3>
                <p className="text-sm text-gray-600">{party.carInfo || "있음 (동승 가능)"}</p>
              </div>
            )}
            {party.equipmentNeeded && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">🎒 준비물</h3>
                <p className="text-sm text-gray-600">{party.equipmentNeeded}</p>
              </div>
            )}
          </div>
        )}

        {/* 파티장 프로필 */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">파티장</h2>
            <div className="relative">
              <button
                onClick={() => setShowHostMenu(!showHostMenu)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                &#x22EF;
              </button>
              {showHostMenu && (
                <div className="absolute right-0 top-9 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 w-32">
                  <button
                    onClick={() => { setShowHostMenu(false); setShowReportModal(true); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50"
                  >
                    🚨 신고하기
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-600">
              {party.hostName[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900">
                {party.hostName}
                <span className="inline-flex items-center px-1.5 py-0.5 bg-emerald-100 text-emerald-600 text-[9px] font-bold rounded-full ml-1.5">📱 인증</span>
              </p>
              <p className="text-xs text-gray-400">
                ⭐ {party.hostRating} · 파티 {party.hostPartyCount}회 개최
              </p>
              {party.hostBio && (
                <p className="text-sm text-gray-500 mt-1">{party.hostBio}</p>
              )}
            </div>
          </div>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2">
          {party.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white border border-gray-200 text-gray-500 text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 flex gap-3">
          {joined ? (
            <div className="flex-1 py-3 bg-emerald-100 text-emerald-700 rounded-xl text-center font-bold">
              참여 완료! 파티장이 승인하면 알려드릴게요
            </div>
          ) : (
            <>
              <a
                href={`https://map.kakao.com/link/to/${encodeURIComponent(party.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50"
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
                className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors"
              >
                참여 신청 ({spotsLeft}자리)
              </button>
            </>
          )}
        </div>
      </main>

      {/* 참여 + 결제 모달 */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6" onClick={() => { if (paymentStep === "info") { setShowJoinModal(false); setPaymentStep("info"); } }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>

            {/* STEP 1: 정보 입력 */}
            {paymentStep === "info" && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-2">참여 신청</h3>
                <p className="text-sm text-gray-500 mb-4">
                  {party.hostName}님의 &quot;{party.title}&quot; 파티에 참여하시겠어요?
                </p>

                <div className="space-y-3 mb-4">
                  <input
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="이름"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-orange-400 outline-none"
                  />
                  <input
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="연락처 (선택)"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-orange-400 outline-none"
                  />
                </div>

                {/* 렌터카 동승 옵션 */}
                {party.rentalCarMode === "rent-together" && rentalCar && rentalSeatsLeft > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 mb-2">렌터카 동승</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => setJoinWithCar(true)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          joinWithCar ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}>
                        <span className="block text-base mb-0.5">🚗</span>
                        <span className="text-xs font-medium">같이 타요</span>
                        <span className="block text-[10px] text-blue-600 font-bold">+{(party.rentalCarPerPerson || 0).toLocaleString()}원</span>
                      </button>
                      <button onClick={() => setJoinWithCar(false)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${
                          !joinWithCar ? "border-gray-500 bg-gray-50" : "border-gray-200"
                        }`}>
                        <span className="block text-base mb-0.5">🚶</span>
                        <span className="text-xs font-medium">각자 이동</span>
                      </button>
                    </div>
                  </div>
                )}

                {party.costType !== "free" && (
                  <div className="p-3 bg-orange-50 rounded-xl mb-4 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">파티비</span>
                      <span className="text-sm font-bold text-orange-700">
                        {(party.costAmount || 0).toLocaleString()}원
                      </span>
                    </div>
                    {party.rentalCarMode === "rent-together" && joinWithCar && party.rentalCarPerPerson && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-600">렌터카 엔빵</span>
                        <span className="text-sm font-bold text-blue-600">
                          {party.rentalCarPerPerson.toLocaleString()}원
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-1.5 border-t border-orange-200">
                      <span className="text-sm font-bold text-orange-800">합계</span>
                      <span className="text-lg font-bold text-orange-700">
                        {((party.costAmount || 0) + (party.rentalCarMode === "rent-together" && joinWithCar ? (party.rentalCarPerPerson || 0) : 0)).toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-[10px] text-orange-500">
                      {party.costType === "split" ? "인당 예상 금액 (엔빵)" : "고정 참여비"}
                    </p>
                  </div>
                )}

                {party.costType === "free" && (
                  <div className="p-3 bg-emerald-50 rounded-xl mb-4">
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

                <label className="flex items-start gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                  <span className="text-xs text-gray-500 leading-relaxed">
                    <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/terms`} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">이용약관</a> 및{" "}
                    <a href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/privacy`} target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">개인정보처리방침</a>에 동의합니다 (만 14세 이상)
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowJoinModal(false); setPaymentStep("info"); }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={async () => {
                      if (!payerName.trim()) return;
                      if (party.costType === "free") {
                        setJoined(true);
                        // 카페패스 파티면 업셀 제안
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
                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                  >
                    {party.costType === "free" ? "참여합니다!" : "결제하고 참여"}
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: 결제 진행 */}
            {paymentStep === "paying" && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-2">결제</h3>
                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">파티</span>
                    <span className="font-medium text-gray-900">{party.title}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">참여자</span>
                    <span className="font-medium text-gray-900">{payerName}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-bold">결제 금액</span>
                    <span className="text-lg font-bold text-orange-600">
                      {(party.costAmount || 0).toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl mb-3 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">🛡️</span>
                    <span className="text-xs font-bold text-emerald-700">에스크로 안전결제</span>
                  </div>
                  <p className="text-[11px] text-emerald-600">
                    결제 금액은 파티 완료 시까지 플랫폼에 안전하게 보관됩니다
                  </p>
                  <p className="text-[10px] text-emerald-500">
                    환불 규정: 48시간 전 전액 / 24시간 전 50% / 당일 불가
                  </p>
                </div>

                <p className="text-xs text-gray-400 mb-4 text-center">
                  결제 게이트웨이 연동 준비 중입니다.
                  현재는 모의 결제로 참여가 처리됩니다.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentStep("info")}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium"
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
                        // 카페패스 파티면 업셀 제안
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
                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                  >
                    {paymentProcessing ? "처리 중..." : "결제 완료"}
                  </button>
                </div>
              </>
            )}

            {/* STEP: 카페패스 업셀 */}
            {paymentStep === "pass-offer" && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-2">카페패스도 함께?</h3>
                <p className="text-sm text-gray-500 mb-4">
                  카페 투어를 더 알뜰하게 즐기고 싶다면
                </p>

                {cafeCount > 0 && savings > 0 && (
                  <div className="p-3 bg-emerald-50 rounded-xl mb-4 text-center">
                    <p className="text-xs text-emerald-600">이 코스에서 카페패스로</p>
                    <p className="text-lg font-bold text-emerald-700">약 {savings.toLocaleString()}원 절약</p>
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {CAFE_PASSES.filter((p) => p.popular || p.id === "pass-3c").map((pass) => (
                    <button
                      key={pass.id}
                      onClick={() => setSelectedPass(pass.id)}
                      className={`w-full p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                        selectedPass === pass.id
                          ? "border-sky-500 bg-sky-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedPass === pass.id ? "border-sky-500" : "border-gray-300"
                        }`}>
                          {selectedPass === pass.id && <div className="w-2 h-2 rounded-full bg-sky-500" />}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{pass.name}</span>
                        {pass.popular && <span className="px-1.5 py-0.5 bg-red-100 text-red-500 text-[10px] font-bold rounded">인기</span>}
                      </div>
                      <span className="text-sm font-bold text-sky-600">{pass.price.toLocaleString()}원</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPaymentStep("done")}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-500 text-sm font-medium"
                  >
                    괜찮아요
                  </button>
                  <button
                    onClick={() => {
                      setPaymentStep("done");
                      setShowPassModal(true);
                      setPassStep("paying");
                    }}
                    className="flex-1 py-2.5 bg-sky-500 text-white rounded-xl font-bold text-sm"
                  >
                    패스 구매하기
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: 완료 */}
            {paymentStep === "done" && (
              <div className="text-center py-4">
                <p className="text-4xl mb-3">🎉</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">참여 완료!</h3>
                <p className="text-sm text-gray-500 mb-1">
                  {party.hostName}님이 승인하면 카카오톡으로 알려드릴게요
                </p>
                {party.costType !== "free" && (
                  <p className="text-xs text-emerald-600 mb-4">
                    결제 {(party.costAmount || 0).toLocaleString()}원 완료
                  </p>
                )}

                {/* 안전 공유 */}
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
                  <p className="text-xs font-bold text-gray-700 mb-1">🛡️ 안전 공유</p>
                  <p className="text-[11px] text-gray-500 mb-3">
                    이 파티 정보를 믿을 수 있는 사람에게 공유하세요
                  </p>
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
                    className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    📤 파티 정보 공유하기
                  </button>
                </div>

                <button
                  onClick={() => { setShowJoinModal(false); setPaymentStep("info"); }}
                  className="px-8 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm"
                >
                  확인
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 본인인증 모달 */}
      {showPhoneVerify && (
        <PhoneVerify
          onVerified={() => {
            setShowPhoneVerify(false);
            setShowJoinModal(true);
          }}
          onClose={() => setShowPhoneVerify(false)}
        />
      )}

      {/* 신고 모달 */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6" onClick={() => { setShowReportModal(false); setReportSubmitted(false); setReportCategory(""); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            {reportSubmitted ? (
              <div className="text-center py-4">
                <p className="text-4xl mb-3">✅</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">신고가 접수되었습니다</h3>
                <p className="text-sm text-gray-500 mb-4">검토 후 조치하겠습니다</p>
                <button
                  onClick={() => { setShowReportModal(false); setReportSubmitted(false); setReportCategory(""); }}
                  className="px-8 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm"
                >
                  확인
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-2">🚨 신고하기</h3>
                <p className="text-sm text-gray-500 mb-4">신고 사유를 선택해주세요</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {["노쇼", "불쾌한 언행", "사기", "안전 우려", "기타"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setReportCategory(cat)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        reportCategory === cat
                          ? "bg-red-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowReportModal(false); setReportCategory(""); }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => setReportSubmitted(true)}
                    disabled={!reportCategory}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                  >
                    신고 접수
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 카페패스 구매 모달 */}
      {showPassModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6" onClick={() => { if (passStep !== "paying") { setShowPassModal(false); setPassStep("select"); } }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>

            {passStep === "select" && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-2">☕ 카페패스 구매</h3>
                <p className="text-sm text-gray-500 mb-4">선택한 패스를 확인해주세요</p>

                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">이용권</span>
                    <span className="font-medium text-gray-900">{currentPass?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-bold">결제 금액</span>
                    <span className="text-lg font-bold text-sky-600">{currentPass?.price.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { setShowPassModal(false); setPassStep("select"); }}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium">
                    취소
                  </button>
                  <button onClick={() => setPassStep("paying")}
                    className="flex-1 py-2.5 bg-sky-500 text-white rounded-xl font-bold text-sm">
                    결제하기
                  </button>
                </div>
              </>
            )}

            {passStep === "paying" && (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-2">결제</h3>
                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">카페패스</span>
                    <span className="font-medium text-gray-900">{currentPass?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-bold">결제 금액</span>
                    <span className="text-lg font-bold text-sky-600">{currentPass?.price.toLocaleString()}원</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-4 text-center">
                  결제 게이트웨이 연동 준비 중입니다.
                  현재는 모의 결제로 처리됩니다.
                </p>

                <div className="flex gap-3">
                  <button onClick={() => setPassStep("select")}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 text-sm font-medium">
                    뒤로
                  </button>
                  <button onClick={handlePassPurchase} disabled={passProcessing}
                    className="flex-1 py-2.5 bg-sky-500 text-white rounded-xl font-bold text-sm disabled:opacity-50">
                    {passProcessing ? "처리 중..." : "결제 완료"}
                  </button>
                </div>
              </>
            )}

            {passStep === "done" && (
              <div className="text-center py-4">
                <p className="text-4xl mb-3">☕</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">카페패스 구매 완료!</h3>
                <p className="text-sm text-gray-500 mb-1">
                  {currentPass?.name} · {currentPass?.price.toLocaleString()}원
                </p>
                <p className="text-xs text-sky-500 mb-4">제휴 카페에서 바로 사용할 수 있어요</p>
                <button onClick={() => { setShowPassModal(false); setPassStep("select"); }}
                  className="px-8 py-2.5 bg-sky-500 text-white rounded-xl font-bold text-sm">
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
