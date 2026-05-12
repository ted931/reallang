"use client";
import { use, useState } from "react";
import Link from "next/link";
import { DUMMY_MARKET, MARKET_CATEGORY_LABEL, CONDITION_LABEL } from "@/lib/dummy-market";

export default function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const m = DUMMY_MARKET.find(x => x.id === id);
  const [contacted, setContacted] = useState(false);
  const [liked, setLiked] = useState(false);

  if (!m) return <div className="p-8 text-center text-slate-400">상품을 찾을 수 없습니다.</div>;

  const cond = CONDITION_LABEL[m.condition];
  const discountPct = Math.round((1 - m.price / m.originalPrice) * 100);
  const isSold = m.status === "sold";

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-0 py-6 pb-32 lg:pb-6">
      <Link href="/market" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 마켓 목록</Link>

      <div className="lg:flex lg:gap-8">
        {/* 왼쪽: 이미지, 설명, 판매자 정보 */}
        <div className="flex-1 min-w-0">
          {/* 이미지 */}
          <div className="rounded-2xl bg-ocean-800 h-56 lg:h-80 flex items-center justify-center text-7xl mb-5 border border-ocean-700 relative">
            {m.images[0]}
            {isSold && (
              <div className="absolute inset-0 rounded-2xl bg-black/60 flex items-center justify-center">
                <span className="text-2xl font-black text-white">판매 완료</span>
              </div>
            )}
          </div>

          {/* 기본 정보 (모바일) */}
          <div className="mb-4 lg:hidden">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cond.color}`}>{cond.label}</span>
              <span className="text-xs text-slate-500">{MARKET_CATEGORY_LABEL[m.category]}</span>
            </div>
            <h1 className="text-xl font-black text-ocean-50 mb-2">{m.title}</h1>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-hook">{m.price.toLocaleString()}원</span>
              <span className="text-sm text-slate-600 line-through">{m.originalPrice.toLocaleString()}원</span>
              <span className="text-sm text-rose-400 font-bold">-{discountPct}%</span>
            </div>
          </div>

          {/* 기본 정보 (PC) */}
          <div className="mb-4 hidden lg:block">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cond.color}`}>{cond.label}</span>
              <span className="text-xs text-slate-500">{MARKET_CATEGORY_LABEL[m.category]}</span>
            </div>
            <h1 className="text-2xl font-black text-ocean-50 mb-2">{m.title}</h1>
          </div>

          {/* 판매자 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-4 mb-4 flex items-center gap-3">
            <span className="text-3xl">{m.sellerAvatar}</span>
            <div className="flex-1">
              <div className="font-bold text-slate-200">{m.sellerName}</div>
              <div className="text-xs text-slate-500">{m.region} · 조회 {m.views} · 찜 {m.likes}</div>
            </div>
          </div>

          {/* 상품 설명 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
            <h2 className="font-bold text-slate-200 mb-3">상품 설명</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{m.description}</p>
          </div>

          {/* 태그 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {m.tags.map(t => (
              <span key={t} className="text-xs px-3 py-1.5 bg-ocean-800 text-slate-400 rounded-full">#{t}</span>
            ))}
          </div>

          {/* 주의사항 */}
          <div className="rounded-xl border border-ocean-800 bg-ocean-900/40 p-4 mb-6 text-xs text-slate-500 space-y-1">
            <div className="font-bold text-slate-400 mb-1">거래 안내</div>
            <div>• 직거래 또는 안전결제를 이용하세요</div>
            <div>• 상품 상태는 사진으로 반드시 확인하세요</div>
            <div>• 사기 거래 발생 시 피싱로그로 신고해 주세요</div>
          </div>
        </div>

        {/* 오른쪽: 가격/구매 패널 (PC only) */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-6 self-start rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-black text-hook">{m.price.toLocaleString()}원</span>
                <span className="text-sm text-rose-400 font-bold">-{discountPct}%</span>
              </div>
              <div className="text-sm text-slate-600 line-through">{m.originalPrice.toLocaleString()}원</div>
            </div>
            <div className="space-y-2 text-sm mb-5">
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--ocean-800)" }}>
                <span className="text-slate-400">상태</span>
                <span className={`font-bold text-xs px-2.5 py-1 rounded-full border ${cond.color}`}>{cond.label}</span>
              </div>
              <div className="flex justify-between py-2" style={{ borderBottom: "1px solid var(--ocean-800)" }}>
                <span className="text-slate-400">지역</span>
                <span className="font-bold text-slate-200">{m.region}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">조회 / 찜</span>
                <span className="font-bold text-slate-200">{m.views} / {m.likes}</span>
              </div>
            </div>
            <button
              onClick={() => setLiked(v => !v)}
              className={`w-full py-3 mb-3 border rounded-2xl font-bold transition-colors text-sm ${liked ? "border-rose-500 text-rose-400 bg-rose-500/10" : "border-ocean-700 hover:border-ocean-500 text-slate-400"}`}>
              {liked ? "♥" : "♡"} 찜하기 ({m.likes + (liked ? 1 : 0)})
            </button>
            {contacted ? (
              <div className="w-full py-3 bg-teal-900/40 border border-teal-700 text-teal-300 font-black text-center rounded-2xl text-sm">
                ✅ 연락처 전송 완료
              </div>
            ) : (
              <button
                disabled={isSold}
                onClick={() => setContacted(true)}
                className={`w-full py-3 font-black rounded-2xl transition-colors text-sm ${isSold ? "bg-ocean-800 text-slate-600 cursor-not-allowed" : "bg-hook hover:bg-hook-light text-ocean-950"}`}>
                {isSold ? "판매 완료" : "💬 판매자에게 연락"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 하단 CTA */}
      <div className="lg:hidden fixed bottom-20 left-0 right-0 z-40 bg-ocean-950/95 border-t border-ocean-800 px-4 py-3 backdrop-blur-sm">
        <div className="max-w-xl mx-auto flex gap-3">
          <button
            onClick={() => setLiked(v => !v)}
            className={`flex-1 py-3 border rounded-2xl font-bold transition-colors text-sm ${liked ? "border-rose-500 text-rose-400 bg-rose-500/10" : "border-ocean-700 hover:border-ocean-500 text-slate-400"}`}>
            {liked ? "♥" : "♡"} 찜하기 ({m.likes + (liked ? 1 : 0)})
          </button>
          {contacted ? (
            <div className="flex-[2] py-3 bg-teal-900/40 border border-teal-700 text-teal-300 font-black text-center rounded-2xl text-sm">
              ✅ 연락처 전송 완료
            </div>
          ) : (
            <button
              disabled={isSold}
              onClick={() => setContacted(true)}
              className={`flex-[2] py-3 font-black rounded-2xl transition-colors text-sm ${isSold ? "bg-ocean-800 text-slate-600 cursor-not-allowed" : "bg-hook hover:bg-hook-light text-ocean-950"}`}>
              {isSold ? "판매 완료" : "💬 판매자에게 연락"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
