"use client";
import { useState } from "react";
import Link from "next/link";
import {
  DUMMY_MARKET, MARKET_CATEGORY_LABEL, MARKET_CATEGORY_ICON, CONDITION_LABEL,
  type MarketCategory,
} from "@/lib/dummy-market";

const CATEGORIES: Array<MarketCategory | "전체"> = ["전체", "rod", "reel", "lure", "line", "hook", "box", "wear", "etc"];

export default function MarketPage() {
  const [category, setCategory] = useState<MarketCategory | "전체">("전체");
  const [showSoldOut, setShowSoldOut] = useState(false);

  const filtered = DUMMY_MARKET.filter(m => {
    if (!showSoldOut && m.status === "sold") return false;
    if (category !== "전체" && m.category !== category) return false;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-white">🛒 중고 장비 마켓</h1>
          <p className="text-xs text-slate-500 mt-0.5">낚시인 간 직거래 · 안전결제</p>
        </div>
        <Link href="/market/sell"
          className="shrink-0 px-4 py-2 bg-hook hover:bg-hook-light text-ocean-950 text-xs font-black rounded-xl transition-colors">
          + 판매 등록
        </Link>
      </div>

      {/* 카테고리 */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-4 px-4">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${category === c ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
            {c !== "전체" && <span>{MARKET_CATEGORY_ICON[c as MarketCategory]}</span>}
            {c === "전체" ? "전체" : MARKET_CATEGORY_LABEL[c as MarketCategory]}
          </button>
        ))}
      </div>

      {/* 판매 완료 토글 */}
      <div className="flex items-center justify-end gap-2 mb-4">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <span className="text-xs text-slate-500">판매완료 포함</span>
          <div onClick={() => setShowSoldOut(v => !v)}
            className={`w-8 h-4 rounded-full transition-colors relative ${showSoldOut ? "bg-hook" : "bg-ocean-700"}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${showSoldOut ? "left-4" : "left-0.5"}`} />
          </div>
        </label>
      </div>

      {/* 상품 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">해당 카테고리 상품이 없습니다</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(m => {
            const cond = CONDITION_LABEL[m.condition];
            const discountPct = Math.round((1 - m.price / m.originalPrice) * 100);
            const isSold = m.status === "sold";
            const isReserved = m.status === "reserved";
            return (
              <Link key={m.id} href={`/market/${m.id}`}
                className={`block rounded-2xl border bg-ocean-900 p-4 hover:border-ocean-600 transition-colors ${isSold ? "border-ocean-800 opacity-50" : isReserved ? "border-ocean-700" : "border-ocean-800"}`}>
                {/* 이미지 */}
                <div className="rounded-xl bg-ocean-800 h-32 flex items-center justify-center text-5xl mb-3 relative">
                  {m.images[0]}
                  {(isSold || isReserved) && (
                    <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                      <span className="text-sm font-black text-white">{isSold ? "판매완료" : "예약중"}</span>
                    </div>
                  )}
                </div>

                {/* 상태 배지 */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cond.color}`}>{cond.label}</span>
                  <span className="text-[10px] text-slate-500">{MARKET_CATEGORY_ICON[m.category]} {MARKET_CATEGORY_LABEL[m.category]}</span>
                </div>

                {/* 제목 */}
                <div className="text-sm font-bold text-slate-200 mb-1 line-clamp-2">{m.title}</div>

                {/* 가격 */}
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-base font-black text-hook">{m.price.toLocaleString()}원</span>
                  <span className="text-xs text-slate-600 line-through">{m.originalPrice.toLocaleString()}</span>
                  <span className="text-xs text-rose-400 font-bold">-{discountPct}%</span>
                </div>

                {/* 판매자 + 지역 */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{m.sellerAvatar} {m.sellerName} · {m.region}</span>
                  <span>조회 {m.views}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
