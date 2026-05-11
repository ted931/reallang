import Link from "next/link";
import { DUMMY_CATCHES as DUMMY_CATCH } from "@/lib/dummy-catch";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";
import { DUMMY_POINTS } from "@/lib/dummy-points";
import { FISH_COLOR } from "@/lib/constants";

// 어종별 집계
function topFish(n = 10) {
  const map: Record<string, number> = {};
  DUMMY_CATCH.forEach(c => c.catches.forEach(f => { map[f.fish] = (map[f.fish] ?? 0) + f.count; }));
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n);
}

// 포인트별 조황 수 집계
function topPoints(n = 5) {
  const map: Record<string, number> = {};
  DUMMY_CATCH.forEach(c => { map[c.location] = (map[c.location] ?? 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n);
}

// 좌대별 평점 정렬
function topJwaedae(n = 5) {
  return [...DUMMY_JWAEDAE].sort((a, b) => b.rating - a.rating).slice(0, n);
}

// 이번 주 인기 좌대 (더미: likes * rating)
function hotJwaedae(n = 3) {
  return [...DUMMY_JWAEDAE].sort((a, b) => b.reviewCount * b.rating - a.reviewCount * a.rating).slice(0, n);
}

const MEDALS = ["🥇", "🥈", "🥉", "4위", "5위", "6위", "7위", "8위", "9위", "10위"];

export default function RankingPage() {
  const fish = topFish(10);
  const points = topPoints(5);
  const jwaedae = topJwaedae(5);
  const hot = hotJwaedae(3);
  const totalCatch = fish.reduce((a, [, c]) => a + c, 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="mb-5">
        <h1 className="text-xl font-black text-white">🏆 조황 랭킹</h1>
        <p className="text-xs text-slate-500 mt-0.5">이번 달 피싱로그 회원들의 실시간 조과 집계</p>
      </div>

      {/* 이번 주 HOT 좌대 */}
      <div className="rounded-2xl border border-hook/30 bg-hook/5 p-5 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🔥</span>
          <h2 className="font-bold text-hook">이번 주 인기 좌대 TOP3</h2>
        </div>
        <div className="space-y-2">
          {hot.map((j, i) => (
            <Link key={j.id} href={`/jwaedae/${j.id}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-ocean-900 hover:bg-ocean-800 transition-colors">
              <span className="text-xl shrink-0">{MEDALS[i]}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-200 text-sm truncate">{j.name}</div>
                <div className="text-xs text-slate-500">{j.region} · ★ {j.rating} · 리뷰 {j.reviewCount}개</div>
              </div>
              <div className="text-sm font-black text-hook shrink-0">{j.priceDay.toLocaleString()}원</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* 어종 랭킹 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span>🐟</span>
            <h2 className="font-bold text-slate-200">어종 TOP10</h2>
            <span className="ml-auto text-xs text-slate-500">총 {totalCatch}마리</span>
          </div>
          <div className="space-y-2">
            {fish.map(([name, count], i) => {
              const pct = Math.round((count / fish[0][1]) * 100);
              const colorClass = (FISH_COLOR as Record<string, string>)[name] ?? "bg-slate-600";
              return (
                <div key={name}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 w-5">{MEDALS[i]}</span>
                      <span className="text-slate-200 font-bold">{name}</span>
                    </div>
                    <span className="text-slate-400 font-mono">{count}마리</span>
                  </div>
                  <div className="h-1.5 bg-ocean-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colorClass} opacity-80`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 포인트 랭킹 */}
        <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
          <div className="flex items-center gap-2 mb-3">
            <span>📍</span>
            <h2 className="font-bold text-slate-200">핫 포인트 TOP5</h2>
          </div>
          <div className="space-y-3">
            {points.map(([loc, cnt], i) => (
              <div key={loc} className="flex items-center gap-3">
                <span className="text-xl shrink-0">{MEDALS[i]}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-200 truncate">{loc}</div>
                  <div className="text-xs text-slate-500">조황 보고 {cnt}건</div>
                </div>
                <div className="shrink-0">
                  {i === 0 && <span className="text-xs px-2 py-0.5 bg-rose-900/40 text-rose-300 border border-rose-800 rounded-full">HOT</span>}
                </div>
              </div>
            ))}
          </div>
          <Link href="/map" className="block mt-4 text-center text-xs text-ocean-400 hover:text-ocean-300">
            포인트 지도 보기 →
          </Link>
        </div>
      </div>

      {/* 좌대 평점 TOP5 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span>🛖</span>
          <h2 className="font-bold text-slate-200">좌대 평점 TOP5</h2>
        </div>
        <div className="space-y-2">
          {jwaedae.map((j, i) => (
            <Link key={j.id} href={`/jwaedae/${j.id}`}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-ocean-800 transition-colors">
              <span className="text-xl shrink-0">{MEDALS[i]}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-200 truncate">{j.name}</div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>{j.region}</span>
                  <span>·</span>
                  <span>{j.targetFish.slice(0, 2).join(", ")}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-black text-hook">★ {j.rating}</div>
                <div className="text-[10px] text-slate-500">{j.reviewCount}리뷰</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 오늘의 빅 피쉬 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span>🏅</span>
          <h2 className="font-bold text-slate-200">오늘의 빅 피쉬</h2>
        </div>
        <div className="space-y-2">
          {DUMMY_CATCH.filter(c => c.catches.some(f => f.size)).slice(0, 5).map((c, i) => {
            const bigFish = c.catches.filter(f => f.size).sort((a, b) => (b.size ?? 0) - (a.size ?? 0))[0];
            return (
              <Link key={c.id} href={`/catch/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-ocean-800 transition-colors">
                <span className="text-lg shrink-0">{MEDALS[i]}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-200">{c.userName} · {bigFish?.fish}</div>
                  <div className="text-xs text-slate-500">{c.location} · {c.date}</div>
                </div>
                <div className="text-sm font-black text-teal-400 shrink-0">{bigFish?.size}cm</div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
