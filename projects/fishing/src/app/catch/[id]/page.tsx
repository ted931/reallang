"use client";
import { use, useState } from "react";
import Link from "next/link";

const CD_CATCH = {
  id: '1', fish: '갈치', species: 'Hairtail',
  size: 62, count: 12, weight: 4.2, color: '#c0c5ce',
  user: { name: '갈치킬러', avatar: '🐟', level: 'Lv.22' },
  time: '오늘 04:30', location: '한림 갯바위 P-12',
  weather: { temp: '8°', wind: '북동 3m/s', wave: '0.5m', sky: '맑음' },
  tide: { state: '중조', flow: '들물', water: '12m' },
  bait: '꽁치 토막', tackle: '갈치 6단 채비',
  story: '새벽 4시 도착해서 첫 입질부터 한 시간 동안 미친듯이 올라왔어요. 큰놈 위주로 골라서 가져왔고 작은건 다 방생했습니다.',
  likes: 213, comments: 47, views: 1842,
  similar: [
    { id: '2', fish: '갈치', size: 58, user: '벵돔장인', loc: '한림 갯바위', color: '#c0c5ce', time: '어제' },
    { id: '3', fish: '갈치', size: 55, user: '낚시선생', loc: '한림 P-08', color: '#c0c5ce', time: '2일 전' },
    { id: '4', fish: '광어', size: 52, user: '광어사냥꾼', loc: '협재', color: '#a78bfa', time: '3일 전' },
  ],
};

const CD_COMMENTS = [
  { id: 1, author: '낚시선생', avatar: '👨‍🏫', time: '5분 전', body: '와 62cm이면 진짜 대물이네요!', likes: 12 },
  { id: 2, author: '벵돔장인', avatar: '🎣', time: '15분 전', body: '같은 포인트 가봐야겠네요. 미끼 정보 감사합니다', likes: 8 },
];

export default function CatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const data = CD_CATCH; // for now all IDs show same data; id used for future lookup
  void id;

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});

  const heroGradient = `linear-gradient(160deg, ${data.color}cc 0%, ${data.color}88 60%, #0a1628 100%)`;

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Back */}
      <div style={{ padding: '14px 20px 0' }}>
        <Link href="/catch" className="text-sm" style={{ color: 'var(--ocean-300)' }}>← 조황 목록</Link>
      </div>

      {/* Hero */}
      <div className="fl-cdd-hero" style={{ background: heroGradient, marginTop: 12 }}>
        {/* Wave SVG */}
        <svg className="fl-cdd-hero-waves" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,40 C80,20 160,60 240,40 C320,20 360,50 400,40 L400,80 L0,80 Z" fill="rgba(255,255,255,0.25)" />
          <path d="M0,50 C60,30 140,65 220,48 C300,30 360,60 400,50 L400,80 L0,80 Z" fill="rgba(255,255,255,0.15)" />
          <path d="M0,60 C100,40 200,72 300,58 C360,48 380,65 400,60 L400,80 L0,80 Z" fill="rgba(255,255,255,0.1)" />
        </svg>

        <div className="fl-cdd-hero-fishname">{data.species}</div>

        {/* Fish SVG silhouette */}
        <svg className="fl-cdd-hero-fish" viewBox="0 0 320 120" fill="none">
          <path d="M280,60 C260,20 200,10 140,18 C80,26 30,42 10,60 C30,78 80,94 140,102 C200,110 260,100 280,60 Z" fill="rgba(255,255,255,0.18)" />
          <path d="M280,60 C295,48 310,38 318,30 C316,42 314,52 318,60 C314,68 316,78 318,90 C310,82 295,72 280,60 Z" fill="rgba(255,255,255,0.18)" />
          <ellipse cx="62" cy="55" rx="6" ry="6" fill="rgba(255,255,255,0.5)" />
          <ellipse cx="64" cy="55" rx="2" ry="2" fill="rgba(0,0,0,0.4)" />
          <path d="M160,18 C180,10 200,14 210,22" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
          <path d="M150,102 C170,110 195,106 205,98" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
        </svg>

        <h1 style={{ fontSize: 32, fontWeight: 900, textAlign: 'center', margin: '0 0 6px', letterSpacing: -0.5 }}>{data.fish}</h1>

        {/* Stats bar */}
        <div className="fl-cdd-hero-stats">
          <div className="fl-cdd-hero-stat">
            <div className="fl-cdd-hs-k">최대 크기</div>
            <div className="fl-cdd-hs-v">{data.size}<span>cm</span></div>
          </div>
          <div className="fl-cdd-hero-stat">
            <div className="fl-cdd-hs-k">마리 수</div>
            <div className="fl-cdd-hs-v">{data.count}<span>마리</span></div>
          </div>
          <div className="fl-cdd-hero-stat">
            <div className="fl-cdd-hs-k">총 무게</div>
            <div className="fl-cdd-hs-v">{data.weight}<span>kg</span></div>
          </div>
        </div>
      </div>

      {/* Fish counter */}
      <div className="fl-cdd-counter">
        <div className="fl-cdd-counter-l">어획 마리 수</div>
        <div className="fl-cdd-counter-fish">
          {Array.from({ length: data.count }).map((_, i) => (
            <span key={i} style={{ fontSize: 22 }}>🐟</span>
          ))}
        </div>
      </div>

      {/* User info */}
      <div className="fl-cdd-user">
        <div className="fl-cdd-user-avatar">{data.user.avatar}</div>
        <div className="fl-cdd-user-info">
          <div className="fl-cdd-user-name">
            {data.user.name}
            <span className="fl-cdd-user-lvl">{data.user.level}</span>
          </div>
          <div className="fl-cdd-user-time">📍 {data.location} · {data.time}</div>
        </div>
        <button className="fl-cdd-follow">팔로우</button>
      </div>

      {/* Section: 당시 조건 */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ocean-400)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>CONDITIONS</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', marginBottom: 10 }}>당시 조건</div>
      </div>
      <div className="fl-cdd-grid">
        {[
          { icon: '🌡️', k: '기온', v: data.weather.temp },
          { icon: '💨', k: '바람', v: data.weather.wind },
          { icon: '🌊', k: '파고', v: data.weather.wave },
          { icon: '☀️', k: '날씨', v: data.weather.sky },
          { icon: '🌙', k: '물때', v: data.tide.state },
          { icon: '🌊', k: '조류', v: data.tide.flow },
        ].map((cell) => (
          <div key={cell.k} className="fl-cdd-info-card">
            <div className="fl-cdd-info-icon">{cell.icon}</div>
            <div className="fl-cdd-info-k">{cell.k}</div>
            <div className="fl-cdd-info-v">{cell.v}</div>
          </div>
        ))}
      </div>

      {/* Tackle */}
      <div className="fl-cdd-tackle">
        <div className="fl-cdd-tackle-row">
          <div className="fl-cdd-tackle-k">미끼</div>
          <div className="fl-cdd-tackle-v">{data.bait}</div>
        </div>
        <div className="fl-cdd-tackle-div" />
        <div className="fl-cdd-tackle-row">
          <div className="fl-cdd-tackle-k">채비</div>
          <div className="fl-cdd-tackle-v">{data.tackle}</div>
        </div>
      </div>

      {/* Map link */}
      <Link href="/map" className="fl-cdd-map">
        <svg className="fl-cdd-map-svg" viewBox="0 0 400 150">
          <rect width="400" height="150" fill="#0e1f35" />
          {/* Road lines */}
          <line x1="0" y1="75" x2="400" y2="75" stroke="#1e3a5f" strokeWidth="2" />
          <line x1="200" y1="0" x2="200" y2="150" stroke="#1e3a5f" strokeWidth="1.5" />
          <path d="M50,30 Q120,60 180,90 Q240,120 310,100" stroke="#2d5a8e" strokeWidth="2" fill="none" />
          <path d="M0,110 Q80,90 150,110 Q230,130 320,115 Q370,105 400,120" stroke="#1e3a5f" strokeWidth="1.5" fill="none" />
          {/* Sea area */}
          <rect x="220" y="60" width="180" height="90" fill="#0a1628" opacity="0.6" rx="4" />
          <text x="290" y="112" fontSize="10" fill="#2d5a8e" fontWeight="bold">바 다</text>
          {/* Pulsing circle */}
          <circle cx="195" cy="72" r="16" fill="rgba(245,158,11,0.12)" />
          <circle cx="195" cy="72" r="9" fill="rgba(245,158,11,0.25)" />
          <circle cx="195" cy="72" r="5" fill="#f59e0b" />
        </svg>
        <div className="fl-cdd-map-pin">📍 {data.location}</div>
      </Link>

      {/* Story */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ocean-400)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>STORY</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', marginBottom: 6 }}>조사의 한 마디</div>
      </div>
      <p className="fl-cdd-story">{data.story}</p>

      {/* Action buttons */}
      <div className="fl-cmd-actions">
        <button
          className={`fl-cmd-action${liked ? ' active' : ''}`}
          onClick={() => setLiked(!liked)}
        >
          {liked ? '❤️' : '🤍'} {data.likes + (liked ? 1 : 0)}
        </button>
        <button className="fl-cmd-action">💬 {data.comments}</button>
        <button
          className={`fl-cmd-action${saved ? ' active' : ''}`}
          onClick={() => setSaved(!saved)}
        >
          {saved ? '📌' : '📑'}
        </button>
        <button className="fl-cmd-action">↗ 공유</button>
      </div>

      {/* CTA */}
      <div style={{ padding: '0 20px 16px' }}>
        <Link
          href="/catch/upload"
          style={{
            display: 'block', padding: '14px 16px', background: 'var(--ocean-900)',
            border: '1px solid var(--ocean-700)', borderRadius: 12,
            fontSize: 13, fontWeight: 800, color: 'var(--hook)', textDecoration: 'none', textAlign: 'center',
          }}
        >
          나도 비슷한 포인트에서 잡았어요 →
        </Link>
      </div>

      {/* Similar catches */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ocean-400)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>SIMILAR</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', marginBottom: 10 }}>비슷한 조황</div>
      </div>
      <div className="fl-cdd-similar">
        {data.similar.map((s) => (
          <Link key={s.id} href={`/catch/${s.id}`} className="fl-cdd-similar-card">
            <div className="fl-cdd-similar-img" style={{ background: `${s.color}cc` }}>
              🐟
              <div className="fl-cdd-similar-size">{s.size}cm</div>
            </div>
            <div className="fl-cdd-similar-fish">{s.fish}</div>
            <div className="fl-cdd-similar-meta">{s.user} · {s.loc}</div>
            <div className="fl-cdd-similar-time">{s.time}</div>
          </Link>
        ))}
      </div>

      {/* Comments */}
      <div style={{ padding: '0 20px 8px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--ocean-400)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>COMMENTS</div>
        <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', marginBottom: 10 }}>댓글 {CD_COMMENTS.length}개</div>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CD_COMMENTS.map((c) => (
          <div key={c.id} style={{
            display: 'flex', gap: 10, padding: 12,
            background: 'var(--ocean-900)', border: '1px solid var(--ocean-800)', borderRadius: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', background: 'var(--ocean-800)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
            }}>{c.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-strong)' }}>{c.author}</span>
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{c.time}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-strong)', lineHeight: 1.6, margin: 0 }}>{c.body}</p>
            </div>
            <button
              onClick={() => setCommentLikes(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
              style={{ fontSize: 11, color: commentLikes[c.id] ? '#f43f5e' : 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', paddingTop: 4 }}
            >
              {commentLikes[c.id] ? '❤️' : '🤍'} {c.likes + (commentLikes[c.id] ? 1 : 0)}
            </button>
          </div>
        ))}
      </div>

      {/* Fixed bottom comment input */}
      <div className="fl-cmd-bottom">
        <input
          className="fl-cmd-input"
          placeholder="댓글을 입력하세요..."
        />
        <button className="fl-cmd-send">등록</button>
      </div>
    </div>
  );
}
