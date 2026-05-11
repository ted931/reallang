"use client";
import { useState } from "react";
import Link from "next/link";
import { DUMMY_RESERVATIONS } from "@/lib/dummy-reservations";

// 낚시 일지 더미 데이터
const DUMMY_LOGS = [
  {
    id: "log1", date: "2026-05-11", location: "서귀포 황금좌대",
    fish: [{ name: "갈치", count: 12, size: 65 }, { name: "참돔", count: 2, size: 42 }],
    weather: "☀️ 맑음", windSpeed: "2.5m/s", tide: "9물",
    method: "야간 갈치", bait: "꽁치살",
    memo: "갈치 입질 폭발. 밤 9시~11시 최고였음. 참돔 2마리는 보너스.",
    photos: 3,
    mood: "😄",
  },
  {
    id: "log2", date: "2026-04-20", location: "성산 일출 좌대",
    fish: [{ name: "참돔", count: 5, size: 38 }],
    weather: "⛅ 흐림", windSpeed: "4.2m/s", tide: "7물",
    method: "선상 낚시", bait: "새우",
    memo: "흐린 날씨에 참돔 꾸준히 올라옴. 5마리 킵. 방파제보다 낫다.",
    photos: 1,
    mood: "😊",
  },
  {
    id: "log3", date: "2026-04-05", location: "한림 애월 좌대",
    fish: [{ name: "감성돔", count: 1, size: 55 }, { name: "볼락", count: 8, size: 0 }],
    weather: "☀️ 맑음", windSpeed: "1.8m/s", tide: "11물",
    method: "찌낚시", bait: "크릴",
    memo: "감성돔 55cm 대물 타작! 오늘은 찌낚시가 정답. 볼락도 마릿수 굿.",
    photos: 5,
    mood: "🤩",
  },
  {
    id: "log4", date: "2026-03-28", location: "모슬포 방파제 좌대",
    fish: [],
    weather: "💨 강풍", windSpeed: "9.5m/s", tide: "3물",
    method: "선상 지깅", bait: "지그",
    memo: "강풍으로 입질 없음. 1시간 만에 철수. 날씨 확인을 더 꼼꼼히 해야겠다.",
    photos: 0,
    mood: "😞",
  },
  {
    id: "log5", date: "2026-03-15", location: "애월 곽지 좌대",
    fish: [{ name: "벵에돔", count: 3, size: 28 }, { name: "볼락", count: 15, size: 0 }],
    weather: "☀️ 맑음", windSpeed: "2.1m/s", tide: "8물",
    method: "릴낚시", bait: "갯지렁이",
    memo: "벵에돔 마릿수 좋고 볼락도 15마리. 3시간 만에 쿨러 반 채움.",
    photos: 2,
    mood: "😄",
  },
];

const STATS = {
  totalDays: DUMMY_LOGS.length,
  totalFish: DUMMY_LOGS.reduce((a, l) => a + l.fish.reduce((b, f) => b + f.count, 0), 0),
  bigFish: Math.max(...DUMMY_LOGS.flatMap(l => l.fish.map(f => f.size)).filter(Boolean)),
  favSpot: "서귀포 황금좌대",
  favFish: "갈치",
};

export default function LogbookPage() {
  const [tab, setTab] = useState<"log" | "stats">("log");

  // 어종 집계
  const fishMap: Record<string, number> = {};
  DUMMY_LOGS.forEach(l => l.fish.forEach(f => { fishMap[f.name] = (fishMap[f.name] ?? 0) + f.count; }));
  const fishRanking = Object.entries(fishMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-black text-white">📓 낚시 일지</h1>
          <p className="text-xs text-slate-500 mt-0.5">나만의 조과 기록을 쌓아보세요</p>
        </div>
        <Link href="/catch/upload"
          className="shrink-0 px-4 py-2 bg-hook hover:bg-hook-light text-ocean-950 text-xs font-black rounded-xl transition-colors">
          + 오늘 기록
        </Link>
      </div>

      {/* 탭 */}
      <div className="flex gap-1.5 mb-5 bg-ocean-900 rounded-2xl p-1 border border-ocean-800">
        {(["log", "stats"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${tab === t ? "bg-hook text-ocean-950" : "text-slate-400 hover:text-slate-200"}`}>
            {t === "log" ? "📋 일지 목록" : "📊 통계"}
          </button>
        ))}
      </div>

      {tab === "log" ? (
        <div className="space-y-4">
          {DUMMY_LOGS.map(log => {
            const totalFish = log.fish.reduce((a, f) => a + f.count, 0);
            const bigFish = log.fish.reduce((a, f) => (f.size > a ? f.size : a), 0);
            return (
              <div key={log.id} className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
                {/* 날짜 + 기분 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-black text-white">{log.date}</div>
                  <span className="text-xl">{log.mood}</span>
                </div>

                {/* 위치 */}
                <div className="text-xs text-teal-400 mb-3">📍 {log.location}</div>

                {/* 어종 */}
                {log.fish.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {log.fish.map(f => (
                      <span key={f.name} className="text-xs px-2.5 py-1 bg-hook/10 text-hook border border-hook/20 rounded-full font-bold">
                        {f.name} {f.count}마리{f.size ? ` (최대${f.size}cm)` : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-slate-600 mb-3">꽝 😅</div>
                )}

                {/* 정보 */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span>{log.weather}</span>
                  <span>💨 {log.windSpeed}</span>
                  <span>🌊 {log.tide}</span>
                  {log.photos > 0 && <span>📸 {log.photos}장</span>}
                </div>

                {/* 메모 */}
                <div className="text-sm text-slate-400 leading-relaxed border-t border-ocean-800 pt-3">
                  {log.memo}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {/* 요약 카드 */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "📅", label: "출조 횟수", value: `${STATS.totalDays}회` },
              { icon: "🐟", label: "총 어획", value: `${STATS.totalFish}마리` },
              { icon: "📏", label: "최대어", value: `${STATS.bigFish}cm` },
              { icon: "🎣", label: "단골 포인트", value: STATS.favSpot.slice(0, 6) + "…" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-ocean-800 bg-ocean-900 p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-lg font-black text-hook">{s.value}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* 어종 랭킹 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <h2 className="font-bold text-slate-200 mb-3">내 어종 랭킹</h2>
            {fishRanking.map(([fish, count], i) => (
              <div key={fish} className="flex items-center gap-3 mb-2 last:mb-0">
                <span className="text-xs text-slate-500 w-4">{i + 1}</span>
                <div className="flex-1 bg-ocean-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-hook rounded-full"
                    style={{ width: `${Math.round(count / fishRanking[0][1] * 100)}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-200 w-16">{fish}</span>
                <span className="text-xs text-slate-500 w-12 text-right">{count}마리</span>
              </div>
            ))}
          </div>

          {/* 월별 출조 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <h2 className="font-bold text-slate-200 mb-3">최근 출조 캘린더</h2>
            <div className="text-xs text-slate-500 text-center py-4">
              📅 캘린더 뷰 (실제 구현 시 출조일 하이라이트)
            </div>
            <div className="flex flex-wrap gap-2">
              {DUMMY_LOGS.map(l => (
                <div key={l.id} className="flex flex-col items-center gap-0.5">
                  <div className="w-9 h-9 rounded-xl bg-hook/10 border border-hook/30 flex items-center justify-center text-base">
                    {l.mood}
                  </div>
                  <div className="text-[9px] text-slate-600">{l.date.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 예약 연동 */}
          <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5">
            <h2 className="font-bold text-slate-200 mb-3">예약 연동 조과</h2>
            {DUMMY_RESERVATIONS.filter(r => r.escrowStatus === "completed").map(r => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-ocean-800/60 mb-2 last:mb-0">
                <span className="text-xl">🎣</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-200">{r.jwaedaeName}</div>
                  <div className="text-xs text-slate-500">{r.date} · {r.targetFish.join(", ")}</div>
                </div>
                <Link href="/catch/upload"
                  className="text-xs px-2.5 py-1 bg-hook/10 text-hook border border-hook/20 rounded-xl font-bold shrink-0">
                  조과 등록
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
