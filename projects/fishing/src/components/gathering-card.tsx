import Link from "next/link";
import { FishingGathering } from "@/lib/types";
import FishBadge from "./fish-badge";
import { SPOT_TYPE_ICON, METHOD_ICON } from "@/lib/constants";

interface GatheringCardProps {
  item: FishingGathering;
}

export default function GatheringCard({ item }: GatheringCardProps) {
  const remaining = item.maxMembers - item.currentMembers;
  const fillRate = item.currentMembers / item.maxMembers;
  const isAlmostFull = fillRate >= 0.8;
  const isFull = fillRate >= 1;

  const costLabel = item.costType === "free" ? "무료" : `${item.costAmount?.toLocaleString()}원`;
  const costSub = item.costType === "split" ? "/인 분담" : item.costType === "fixed" ? "/인 고정" : "";

  const dateObj = new Date(item.date);
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getDate()}(${weekdays[dateObj.getDay()]})`;

  return (
    <Link href={`/gathering/${item.id}`}>
      <div className="group rounded-2xl border border-ocean-800 bg-ocean-900 hover:border-ocean-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-black/20 p-4">
        {/* 상단 */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-slate-100 text-sm leading-snug flex-1">{item.title}</h3>
          {isAlmostFull && !isFull && (
            <span className="text-[10px] bg-rose-950/60 text-rose-400 border border-rose-800 px-2 py-0.5 rounded-full shrink-0">마감임박</span>
          )}
          {isFull && (
            <span className="text-[10px] bg-slate-800 text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full shrink-0">마감</span>
          )}
        </div>

        {/* 호스트 정보 */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="text-slate-300 font-medium">{item.hostName}</span>
          <span className="text-ocean-600">·</span>
          <span className="text-hook">★ {item.hostRating}</span>
          <span className="text-ocean-600">·</span>
          <span className="text-slate-500">조획 {item.hostCatchCount}마리</span>
        </div>

        {/* 정보 그리드 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>📅</span><span>{dateStr} {item.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{SPOT_TYPE_ICON[item.spotType]}</span><span>{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{METHOD_ICON[item.fishingMethod]}</span><span>{item.fishingMethod}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-hook font-bold">{costLabel}</span>
            <span className="text-slate-500">{costSub}</span>
          </div>
        </div>

        {/* 어종 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.targetFish.map((f) => <FishBadge key={f} name={f} />)}
          {item.beginnerWelcome && (
            <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-800 px-2 py-0.5 rounded-full">초보환영</span>
          )}
          {item.equipmentProvided && (
            <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">장비제공</span>
          )}
        </div>

        {/* 참가 현황 */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-ocean-800 rounded-full overflow-hidden">
            <div className="h-full bg-ocean-500 rounded-full transition-all" style={{ width: `${Math.min(fillRate * 100, 100)}%` }} />
          </div>
          <span className="text-xs text-slate-400">
            <span className={isAlmostFull ? "text-rose-400 font-bold" : "text-ocean-300"}>{item.currentMembers}</span>/{item.maxMembers}명
            {!isFull && <span className="text-slate-500"> ({remaining}자리 남음)</span>}
          </span>
        </div>
      </div>
    </Link>
  );
}
