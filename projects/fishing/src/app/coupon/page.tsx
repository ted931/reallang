"use client";
import { useState } from "react";
import Link from "next/link";
import { DUMMY_COUPONS, type CouponType } from "@/lib/dummy-coupon";

const REGIONS = ["전체", "서귀포", "성산", "모슬포", "한림", "애월", "구좌"];

function CouponBadge({ type, value }: { type: CouponType; value: number }) {
  if (type === "percent") return (
    <div className="w-16 h-16 rounded-2xl bg-hook flex flex-col items-center justify-center shrink-0">
      <span className="text-xl font-black text-ocean-950 leading-none">{value}%</span>
      <span className="text-[9px] text-ocean-950/70 font-bold">할인</span>
    </div>
  );
  if (type === "fixed") return (
    <div className="w-16 h-16 rounded-2xl bg-teal-600 flex flex-col items-center justify-center shrink-0">
      <span className="text-sm font-black text-white leading-none">{(value / 1000).toFixed(0)}천원</span>
      <span className="text-[9px] text-white/70 font-bold">즉시할인</span>
    </div>
  );
  return (
    <div className="w-16 h-16 rounded-2xl bg-ocean-600 flex flex-col items-center justify-center shrink-0">
      <span className="text-2xl">🎁</span>
      <span className="text-[9px] text-white/70 font-bold">무료제공</span>
    </div>
  );
}

export default function CouponPage() {
  const [region, setRegion] = useState("전체");
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const filtered = DUMMY_COUPONS.filter(c => {
    if (region !== "전체" && c.region !== region) return false;
    return true;
  });

  const download = (id: string) => {
    if (!downloaded.includes(id)) setDownloaded(prev => [...prev, id]);
  };

  const expiringSoon = DUMMY_COUPONS.filter(c => {
    const d = new Date(c.validUntil);
    const now = new Date("2026-05-11");
    return (d.getTime() - now.getTime()) / 86400000 <= 14;
  });

  return (
    <div className="max-w-xl lg:max-w-4xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-5">
        <h1 className="text-xl font-black text-ocean-50">🎫 쿠폰 허브</h1>
        <p className="text-xs text-slate-500 mt-0.5">좌대 할인 쿠폰을 다운받고 예약할 때 사용하세요</p>
      </div>

      {/* 마감 임박 배너 */}
      {expiringSoon.length > 0 && (
        <div className="rounded-2xl border border-rose-800 bg-rose-900/20 p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⏰</span>
            <span className="font-bold text-rose-300 text-sm">마감 임박 쿠폰</span>
            <span className="ml-auto text-xs text-rose-400">{expiringSoon.length}개</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {expiringSoon.map(c => (
              <button key={c.id} onClick={() => download(c.id)}
                className="text-xs px-3 py-1.5 bg-rose-900/40 border border-rose-700 text-rose-300 rounded-full font-bold hover:bg-rose-800/40 transition-colors">
                {c.jwaedaeName.slice(0, 6)} {c.type === "percent" ? `${c.value}%` : c.type === "fixed" ? `${c.value.toLocaleString()}원` : "무료"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 지역 필터 */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 -mx-4 px-4">
        {REGIONS.map(r => (
          <button key={r} onClick={() => setRegion(r)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${region === r ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
            {r}
          </button>
        ))}
      </div>

      {/* 쿠폰 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(c => {
          const isDownloaded = downloaded.includes(c.id);
          const usedPct = Math.round((1 - c.remainCount / c.totalCount) * 100);
          const daysLeft = Math.ceil((new Date(c.validUntil).getTime() - new Date("2026-05-11").getTime()) / 86400000);
          const urgent = daysLeft <= 14;

          return (
            <div key={c.id} className={`rounded-2xl border bg-ocean-900 overflow-hidden ${urgent ? "border-rose-800/50" : "border-ocean-800"}`}>
              {/* 쿠폰 본체 */}
              <div className="flex items-center gap-4 p-4">
                <CouponBadge type={c.type} value={c.value} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-200 text-sm mb-0.5">{c.title}</div>
                  <div className="text-xs text-slate-500 mb-1">{c.jwaedaeName} · {c.region}</div>
                  <div className="text-xs text-slate-500">{c.description}</div>
                  {c.minAmount > 0 && (
                    <div className="text-[10px] text-slate-600 mt-1">{c.minAmount.toLocaleString()}원 이상 결제 시</div>
                  )}
                </div>
              </div>

              {/* 구분선 (점선) */}
              <div className="border-t border-dashed border-ocean-700 mx-4" />

              {/* 하단 정보 */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className={urgent ? "text-rose-400 font-bold" : ""}>
                    {urgent ? `⏰ ${daysLeft}일 남음` : `~${c.validUntil}`}
                  </span>
                  <span>잔여 {c.remainCount}/{c.totalCount}</span>
                </div>
                {isDownloaded ? (
                  <Link href={`/jwaedae/${c.jwaedaeId}`}
                    className="px-4 py-1.5 bg-teal-900/40 border border-teal-700 text-teal-300 text-xs font-bold rounded-xl transition-colors">
                    ✅ 예약하러 가기
                  </Link>
                ) : (
                  <button onClick={() => download(c.id)}
                    className="px-4 py-1.5 bg-hook hover:bg-hook-light text-ocean-950 text-xs font-black rounded-xl transition-colors">
                    다운받기
                  </button>
                )}
              </div>

              {/* 사용률 바 */}
              <div className="h-1 bg-ocean-800">
                <div className="h-full bg-hook/40 transition-all" style={{ width: `${usedPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-600 mt-6">쿠폰은 예약 시 자동 적용됩니다 · 중복 사용 불가</p>
    </div>
  );
}
