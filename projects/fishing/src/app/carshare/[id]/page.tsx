"use client";
import { use, useState } from "react";
import Link from "next/link";

const CSD_TRIP = {
  host: { name: '김선장', avatar: '🚗', level: 'Lv.18', rating: 4.9, trips: 47, car: '카니발 9인승' },
  from: '제주공항', fromTime: '04:30', to: '한림 갯바위 P-12', toTime: '05:15',
  distance: '38km', duration: '45분', date: '11/15 토',
  capacity: 8, joined: 5, fee: 8000,
  fish: ['갈치', '벵에돔'],
  notes: '낚시대 + 아이스박스 OK. 미끼는 각자 준비해주세요. 픽업 후 편의점 1회 들러요.',
  members: [
    { name: '나', avatar: '😎', isMe: true },
    { name: '이낚시', avatar: '🎣', isMe: false },
    { name: '벵돔장인', avatar: '🐟', isMe: false },
    { name: '낚시선생', avatar: '👨‍🏫', isMe: false },
    { name: '바다왕', avatar: '🌊', isMe: false },
  ],
};

const FISH_EMOJI: Record<string, string> = {
  갈치: '🐟', 벵에돔: '🐠', 참돔: '🐡', 광어: '🐟', 고등어: '🐟',
};

export default function CarShareDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  void id;

  const trip = CSD_TRIP;
  const [requested, setRequested] = useState(false);

  const empty = trip.capacity - trip.joined;

  // Build seat grid: driver + passengers + empty slots
  // Front row: driver seat + co-pilot empty
  // Back rows: members (excluding driver, slot 0 = me) + empties
  const passengersWithoutHost = trip.members; // all 5 members are passengers/host
  // We'll treat slot 0 as host (driver), rest as passengers
  const driver = trip.members[0]; // me as driver for illustration
  const passengers = trip.members.slice(1); // 4 passengers
  const emptySeats = Array.from({ length: empty });

  return (
    <div className="max-w-5xl mx-auto pb-32">
      {/* Back */}
      <div style={{ padding: '14px 20px 0' }}>
        <Link href="/carshare" className="text-sm" style={{ color: 'var(--ocean-300)' }}>← 카풀 목록</Link>
      </div>

      {/* Hero */}
      <div className="fl-csd-hero" style={{ marginTop: 12 }}>
        <div className="fl-csd-date-badge">{trip.date}</div>

        <div className="fl-csd-route">
          {/* From */}
          <div className="fl-csd-route-end">
            <div className="fl-csd-route-time">{trip.fromTime}</div>
            <div className="fl-csd-route-loc">{trip.from}</div>
            <span className="fl-csd-route-tag">픽업</span>
          </div>

          {/* Mid SVG */}
          <div className="fl-csd-route-mid">
            <svg className="fl-csd-route-svg" viewBox="0 0 120 32">
              <line x1="8" y1="16" x2="112" y2="16" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="4 3" />
              {/* Car icon */}
              <g transform="translate(48,8)">
                <rect x="2" y="6" width="20" height="10" rx="3" fill="rgba(255,255,255,0.85)" />
                <rect x="5" y="3" width="13" height="7" rx="2" fill="rgba(255,255,255,0.7)" />
                <circle cx="6" cy="17" r="2.5" fill="rgba(255,255,255,0.9)" />
                <circle cx="18" cy="17" r="2.5" fill="rgba(255,255,255,0.9)" />
                <rect x="14" y="7" width="1" height="4" rx="0.5" fill="rgba(100,150,200,0.5)" />
              </g>
            </svg>
            <div className="fl-csd-route-info">{trip.distance} · {trip.duration}</div>
          </div>

          {/* To */}
          <div className="fl-csd-route-end" style={{ textAlign: 'right' }}>
            <div className="fl-csd-route-time">{trip.toTime}</div>
            <div className="fl-csd-route-loc">{trip.to}</div>
            <span className="fl-csd-route-tag arr">도착</span>
          </div>
        </div>
      </div>

      {/* Host card */}
      <div className="fl-csd-host-card">
        <div className="fl-csd-host-avatar">{trip.host.avatar}</div>
        <div className="fl-csd-host-info">
          <div className="fl-csd-host-name">
            {trip.host.name}
            <span className="fl-csd-host-lvl">{trip.host.level}</span>
          </div>
          <div className="fl-csd-host-stats">⭐ {trip.host.rating} · 출조 {trip.host.trips}회</div>
          <div className="fl-csd-host-car">🚗 {trip.host.car}</div>
        </div>
        <button className="fl-csd-msg-btn">메시지</button>
      </div>

      {/* Seats section */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ocean-400)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>SEATS</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', marginBottom: 4 }}>좌석 현황</div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{trip.joined}/{trip.capacity}석 탑승 · {empty}석 남음</div>
      </div>

      <div className="fl-csd-seats">
        <div className="fl-csd-car-layout">
          {/* Front row: steering + co-pilot */}
          <div className="fl-csd-car-front">
            <div className="fl-csd-car-wheel" />
            {/* Driver */}
            <div className="fl-csd-car-host">
              <div style={{ fontSize: 24 }}>🚗</div>
              <div style={{ fontSize: 10, color: 'var(--ocean-300)', fontWeight: 700, marginTop: 2 }}>{trip.host.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>운전자</div>
            </div>
            {/* Co-pilot — first passenger or empty */}
            {passengers[0] ? (
              <div className={`fl-csd-seat ${passengers[0].isMe ? 'me' : 'taken'}`}>
                <div className="fl-csd-seat-icon">{passengers[0].avatar}</div>
                <div className="fl-csd-seat-label">{passengers[0].isMe ? '나' : passengers[0].name}</div>
              </div>
            ) : (
              <div className="fl-csd-seat empty">
                <div className="fl-csd-seat-icon" style={{ opacity: 0.3 }}>💺</div>
                <div className="fl-csd-seat-label">빈자리</div>
              </div>
            )}
          </div>

          {/* Back rows */}
          <div className="fl-csd-car-rows">
            {passengers.slice(1).map((p, i) => (
              <div key={i} className={`fl-csd-seat ${p.isMe ? 'me' : 'taken'}`}>
                <div className="fl-csd-seat-icon">{p.avatar}</div>
                <div className="fl-csd-seat-label">{p.isMe ? '나' : p.name}</div>
              </div>
            ))}
            {emptySeats.map((_, i) => (
              <div key={`e${i}`} className="fl-csd-seat empty">
                <div className="fl-csd-seat-icon" style={{ opacity: 0.3 }}>💺</div>
                <div className="fl-csd-seat-label">빈자리</div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="fl-csd-seat-legend">
          <span><span className="fl-csd-dot taken" />탑승</span>
          <span><span className="fl-csd-dot me" />나</span>
          <span><span className="fl-csd-dot empty" />빈자리</span>
        </div>
      </div>

      {/* Fish section */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ocean-400)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>TARGET</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', marginBottom: 10 }}>목표 어종</div>
      </div>
      <div className="fl-csd-fish">
        {trip.fish.map((f) => (
          <div key={f} className="fl-csd-fish-chip">
            <span className="fl-csd-fish-emoji">{FISH_EMOJI[f] ?? '🐟'}</span>
            <span className="fl-csd-fish-name">{f}</span>
          </div>
        ))}
      </div>

      {/* Notes section */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ocean-400)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>NOTES</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', marginBottom: 6 }}>안내사항</div>
      </div>
      <div className="fl-csd-notes">
        💬 {trip.notes}
      </div>

      {/* Cost card */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ocean-400)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>COST</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', marginBottom: 6 }}>분담금</div>
      </div>
      <div className="fl-csd-cost">
        <div className="fl-csd-cost-row">
          <span>1인 분담금</span>
          <strong>{trip.fee.toLocaleString()}원</strong>
        </div>
        <div className="fl-csd-cost-sub">총 {trip.capacity}인 기준 · 유류비 균등 분할</div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fl-csd-sticky">
        {requested ? (
          <div className="fl-csd-status">
            <div className="fl-csd-status-check">
              <svg viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="17" stroke="#22c55e" strokeWidth="2" fill="rgba(34,197,94,0.1)" />
                <path d="M10 18 L15.5 24 L26 12" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="fl-csd-status-t">동승 신청 완료!</div>
              <div className="fl-csd-status-s">호스트 연락을 기다려주세요 · 카카오톡 연결</div>
            </div>
          </div>
        ) : (
          <button className="fl-csd-join" onClick={() => setRequested(true)}>
            🚗 동승 신청 — {trip.fee.toLocaleString()}원
          </button>
        )}
      </div>
    </div>
  );
}
