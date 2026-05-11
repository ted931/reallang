"use client";
import { useState } from "react";
import Link from "next/link";
import { DUMMY_CATCHES as DUMMY_CATCH } from "@/lib/dummy-catch";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";

const TOP_JWAEDAE = [
  { rank: 2, name: '한림 갯바위', loc: '한림읍', catches: 142, score: 4.8, change: 1, hue: 195 },
  { rank: 1, name: '애월 바다 좌대', loc: '애월읍', catches: 218, score: 4.9, change: 0, hue: 210 },
  { rank: 3, name: '성산 선상낚시', loc: '성산읍', catches: 96, score: 4.7, change: -1, hue: 30 },
];

const TOP_FISH = [
  { name: '광어', count: 482, color: '#5fa3cf', emoji: '🐟', change: 2 },
  { name: '농어', count: 376, color: '#fbbf24', emoji: '🐠', change: 0 },
  { name: '참돔', count: 284, color: '#f87171', emoji: '🐡', change: 1 },
  { name: '감성돔', count: 215, color: '#a78bfa', emoji: '🐟', change: -1 },
  { name: '우럭', count: 168, color: '#86efac', emoji: '🐠', change: 0 },
  { name: '벵에돔', count: 124, color: '#fb923c', emoji: '🐟', change: 2 },
];

const BIG_FISH = [
  { rank: 1, fish: '농어', size: 92, angler: '박민수', loc: '한림 갯바위', date: '12.16', color: '#fbbf24' },
  { rank: 2, fish: '광어', size: 87, angler: '김지훈', loc: '모슬포', date: '12.14', color: '#5fa3cf' },
  { rank: 3, fish: '참돔', size: 76, angler: '최영진', loc: '마라도', date: '12.11', color: '#f87171' },
  { rank: 4, fish: '농어', size: 71, angler: '이서연', loc: '애월', date: '12.10', color: '#fbbf24' },
  { rank: 5, fish: '감성돔', size: 58, angler: '정태호', loc: '성산', date: '12.09', color: '#a78bfa' },
];

const TOP_POINTS = [
  { rank: 1, name: '한림 갯바위', region: '한림읍', regionColor: '#5fa3cf', catches: 342, change: 3 },
  { rank: 2, name: '모슬포 방파제', region: '대정읍', regionColor: '#fbbf24', catches: 287, change: -1 },
  { rank: 3, name: '애월 한담', region: '애월읍', regionColor: '#86efac', catches: 254, change: 1 },
  { rank: 4, name: '성산 일출봉 앞', region: '성산읍', regionColor: '#f87171', catches: 198, change: 0 },
  { rank: 5, name: '마라도 갯바위', region: '대정읍', regionColor: '#fbbf24', catches: 165, change: 2 },
];

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
      <div className="fl-sec-bar" style={{ background: accent ?? 'var(--hook)' }} />
      <div className="fl-sec-text">
        <div className="fl-sec-kicker" style={{ color: accent ?? 'var(--hook)' }}>{kicker}</div>
        <div className="fl-sec-title">{title}</div>
        {subtitle && <div className="fl-sec-sub">{subtitle}</div>}
      </div>
    </div>
  );
}

function Podium() {
  return (
    <div className="fl-podium">
      {TOP_JWAEDAE.map((p) => (
        <div key={p.rank} className={`fl-pod fl-pod-${p.rank}`}>
          <div className="fl-pod-medal">
            {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : '🥉'}
          </div>
          <div className="fl-pod-card" style={{ '--hue': p.hue } as React.CSSProperties}>
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
          <span
            className="fl-prow-chip"
            style={{
              background: `${p.regionColor}22`,
              color: p.regionColor,
              borderColor: `${p.regionColor}55`,
            }}
          >
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

export default function RankingPage() {
  const [period, setPeriod] = useState('week');
  const maxFish = Math.max(...TOP_FISH.map(f => f.count));

  return (
    <>
      <section className="fl-rk-hero">
        <div className="fl-catch-hero-glow" />
        <div className="fl-tide-hero-inner">
          <div className="fl-catch-hero-kicker">RANKING</div>
          <h1 className="fl-catch-hero-title">
            제주 낚시<br /><span className="fl-hero-accent">위클리 랭킹</span>
          </h1>
          <div className="fl-catch-hero-meta">
            <span>12.09 — 12.15</span>
            <span className="fl-cond-sep" />
            <span>2,184건 집계</span>
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      <div className="fl-filters">
        <div className="fl-sort">
          {([['day', '일간'], ['week', '주간'], ['month', '월간']] as const).map(([k, l]) => (
            <button key={k} className={`fl-sort-btn ${period === k ? 'on' : ''}`} onClick={() => setPeriod(k)}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <SectionHeader kicker="HOT JWAEDAE" title="HOT 좌대 TOP 3" subtitle="이번 주 가장 핫한 좌대" accent="#fbbf24" />
      <Podium />

      <SectionHeader kicker="FISH" title="어종별 마릿수" subtitle="가장 많이 잡힌 어종" accent="#5fa3cf" />
      <div className="fl-fbar-list">
        {TOP_FISH.map(f => <FishBar key={f.name} f={f} max={maxFish} />)}
      </div>

      <SectionHeader kicker="BIG FISH" title="이번 주 빅 피쉬" subtitle="가장 큰 사이즈 TOP 5" accent="#fbbf24" />
      <div className="fl-big-list">
        {BIG_FISH.map(b => <BigFishRow key={b.rank} b={b} />)}
      </div>

      <SectionHeader kicker="POINTS" title="포인트 랭킹" subtitle="조황이 잘 잡힌 포인트" accent="#86efac" />
      <div className="fl-prow-list">
        {TOP_POINTS.map(p => <PointRow key={p.rank} p={p} />)}
      </div>
    </>
  );
}
