"use client";
import { useState, useMemo } from "react";

const CATCH_FEED = [
  { id: 1, fish: '농어', size: 82, angler: '박민수', avatar: 'B', loc: '한림 갯바위', region: '한림', when: '4시간 전', wind: '동풍 3m/s', tide: '만조', water: '21℃', hue: 210, likes: 42, comments: 8 },
  { id: 2, fish: '광어', size: 64, angler: '김지훈', avatar: 'K', loc: '모슬포 방파제', region: '모슬포', when: '2시간 전', wind: '남풍 2m/s', tide: '간조', water: '20℃', hue: 195, likes: 28, comments: 5 },
  { id: 3, fish: '참돔', size: 56, angler: '최영진', avatar: 'C', loc: '마라도', region: '마라도', when: '8시간 전', wind: '서풍 4m/s', tide: '만조', water: '22℃', hue: 350, likes: 64, comments: 12 },
  { id: 4, fish: '우럭', size: 45, angler: '이서연', avatar: 'L', loc: '성산 선상', region: '성산', when: '5시간 전', wind: '북동 2m/s', tide: '간조', water: '19℃', hue: 30, likes: 18, comments: 3 },
  { id: 5, fish: '감성돔', size: 38, angler: '정태호', avatar: 'J', loc: '애월 좌대', region: '애월', when: '6시간 전', wind: '동풍 3m/s', tide: '만조', water: '21℃', hue: 230, likes: 22, comments: 4 },
  { id: 6, fish: '벵에돔', size: 32, angler: '한미진', avatar: 'H', loc: '한림 방파제', region: '한림', when: '1일 전', wind: '서풍 5m/s', tide: '간조', water: '20℃', hue: 180, likes: 15, comments: 2 },
  { id: 7, fish: '문어', size: 28, angler: '서지혜', avatar: 'S', loc: '애월 갯바위', region: '애월', when: '1일 전', wind: '남풍 2m/s', tide: '만조', water: '21℃', hue: 280, likes: 31, comments: 6 },
  { id: 8, fish: '농어', size: 71, angler: '오태식', avatar: 'O', loc: '모슬포 선상', region: '모슬포', when: '2일 전', wind: '동풍 4m/s', tide: '만조', water: '20℃', hue: 210, likes: 51, comments: 9 },
];

const REGIONS = ['전체', '애월', '한림', '모슬포', '성산', '마라도'];
const SPECIES = ['전체 어종', '농어', '광어', '참돔', '우럭', '감성돔', '벵에돔', '문어'];
const SORTS = ['최신순', '크기순', '인기순'];

function FilterChips({ items, value, onChange }: { items: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="fl-chips">
      {items.map(it => (
        <button
          key={it}
          className={`fl-chip ${value === it ? 'on' : ''}`}
          onClick={() => onChange(it)}
        >
          {it}
        </button>
      ))}
    </div>
  );
}

interface CatchItem {
  id: number; fish: string; size: number; angler: string; avatar: string;
  loc: string; region: string; when: string; wind: string; tide: string;
  water: string; hue: number; likes: number; comments: number;
}

function CatchFeedCard({ c }: { c: CatchItem }) {
  const big = c.size >= 50;
  return (
    <article className={`fl-feed-card ${big ? 'big' : ''}`}>
      <div className="fl-feed-img" style={{ '--hue': c.hue } as React.CSSProperties}>
        {big && (
          <div className="fl-big-tag">
            🔥 대물 {c.size}cm+
          </div>
        )}
        <svg className="fl-feed-fish" viewBox="0 0 120 70">
          <path d="M10 35 Q 35 10, 70 35 T 110 35 L 118 26 L 118 44 Z" fill="rgba(255,255,255,0.16)" />
          <circle cx="65" cy="33" r="2.5" fill="rgba(0,0,0,0.5)" />
        </svg>
        <div className="fl-feed-region">📍 {c.region}</div>
        <div className={`fl-feed-size ${big ? 'big' : ''}`}>
          <span className="fl-feed-size-n">{c.size}</span>
          <span className="fl-feed-size-u">cm</span>
        </div>
      </div>

      <div className="fl-feed-body">
        <div className="fl-feed-top">
          <div className="fl-feed-fish-name">{c.fish}</div>
          <div className="fl-feed-time">🕐 {c.when}</div>
        </div>
        <div className="fl-feed-loc">📍 {c.loc}</div>

        <div className="fl-feed-cond">
          <span>💨 {c.wind}</span>
          <span className="fl-cond-sep" />
          <span>🌊 {c.tide}</span>
          <span className="fl-cond-sep" />
          <span>🌡️ {c.water}</span>
        </div>

        <div className="fl-feed-foot">
          <div className="fl-feed-angler">
            <div className="fl-avatar">{c.avatar}</div>
            <div className="fl-feed-angler-name">{c.angler}</div>
          </div>
          <div className="fl-feed-stats">
            <span>♥ {c.likes}</span>
            <span>💬 {c.comments}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function CatchEmpty({ onReset }: { onReset: () => void }) {
  return (
    <div className="fl-empty">
      <div className="fl-empty-art">
        <svg viewBox="0 0 200 120" width="160" height="100">
          <defs>
            <linearGradient id="emptyG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--tint-12)" />
              <stop offset="100%" stopColor="var(--tint-05)" />
            </linearGradient>
          </defs>
          <path d="M10 80 Q 50 60 100 80 T 190 80" stroke="var(--tint-15)" strokeWidth="1.5" fill="none" />
          <path d="M10 95 Q 50 75 100 95 T 190 95" stroke="var(--tint-10)" strokeWidth="1.5" fill="none" />
          <ellipse cx="100" cy="50" rx="42" ry="18" fill="url(#emptyG)" />
          <path d="M58 50 L 45 38 L 45 62 Z" fill="url(#emptyG)" />
          <circle cx="120" cy="45" r="3" fill="var(--text-dim)" />
        </svg>
      </div>
      <div className="fl-empty-title">아직 올라온 조황이 없어요</div>
      <div className="fl-empty-sub">필터를 바꾸거나 직접 한 마리 올려보세요</div>
      <button className="fl-empty-cta" onClick={onReset}>필터 초기화</button>
    </div>
  );
}

export default function CatchPage() {
  const [region, setRegion] = useState('전체');
  const [species, setSpecies] = useState('전체 어종');
  const [sort, setSort] = useState('최신순');

  const filtered = useMemo(() => {
    let list = CATCH_FEED.filter(c =>
      (region === '전체' || c.region === region) &&
      (species === '전체 어종' || c.fish === species)
    );
    if (sort === '크기순') list = [...list].sort((a, b) => b.size - a.size);
    if (sort === '인기순') list = [...list].sort((a, b) => b.likes - a.likes);
    return list;
  }, [region, species, sort]);

  const reset = () => { setRegion('전체'); setSpecies('전체 어종'); };

  return (
    <>
      <div className="fl-catch-hero">
        <div className="fl-catch-hero-glow" />
        <div className="fl-catch-hero-inner">
          <div className="fl-catch-hero-kicker">REAL-TIME</div>
          <h1 className="fl-catch-hero-title">오늘의 조황</h1>
          <div className="fl-catch-hero-meta">
            <span>🐟 총 {CATCH_FEED.length}건</span>
            <span className="fl-cond-sep" />
            <span>🔥 대물 {CATCH_FEED.filter(c => c.size >= 50).length}건</span>
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </div>

      <div className="fl-filters">
        <div className="fl-filter-row">
          <div className="fl-filter-label">📍 지역</div>
          <FilterChips items={REGIONS} value={region} onChange={setRegion} />
        </div>
        <div className="fl-filter-row">
          <div className="fl-filter-label">🐟 어종</div>
          <FilterChips items={SPECIES} value={species} onChange={setSpecies} />
        </div>
        <div className="fl-filter-row">
          <div className="fl-filter-label">정렬</div>
          <div className="fl-sort">
            {SORTS.map(s => (
              <button key={s} className={`fl-sort-btn ${sort === s ? 'on' : ''}`} onClick={() => setSort(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fl-feed-result">
        <span><strong>{filtered.length}</strong>건의 조황</span>
        {(region !== '전체' || species !== '전체 어종') && (
          <button className="fl-reset-btn" onClick={reset}>필터 초기화</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <CatchEmpty onReset={reset} />
      ) : (
        <div className="fl-feed-grid">
          {filtered.map(c => <CatchFeedCard key={c.id} c={c} />)}
        </div>
      )}
    </>
  );
}
