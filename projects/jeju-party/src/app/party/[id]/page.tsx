"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { HOBBY_CATEGORIES } from "@/lib/types";
import { DUMMY_PARTIES } from "@/lib/dummy-parties";

export default function PartyDetailPage() {
  const params = useParams();
  const party = DUMMY_PARTIES.find((p) => p.id === params.id);
  const [joined, setJoined] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"info" | "paying" | "done">("info");
  const [payerName, setPayerName] = useState("");
  const [payerPhone, setPayerPhone] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

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

  const formatDate = (d: string) => {
    const date = new Date(d);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}(${days[date.getDay()]})`;
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

        {/* 일정 타임라인 */}
        {party.schedule && party.schedule.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">일정</h2>
            <div className="space-y-0">
              {party.schedule.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  {/* 타임라인 도트 + 선 */}
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-400 border-2 border-orange-100 flex-shrink-0 mt-1" />
                    {idx < party.schedule!.length - 1 && (
                      <div className="w-px flex-1 bg-orange-200 min-h-[32px]" />
                    )}
                  </div>
                  {/* 내용 */}
                  <div className="pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                        {item.time}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{item.place}</span>
                    </div>
                    {item.memo && (
                      <p className="text-xs text-gray-400 mt-0.5 ml-[52px]">{item.memo}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 렌터카 / 장비 */}
        {(party.hasRentalCar || party.equipmentNeeded) && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            {party.hasRentalCar && (
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">🚗 렌터카</h3>
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-3">파티장</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-600">
              {party.hostName[0]}
            </div>
            <div>
              <p className="font-bold text-gray-900">{party.hostName}</p>
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
                onClick={() => setShowJoinModal(true)}
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

                {party.costType !== "free" && (
                  <div className="p-3 bg-orange-50 rounded-xl mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">참여 비용</span>
                      <span className="text-lg font-bold text-orange-700">
                        {(party.costAmount || 0).toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-[10px] text-orange-500 mt-1">
                      {party.costType === "split" ? "인당 예상 금액 (엔빵)" : "고정 참여비"}
                    </p>
                  </div>
                )}

                {party.costType === "free" && (
                  <div className="p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700 mb-4">
                    무료 파티입니다
                  </div>
                )}

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
                        setPaymentStep("done");
                      } else {
                        setPaymentStep("paying");
                      }
                    }}
                    disabled={!payerName.trim()}
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
                        // 결제 초기화
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
                        // 모의 결제 완료
                        await fetch(`${basePath}/api/payments`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ action: "confirm", orderId: `PARTY-${party.id.slice(0, 8)}-${Date.now()}` }),
                        });
                        setJoined(true);
                        setPaymentStep("done");
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
    </div>
  );
}
