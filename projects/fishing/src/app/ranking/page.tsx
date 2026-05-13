"use client";
import { useState } from "react";

// ── 타입 ──────────────────────────────────────────
type PeriodKey = "day" | "week" | "month";
type MainTabKey = "전체" | "어종별" | "지역별" | "이달의신인";
type FishTabKey = "갈치" | "감성돔" | "참돔" | "방어" | "광어";

// ── 이번주 TOP 조과 포디움 ────────────────────────
const TOP_CATCH_PODIUM = [
  { rank: 2, avatar: "🎣", nick: "바다킹_제주", fish: "참돔", size: "2.1kg", qty: 7, pts: 2840, order: 1 },
  { rank: 1, avatar: "🏆", nick: "갈치헌터", fish: "갈치", size: "98cm", qty: 12, pts: 4210, order: 2 },
  { rank: 3, avatar: "🎯", nick: "서귀포낚꾼", fish: "방어", size: "3.8kg", qty: 3, pts: 2150, order: 3 },
];

// ── 내 순위 ──────────────────────────────────────
const MY_RANK = { rank: 23, total: 1842, topPct: 1.3 };

// ── 전체 랭킹 리스트 ─────────────────────────────
const FULL_RANKING = [
  { rank: 1, nick: "갈치헌터", region: "서귀포", pts: 4210, fish: "갈치", badge: "🥇", change: 2 },
  { rank: 2, nick: "바다킹_제주", region: "한림", pts: 2840, fish: "참돔", badge: "🥈", change: 0 },
  { rank: 3, nick: "서귀포낚꾼", region: "서귀포", pts: 2150, fish: "방어", badge: "🥉", change: -1 },
  { rank: 4, nick: "모슬포마스터", region: "모슬포", pts: 1980, fish: "광어", badge: null, change: 3 },
  { rank: 5, nick: "성산일출낚시", region: "성산", pts: 1760, fish: "감성돔", badge: null, change: 1 },
  { rank: 6, nick: "애월바다꾼", region: "애월", pts: 1540, fish: "갈치", badge: null, change: -2 },
  { rank: 7, nick: "구좌해녀아빠", region: "구좌", pts: 1320, fish: "참돔", badge: null, change: 0 },
  { rank: 8, nick: "한림낚시왕", region: "한림", pts: 1180, fish: "감성돔", badge: null, change: 4 },
  { rank: 9, nick: "협재보트맨", region: "한림", pts: 1050, fish: "광어", badge: null, change: -1 },
  { rank: 10, nick: "표선갈치달인", region: "표선", pts: 960, fish: "갈치", badge: null, change: 2 },
];

// ── 어종별 랭킹 ──────────────────────────────────
const FISH_RANKING: Record<FishTabKey, typeof FULL_RANKING> = {
  "갈치": [
    { rank: 1, nick: "갈치헌터", region: "서귀포", pts: 4210, fish: "갈치", badge: "🥇", change: 0 },
    { rank: 2, nick: "애월바다꾼", region: "애월", pts: 2100, fish: "갈치", badge: "🥈", change: 1 },
    { rank: 3, nick: "표선갈치달인", region: "표선", pts: 1840, fish: "갈치", badge: "🥉", change: -1 },
    { rank: 4, nick: "야간갈치GO", region: "서귀포", pts: 1520, fish: "갈치", badge: null, change: 2 },
    { rank: 5, nick: "모슬포갈치왕", region: "모슬포", pts: 1210, fish: "갈치", badge: null, change: 0 },
  ],
  "감성돔": [
    { rank: 1, nick: "감성돔헌터", region: "한림", pts: 3100, fish: "감성돔", badge: "🥇", change: 1 },
    { rank: 2, nick: "성산일출낚시", region: "성산", pts: 2700, fish: "감성돔", badge: "🥈", change: 0 },
    { rank: 3, nick: "한림낚시왕", region: "한림", pts: 2100, fish: "감성돔", badge: "🥉", change: 2 },
    { rank: 4, nick: "구좌바위낚시", region: "구좌", pts: 1850, fish: "감성돔", badge: null, change: -1 },
    { rank: 5, nick: "협재감성돔", region: "한림", pts: 1400, fish: "감성돔", badge: null, change: 0 },
  ],
  "참돔": [
    { rank: 1, nick: "바다킹_제주", region: "한림", pts: 2840, fish: "참돔", badge: "🥇", change: 0 },
    { rank: 2, nick: "구좌해녀아빠", region: "구좌", pts: 2200, fish: "참돔", badge: "🥈", change: 1 },
    { rank: 3, nick: "성산참돔호", region: "성산", pts: 1960, fish: "참돔", badge: "🥉", change: -1 },
    { rank: 4, nick: "참돔킹덤", region: "서귀포", pts: 1540, fish: "참돔", badge: null, change: 3 },
    { rank: 5, nick: "마라도참돔", region: "모슬포", pts: 1280, fish: "참돔", badge: null, change: 0 },
  ],
  "방어": [
    { rank: 1, nick: "서귀포낚꾼", region: "서귀포", pts: 2150, fish: "방어", badge: "🥇", change: 0 },
    { rank: 2, nick: "방어킹모슬포", region: "모슬포", pts: 1900, fish: "방어", badge: "🥈", change: 2 },
    { rank: 3, nick: "부시리헌터", region: "서귀포", pts: 1650, fish: "방어", badge: "🥉", change: -1 },
    { rank: 4, nick: "겨울방어달인", region: "한림", pts: 1300, fish: "방어", badge: null, change: 1 },
    { rank: 5, nick: "성산방어호", region: "성산", pts: 1100, fish: "방어", badge: null, change: 0 },
  ],
  "광어": [
    { rank: 1, nick: "모슬포마스터", region: "모슬포", pts: 1980, fish: "광어", badge: "🥇", change: 0 },
    { rank: 2, nick: "협재보트맨", region: "한림", pts: 1600, fish: "광어", badge: "🥈", change: -1 },
    { rank: 3, nick: "광어킹제주", region: "구좌", pts: 1380, fish: "광어", badge: "🥉", change: 2 },
    { rank: 4, nick: "보트낚시매니아", region: "애월", pts: 1180, fish: "광어", badge: null, change: 1 },
    { rank: 5, nick: "제주광어달인", region: "성산", pts: 960, fish: "광어", badge: null, change: 0 },
  ],
};

// ── 지역별 ───────────────────────────────────────
const REGION_RANKING = [
  { rank: 1, region: "서귀포", anglers: 342, avgPts: 820, topFish: "갈치", change: 1 },
  { rank: 2, region: "한림", anglers: 298, avgPts: 750, topFish: "감성돔", change: 0 },
  { rank: 3, region: "성산", anglers: 241, avgPts: 690, topFish: "참돔", change: 2 },
  { rank: 4, region: "모슬포", anglers: 213, avgPts: 640, topFish: "방어", change: -1 },
  { rank: 5, region: "애월", anglers: 187, avgPts: 580, topFish: "광어", change: 1 },
  { rank: 6, region: "구좌", anglers: 154, avgPts: 510, topFish: "벵에돔", change: 0 },
  { rank: 7, region: "표선", anglers: 128, avgPts: 460, topFish: "갈치", change: 3 },
];

// ── 이달의 신인 ──────────────────────────────────
const ROOKIE_RANKING = [
  { rank: 1, nick: "낚시입문자1", region: "서귀포", pts: 840, fish: "갈치", joinedDays: 12 },
  { rank: 2, nick: "제주이사왔어요", region: "한림", pts: 720, fish: "참돔", joinedDays: 18 },
  { rank: 3, nick: "낚시초보탈출", region: "성산", pts: 650, fish: "광어", joinedDays: 22 },
  { rank: 4, nick: "첫낚시감동", region: "애월", pts: 510, fish: "감성돔", joinedDays: 25 },
  { rank: 5, nick: "바다가좋아", region: "구좌", pts: 420, fish: "방어", joinedDays: 28 },
];

// ── 기존 섹션 데이터 ─────────────────────────────
const TOP_JWAEDAE = [
  { rank: 2, name: "한림 갯바위", loc: "한림읍", catches: 142, score: 4.8, change: 1, hue: 195 },
  { rank: 1, name: "애월 바다 좌대", loc: "애월읍", catches: 218, score: 4.9, change: 0, hue: 210 },
  { rank: 3, name: "성산 선상낚시", loc: "성산읍", catches: 96, score: 4.7, change: -1, hue: 30 },
];
const TOP_FISH = [
  { name: "광어", count: 482, color: "#5fa3cf", emoji: "🐟", change: 2 },
  { name: "농어", count: 376, color: "#fbbf24", emoji: "🐠", change: 0 },
  { name: "참돔", count: 284, color: "#f87171", emoji: "🐡", change: 1 },
  { name: "감성돔", count: 215, color: "#a78bfa", emoji: "🐟", change: -1 },
  { name: "우럭", count: 168, color: "#86efac", emoji: "🐠", change: 0 },
  { name: "벵에돔", count: 124, color: "#fb923c", emoji: "🐟", change: 2 },
];
const BIG_FISH = [
  { rank: 1, fish: "농어", size: 92, angler: "박민수", loc: "한림 갯바위", date: "5.08", color: "#fbbf24" },
  { rank: 2, fish: "광어", size: 87, angler: "김지훈", loc: "모슬포", date: "5.06", color: "#5fa3cf" },
  { rank: 3, fish: "참돔", size: 76, angler: "최영진", loc: "마라도", date: "5.05", color: "#f87171" },
  { rank: 4, fish: "농어", size: 71, angler: "이서연", loc: "애월", date: "5.04", color: "#fbbf24" },
  { rank: 5, fish: "감성돔", size: 58, angler: "정태호", loc: "성산", date: "5.03", color: "#a78bfa" },
];
const TOP_POINTS = [
  { rank: 1, name: "한림 갯바위", region: "한림읍", regionColor: "#5fa3cf", catches: 342, change: 3 },
  { rank: 2, name: "모슬포 방파제", region: "대정읍", regionColor: "#fbbf24", catches: 287, change: -1 },
  { rank: 3, name: "애월 한담", region: "애월읍", regionColor: "#86efac", catches: 254, change: 1 },
  { rank: 4, name: "성산 일출봉 앞", region: "성산읍", regionColor: "#f87171", catches: 198, change: 0 },
  { rank: 5, name: "마라도 갯바위", region: "대정읍", regionColor: "#fbbf24", catches: 165, change: 2 },
];

// ── 헬퍼 컴포넌트 ────────────────────────────────
function ChangeArrow({ n }: { n: number }) {
  if (n === 0) return <span className="fl-ch zero">—</span>;
  if (n > 0) return <span className="fl-ch up">↑ {n}</span>;
  return <span className="fl-ch down">↓ {Math.abs(n)}</span>;
}

function SectionHeader({ kicker, title, subtitle, accent }: {
  kicker: string; title: string; subtitle: string; accent?: string;
}) {
  return (
    <div className="fl-sec-head" style={{ paddingTop: 20, paddingBottom: 4 }}>
      <div className="fl-sec-bar" style={{ background: accent ?? "var(--hook)" }} />
      <div className="fl-sec-text">
        <div className="fl-sec-kicker" style={{ color: accent ?? "var(--hook)" }}>{kicker}</div>
        <div className="fl-sec-title">{title}</div>
        {subtitle && <div className="fl-sec-sub">{subtitle}</div>}
      </div>
    </div>
  );
}

// ── 이번주 TOP 조과 포디움 ────────────────────────
function CatchPodium() {
  const sorted = [...TOP_CATCH_PODIUM].sort((a, b) => a.order - b.order);
  const podiumHeights = [80, 110, 65]; // 2위, 1위, 3위 높이

  return (
    <div className="fl-rk-catch-podium-wrap" style={{
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      gap: 8, padding: "0 16px 20px",
    }}>
      {sorted.map((p, i) => {
        const isFirst = p.rank === 1;
        const medalColors: Record<number, string> = { 1: "#f59e0b", 2: "#94a3b8", 3: "#cd7f32" };
        const color = medalColors[p.rank];
        return (
          <div key={p.rank} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
            {/* 메달 */}
            <span style={{ fontSize: 20, marginBottom: 4 }}>
              {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉"}
            </span>
            {/* 카드 */}
            <div style={{
              width: "100%", borderRadius: 14,
              background: `linear-gradient(135deg, ${color}33, ${color}18)`,
              border: `1px solid ${color}55`,
              padding: isFirst ? "14px 8px" : "10px 6px",
              textAlign: "center",
              boxShadow: isFirst ? `0 4px 20px ${color}40` : undefined,
            }}>
              <div className={isFirst ? "podium-avatar-1" : "podium-avatar-other"} style={{ fontSize: isFirst ? 28 : 22, marginBottom: 4 }}>{p.avatar}</div>
              <div style={{
                fontSize: 11, fontWeight: 800,
                color: "var(--text-strong)",
                letterSpacing: "-0.3px", marginBottom: 2,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {p.nick}
              </div>
              <div style={{ fontSize: 9, color: color, fontWeight: 700, marginBottom: 6 }}>
                {p.fish}
              </div>
              <div style={{
                display: "flex", justifyContent: "center", gap: 6, marginBottom: 4,
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: isFirst ? 13 : 11, fontWeight: 800, color: "var(--hook-300)" }}>
                    {p.qty}
                  </div>
                  <div style={{ fontSize: 8, color: "var(--text-mute)" }}>마리</div>
                </div>
                <div style={{ width: 1, background: "var(--line)" }} />
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: isFirst ? 13 : 11, fontWeight: 800, color: "var(--text)" }}>
                    {p.size}
                  </div>
                  <div style={{ fontSize: 8, color: "var(--text-mute)" }}>크기</div>
                </div>
              </div>
              <div style={{
                fontSize: 10, fontWeight: 800, color, padding: "3px 0",
                borderTop: `1px solid ${color}33`,
              }}>
                {p.pts.toLocaleString()}pt
              </div>
            </div>
            {/* 받침대 */}
            <div style={{
              width: "100%", height: podiumHeights[i],
              background: `${color}22`,
              border: `1px solid ${color}44`,
              borderTop: "none",
              borderRadius: "0 0 8px 8px",
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              paddingBottom: 6,
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color }}>{p.rank}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── 내 순위 카드 ──────────────────────────────────
function MyRankCard() {
  return (
    <div style={{
      margin: "0 16px 12px",
      background: "linear-gradient(135deg, rgba(59,163,207,0.12), rgba(245,158,11,0.08))",
      border: "1px solid var(--line-2)",
      borderRadius: "var(--r-card)",
      padding: "14px 16px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "linear-gradient(135deg, var(--ocean-300), var(--hook))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20, flexShrink: 0,
      }}>
        🎣
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "var(--text-mute)", marginBottom: 2 }}>나의 현재 순위</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", letterSpacing: "-0.5px" }}>
            {MY_RANK.rank}위
          </span>
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>/ {MY_RANK.total.toLocaleString()}명</span>
        </div>
      </div>
      <div style={{
        textAlign: "right",
        background: "rgba(245,158,11,0.12)",
        border: "1px solid rgba(245,158,11,0.25)",
        borderRadius: 10, padding: "6px 10px",
      }}>
        <div style={{ fontSize: 9, color: "var(--text-mute)", marginBottom: 2 }}>상위</div>
        <div style={{ fontSize: 16, fontWeight: 900, color: "var(--hook-300)" }}>
          {MY_RANK.topPct}%
        </div>
      </div>
    </div>
  );
}

// ── 전체 랭킹 행 ──────────────────────────────────
function RankRow({ item }: { item: typeof FULL_RANKING[0] }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 16px",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{
        width: 28, textAlign: "center",
        fontSize: item.badge ? 18 : 14,
        fontWeight: 900,
        color: item.badge ? undefined : "var(--text-dim)",
      }}>
        {item.badge ?? item.rank}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)", marginBottom: 1 }}>
          {item.nick}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
          {item.region} · 주종: {item.fish}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-strong)" }}>
          {item.pts.toLocaleString()}<span style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 2 }}>pt</span>
        </div>
        <div style={{ fontSize: 10, marginTop: 1 }}>
          <ChangeArrow n={item.change} />
        </div>
      </div>
    </div>
  );
}

// ── 지역별 랭킹 행 ────────────────────────────────
function RegionRow({ item }: { item: typeof REGION_RANKING[0] }) {
  const rankColors = ["#f59e0b", "#94a3b8", "#cd7f32"];
  const color = rankColors[item.rank - 1] ?? "var(--text-dim)";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 16px",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ width: 24, textAlign: "center", fontSize: 13, fontWeight: 900, color }}>
        {item.rank}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)", marginBottom: 1 }}>
          {item.region}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
          낚시인 {item.anglers}명 · 주요 어종: {item.topFish}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-strong)" }}>
          avg {item.avgPts}<span style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 2 }}>pt</span>
        </div>
        <div style={{ fontSize: 10, marginTop: 1 }}><ChangeArrow n={item.change} /></div>
      </div>
    </div>
  );
}

// ── 신인왕 행 ─────────────────────────────────────
function RookieRow({ item }: { item: typeof ROOKIE_RANKING[0] }) {
  const rankColors = ["#f59e0b", "#94a3b8", "#cd7f32"];
  const color = rankColors[item.rank - 1] ?? "var(--text-dim)";
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 16px",
      borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ width: 24, textAlign: "center", fontSize: 13, fontWeight: 900, color }}>
        {item.rank}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 1 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)" }}>{item.nick}</span>
          {item.rank === 1 && (
            <span style={{
              fontSize: 9, fontWeight: 800,
              background: "rgba(245,158,11,0.15)", color: "#f59e0b",
              border: "1px solid rgba(245,158,11,0.3)",
              padding: "1px 5px", borderRadius: 4,
            }}>
              신인왕
            </span>
          )}
        </div>
        <div style={{ fontSize: 11, color: "var(--text-mute)" }}>
          {item.region} · 가입 {item.joinedDays}일차 · 주종: {item.fish}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-strong)" }}>
          {item.pts.toLocaleString()}<span style={{ fontSize: 10, color: "var(--text-dim)", marginLeft: 2 }}>pt</span>
        </div>
      </div>
    </div>
  );
}

// ── 기존 컴포넌트들 ──────────────────────────────
function Podium() {
  return (
    <div className="fl-podium">
      {TOP_JWAEDAE.map((p) => (
        <div key={p.rank} className={`fl-pod fl-pod-${p.rank}`}>
          <div className="fl-pod-medal">
            {p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉"}
          </div>
          <div className="fl-pod-card" style={{ "--hue": p.hue } as React.CSSProperties}>
            <div className="fl-pod-thumb">🛖</div>
            <div className="fl-pod-name">{p.name}</div>
            <div className="fl-pod-loc">📍 {p.loc}</div>
            <div className="fl-pod-stats">
              <div className="fl-pod-stat">
                <div className="fl-pod-n">{p.catches}</div>
                <div className="fl-pod-l">조황</div>
              </div>
              <div className="fl-pod-stat">
                <div className="fl-pod-n">{p.score}</div>
                <div className="fl-pod-l">평점</div>
              </div>
            </div>
            <div className="fl-pod-change"><ChangeArrow n={p.change} /> 지난주</div>
          </div>
          <div className={`fl-pod-base fl-pod-base-${p.rank}`}>
            <span>{p.rank}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FishBar({ f, max }: { f: typeof TOP_FISH[0]; max: number }) {
  const pct = (f.count / max) * 100;
  return (
    <div className="fl-fbar-row">
      <div className="fl-fbar-rank">{f.emoji}</div>
      <div className="fl-fbar-info">
        <div className="fl-fbar-name">{f.name}</div>
        <div className="fl-fbar-bar">
          <div className="fl-fbar-fill" style={{ width: `${pct}%`, background: f.color }} />
        </div>
      </div>
      <div className="fl-fbar-num">
        <strong style={{ color: f.color }}>{f.count}</strong>
        <span>마리</span>
        <ChangeArrow n={f.change} />
      </div>
    </div>
  );
}

function BigFishRow({ b }: { b: typeof BIG_FISH[0] }) {
  return (
    <div className="fl-big-row">
      <div className="fl-big-rank">{b.rank}</div>
      <div className="fl-big-fish-info">
        <div className="fl-big-fish-name" style={{ color: b.color }}>{b.fish}</div>
        <div className="fl-big-angler">{b.angler} · {b.loc} · {b.date}</div>
      </div>
      <div className="fl-big-size" style={{ color: b.color }}>
        {b.size}<span>cm</span>
      </div>
    </div>
  );
}

function PointRow({ p }: { p: typeof TOP_POINTS[0] }) {
  return (
    <div className="fl-prow">
      <div className="fl-prow-rank">{p.rank}</div>
      <div className="fl-prow-pin" style={{ background: p.regionColor }}>📍</div>
      <div className="fl-prow-info">
        <div className="fl-prow-name">{p.name}</div>
        <div className="fl-prow-region">
          <span className="fl-prow-chip" style={{
            background: `${p.regionColor}22`, color: p.regionColor, borderColor: `${p.regionColor}55`,
          }}>
            {p.region}
          </span>
        </div>
      </div>
      <div className="fl-prow-stats">
        <div className="fl-prow-n">{p.catches}<span>건</span></div>
        <ChangeArrow n={p.change} />
      </div>
    </div>
  );
}

// ── 메인 페이지 ───────────────────────────────────
function handleShare() {
  if (typeof navigator !== "undefined" && navigator.share) {
    navigator.share({
      title: "제주 낚시 위클리 랭킹",
      text: "제주 낚시 이번 주 랭킹을 확인해보세요!",
      url: window.location.href,
    }).catch(() => {});
  } else {
    alert("랭킹 링크가 복사되었습니다!\n" + window.location.href);
  }
}

export default function RankingPage() {
  const [period, setPeriod] = useState<PeriodKey>("week");
  const [mainTab, setMainTab] = useState<MainTabKey>("전체");
  const [fishTab, setFishTab] = useState<FishTabKey>("갈치");
  const maxFish = Math.max(...TOP_FISH.map(f => f.count));

  const FISH_TABS: FishTabKey[] = ["갈치", "감성돔", "참돔", "방어", "광어"];

  return (
    <>
      {/* 히어로 */}
      <section className="fl-rk-hero">
        <div className="fl-catch-hero-glow" />
        <div className="fl-tide-hero-inner">
          <div className="fl-catch-hero-kicker">RANKING</div>
          <h1 className="fl-catch-hero-title">
            제주 낚시<br /><span className="fl-hero-accent">위클리 랭킹</span>
          </h1>
          <div className="fl-catch-hero-meta">
            <span>5.05 — 5.11</span>
            <span className="fl-cond-sep" />
            <span>2,184건 집계</span>
            <span className="fl-cond-sep" />
            <button
              onClick={handleShare}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                padding: "0 2px",
                fontFamily: "inherit",
              }}
            >
              공유 🔗
            </button>
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      {/* 콘텐츠 래퍼: maxWidth 960px 중앙정렬 */}
      <div className="fl-rk-wrap">

        {/* 기간 필터 */}
        <div className="fl-filters">
          <div className="fl-sort">
            {([ ["day", "일간"], ["week", "주간"], ["month", "월간"] ] as const).map(([k, l]) => (
              <button
                key={k}
                className={`fl-sort-btn${period === k ? " on" : ""}`}
                onClick={() => setPeriod(k)}
                style={{ fontFamily: "inherit" }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* ── 이번주 TOP 조과 포디움 ── */}
        <SectionHeader
          kicker="THIS WEEK TOP"
          title="이번주 TOP 조과"
          subtitle="포인트 기준 이번 주 최고 낚시인"
          accent="var(--hook)"
        />
        <CatchPodium />

        {/* ── 메인 탭 ── */}
        <div className="fl-cm-tabs" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
          {(["전체", "어종별", "지역별", "이달의신인"] as MainTabKey[]).map(t => (
            <button
              key={t}
              className={`fl-cm-tab${mainTab === t ? " on" : ""}`}
              onClick={() => setMainTab(t)}
              style={{ fontFamily: "inherit", flexShrink: 0 }}
            >
              {t === "이달의신인" ? "이달의 신인" : t}
            </button>
          ))}
        </div>

        {/* ── 전체 탭 ── */}
        {mainTab === "전체" && (
          <div className="fl-rk-myrank-list">
            {/* 내 순위 카드 */}
            <MyRankCard />

            <div style={{
              background: "var(--tint-04)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-card)",
              margin: "0 16px 16px",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "12px 16px 10px",
                borderBottom: "1px solid var(--line)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)" }}>전체 랭킹 TOP 10</span>
                <span style={{ fontSize: 11, color: "var(--text-mute)" }}>포인트 기준</span>
              </div>
              {FULL_RANKING.map(item => <RankRow key={item.rank} item={item} />)}
            </div>
          </div>
        )}

        {/* ── 어종별 탭 ── */}
        {mainTab === "어종별" && (
          <>
            {/* 어종 칩 — 모바일 가로 스크롤 */}
            <div style={{
              display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none",
              padding: "8px 16px 16px", flexWrap: "nowrap",
            }}>
              {FISH_TABS.map(ft => (
                <button
                  key={ft}
                  className={`fl-chip${fishTab === ft ? " on" : ""}`}
                  onClick={() => setFishTab(ft)}
                  style={{ fontFamily: "inherit", flexShrink: 0, minHeight: 44 }}
                >
                  {ft}
                </button>
              ))}
            </div>

            <div style={{
              background: "var(--tint-04)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-card)",
              margin: "0 16px 16px",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "12px 16px 10px",
                borderBottom: "1px solid var(--line)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)" }}>
                  {fishTab} 랭킹 TOP 5
                </span>
                <span style={{ fontSize: 11, color: "var(--text-mute)" }}>포인트 기준</span>
              </div>
              {FISH_RANKING[fishTab].map(item => <RankRow key={item.rank} item={item} />)}
            </div>
          </>
        )}

        {/* ── 지역별 탭 ── */}
        {mainTab === "지역별" && (
          <div style={{
            background: "var(--tint-04)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-card)",
            margin: "8px 16px 16px",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "12px 16px 10px",
              borderBottom: "1px solid var(--line)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)" }}>지역별 랭킹</span>
              <span style={{ fontSize: 11, color: "var(--text-mute)" }}>평균 포인트 기준</span>
            </div>
            {REGION_RANKING.map(item => <RegionRow key={item.rank} item={item} />)}
          </div>
        )}

        {/* ── 이달의 신인 탭 ── */}
        {mainTab === "이달의신인" && (
          <>
            <div style={{
              margin: "8px 16px 12px",
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: "var(--r-sm)",
              padding: "10px 14px",
              fontSize: 12, color: "var(--text-dim)",
              lineHeight: 1.5,
            }}>
              이번달 신규 가입 후 가장 빠르게 성장한 낚시인을 소개합니다.
            </div>
            <div style={{
              background: "var(--tint-04)",
              border: "1px solid var(--line)",
              borderRadius: "var(--r-card)",
              margin: "0 16px 16px",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "12px 16px 10px",
                borderBottom: "1px solid var(--line)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)" }}>
                  이달의 신인왕
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 800,
                  background: "rgba(245,158,11,0.15)", color: "#f59e0b",
                  border: "1px solid rgba(245,158,11,0.3)",
                  padding: "2px 6px", borderRadius: 4,
                }}>
                  5월
                </span>
              </div>
              {ROOKIE_RANKING.map(item => <RookieRow key={item.rank} item={item} />)}
            </div>
          </>
        )}

        {/* ── 기존 섹션: HOT 좌대 + 포인트 ── */}
        <div className="fl-rk-podium-points-grid">
          <div>
            <SectionHeader kicker="HOT JWAEDAE" title="HOT 좌대 TOP 3" subtitle="이번 주 가장 핫한 좌대" accent="#fbbf24" />
            <Podium />
          </div>
          <div>
            <SectionHeader kicker="POINTS" title="포인트 랭킹" subtitle="조황이 잘 잡힌 포인트" accent="#86efac" />
            <div className="fl-prow-list">
              {TOP_POINTS.map(p => <PointRow key={p.rank} p={p} />)}
            </div>
          </div>
        </div>

        {/* ── 기존 섹션: 어종 마릿수 + 빅피쉬 ── */}
        <div className="fl-rk-fish-big-grid">
          <div>
            <SectionHeader kicker="FISH" title="어종별 마릿수" subtitle="가장 많이 잡힌 어종" accent="#5fa3cf" />
            <div className="fl-fbar-list">
              {TOP_FISH.map(f => <FishBar key={f.name} f={f} max={maxFish} />)}
            </div>
          </div>
          <div>
            <SectionHeader kicker="BIG FISH" title="이번 주 빅 피쉬" subtitle="가장 큰 사이즈 TOP 5" accent="#fbbf24" />
            <div className="fl-big-list">
              {BIG_FISH.map(b => <BigFishRow key={b.rank} b={b} />)}
            </div>
          </div>
        </div>

        {/* 하단 여백 — 모바일 바텀 네비 100px */}
        <div style={{ height: 100 }} />

      </div>

      {/* 반응형 스타일 */}
      <style>{`
        /* 콘텐츠 래퍼: maxWidth 960px 중앙정렬 */
        .fl-rk-wrap {
          max-width: 960px;
          margin: 0 auto;
          width: 100%;
          overflow-x: hidden;
        }

        /* HOT 좌대 + 포인트 그리드: 모바일 1열 → PC 2열 */
        .fl-rk-podium-points-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .fl-rk-podium-points-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* 어종 마릿수 + 빅피쉬 그리드: 모바일 1열 → PC 2열 */
        .fl-rk-fish-big-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .fl-rk-fish-big-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* 전체/어종별 랭킹 목록: PC에서 2컬럼 카드 그리드 */
        .fl-rk-list-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .fl-rk-list-grid {
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            padding: 0 16px;
          }
          .fl-rk-list-grid > div {
            margin: 0 !important;
          }
        }

        /* 포디움: PC에서 더 크게 */
        @media (min-width: 768px) {
          .fl-rk-catch-podium-wrap {
            padding: 0 40px 28px;
          }
          .fl-rk-catch-podium-wrap .podium-avatar-1 {
            font-size: 40px !important;
          }
          .fl-rk-catch-podium-wrap .podium-avatar-other {
            font-size: 32px !important;
          }
        }

        /* 내 순위 카드 + 랭킹 박스: PC에서 나란히 */
        .fl-rk-myrank-list {
          display: block;
        }
        @media (min-width: 768px) {
          .fl-rk-myrank-list {
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 12px;
            padding: 0 16px;
            align-items: start;
          }
          .fl-rk-myrank-list > *:first-child {
            margin: 0 !important;
          }
          .fl-rk-myrank-list > *:last-child {
            margin: 0 !important;
          }
        }
      `}</style>
    </>
  );
}
