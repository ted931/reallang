"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const RC_CARS = [
  { id: 1, name: '아반떼 CN7', cls: '준중형', region: '제주공항', pickup: '제주공항 1층', orig: 65000, sale: 38000, off: 42, fishing: true, seats: 5, fuel: '가솔린', deadline: '오늘 17:00', features: ['낚시대 적재', '아이스박스 무료'], color: '#5fa3cf', plate: '63저 1234' },
  { id: 2, name: 'SM6', cls: '중형', region: '서귀포', pickup: '서귀포 지점', orig: 85000, sale: 54000, off: 36, fishing: false, seats: 5, fuel: '가솔린', deadline: '오늘 18:00', features: ['트렁크 대', '무제한주행'], color: '#86efac', plate: '12가 5678' },
  { id: 3, name: '카니발 9인승', cls: '승합', region: '제주공항', pickup: '공항 셔틀존', orig: 145000, sale: 89000, off: 39, fishing: true, seats: 9, fuel: '디젤', deadline: '오늘 19:30', features: ['장비 풀적재', '단체 출조'], color: '#f59e0b', plate: '74하 9012' },
  { id: 4, name: '레이', cls: '경차', region: '제주시', pickup: '제주시 지점', orig: 48000, sale: 28000, off: 42, fishing: false, seats: 4, fuel: '가솔린', deadline: '오늘 16:00', features: ['주차편함', '연비좋음'], color: '#a78bfa', plate: '34나 3456' },
  { id: 5, name: '스타리아', cls: '승합', region: '성산', pickup: '성산항 인근', orig: 165000, sale: 99000, off: 40, fishing: true, seats: 11, fuel: '디젤', deadline: '오늘 20:00', features: ['단체팀 추천', '낚시대 12개'], color: '#fbbf24', plate: '89사 7890' },
  { id: 6, name: '쏘렌토 하이브리드', cls: 'SUV', region: '서귀포', pickup: '서귀포 지점', orig: 125000, sale: 76000, off: 39, fishing: true, seats: 7, fuel: 'HEV', deadline: '오늘 17:30', features: ['장거리 출조', '캠핑 가능'], color: '#5fa3cf', plate: '21라 2345' },
];
const RC_REGIONS = ['전체', '제주공항', '제주시', '서귀포', '성산', '한림'];
const RC_CLASSES = ['전체', '경차', '준중형', '중형', 'SUV', '승합'];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function Countdown() {
  const [t, setT] = useState(() => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 0);
    return end.getTime() - now.getTime();
  });
  useEffect(() => {
    const id = setInterval(() => setT(prev => Math.max(0, prev - 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(t / 3600000);
  const m = Math.floor((t % 3600000) / 60000);
  const s = Math.floor((t % 60000) / 1000);
  return (
    <div className="fl-rc-cd">
      <div className="fl-rc-cd-cell">
        <span className="fl-rc-cd-n">{pad(h)}</span>
        <span className="fl-rc-cd-l">HOUR</span>
      </div>
      <span className="fl-rc-cd-sep">:</span>
      <div className="fl-rc-cd-cell">
        <span className="fl-rc-cd-n">{pad(m)}</span>
        <span className="fl-rc-cd-l">MIN</span>
      </div>
      <span className="fl-rc-cd-sep">:</span>
      <div className="fl-rc-cd-cell pulse">
        <span className="fl-rc-cd-n">{pad(s)}</span>
        <span className="fl-rc-cd-l">SEC</span>
      </div>
    </div>
  );
}

function CarSVG({ color }: { color: string }) {
  return (
    <svg className="fl-rc-car-svg" viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="36" width="200" height="32" rx="8" fill={color} opacity="0.9" />
      <path d="M60 36 L80 16 L160 16 L180 36 Z" fill={color} opacity="0.75" />
      <rect x="84" y="18" width="32" height="16" rx="3" fill="rgba(255,255,255,0.2)" />
      <rect x="122" y="18" width="32" height="16" rx="3" fill="rgba(255,255,255,0.2)" />
      <circle cx="65" cy="68" r="12" fill="#1a1a2e" stroke={color} strokeWidth="2" />
      <circle cx="65" cy="68" r="6" fill="#333" />
      <circle cx="175" cy="68" r="12" fill="#1a1a2e" stroke={color} strokeWidth="2" />
      <circle cx="175" cy="68" r="6" fill="#333" />
      <rect x="24" y="44" width="16" height="8" rx="3" fill="#fbbf24" opacity="0.9" />
      <rect x="200" y="44" width="16" height="8" rx="3" fill="#f87171" opacity="0.9" />
    </svg>
  );
}

export default function RentCarPage() {
  const [region, setRegion] = useState('전체');
  const [cls, setCls] = useState('전체');
  const [reserved, setReserved] = useState<Set<number>>(new Set());

  const filtered = RC_CARS.filter(c => {
    if (region !== '전체' && c.region !== region) return false;
    if (cls !== '전체' && c.cls !== cls) return false;
    return true;
  });

  const fishingCount = filtered.filter(c => c.fishing).length;

  function toggleReserve(id: number) {
    setReserved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  return (
    <div className="fl-page-inner">
      {/* Hero */}
      <section className="fl-rc-hero">
        <div className="fl-rc-hero-inner">
          <div className="fl-rc-hero-badge">
            <span className="fl-rc-hero-dot" />
            TODAY ONLY · 마지막 자리 땡처리
          </div>
          <h1 className="fl-rc-hero-title">
            오늘만 이 가격{' '}
            <span className="fl-hero-accent" style={{ color: 'var(--hook)' }}>최대 42% OFF</span>
          </h1>
          <p className="fl-rc-hero-sub">자정이 지나면 정상가로 돌아갑니다</p>
          <Countdown />
        </div>
      </section>

      {/* Stats Banner */}
      <div className="fl-rc-banner">
        <div className="fl-rc-banner-l">
          <div className="fl-rc-banner-k">예약가능</div>
          <div className="fl-rc-banner-v">
            <strong>{filtered.length}</strong>대
          </div>
        </div>
        <div className="fl-rc-banner-div" />
        <div className="fl-rc-banner-l">
          <div className="fl-rc-banner-k">낚시특화</div>
          <div className="fl-rc-banner-v hook">
            <strong>{fishingCount}</strong>대 🎣
          </div>
        </div>
        <div className="fl-rc-banner-div" />
        <div className="fl-rc-banner-l">
          <div className="fl-rc-banner-k">평균할인</div>
          <div className="fl-rc-banner-v hook">
            <strong>40</strong>%
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="fl-rc-filters">
        <div className="fl-rc-filter-row">
          <span className="fl-rc-filter-label">지역</span>
          <div className="fl-rc-filter-chips">
            {RC_REGIONS.map(r => (
              <button
                key={r}
                className={`fl-chip ${region === r ? 'on' : ''}`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="fl-rc-filter-row">
          <span className="fl-rc-filter-label">차종</span>
          <div className="fl-rc-filter-chips">
            {RC_CLASSES.map(c => (
              <button
                key={c}
                className={`fl-chip ${cls === c ? 'on' : ''}`}
                onClick={() => setCls(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section header */}
      <div style={{ padding: '0 20px 12px', fontSize: 12, fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.5px' }}>
        FISHERMAN PICK / 낚시꾼 추천 차량
      </div>

      {/* Car grid */}
      <div className="fl-rc-grid">
        {filtered.map(car => {
          const done = reserved.has(car.id);
          return (
            <article key={car.id} className="fl-rc-card">
              {/* Image area */}
              <div className="fl-rc-img" style={{ background: `linear-gradient(135deg, ${car.color}22, ${car.color}44)` }}>
                <div className="fl-rc-off-sticker">-{car.off}%</div>
                {car.fishing && <div className="fl-rc-fish-badge">🎣 낚시특화</div>}
                <CarSVG color={car.color} />
                <div className="fl-rc-plate">{car.plate}</div>
              </div>

              {/* Body */}
              <div className="fl-rc-body">
                <div className="fl-rc-cls">{car.cls} · {car.seats}인승 · {car.fuel}</div>
                <h3 className="fl-rc-name">{car.name}</h3>

                <div className="fl-rc-feats">
                  {car.features.map(f => (
                    <span key={f} className="fl-rc-feat">{f}</span>
                  ))}
                </div>

                <div className="fl-rc-pickup">
                  <span>📍 {car.pickup}</span>
                  <span className="fl-rc-deadline">⏰ {car.deadline}</span>
                </div>

                <div className="fl-rc-foot">
                  <div className="fl-rc-price">
                    <span className="fl-rc-orig">{car.orig.toLocaleString()}원</span>
                    <span>
                      <span className="fl-rc-sale">{car.sale.toLocaleString()}원</span>
                      <span className="fl-rc-day">/1일</span>
                    </span>
                  </div>
                  <button
                    className={`fl-rc-cta ${done ? 'done' : ''}`}
                    onClick={() => toggleReserve(car.id)}
                  >
                    {done ? '✓ 예약완료' : '땡처리 예약'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
