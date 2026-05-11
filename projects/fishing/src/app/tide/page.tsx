"use client";
import { useState } from "react";
import Link from "next/link";
import {
  DUMMY_TIDE, WEATHER_ICON, WEATHER_LABEL, SCORE_COLOR, SCORE_LABEL,
} from "@/lib/dummy-tide";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";

const TIDE_POINTS_STATIC = [
  { t: '03:24', type: '간조', h: 12 },
  { t: '09:42', type: '만조', h: 218 },
  { t: '15:51', type: '간조', h: 28 },
  { t: '22:08', type: '만조', h: 232 },
];

const WEATHER_STATIC = [
  { k: 'temp',  l: '기온',       v: '12°',         s: '체감 9°',   icon: '🌡️' },
  { k: 'wind',  l: '바람',       v: '북동 3m/s',   s: '약함',     icon: '💨' },
  { k: 'wave',  l: '파고',       v: '0.5m',        s: '잔잔',     icon: '🌊' },
  { k: 'cloud', l: '날씨',       v: '맑음',        s: '강수 0%',  icon: '☀️' },
  { k: 'sun',   l: '일출/일몰',  v: '07:34',       s: '17:24',    icon: '🌅' },
  { k: 'visi',  l: '시야',       v: '10km',        s: '매우 좋음', icon: '👁️' },
];

function TideWaveSVG() {
  const W = 600, H = 160;
  const pts: string[] = [];
  for (let x = 0; x <= W; x += 4) {
    const t = (x / W) * 4 * Math.PI - 0.3;
    const y = H / 2 + Math.sin(t) * 50 + Math.cos(t * 0.5) * 8;
    pts.push(`${x},${y}`);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="fl-tide-wave-svg">
      <defs>
        <linearGradient id="tideGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(95,163,207,0.4)" />
          <stop offset="100%" stopColor="rgba(30,101,149,0.05)" />
        </linearGradient>
      </defs>
      <path d={`M0,${H} L${pts.join(' L')} L${W},${H} Z`} fill="url(#tideGrad)" />
      <path d={`M0,${H / 2} L${pts.join(' L')}`} stroke="var(--hook)" strokeWidth="2.5" fill="none" />
      {TIDE_POINTS_STATIC.map((p, i) => {
        const x = (i + 0.5) * (W / TIDE_POINTS_STATIC.length);
        const y = p.type === '만조' ? H / 2 - 50 : H / 2 + 50;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="6" fill="var(--hook)" stroke="#fff" strokeWidth="2" />
            <text x={x} y={y - 14} textAnchor="middle" fill="var(--text-strong)" fontSize="13" fontWeight="800">{p.t}</text>
            <text x={x} y={y + 22} textAnchor="middle" fill="var(--text-dim)" fontSize="11">{p.type} · {p.h}cm</text>
          </g>
        );
      })}
    </svg>
  );
}

function ScoreFish({ score }: { score: number }) {
  return (
    <div className="fl-score-fish">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`fl-score-fish-i ${i < score ? 'on' : ''}`}>🐟</span>
      ))}
    </div>
  );
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

export default function TidePage() {
  const [sel, setSel] = useState(0);
  const cur = DUMMY_TIDE[sel];

  const recommendedJwaedae = DUMMY_JWAEDAE.slice(0, 4);

  return (
    <>
      <section className="fl-tide-hero">
        <div className="fl-catch-hero-glow" />
        <div className="fl-tide-hero-inner">
          <div className="fl-catch-hero-kicker">TIDE CALENDAR</div>
          <h1 className="fl-catch-hero-title">
            {cur.date}<br />
            <span className="fl-hero-accent">{cur.tideLabel} {cur.moonPhase}</span>
          </h1>
          <div className="fl-tide-score-row">
            <ScoreFish score={cur.fishingScore} />
            <div className="fl-tide-score-l">출조 점수 <strong>{cur.fishingScore}.0</strong> / 5</div>
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      <div className="fl-tide-dates">
        {DUMMY_TIDE.map((t, i) => {
          const dt = new Date(t.date);
          const dow = ['일', '월', '화', '수', '목', '금', '토'][dt.getDay()];
          const isToday = t.date === '2026-05-11';
          return (
            <button
              key={i}
              className={`fl-tide-date ${sel === i ? 'on' : ''} ${t.fishingScore === 5 ? 'gold' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => setSel(i)}
            >
              <div className="fl-tide-date-dow">{dow}</div>
              <div className="fl-tide-date-d">{dt.getDate()}</div>
              <div className="fl-tide-date-mul">{t.tideLabel}</div>
              <div className={`fl-tide-date-score s-${t.fishingScore}`} />
            </button>
          );
        })}
      </div>

      <SectionHeader kicker="TIDE GRAPH" title="조석 예보" subtitle={`${cur.date} 만조·간조 그래프`} accent="#5fa3cf" />
      <div className="fl-tide-graph">
        <TideWaveSVG />
      </div>

      <SectionHeader kicker="WEATHER" title="기상 정보" subtitle="출조 컨디션 한눈에 확인" accent="#5fa3cf" />
      <div className="fl-tide-weather">
        {WEATHER_STATIC.map(w => (
          <div key={w.k} className="fl-tide-wx">
            <div className="fl-tide-wx-icon">{w.icon}</div>
            <div className="fl-tide-wx-l">{w.l}</div>
            <div className="fl-tide-wx-v">{w.v}</div>
            <div className="fl-tide-wx-s">{w.s}</div>
          </div>
        ))}
      </div>

      <SectionHeader kicker="JWAEDAE" title="이 날 좌대 추천" subtitle="물때와 잘 맞는 좌대" accent="#fbbf24" />
      <div className="fl-carousel">
        {recommendedJwaedae.map(s => (
          <Link key={s.id} href={`/jwaedae/${s.id}`} className="fl-catch fl-tide-rec">
            <div className="fl-catch-img" style={{ '--hue': 210 } as React.CSSProperties}>
              <div className="fl-catch-img-fish" style={{ fontSize: 48, display: 'grid', placeItems: 'center' }}>🛖</div>
              <div className="fl-hot-badge">🔥 추천</div>
              <div className="fl-catch-size">{s.availableSeats}<span>석 남음</span></div>
            </div>
            <div className="fl-catch-body">
              <div className="fl-catch-fish">{s.name}</div>
              <div className="fl-catch-meta">📍 {s.region}</div>
              <div className="fl-catch-foot" style={{ paddingTop: 8 }}>
                <ScoreFish score={s.rating} />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div style={{ height: 32 }} />
    </>
  );
}
