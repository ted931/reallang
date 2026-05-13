"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DUMMY_STAY, STAY_TYPE_LABEL } from "@/lib/dummy-stay";

export default function StayDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
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
    <div className="max-w-5xl mx-auto px-4 lg:px-0 py-6 pb-32 lg:pb-6">
      <Link href="/stay" className="text-sm mb-6 inline-block" style={{ color: "var(--text-dim)" }}>← 숙소 목록</Link>

      <div className="lg:flex lg:gap-8">
        {/* 왼쪽: 메인 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* 이미지 플레이스홀더 */}
          <div className="rounded-2xl h-48 lg:h-72 flex items-center justify-center text-6xl mb-5 border" style={{ background: "var(--ocean-800)", borderColor: "var(--line)" }}>
            {s.images[0]}
          </div>

          {/* 기본 정보 */}
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs mb-1 block" style={{ color: "var(--text-mute)" }}>{STAY_TYPE_LABEL[s.type]} · {s.region}</span>
                <h1 className="text-xl font-black" style={{ color: "var(--text-strong)" }}>{s.name}</h1>
              </div>
              <div className="text-right shrink-0 lg:hidden">
                <div className="text-xl font-black text-hook">{s.pricePerNight.toLocaleString()}원</div>
                <div className="text-xs" style={{ color: "var(--text-mute)" }}>/박</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-hook text-sm">★ {s.rating}</span>
              <span className="text-xs" style={{ color: "var(--text-mute)" }}>({s.reviewCount}개 리뷰)</span>
              <span style={{ color: "var(--line)" }}>·</span>
              <span className="text-xs" style={{ color: "var(--text-mute)" }}>최대 {s.capacity}명 · {s.rooms}개 방</span>
            </div>
          </div>

          {/* 포인트 정보 */}
          <div className="rounded-2xl p-4 mb-4" style={{ border: "1px solid var(--line)", background: "var(--ocean-900)" }}>
            <div className="flex items-center gap-2 mb-1">
              <span>🎣</span>
              <span className="text-sm font-bold" style={{ color: "var(--text)" }}>{s.nearbySpot}</span>
              <span className="text-xs" style={{ color: "var(--text-mute)" }}>({s.distanceToSpot})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {s.targetFish.map(f => (
                <span key={f} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--ocean-800)", border: "1px solid var(--line)", color: "var(--text)" }}>{f}</span>
              ))}
            </div>
          </div>

          {/* 설명 */}
          <div className="rounded-2xl p-5 mb-4" style={{ border: "1px solid var(--line)", background: "var(--ocean-900)" }}>
            <h2 className="font-bold mb-2" style={{ color: "var(--text-strong)" }}>숙소 소개</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{s.description}</p>
            <div className="mt-3 text-xs" style={{ color: "var(--text-mute)" }}>호스트: {s.hostName}</div>
          </div>

          {/* 편의시설 */}
          <div className="rounded-2xl p-5 mb-4" style={{ border: "1px solid var(--line)", background: "var(--ocean-900)" }}>
            <h2 className="font-bold mb-3" style={{ color: "var(--text-strong)" }}>편의시설</h2>
            <div className="grid grid-cols-2 gap-2">
              {s.amenities.map(a => (
                <div key={a} className="flex items-center gap-2 text-sm" style={{ color: "var(--text)" }}>
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
        </div>

        {/* 오른쪽: 예약 패널 (PC only) */}
        <div className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-6 self-start rounded-2xl p-5" style={{ border: "1px solid var(--line)", background: "var(--ocean-900)" }}>
            <div className="text-right mb-4">
              <div className="text-2xl font-black text-hook">{s.pricePerNight.toLocaleString()}원</div>
              <div className="text-xs" style={{ color: "var(--text-mute)" }}>/박</div>
            </div>
            <div className="flex flex-col gap-3 mb-4">
              <div>
                <label className="text-xs block mb-1 font-bold" style={{ color: "var(--text-mute)" }}>체크인</label>
                <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                  className="w-full h-10 rounded-xl px-3 text-sm focus:outline-none"
                  style={{ background: "var(--ocean-800)", border: "1px solid var(--line)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="text-xs block mb-1 font-bold" style={{ color: "var(--text-mute)" }}>체크아웃</label>
                <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                  className="w-full h-10 rounded-xl px-3 text-sm focus:outline-none"
                  style={{ background: "var(--ocean-800)", border: "1px solid var(--line)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="text-xs block mb-1 font-bold" style={{ color: "var(--text-mute)" }}>인원</label>
                <div className="flex items-center gap-2 h-10">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full text-sm font-bold" style={{ background: "var(--ocean-800)", color: "var(--text)" }}>−</button>
                  <span className="flex-1 text-center text-sm font-bold" style={{ color: "var(--text-strong)" }}>{guests}명</span>
                  <button onClick={() => setGuests(Math.min(s.capacity, guests + 1))} className="w-8 h-8 rounded-full text-sm font-bold" style={{ background: "var(--ocean-800)", color: "var(--text)" }}>+</button>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-sm mb-4 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
              <span style={{ color: "var(--text-mute)" }}>{s.pricePerNight.toLocaleString()}원 × {nights}박</span>
              <span className="font-black text-hook">{total.toLocaleString()}원</span>
            </div>
            <button
              onClick={() => router.push(`/stay/${id}/checkout?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
              className="w-full py-3 bg-hook font-black rounded-2xl text-sm" style={{ color: "var(--ocean-950,#0a1628)" }}>
              🏠 {nights}박 예약
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 하단 예약 패널 */}
      <div className="lg:hidden fixed bottom-20 left-0 right-0 z-40 px-4 py-3 backdrop-blur-sm" style={{ background: "var(--ocean-950)", borderTop: "1px solid var(--line)" }}>
        <div className="max-w-xl mx-auto">
          <div className="flex gap-2 mb-3">
            <div className="flex-1">
              <label className="text-[10px] block mb-1" style={{ color: "var(--text-mute)" }}>체크인</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)}
                className="w-full h-9 rounded-xl px-3 text-xs focus:outline-none"
                style={{ background: "var(--ocean-800)", border: "1px solid var(--line)", color: "var(--text)" }} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] block mb-1" style={{ color: "var(--text-mute)" }}>체크아웃</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)}
                className="w-full h-9 rounded-xl px-3 text-xs focus:outline-none"
                style={{ background: "var(--ocean-800)", border: "1px solid var(--line)", color: "var(--text)" }} />
            </div>
            <div className="w-20">
              <label className="text-[10px] block mb-1" style={{ color: "var(--text-mute)" }}>인원</label>
              <div className="flex items-center gap-1 h-9">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-7 h-7 rounded-full text-sm font-bold" style={{ background: "var(--ocean-800)", color: "var(--text)" }}>−</button>
                <span className="w-4 text-center text-sm font-bold" style={{ color: "var(--text-strong)" }}>{guests}</span>
                <button onClick={() => setGuests(Math.min(s.capacity, guests + 1))} className="w-7 h-7 rounded-full text-sm font-bold" style={{ background: "var(--ocean-800)", color: "var(--text)" }}>+</button>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push(`/stay/${id}/checkout?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
            className="w-full py-3 bg-hook font-black rounded-2xl text-sm" style={{ color: "var(--ocean-950,#0a1628)" }}>
            🏠 {nights}박 예약 — {total.toLocaleString()}원
          </button>
        </div>
      </div>
    </div>
  );
}
