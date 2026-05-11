import { notFound } from "next/navigation";
import Link from "next/link";
import { DUMMY_CATCHES } from "@/lib/dummy-catch";
import FishBadge from "@/components/fish-badge";
import { SPOT_TYPE_ICON, METHOD_ICON, LEVEL_COLOR } from "@/lib/constants";

export default async function CatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = DUMMY_CATCHES.find((c) => c.id === id);
  if (!report) notFound();

  const weatherIcon = { 맑음: "☀️", 흐림: "☁️", 비: "🌧️", 바람: "💨" }[report.weather.condition] ?? "🌤️";
  const levelColor = LEVEL_COLOR[report.authorLevel] ?? "";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/catch" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 조황 피드로</Link>

      <article className="rounded-2xl border border-ocean-800 bg-ocean-900 overflow-hidden">
        {/* 헤더 */}
        <div className="p-5 border-b border-ocean-800">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-slate-100">{report.authorName}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${levelColor}`}>{report.authorLevel}</span>
            <span className="text-xs text-ocean-400">· {report.region}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <span>{SPOT_TYPE_ICON[report.spotType]} {report.spotType}</span>
            <span>·</span>
            <span>{METHOD_ICON[report.fishingMethod]} {report.fishingMethod}</span>
            <span>·</span>
            <span className="text-ocean-300">{report.tidePhase}</span>
            <span>·</span>
            <span>{weatherIcon} {report.weather.condition} {report.weather.temp}°C</span>
            <span>·</span>
            <span>파고 {report.weather.waveHeight}</span>
            <span>·</span>
            <span>풍속 {report.weather.windSpeed}</span>
          </div>
        </div>

        {/* 위치 */}
        <div className="px-5 py-3 bg-ocean-950/30 border-b border-ocean-800">
          <p className="text-sm text-slate-300">📍 {report.location}</p>
        </div>

        {/* 어획 */}
        <div className="p-5 border-b border-ocean-800">
          <h2 className="text-xs text-slate-500 font-medium mb-3">어획 현황</h2>
          <div className="flex flex-wrap gap-2">
            {report.catches.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-ocean-800/60 border border-ocean-700 rounded-xl px-3 py-2">
                <FishBadge name={c.fishName} />
                <span className="text-sm font-bold text-slate-200">{c.size}</span>
                {c.count > 1 && <span className="text-xs text-slate-400">×{c.count}마리</span>}
                {c.note && <span className="text-xs text-ocean-400">{c.note}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* 본문 */}
        <div className="p-5 border-b border-ocean-800">
          <h2 className="text-xs text-slate-500 font-medium mb-3">조황 상세</h2>
          <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-line">{report.content}</p>
        </div>

        {/* 태그 */}
        <div className="px-5 py-3 border-b border-ocean-800">
          <div className="flex flex-wrap gap-1.5">
            {report.tags.map((tag) => (
              <span key={tag} className="text-xs text-ocean-400">#{tag}</span>
            ))}
          </div>
        </div>

        {/* 만족도 + 반응 */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <button className="flex items-center gap-1 hover:text-rose-400 transition-colors">
              ♥ <span>{report.likeCount}</span>
            </button>
            <span>💬 {report.commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            {"★".repeat(report.rating)}
            <span className="text-xs text-slate-500 ml-1">조황 만족도</span>
          </div>
        </div>
      </article>

      {/* 댓글 섹션 (더미) */}
      <section className="mt-6">
        <h2 className="text-sm font-bold text-slate-300 mb-3">댓글 {report.commentCount}개</h2>
        <div className="space-y-3">
          {["감사해요! 저도 법환 자주 가는데 정보 도움 됐어요 ㅎㅎ", "몇 시에 포인트 도착하셨어요? 조류 방향은?", "크릴 사이즈는 어떤 거 쓰셨나요?"].map((comment, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-xl bg-ocean-900 border border-ocean-800">
              <div className="w-7 h-7 rounded-full bg-ocean-700 flex items-center justify-center text-xs shrink-0">🎣</div>
              <div>
                <div className="text-xs text-ocean-400 mb-1">낚시인{i + 1}</div>
                <p className="text-sm text-slate-300">{comment}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input className="flex-1 h-10 bg-ocean-800 border border-ocean-700 rounded-full px-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-ocean-500" placeholder="댓글을 입력하세요..." />
          <button className="h-10 px-4 bg-ocean-600 hover:bg-ocean-500 text-white rounded-full text-sm font-medium transition-colors">등록</button>
        </div>
      </section>
    </div>
  );
}
