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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/jwaedae" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 좌대 목록으로</Link>

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
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl bg-ocean-900 border border-ocean-800 p-3 text-center">
          <div className={`text-lg font-black ${availableColor}`}>
            {item.availableSeats === 0 ? "마감" : `${item.availableSeats}석`}
          </div>
          <div className="text-xs text-slate-500">잔여석/{item.capacity}석</div>
        </div>
        <div className="rounded-xl bg-ocean-900 border border-ocean-800 p-3 text-center">
          <div className={`text-lg font-black ${catchRateColor}`}>{item.catchRate}</div>
          <div className="text-xs text-slate-500">조황등급</div>
        </div>
        <div className="rounded-xl bg-ocean-900 border border-ocean-800 p-3 text-center">
          <div className="text-lg font-black text-hook">★ {item.rating}</div>
          <div className="text-xs text-slate-500">{item.reviewCount}개 후기</div>
        </div>
      </div>

      {/* 소개 */}
      <div className="rounded-2xl bg-ocean-900 border border-ocean-800 p-5 mb-4">
        <h2 className="text-sm font-bold text-slate-300 mb-2">좌대 소개</h2>
        <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
      </div>

      {/* 대상 어종 */}
      <div className="rounded-2xl bg-ocean-900 border border-ocean-800 p-5 mb-4">
        <h2 className="text-sm font-bold text-slate-300 mb-3">주요 대상 어종</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {item.targetFish.map((f) => <FishBadge key={f} name={f} />)}
        </div>
        <div className="text-xs text-slate-500">최적 시즌: {item.bestSeason.join(" · ")}</div>
      </div>

      {/* 요금 */}
      <div className="rounded-2xl bg-ocean-900 border border-ocean-800 p-5 mb-4">
        <h2 className="text-sm font-bold text-slate-300 mb-3">요금</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">주간 (1인)</span>
            <span className="text-hook font-bold">{item.priceDay.toLocaleString()}원</span>
          </div>
          {item.priceNight && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">야간 (1인)</span>
              <span className="text-hook font-bold">{item.priceNight.toLocaleString()}원</span>
            </div>
          )}
        </div>
      </div>

      {/* 시설 */}
      <div className="rounded-2xl bg-ocean-900 border border-ocean-800 p-5 mb-4">
        <h2 className="text-sm font-bold text-slate-300 mb-3">시설 및 서비스</h2>
        <div className="flex flex-wrap gap-2">
          {item.facilities.map((f) => (
            <span key={f} className="text-xs bg-ocean-800 text-ocean-300 border border-ocean-700 px-3 py-1 rounded-full">✓ {f}</span>
          ))}
        </div>
      </div>

      {/* 운영 일정 */}
      <div className="rounded-2xl bg-ocean-900 border border-ocean-800 p-5 mb-4">
        <h2 className="text-sm font-bold text-slate-300 mb-2">운영 일정</h2>
        <p className="text-sm text-slate-300">{item.schedule}</p>
      </div>

      {/* 교통 */}
      <div className="rounded-2xl bg-ocean-900 border border-ocean-800 p-5 mb-6">
        <h2 className="text-sm font-bold text-slate-300 mb-2">교통 안내</h2>
        <p className="text-sm text-slate-300">🚢 {item.transportInfo}</p>
        <p className="text-xs text-slate-500 mt-2">📞 예약: {item.operatorPhone}</p>
      </div>

      {/* CTA */}
      <div className="sticky bottom-24 md:bottom-4">
        <button className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-colors shadow-lg ${item.availableSeats === 0 ? "bg-slate-700 cursor-not-allowed" : "bg-hook hover:bg-hook-light"}`} disabled={item.availableSeats === 0}>
          {item.availableSeats === 0 ? "예약 마감" : `예약하기 — ${item.priceDay.toLocaleString()}원/인`}
        </button>
        <p className="text-center text-xs text-slate-500 mt-2">전화 예약: {item.operatorPhone}</p>
      </div>
    </div>
  );
}
