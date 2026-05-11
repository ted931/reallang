"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DUMMY_JWAEDAE } from "@/lib/dummy-jwaedae";
import type { Jwaedae } from "@/lib/types";

export default function JwaedaePage() {
  const [sort, setSort] = useState("거리순");
  const [filter, setFilter] = useState("전체");

  const FILTERS = ["전체", "예약가능", "숙박가능", "취사가능"];
  const SORT_OPTS = ["거리순", "가격↓", "잔여석↓", "조황등급"];

  const list = useMemo(() => {
    let l = DUMMY_JWAEDAE;
    if (filter === "예약가능") l = l.filter((s) => s.availableSeats > 0);
    if (filter === "숙박가능") l = l.filter((s) => s.hasAccommodation);
    if (filter === "취사가능") l = l.filter((s) => s.facilities.some((f) => f.includes("취사")));
    if (sort === "가격↓") l = [...l].sort((a, b) => a.priceDay - b.priceDay);
    if (sort === "잔여석↓") l = [...l].sort((a, b) => b.availableSeats - a.availableSeats);
    if (sort === "조황등급") {
      const order: Record<string, number> = { 상: 3, 중: 2, 하: 1 };
      l = [...l].sort((a, b) => (order[b.catchRate] ?? 0) - (order[a.catchRate] ?? 0));
    }
    return l;
  }, [sort, filter]);

  const available = DUMMY_JWAEDAE.filter((s) => s.availableSeats > 0).length;
  const urgentCount = DUMMY_JWAEDAE.filter((s) => s.availableSeats > 0 && s.availableSeats <= 3).length;
  const totalSeats = DUMMY_JWAEDAE.reduce((a, s) => a + s.availableSeats, 0);

  return (
    <>
      {/* 히어로 */}
      <div className="fl-jw-hero">
        <div className="fl-hero-glow" />
        <div className="fl-jw-hero-inner">
          <div className="fl-catch-hero-kicker" style={{ color: "#5fa3cf" }}>JWAEDAE</div>
          <h1 className="fl-catch-hero-title">오늘 입실 가능한 좌대</h1>
          <div className="fl-jw-hero-stats">
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n">{available}<span>곳</span></div>
              <div className="fl-jw-hero-l">예약 가능</div>
            </div>
            <div className="fl-jw-hero-divider" />
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n" style={{ color: "#f59e0b" }}>{urgentCount}<span>곳</span></div>
              <div className="fl-jw-hero-l">마감임박</div>
            </div>
            <div className="fl-jw-hero-divider" />
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n">{totalSeats}<span>석</span></div>
              <div className="fl-jw-hero-l">총 잔여</div>
            </div>
          </div>
        </div>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </div>

      {/* 필터 + 정렬 */}
      <div className="fl-filters">
        <div className="fl-filter-row">
          <div className="fl-filter-label">필터</div>
          <div className="fl-chips">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`fl-chip ${filter === f ? "on" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="fl-filter-row">
          <div className="fl-filter-label">정렬</div>
          <div className="fl-sort">
            {SORT_OPTS.map((o) => (
              <button
                key={o}
                className={`fl-sort-btn ${sort === o ? "on" : ""}`}
                onClick={() => setSort(o)}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fl-feed-result">
        <span><strong>{list.length}</strong>개 좌대</span>
      </div>

      {/* 카드 목록 */}
      <div className="fl-jw-grid">
        {list.map((s) => (
          <JwaedaeCard key={s.id} s={s} />
        ))}
      </div>
    </>
  );
}

function JwaedaeCard({ s }: { s: Jwaedae }) {
  const router = useRouter();
  const urgent = s.availableSeats > 0 && s.availableSeats <= 3;
  const closed = s.availableSeats === 0;
  const pct = s.capacity > 0 ? ((s.capacity - s.availableSeats) / s.capacity) * 100 : 100;

  const rateColor = s.catchRate === "상" ? "#fbbf24" : s.catchRate === "중" ? "#5fa3cf" : "var(--text-dim)";
  const rateVal = s.catchRate === "상" ? 3 : s.catchRate === "중" ? 2 : 1;

  return (
    <article
      className={`fl-jw-card${urgent ? " urgent" : ""}${closed ? " closed" : ""}`}
      onClick={() => router.push(`/jwaedae/${s.id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* 이미지 영역 */}
      <div className="fl-jw-img">
        <SeatImageSvg name={s.name} hue={nameToHue(s.name)} />
        <div className="fl-jw-img-overlay">
          <div className="fl-jw-tags">
            {s.tags.slice(0, 3).map((t) => (
              <span key={t} className="fl-jw-tag">{t}</span>
            ))}
          </div>
          {closed && <div className="fl-jw-closed-badge">금일 마감</div>}
          {urgent && !closed && (
            <div className="fl-jw-urgent-badge">🔥 마감임박</div>
          )}
        </div>
        <div className="fl-jw-distance">📍 {s.region}</div>
      </div>

      {/* 본문 */}
      <div className="fl-jw-body">
        <div className="fl-jw-head">
          <div>
            <div className="fl-jw-title">{s.name}</div>
            <div className="fl-jw-loc">📍 {s.location}</div>
          </div>
          <div className="fl-rate-gauge" title={`조황 ${s.catchRate}`}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={i < rateVal ? "on" : ""}
                style={i < rateVal ? { background: rateColor } : undefined}
              />
            ))}
            <em style={{ color: rateColor }}>조황 {s.catchRate}</em>
          </div>
        </div>

        {/* 잔여석 */}
        <div className="fl-jw-seat-row">
          <div className="fl-jw-seat-label">
            잔여 <strong className={urgent ? "urgent" : ""}>{s.availableSeats}</strong>
            <span>/{s.capacity}석</span>
          </div>
          <div className="fl-seatgrid">
            {Array.from({ length: Math.min(s.capacity, 12) }).map((_, i) => {
              const taken = s.capacity - s.availableSeats;
              return (
                <span
                  key={i}
                  className={`fl-seatgrid-cell ${i < taken ? "taken" : urgent ? "left-urgent" : "left"}`}
                />
              );
            })}
          </div>
        </div>

        {/* 진행바 */}
        <div className="fl-jw-bar">
          <div
            className="fl-jw-bar-fill"
            style={{
              width: `${pct}%`,
              background: closed
                ? "var(--text-dim)"
                : urgent
                ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                : "linear-gradient(90deg, #3a82b3, #1e6595)",
            }}
          />
        </div>

        {/* 가격 + 예약 */}
        <div className="fl-jw-prices">
          <div className="fl-jw-price">
            <div className="fl-jw-price-h">☀️ 주간</div>
            <div className="fl-jw-price-v">
              {Math.round(s.priceDay / 10000)}<span>만원</span>
            </div>
          </div>
          {s.priceNight && (
            <>
              <div className="fl-jw-price-sep" />
              <div className="fl-jw-price">
                <div className="fl-jw-price-h">🌙 야간</div>
                <div className="fl-jw-price-v">
                  {Math.round(s.priceNight / 10000)}<span>만원</span>
                </div>
              </div>
            </>
          )}
          <button
            className="fl-jw-book"
            disabled={closed}
            onClick={(e) => {
              e.stopPropagation();
              if (!closed) router.push(`/jwaedae/${s.id}`);
            }}
          >
            {closed ? "마감" : "예약 →"}
          </button>
        </div>
      </div>
    </article>
  );
}

function nameToHue(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return ((hash % 360) + 360) % 360;
}

function SeatImageSvg({ name, hue }: { name: string; hue: number }) {
  const gradId = `sgp-${name.replace(/\s/g, "")}`;
  return (
    <svg viewBox="0 0 240 140" preserveAspectRatio="xMidYMid slice" className="fl-jw-img-svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`hsl(${hue}, 50%, 30%)`} />
          <stop offset="100%" stopColor={`hsl(${hue}, 55%, 18%)`} />
        </linearGradient>
      </defs>
      <rect width="240" height="140" fill={`url(#${gradId})`} />
      <path
        d="M0 70 Q 40 55 80 70 T 160 70 T 240 70 V140 H0 Z"
        fill="rgba(255,255,255,0.08)"
      />
      <path
        d="M0 85 Q 40 70 80 85 T 160 85 T 240 85 V140 H0 Z"
        fill="rgba(255,255,255,0.06)"
      />
      <circle cx="190" cy="32" r="16" fill="rgba(255,235,180,0.18)" />
      <circle cx="190" cy="32" r="10" fill="rgba(255,235,180,0.22)" />
    </svg>
  );
}
