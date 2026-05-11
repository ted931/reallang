"use client";
import { useState } from "react";
import Link from "next/link";
import {
  DUMMY_MARKET, MARKET_CATEGORY_LABEL, MARKET_CATEGORY_ICON, CONDITION_LABEL,
  type MarketCategory,
} from "@/lib/dummy-market";

const CATEGORIES: Array<MarketCategory | "전체"> = ["전체", "rod", "reel", "lure", "line", "hook", "box", "wear", "etc"];
type ViewMode = "list" | "card" | "album";

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="2" width="16" height="2" rx="1"/>
      <rect x="0" y="7" width="16" height="2" rx="1"/>
      <rect x="0" y="12" width="16" height="2" rx="1"/>
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="0" width="7" height="7" rx="1"/>
      <rect x="9" y="0" width="7" height="7" rx="1"/>
      <rect x="0" y="9" width="7" height="7" rx="1"/>
      <rect x="9" y="9" width="7" height="7" rx="1"/>
    </svg>
  );
}
function AlbumIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="0" width="4.5" height="4.5" rx="0.5"/>
      <rect x="5.75" y="0" width="4.5" height="4.5" rx="0.5"/>
      <rect x="11.5" y="0" width="4.5" height="4.5" rx="0.5"/>
      <rect x="0" y="5.75" width="4.5" height="4.5" rx="0.5"/>
      <rect x="5.75" y="5.75" width="4.5" height="4.5" rx="0.5"/>
      <rect x="11.5" y="5.75" width="4.5" height="4.5" rx="0.5"/>
      <rect x="0" y="11.5" width="4.5" height="4.5" rx="0.5"/>
      <rect x="5.75" y="11.5" width="4.5" height="4.5" rx="0.5"/>
      <rect x="11.5" y="11.5" width="4.5" height="4.5" rx="0.5"/>
    </svg>
  );
}

export default function MarketPage() {
  const [category, setCategory] = useState<MarketCategory | "전체">("전체");
  const [showSoldOut, setShowSoldOut] = useState(false);
  const [view, setView] = useState<ViewMode>("card");

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

      {/* 옵션 바 */}
      <div className="flex items-center justify-between mb-4">
        {/* 판매 완료 토글 */}
        <label className="flex items-center gap-1.5 cursor-pointer">
          <span className="text-xs text-slate-500">판매완료 포함</span>
          <div onClick={() => setShowSoldOut(v => !v)}
            className={`w-8 h-4 rounded-full transition-colors relative ${showSoldOut ? "bg-hook" : "bg-ocean-700"}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${showSoldOut ? "left-4" : "left-0.5"}`} />
          </div>
        </label>

        {/* 뷰 모드 토글 */}
        <div className="flex items-center gap-0.5 bg-ocean-900 border border-ocean-800 rounded-xl p-1">
          {([
            { mode: "list" as ViewMode, Icon: ListIcon, label: "리스트형" },
            { mode: "card" as ViewMode, Icon: CardIcon, label: "카드형" },
            { mode: "album" as ViewMode, Icon: AlbumIcon, label: "앨범형" },
          ]).map(({ mode, Icon, label }) => (
            <button key={mode} onClick={() => setView(mode)} title={label}
              className={`w-8 h-7 flex items-center justify-center rounded-lg transition-colors ${view === mode ? "bg-hook text-ocean-950" : "text-slate-500 hover:text-slate-300"}`}>
              <Icon />
            </button>
          ))}
        </div>
      </div>

      {/* 상품 수 */}
      <div className="text-xs text-slate-500 mb-3">{filtered.length}개 상품</div>

      {/* 상품 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">해당 카테고리 상품이 없습니다</div>
      ) : (
        <>
          {/* ── 리스트형 ── */}
          {view === "list" && (
            <div className="space-y-2">
              {filtered.map(m => {
                const cond = CONDITION_LABEL[m.condition];
                const discountPct = Math.round((1 - m.price / m.originalPrice) * 100);
                const isSold = m.status === "sold";
                const isReserved = m.status === "reserved";
                return (
                  <Link key={m.id} href={`/market/${m.id}`}
                    className={`flex items-center gap-3 rounded-2xl border bg-ocean-900 p-3 hover:border-ocean-600 transition-colors ${isSold ? "border-ocean-800 opacity-50" : "border-ocean-800"}`}>
                    {/* 썸네일 */}
                    <div className="relative w-16 h-16 rounded-xl bg-ocean-800 flex items-center justify-center text-3xl shrink-0">
                      {m.images[0]}
                      {(isSold || isReserved) && (
                        <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                          <span className="text-[9px] font-black text-white">{isSold ? "완료" : "예약"}</span>
                        </div>
                      )}
                    </div>
                    {/* 텍스트 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${cond.color}`}>{cond.label}</span>
                        <span className="text-[10px] text-slate-500">{MARKET_CATEGORY_LABEL[m.category]}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-200 truncate">{m.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-black text-hook">{m.price.toLocaleString()}원</span>
                        <span className="text-xs text-slate-600 line-through">{m.originalPrice.toLocaleString()}</span>
                        <span className="text-xs text-rose-400 font-bold">-{discountPct}%</span>
                      </div>
                    </div>
                    {/* 우측 */}
                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-500">{m.region}</div>
                      <div className="text-xs text-slate-600 mt-0.5">조회 {m.views}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── 카드형 (2열) ── */}
          {view === "card" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map(m => {
                const cond = CONDITION_LABEL[m.condition];
                const discountPct = Math.round((1 - m.price / m.originalPrice) * 100);
                const isSold = m.status === "sold";
                const isReserved = m.status === "reserved";
                return (
                  <Link key={m.id} href={`/market/${m.id}`}
                    className={`block rounded-2xl border bg-ocean-900 p-4 hover:border-ocean-600 transition-colors ${isSold ? "border-ocean-800 opacity-50" : isReserved ? "border-ocean-700" : "border-ocean-800"}`}>
                    <div className="rounded-xl bg-ocean-800 h-32 flex items-center justify-center text-5xl mb-3 relative">
                      {m.images[0]}
                      {(isSold || isReserved) && (
                        <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                          <span className="text-sm font-black text-white">{isSold ? "판매완료" : "예약중"}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cond.color}`}>{cond.label}</span>
                      <span className="text-[10px] text-slate-500">{MARKET_CATEGORY_ICON[m.category]} {MARKET_CATEGORY_LABEL[m.category]}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-200 mb-1 line-clamp-2">{m.title}</div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-base font-black text-hook">{m.price.toLocaleString()}원</span>
                      <span className="text-xs text-slate-600 line-through">{m.originalPrice.toLocaleString()}</span>
                      <span className="text-xs text-rose-400 font-bold">-{discountPct}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{m.sellerAvatar} {m.sellerName} · {m.region}</span>
                      <span>조회 {m.views}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── 앨범형 (3열, 이미지 중심) ── */}
          {view === "album" && (
            <div className="grid grid-cols-3 gap-1.5">
              {filtered.map(m => {
                const isSold = m.status === "sold";
                const isReserved = m.status === "reserved";
                const discountPct = Math.round((1 - m.price / m.originalPrice) * 100);
                return (
                  <Link key={m.id} href={`/market/${m.id}`}
                    className={`block rounded-xl overflow-hidden border ${isSold ? "border-ocean-800 opacity-50" : "border-ocean-800 hover:border-ocean-600"} transition-colors`}>
                    {/* 정사각 이미지 */}
                    <div className="relative aspect-square bg-ocean-800 flex items-center justify-center text-4xl">
                      {m.images[0]}
                      {(isSold || isReserved) && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-xs font-black text-white">{isSold ? "완료" : "예약"}</span>
                        </div>
                      )}
                      {/* 할인율 뱃지 */}
                      <div className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                        -{discountPct}%
                      </div>
                    </div>
                    {/* 간략 정보 */}
                    <div className="bg-ocean-900 px-2 py-1.5">
                      <div className="text-[10px] font-bold text-slate-300 truncate">{m.title}</div>
                      <div className="text-[11px] font-black text-hook">{m.price.toLocaleString()}원</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
