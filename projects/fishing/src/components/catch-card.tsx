import Link from "next/link";
import { CatchReport } from "@/lib/types";
import FishBadge from "./fish-badge";
import { SPOT_TYPE_ICON, METHOD_ICON, LEVEL_COLOR } from "@/lib/constants";

function timeAgo(date: string) {
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

interface CatchCardProps {
  report: CatchReport;
  compact?: boolean;
}

export default function CatchCard({ report, compact }: CatchCardProps) {
  const weatherIcon = { 맑음: "☀️", 흐림: "☁️", 비: "🌧️", 바람: "💨" }[report.weather.condition] ?? "🌤️";
  const levelColor = LEVEL_COLOR[report.authorLevel] ?? "";

  return (
    <Link href={`/catch/${report.id}`}>
      <div className="group rounded-2xl border border-ocean-800 bg-ocean-900 hover:border-ocean-600 hover:-translate-y-0.5 transition-all shadow-lg shadow-black/20 overflow-hidden">
        {/* 헤더 */}
        <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-100">{report.authorName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${levelColor}`}>{report.authorLevel}</span>
            <span className="text-xs text-ocean-400">{report.region}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0">
            <span>{weatherIcon}</span>
            <span>{report.weather.temp}°C</span>
          </div>
        </div>

        {/* 위치 */}
        <div className="px-4 pb-2 flex items-center gap-1.5 text-xs text-slate-400">
          <span>{SPOT_TYPE_ICON[report.spotType]}</span>
          <span className="truncate">{report.location}</span>
          <span className="text-ocean-600">·</span>
          <span>{METHOD_ICON[report.fishingMethod]}</span>
          <span>{report.fishingMethod}</span>
          <span className="text-ocean-600">·</span>
          <span className="text-ocean-300">{report.tidePhase}</span>
        </div>

        {/* 어획 */}
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {report.catches.map((c, i) => (
            <FishBadge key={i} name={c.fishName} size={c.size} count={c.count} />
          ))}
        </div>

        {/* 본문 */}
        {!compact && (
          <div className="px-4 pb-3 text-sm text-slate-300 line-clamp-2 leading-relaxed">
            {report.content}
          </div>
        )}

        {/* 태그 */}
        <div className="px-4 pb-3 flex flex-wrap gap-1">
          {report.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[11px] text-ocean-400">#{tag}</span>
          ))}
        </div>

        {/* 푸터 */}
        <div className="px-4 pb-4 flex items-center justify-between text-xs text-slate-500 border-t border-ocean-800/50 pt-2">
          <div className="flex items-center gap-3">
            <span>♥ {report.likeCount}</span>
            <span>💬 {report.commentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            {"★".repeat(report.rating)}
            <span>{timeAgo(report.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
