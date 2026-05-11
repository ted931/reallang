import { notFound } from "next/navigation";
import Link from "next/link";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";
import FishBadge from "@/components/fish-badge";

export default async function JwaedaeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = DUMMY_JWAEDAE.find((j) => j.id === id);
  if (!item) notFound();

  const catchRateColor = { 상: "text-teal-400", 중: "text-amber-400", 하: "text-slate-400" }[item.catchRate];
  const availableColor = item.availableSeats === 0 ? "text-rose-400" : item.availableSeats <= 3 ? "text-amber-400" : "text-teal-400";

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-0 py-6">
      <Link href="/jwaedae" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 좌대 목록으로</Link>

      <div className="lg:flex lg:gap-8">
        {/* 왼쪽: 메인 콘텐츠 */}
        <div className="lg:flex-1 min-w-0">
          {/* 헤더 이미지 */}
          <div className="rounded-2xl overflow-hidden mb-6 h-48 relative" style={{ background: "linear-gradient(135deg, #0d2137 0%, #0f3460 50%, #1a4d70 100%)" }}>
            <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-20">🛖</div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-ocean-950/80 text-ocean-300 px-2 py-0.5 rounded-full">{item.region}</span>
                {item.hasAccommodation && <span className="text-xs bg-hook/20 text-hook border border-hook/30 px-2 py-0.5 rounded-full">숙박가능</span>}
              </div>
              <h1 className="text-xl font-black text-white">{item.name}</h1>
              <p className="text-sm text-slate-300">{item.operatorName}</p>
            </div>
          </div>

          {/* 핵심 정보 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
              <div className={`text-lg font-black ${availableColor}`}>
                {item.availableSeats === 0 ? "마감" : `${item.availableSeats}석`}
              </div>
              <div className="text-xs" style={{ color: "var(--text-mute)" }}>잔여석/{item.capacity}석</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
              <div className={`text-lg font-black ${catchRateColor}`}>{item.catchRate}</div>
              <div className="text-xs" style={{ color: "var(--text-mute)" }}>조황등급</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
              <div className="text-lg font-black text-hook">★ {item.rating}</div>
              <div className="text-xs" style={{ color: "var(--text-mute)" }}>{item.reviewCount}개 후기</div>
            </div>
          </div>

          {/* 소개 */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
            <h2 className="text-sm font-bold mb-2" style={{ color: "var(--text-strong)" }}>좌대 소개</h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>{item.description}</p>
          </div>

          {/* 대상 어종 */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-strong)" }}>주요 대상 어종</h2>
            <div className="flex flex-wrap gap-2 mb-2">
              {item.targetFish.map((f) => <FishBadge key={f} name={f} />)}
            </div>
            <div className="text-xs" style={{ color: "var(--text-mute)" }}>최적 시즌: {item.bestSeason.join(" · ")}</div>
          </div>

          {/* 시설 */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: "var(--text-strong)" }}>시설 및 서비스</h2>
            <div className="flex flex-wrap gap-2">
              {item.facilities.map((f) => (
                <span key={f} className="text-xs px-3 py-1 rounded-full" style={{ background: "var(--ocean-800)", color: "var(--text)", border: "1px solid var(--line)" }}>✓ {f}</span>
              ))}
            </div>
          </div>

          {/* 운영 일정 */}
          <div className="rounded-2xl p-5 mb-4" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
            <h2 className="text-sm font-bold mb-2" style={{ color: "var(--text-strong)" }}>운영 일정</h2>
            <p className="text-sm" style={{ color: "var(--text)" }}>{item.schedule}</p>
          </div>

          {/* 교통 */}
          <div className="rounded-2xl p-5 mb-6" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
            <h2 className="text-sm font-bold mb-2" style={{ color: "var(--text-strong)" }}>교통 안내</h2>
            <p className="text-sm" style={{ color: "var(--text)" }}>🚢 {item.transportInfo}</p>
            <p className="text-xs mt-2" style={{ color: "var(--text-mute)" }}>📞 예약: {item.operatorPhone}</p>
          </div>
        </div>

        {/* 오른쪽: 예약 카드 (PC 전용 sticky) */}
        <div className="lg:w-72 shrink-0">
          <div className="sticky top-6 self-start hidden lg:block rounded-2xl p-6" style={{ background: "var(--ocean-900)", border: "1px solid var(--line)" }}>
            <div className="mb-4">
              <div className="text-2xl font-black text-hook mb-0.5">{item.priceDay.toLocaleString()}원<span className="text-sm font-normal text-slate-400">/인 (주간)</span></div>
              {item.priceNight && (
                <div className="text-sm text-slate-400">{item.priceNight.toLocaleString()}원/인 (야간)</div>
              )}
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-dim)" }}>잔여석</span>
                <span className={`font-bold ${availableColor}`}>{item.availableSeats === 0 ? "마감" : `${item.availableSeats}/${item.capacity}석`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-dim)" }}>조황등급</span>
                <span className={`font-bold ${catchRateColor}`}>{item.catchRate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--text-dim)" }}>평점</span>
                <span className="font-bold text-hook">★ {item.rating} <span className="text-slate-500 font-normal">({item.reviewCount})</span></span>
              </div>
            </div>
            <button
              className={`w-full py-3.5 rounded-xl font-bold text-base transition-colors ${item.availableSeats === 0 ? "cursor-not-allowed" : "bg-hook hover:bg-hook-light"}`}
              style={item.availableSeats === 0 ? { background: "var(--ocean-800)", color: "var(--text-dim)" } : { color: "var(--ocean-950)" }}
              disabled={item.availableSeats === 0}>
              {item.availableSeats === 0 ? "예약 마감" : "예약하기"}
            </button>
            <p className="text-center text-xs mt-2" style={{ color: "var(--text-mute)" }}>📞 {item.operatorPhone}</p>
          </div>
        </div>
      </div>

      {/* CTA (모바일 전용) */}
      <div className="sticky bottom-24 md:bottom-4 lg:hidden">
        <button className={`w-full py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg ${item.availableSeats === 0 ? "cursor-not-allowed" : "bg-hook hover:bg-hook-light"}`}
          style={item.availableSeats === 0 ? { background: "var(--ocean-800)", color: "var(--text-dim)" } : { color: "var(--ocean-950)" }}
          disabled={item.availableSeats === 0}>
          {item.availableSeats === 0 ? "예약 마감" : `예약하기 — ${item.priceDay.toLocaleString()}원/인`}
        </button>
        <p className="text-center text-xs mt-2" style={{ color: "var(--text-mute)" }}>전화 예약: {item.operatorPhone}</p>
      </div>
    </div>
  );
}
