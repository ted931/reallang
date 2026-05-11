"use client";
import { useState } from "react";
import Link from "next/link";
import { DUMMY_CARSHARE } from "@/lib/dummy-carshare";

const REGIONS = ["전체", "서귀포", "성산", "모슬포", "한림", "애월", "구좌"];

export default function CarSharePage() {
  const [region, setRegion] = useState("전체");
  const [dateFilter, setDateFilter] = useState("");

  const filtered = DUMMY_CARSHARE.filter((c) => {
    if (region !== "전체" && c.region !== region) return false;
    if (dateFilter && c.date !== dateFilter) return false;
    return true;
  });

  return (
    <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-5">
        <h1 className="text-xl font-black text-ocean-50">🚗 낚시 카풀</h1>
        <p className="text-xs text-slate-500 mt-0.5">같은 포인트로 가는 낚시인과 이동비를 나눠요</p>
      </div>

      {/* CTA 배너 */}
      <div className="rounded-2xl bg-gradient-to-r from-ocean-800 to-teal-900/40 border border-teal-800/50 p-4 mb-5 flex items-center justify-between">
        <div>
          <div className="font-bold text-teal-300 text-sm">내 카풀 등록하기</div>
          <div className="text-xs text-slate-400 mt-0.5">빈 자리 공유하고 유류비 절약</div>
        </div>
        <Link href="/carshare/new" className="shrink-0 px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors">
          + 등록
        </Link>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex gap-1.5 flex-wrap">
          {REGIONS.map((r) => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${region === r ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
              {r}
            </button>
          ))}
        </div>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
          className="h-8 bg-ocean-800 border border-ocean-700 rounded-xl px-3 text-xs text-slate-300 focus:outline-none focus:border-ocean-500" />
        {dateFilter && (
          <button onClick={() => setDateFilter("")} className="text-xs text-slate-500 hover:text-slate-300 px-2">✕</button>
        )}
      </div>

      {/* 카풀 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-500">조건에 맞는 카풀이 없습니다</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const taken = c.seatsTaken;
            const remain = c.seats - taken;
            const full = remain === 0;
            return (
              <Link key={c.id} href={`/carshare/${c.id}`}
                className={`block rounded-2xl border bg-ocean-900 p-4 transition-colors hover:border-ocean-600 ${full ? "border-ocean-800 opacity-60" : "border-ocean-800"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{c.hostAvatar}</span>
                    <div>
                      <div className="font-bold text-slate-200 text-sm">{c.hostName}</div>
                      <div className="text-xs text-slate-500">{c.carType} · {c.region}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${full ? "bg-slate-800 text-slate-500" : "bg-teal-900/40 text-teal-300 border border-teal-800"}`}>
                    {full ? "마감" : `${remain}석 남음`}
                  </span>
                </div>

                {/* 경로 */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <span className="bg-ocean-800 px-2 py-0.5 rounded-full">{c.departure}</span>
                  <span className="text-slate-600">→</span>
                  <span className="bg-hook/10 text-hook px-2 py-0.5 rounded-full border border-hook/20">{c.destination}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>📅 {c.date}</span>
                    <span>🕓 {c.time}</span>
                  </div>
                  <div className="text-sm font-black text-hook">{c.pricePerSeat.toLocaleString()}원<span className="text-xs font-normal text-slate-500">/인</span></div>
                </div>

                {/* 어종 */}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {c.targetFish.map(f => (
                    <span key={f} className="text-[10px] px-2 py-0.5 bg-ocean-800 text-slate-500 rounded-full">{f}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
