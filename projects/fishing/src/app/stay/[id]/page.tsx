"use client";
import { use, useState } from "react";
import Link from "next/link";
import { DUMMY_STAY, STAY_TYPE_LABEL } from "@/lib/dummy-stay";

export default function StayDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const s = DUMMY_STAY.find((x) => x.id === id);
  const [checkIn, setCheckIn] = useState("2026-05-23");
  const [checkOut, setCheckOut] = useState("2026-05-24");
  const [guests, setGuests] = useState(2);

  if (!s) return <div className="p-8 text-center text-slate-400">숙소를 찾을 수 없습니다.</div>;

  const nights = Math.max(1, (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
  const total = s.pricePerNight * nights;

  const amenityIcons: Record<string, string> = {
    "어구세척장": "🚿", "냉동보관": "❄️", "주차": "🅿️", "바베큐": "🔥",
    "조식제공": "🍱", "어구보관": "🎣", "공용주방": "🍳", "세탁기": "🫧",
    "회뜨기서비스": "🔪", "낚시용품대여": "🎿", "샤워실": "🚿", "전기": "⚡",
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-32">
      <Link href="/stay" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 숙소 목록</Link>

      {/* 이미지 플레이스홀더 */}
      <div className="rounded-2xl bg-ocean-800 h-48 flex items-center justify-center text-6xl mb-5 border border-ocean-700">
        {s.images[0]}
      </div>

      {/* 기본 정보 */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs text-slate-500 mb-1 block">{STAY_TYPE_LABEL[s.type]} · {s.region}</span>
            <h1 className="text-xl font-black text-white">{s.name}</h1>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xl font-black text-hook">{s.pricePerNight.toLocaleString()}원</div>
            <div className="text-xs text-slate-500">/박</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-hook text-sm">★ {s.rating}</span>
          <span className="text-xs text-slate-500">({s.reviewCount}개 리뷰)</span>
          <span className="text-slate-700">·</span>
          <span className="text-xs text-slate-500">최대 {s.capacity}명 · {s.rooms}개 방</span>
        </div>
      </div>

      {/* 포인트 정보 */}
      <div className="rounded-2xl border border-teal-800/50 bg-teal-900/10 p-4 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span>🎣</span>
          <span className="text-sm font-bold text-teal-300">{s.nearbySpot}</span>
          <span className="text-xs text-slate-500">({s.distanceToSpot})</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {s.targetFish.map(f => (
            <span key={f} className="text-xs px-2 py-0.5 bg-teal-900/40 border border-teal-800 text-teal-300 rounded-full">{f}</span>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-2">숙소 소개</h2>
        <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
        <div className="mt-3 text-xs text-slate-500">호스트: {s.hostName}</div>
      </div>

      {/* 편의시설 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-3">편의시설</h2>
        <div className="grid grid-cols-2 gap-2">
          {s.amenities.map(a => (
            <div key={a} className="flex items-center gap-2 text-sm text-slate-300">
              <span>{amenityIcons[a] ?? "✓"}</span>
              <span>{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {s.tags.map(t => (
          <span key={t} className="px-3 py-1.5 bg-hook/10 text-hook border border-hook/20 rounded-full text-xs font-bold">{t}</span>
        ))}
      </div>

      {/* 하단 예약 패널 */}
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-ocean-950/95 border-t border-ocean-800 px-4 py-3 backdrop-blur-sm">
        <div className="max-w-xl mx-auto">
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 block mb-1">체크인</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                className="w-full h-9 bg-ocean-800 border border-ocean-700 rounded-xl px-3 text-xs text-slate-200 focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 block mb-1">체크아웃</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                className="w-full h-9 bg-ocean-800 border border-ocean-700 rounded-xl px-3 text-xs text-slate-200 focus:outline-none" />
            </div>
            <div className="w-20">
              <label className="text-[10px] text-slate-500 block mb-1">인원</label>
              <div className="flex items-center gap-1 h-9">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full bg-ocean-800 text-slate-300 text-sm font-bold">−</button>
                <span className="w-4 text-center text-sm text-white font-bold">{guests}</span>
                <button onClick={() => setGuests(Math.min(s.capacity, guests + 1))} className="w-7 h-7 rounded-full bg-ocean-800 text-slate-300 text-sm font-bold">+</button>
              </div>
            </div>
          </div>
          <button className="w-full py-3 bg-hook hover:bg-hook-light text-ocean-950 font-black rounded-2xl transition-colors text-sm">
            🏠 {nights}박 예약 — {total.toLocaleString()}원
          </button>
        </div>
      </div>
    </div>
  );
}
