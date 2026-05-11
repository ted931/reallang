import Link from "next/link";
import { Jwaedae } from "@/lib/types";
import FishBadge from "./fish-badge";

interface JwaedaeCardProps {
  item: Jwaedae;
}

export default function JwaedaeCard({ item }: JwaedaeCardProps) {
  const catchRateColor = { 상: "text-teal-sea", 중: "text-amber-400", 하: "text-slate-400" }[item.catchRate];
  const availableColor = item.availableSeats === 0 ? "text-rose-400 bg-rose-950/50" : item.availableSeats <= 3 ? "text-amber-400 bg-amber-950/50" : "text-teal-300 bg-teal-950/50";

  return (
    <Link href={`/jwaedae/${item.id}`}>
      <div className="group rounded-2xl border border-ocean-800 bg-ocean-900 hover:border-ocean-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-black/20 overflow-hidden">
        {/* 이미지 플레이스홀더 */}
        <div className="h-40 relative" style={{ background: "linear-gradient(135deg, #0d2137 0%, #0f3460 50%, #1a4d70 100%)" }}>
          <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-30">🛖</div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${availableColor}`}>
              {item.availableSeats === 0 ? "마감" : `잔여 ${item.availableSeats}석`}
            </span>
          </div>
          {item.hasAccommodation && (
            <div className="absolute top-3 right-3">
              <span className="text-xs bg-hook/20 text-hook border border-hook/30 px-2 py-1 rounded-full font-medium">숙박가능</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <span className="text-xs bg-ocean-950/80 text-ocean-300 px-2 py-1 rounded-full">{item.region}</span>
          </div>
        </div>

        {/* 본문 */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-slate-100 leading-tight">{item.name}</h3>
            <div className="text-right shrink-0">
              <div className="text-hook font-bold text-sm">{item.priceDay.toLocaleString()}원</div>
              <div className="text-[10px] text-slate-500">1인 주간</div>
            </div>
          </div>

          {/* 위치 */}
          <div className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <span>📍</span><span className="truncate">{item.location}</span>
          </div>

          {/* 어종 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.targetFish.slice(0, 4).map((f) => (
              <FishBadge key={f} name={f} />
            ))}
          </div>

          {/* 시설 */}
          <div className="flex flex-wrap gap-1 mb-3">
            {item.facilities.slice(0, 4).map((f) => (
              <span key={f} className="text-[10px] bg-ocean-800/60 text-ocean-300 px-2 py-0.5 rounded-full">{f}</span>
            ))}
          </div>

          {/* 교통 */}
          <div className="text-xs text-slate-500 flex items-center gap-1 mb-3">
            <span>🚢</span><span className="truncate">{item.transportInfo}</span>
          </div>

          {/* 하단 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span className="text-hook">★</span>
              <span className="text-slate-200 font-medium">{item.rating}</span>
              <span className="text-slate-500">({item.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">조황</span>
              <span className={`font-bold ${catchRateColor}`}>{item.catchRate}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
