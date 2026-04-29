"use client";

import { useState } from "react";
import type { PartnerOffer } from "@/lib/dummy-partners";

const OFFER_TYPE_LABEL: Record<PartnerOffer["offerType"], string> = {
  discount: "할인",
  freebie: "무료 증정",
  package: "패키지",
};

const BUSINESS_TYPE_LABEL: Record<PartnerOffer["businessType"], string> = {
  guesthouse: "게스트하우스",
  cafe: "카페",
  "tourist-spot": "관광지",
  restaurant: "식당",
  activity: "액티비티",
  rental: "렌탈",
};

/** "2026-12-31" → "2026.12.31" */
function formatValidUntil(raw: string): string {
  return raw.replace(/-/g, ".");
}

/** 절약 금액 계산 (원 단위 반올림) */
function calcSaving(basePrice: number, discountPercent: number): number {
  return Math.round((basePrice * discountPercent) / 100);
}

/** 카카오맵 검색 URL */
function kakaoMapUrl(location: string): string {
  return `https://map.kakao.com/link/search/${encodeURIComponent(location)}`;
}

// ─────────────────────────────────────────
// Featured 카드 (풀 width, 주황 테두리)
// ─────────────────────────────────────────
export function FeaturedPartnerCard({ offer }: { offer: PartnerOffer }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!offer.discountCode) return;
    try {
      await navigator.clipboard.writeText(offer.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 실패 시 무시
    }
  };

  const saving =
    offer.basePrice && offer.discountPercent
      ? calcSaving(offer.basePrice, offer.discountPercent)
      : null;

  return (
    <div className="w-full rounded-2xl border-2 border-orange-300 bg-white shadow-sm overflow-hidden">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-3 flex items-center justify-between border-b border-orange-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">{offer.emoji}</span>
          <div>
            <p className="text-sm font-bold text-gray-900">{offer.businessName}</p>
            <p className="text-[10px] text-gray-400">{BUSINESS_TYPE_LABEL[offer.businessType]}</p>
          </div>
        </div>
        <span className="px-2 py-0.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">협찬</span>
      </div>

      {/* 본문 */}
      <div className="px-4 py-4">
        {/* 위치 — 카카오맵 링크 */}
        <div className="flex items-center gap-1 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3 text-gray-400 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.218-4.402 3.218-7.327a6.5 6.5 0 00-13 0c0 2.925 1.274 5.248 3.218 7.327a19.569 19.569 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <a
            href={kakaoMapUrl(offer.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-500 underline underline-offset-2 hover:text-blue-700 transition-colors"
          >
            {offer.location}
          </a>
        </div>

        {/* 오퍼 타입 배지 + 제목 + 절약 금액 */}
        <div className="flex items-start gap-2 mb-2">
          <div className="flex flex-col items-start gap-0.5 shrink-0 mt-0.5">
            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[10px] font-bold rounded">
              {OFFER_TYPE_LABEL[offer.offerType]}
              {offer.discountPercent ? ` ${offer.discountPercent}%` : ""}
            </span>
            {saving !== null && (
              <span className="text-[9px] text-emerald-600 font-medium whitespace-nowrap">
                약 ₩{saving.toLocaleString()} 절약
              </span>
            )}
          </div>
          <p className="text-sm font-bold text-gray-900 leading-snug">{offer.offerTitle}</p>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          &ldquo;{offer.offerDetail}&rdquo;
        </p>

        {/* 할인코드 + 복사 버튼 */}
        {offer.discountCode && (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 rounded-xl px-3 py-2">
              <span className="text-[10px] text-gray-400 font-medium shrink-0">할인코드</span>
              <span className="text-sm font-mono font-bold text-orange-600 tracking-wider">
                {offer.discountCode}
              </span>
            </div>
            <button
              onClick={handleCopy}
              aria-label={`${offer.discountCode} 코드 복사`}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-orange-500 text-white hover:bg-orange-600"
              }`}
            >
              {copied ? "복사됨!" : "코드 복사"}
            </button>
          </div>
        )}
      </div>

      {/* 푸터 — 유효기간 */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="w-3 h-3 text-gray-400 shrink-0"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p className="text-[10px] text-gray-400">
          ~{formatValidUntil(offer.validUntil)}까지
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Basic 카드 (컴팩트 수평)
// ─────────────────────────────────────────
export function BasicPartnerCard({ offer }: { offer: PartnerOffer }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!offer.discountCode) return;
    try {
      await navigator.clipboard.writeText(offer.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard 실패 시 무시
    }
  };

  const saving =
    offer.basePrice && offer.discountPercent
      ? calcSaving(offer.basePrice, offer.discountPercent)
      : null;

  return (
    <div className="shrink-0 w-52 rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-base">{offer.emoji}</span>
            <span className="text-xs font-bold text-gray-900 leading-tight line-clamp-1">
              {offer.businessName}
            </span>
          </div>
          <span className="shrink-0 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold rounded-full">제휴</span>
        </div>

        {/* 위치 — 카카오맵 링크 + 할인 정보 */}
        <div className="flex items-center flex-wrap gap-x-1 gap-y-0.5 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-2.5 h-2.5 text-gray-400 shrink-0"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.218-4.402 3.218-7.327a6.5 6.5 0 00-13 0c0 2.925 1.274 5.248 3.218 7.327a19.569 19.569 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <a
            href={kakaoMapUrl(offer.location)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-500 underline underline-offset-1 hover:text-blue-700 transition-colors"
          >
            {offer.location}
          </a>
          {offer.discountPercent ? (
            <span className="text-[10px] text-orange-500 font-bold">· {offer.discountPercent}% 할인</span>
          ) : (
            <span className="text-[10px] text-orange-500 font-bold">· {OFFER_TYPE_LABEL[offer.offerType]}</span>
          )}
          {saving !== null && (
            <span className="text-[9px] text-emerald-600 font-medium">약 ₩{saving.toLocaleString()} 절약</span>
          )}
        </div>

        {expanded && (
          <div className="mb-2">
            <p className="text-[10px] text-gray-500 leading-relaxed mb-1.5">{offer.offerDetail}</p>
            {offer.discountCode && (
              <div className="flex items-center gap-1.5">
                <span className="flex-1 text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg truncate">
                  {offer.discountCode}
                </span>
                <button
                  onClick={handleCopy}
                  aria-label={`${offer.discountCode} 코드 복사`}
                  className={`shrink-0 text-[9px] font-bold px-2 py-1 rounded-lg transition-all ${
                    copied
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {copied ? "복사됨!" : "복사"}
                </button>
              </div>
            )}
            {/* 유효기간 */}
            {offer.validUntil && (
              <p className="mt-1.5 text-[9px] text-gray-400">
                ~{formatValidUntil(offer.validUntil)}까지
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-1.5 border border-gray-200 rounded-xl text-[11px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {expanded ? "접기" : "혜택 보기"}
        </button>
      </div>
    </div>
  );
}
