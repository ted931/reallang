"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { FISH_DATA } from "@/lib/fish-data";
import type { FishData } from "@/lib/fish-data";

const TYPE_TABS = [
  { key: 'all', label: '전체' },
  { key: 'rock', label: '갯바위' },
  { key: 'boat', label: '선상' },
  { key: 'pier', label: '방파제' },
  { key: 'lure', label: '루어' },
] as const;

const DIFF_TABS = [
  { key: 'all', label: '전체' },
  { key: '입문', label: '입문' },
  { key: '중급', label: '중급' },
  { key: '고급', label: '고급' },
] as const;

const DIFF_COLOR: Record<string, string> = {
  '입문': '#22c55e',
  '중급': '#f59e0b',
  '고급': '#ef4444',
};

function FishCard({ fish }: { fish: FishData }) {
  return (
    <Link
      href={`/fish-guide/${fish.id}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
    >
      <article style={{
        background: 'var(--tint-04)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-card)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        transition: 'border-color 0.15s, background 0.15s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = `${fish.color}66`;
          (e.currentTarget as HTMLElement).style.background = `${fish.color}0d`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)';
          (e.currentTarget as HTMLElement).style.background = 'var(--tint-04)';
        }}
      >
        {/* Emoji + type badge row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `${fish.color}22`,
            border: `1.5px solid ${fish.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26,
          }}>
            {fish.emoji}
          </div>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px',
            borderRadius: 999, background: `${fish.color}22`,
            color: fish.color, border: `1px solid ${fish.color}44`,
            letterSpacing: '-0.2px',
          }}>
            {fish.typeLabel}
          </span>
        </div>

        {/* Name */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            {fish.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2, letterSpacing: '-0.2px' }}>
            {fish.nameEn}
          </div>
        </div>

        {/* Season */}
        <div style={{ fontSize: 12, color: 'var(--text-dim)', letterSpacing: '-0.2px' }}>
          🗓 {fish.season}
        </div>

        {/* Difficulty badge */}
        <div>
          <span style={{
            fontSize: 11, fontWeight: 700, padding: '3px 9px',
            borderRadius: 999, background: `${DIFF_COLOR[fish.difficulty]}22`,
            color: DIFF_COLOR[fish.difficulty], border: `1px solid ${DIFF_COLOR[fish.difficulty]}44`,
          }}>
            {fish.difficulty}
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function FishGuidePage() {
  const [search, setSearch] = useState('');
  const [typeTab, setTypeTab] = useState<string>('all');
  const [diffTab, setDiffTab] = useState<string>('all');

  const filtered = useMemo(() => {
    return FISH_DATA.filter(f => {
      const matchSearch = search === '' || f.name.includes(search) || f.nameEn.toLowerCase().includes(search.toLowerCase());
      const matchType = typeTab === 'all' || f.type === typeTab;
      const matchDiff = diffTab === 'all' || f.difficulty === diffTab;
      return matchSearch && matchType && matchDiff;
    });
  }, [search, typeTab, diffTab]);

  return (
    <>

        {/* Hero */}
        <div className="fl-hero">
          <div className="fl-hero-glow" />
          <div className="fl-hero-content">
            <div className="fl-hero-greet">FISH GUIDE</div>
            <h1 className="fl-hero-title">
              어종 도감<br />
              <span className="fl-hero-accent">제주 바다 20종</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, margin: 0, letterSpacing: '-0.3px' }}>
              갯바위·선상·방파제·루어까지 제주 대표 어종 완전 정복
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 960, width: '100%', margin: '0 auto' }}>

          {/* Search */}
          <div style={{ padding: '20px 20px 0' }}>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                fontSize: 16, color: 'var(--text-mute)', pointerEvents: 'none',
              }}>🔍</span>
              <input
                type="search"
                placeholder="어종 이름 검색 (갈치, Hairtail…)"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '12px 16px 12px 42px',
                  background: 'var(--tint-05)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)', color: 'var(--text-strong)',
                  fontSize: 14, fontFamily: 'inherit', outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--ocean-300)')}
                onBlur={e => (e.target.style.borderColor = 'var(--line)')}
              />
            </div>
          </div>

          {/* Type tabs */}
          <div style={{ paddingTop: 16 }}>
            <div className="fl-cm-tabs">
              {TYPE_TABS.map(t => (
                <button
                  key={t.key}
                  className={`fl-cm-tab ${typeTab === t.key ? 'on' : ''}`}
                  onClick={() => setTypeTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty filter */}
          <div style={{ padding: '0 20px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-mute)', whiteSpace: 'nowrap' }}>난이도</span>
            <div className="fl-chips">
              {DIFF_TABS.map(t => (
                <button
                  key={t.key}
                  className={`fl-chip ${diffTab === t.key ? 'on' : ''}`}
                  onClick={() => setDiffTab(t.key)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          <div style={{ padding: '0 20px 12px' }}>
            <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>
              {filtered.length}종 표시 중
            </span>
          </div>

          {/* Grid */}
          <div style={{
            padding: '0 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}
            className="fg-grid"
          >
            {filtered.length > 0 ? filtered.map(f => (
              <FishCard key={f.id} fish={f} />
            )) : (
              <div style={{
                gridColumn: '1/-1', padding: '60px 0', textAlign: 'center',
                color: 'var(--text-mute)', fontSize: 14,
              }}>
                검색 결과가 없습니다
              </div>
            )}
          </div>

          <div className="fl-bottom-pad" />
        </div>

        {/* Responsive grid: 4 cols on PC */}
        <style>{`
          @media (min-width: 768px) {
            .fg-grid { grid-template-columns: repeat(4, 1fr) !important; }
          }
        `}</style>
    </>
  );
}
