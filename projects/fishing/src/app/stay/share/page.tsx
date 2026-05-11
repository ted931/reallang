"use client";
import { useState } from "react";
import { DUMMY_STAY_SHARE } from "@/lib/dummy-stay";
import Link from "next/link";

export default function StaySharePage() {
  const [requested, setRequested] = useState<string | null>(null);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <Link href="/stay" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 숙소 목록</Link>

      <div className="mb-5">
        <h1 className="text-xl font-black text-white">🤝 방 쉐어</h1>
        <p className="text-xs text-slate-500 mt-0.5">남는 방을 낚시 동행과 나눠 쓰세요</p>
      </div>

      {/* 내 방 등록 */}
      <div className="rounded-2xl bg-gradient-to-r from-ocean-800 to-teal-900/30 border border-teal-800/40 p-4 mb-5 flex items-center justify-between">
        <div>
          <div className="font-bold text-teal-300 text-sm">내 방 공유하기</div>
          <div className="text-xs text-slate-400 mt-0.5">빈 자리 공유하고 숙박비 절약</div>
        </div>
        <button className="shrink-0 px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold rounded-xl transition-colors">
          + 등록
        </button>
      </div>

      {/* 공유 목록 */}
      <div className="space-y-4">
        {DUMMY_STAY_SHARE.map((s) => (
          <div key={s.id} className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            {/* 호스트 */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{s.hostAvatar}</span>
              <div className="flex-1">
                <div className="font-bold text-slate-200 text-sm">{s.hostName}</div>
                <div className="text-xs text-slate-500">{s.stayName} · {s.region}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-hook">{s.pricePerPerson.toLocaleString()}원</div>
                <div className="text-[10px] text-slate-500">/인</div>
              </div>
            </div>

            {/* 날짜 + 잔여 */}
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
              <span>📅 {s.date}</span>
              <span className="px-2 py-0.5 bg-teal-900/40 border border-teal-800 text-teal-300 rounded-full font-bold">
                {s.availableSeats}자리 남음
              </span>
            </div>

            {/* 메모 */}
            <div className="text-xs text-slate-400 bg-ocean-800/60 rounded-xl px-3 py-2 mb-3">
              💬 {s.note}
            </div>

            {/* 어종 */}
            <div className="flex flex-wrap gap-1 mb-4">
              {s.targetFish.map(f => (
                <span key={f} className="text-[10px] px-2 py-0.5 bg-ocean-800 text-slate-500 rounded-full">{f}</span>
              ))}
            </div>

            {requested === s.id ? (
              <div className="w-full py-2.5 bg-teal-900/40 border border-teal-700 text-teal-300 font-bold text-sm text-center rounded-xl">
                ✅ 신청 완료! 호스트 연락을 기다려주세요
              </div>
            ) : (
              <button onClick={() => setRequested(s.id)}
                className="w-full py-2.5 bg-hook hover:bg-hook-light text-ocean-950 font-black text-sm rounded-xl transition-colors">
                🤝 동숙 신청 — {s.pricePerPerson.toLocaleString()}원
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-slate-600 mt-6">신청 후 카카오톡으로 호스트와 연결됩니다</p>
    </div>
  );
}
