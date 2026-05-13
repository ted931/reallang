"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

type MatchStatus = '모집중' | '마감임박' | '마감';

interface MatchPost {
  id: string;
  authorNick: string;
  authorLevel: string;
  date: string;
  dday: number;
  region: string;
  targetFish: string;
  totalSlots: number;
  takenSlots: number;
  status: MatchStatus;
  message: string;
}

const MATCH_POSTS: MatchPost[] = [
  {
    id: 'm1',
    authorNick: '갈치왕김씨',
    authorLevel: 'Lv.34 고수',
    date: '2026-05-14',
    dday: 2,
    region: '한림',
    targetFish: '갈치',
    totalSlots: 4,
    takenSlots: 2,
    status: '모집중',
    message: '야간 갈치 전문입니다. 채비 없어도 OK, 같이 즐겁게 낚시해요!',
  },
  {
    id: 'm2',
    authorNick: '서귀포바다',
    authorLevel: 'Lv.18 중급',
    date: '2026-05-12',
    dday: 0,
    region: '서귀포',
    targetFish: '감성돔',
    totalSlots: 3,
    takenSlots: 2,
    status: '마감임박',
    message: '오늘 새벽 출발! 마지막 1자리. 찌낚시 경험자 우대.',
  },
  {
    id: 'm3',
    authorNick: '성산출조대장',
    authorLevel: 'Lv.52 마스터',
    date: '2026-05-13',
    dday: 1,
    region: '성산',
    targetFish: '참돔',
    totalSlots: 5,
    takenSlots: 3,
    status: '마감임박',
    message: '내일 아침 일출 참돔 도전. 배 대절 비용 1/5 나눕니다. 입문자도 환영!',
  },
  {
    id: 'm4',
    authorNick: '모슬포방어팀',
    authorLevel: 'Lv.41 고수',
    date: '2026-05-15',
    dday: 3,
    region: '모슬포',
    targetFish: '방어',
    totalSlots: 6,
    takenSlots: 2,
    status: '모집중',
    message: '방어 루어 지깅 팀 구합니다. 지깅 장비 필수. 체력 자신 있는 분!',
  },
  {
    id: 'm5',
    authorNick: '애월혼낚러',
    authorLevel: 'Lv.9 입문',
    date: '2026-05-16',
    dday: 4,
    region: '애월',
    targetFish: '광어',
    totalSlots: 2,
    takenSlots: 0,
    status: '모집중',
    message: '처음이라 혼자 가기 무서워요 ㅜㅜ 같이 광어 좌대 가실 분 구해요.',
  },
  {
    id: 'm6',
    authorNick: '구좌갯바위',
    authorLevel: 'Lv.27 중급',
    date: '2026-05-11',
    dday: -1,
    region: '구좌',
    targetFish: '벵에돔',
    totalSlots: 3,
    takenSlots: 3,
    status: '마감',
    message: '구좌 갯바위 벵에돔 전문 팀. 이번 출조 마감됐어요, 다음 기회에!',
  },
  {
    id: 'm7',
    authorNick: '한림새벽꾼',
    authorLevel: 'Lv.63 레전드',
    date: '2026-05-17',
    dday: 5,
    region: '한림',
    targetFish: '갈치',
    totalSlots: 4,
    takenSlots: 1,
    status: '모집중',
    message: '17년 경력 갈치 고수입니다. 포인트 아는 분, 모르는 분 모두 환영. 채비 공유 가능.',
  },
  {
    id: 'm8',
    authorNick: '서귀포쌍방어',
    authorLevel: 'Lv.38 고수',
    date: '2026-05-10',
    dday: -2,
    region: '서귀포',
    targetFish: '방어',
    totalSlots: 5,
    takenSlots: 5,
    status: '마감',
    message: '지난주 출조 완료. 방어 대물 4마리 작살냈습니다. 다음번 공지 올릴게요!',
  },
];

const TABS = ['전체', '모집중', '마감임박', '내가 올린글'] as const;
type Tab = typeof TABS[number];

const FISH_OPTIONS = ['갈치', '감성돔', '참돔', '방어', '광어', '벵에돔', '농어', '우럭'];
const REGION_OPTIONS = ['한림', '애월', '서귀포', '성산', '모슬포', '구좌'];

const LEVEL_BADGE: Record<string, { bg: string; color: string }> = {
  입문: { bg: 'rgba(134,239,172,0.15)', color: '#86efac' },
  중급: { bg: 'rgba(96,165,250,0.15)', color: '#60a5fa' },
  고수: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  마스터: { bg: 'rgba(167,139,250,0.15)', color: '#a78bfa' },
  레전드: { bg: 'rgba(251,113,133,0.15)', color: '#fb7185' },
};

function DdayBadge({ dday, status }: { dday: number; status: MatchStatus }) {
  if (status === '마감') {
    return (
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          padding: '3px 9px',
          borderRadius: 99,
          background: 'rgba(100,116,139,0.2)',
          color: '#94a3b8',
          border: '1px solid rgba(100,116,139,0.3)',
        }}
      >
        마감
      </span>
    );
  }
  const label = dday === 0 ? '오늘!' : `D-${dday}`;
  const isUrgent = dday <= 1;
  return (
    <span
      style={{
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: 99,
        background: isUrgent ? 'rgba(251,113,133,0.18)' : 'rgba(var(--hook-300,234,179,8),0.15)',
        color: isUrgent ? '#fb7185' : 'var(--hook)',
        border: `1px solid ${isUrgent ? 'rgba(251,113,133,0.35)' : 'rgba(234,179,8,0.35)'}`,
      }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: MatchStatus }) {
  if (status === '마감') return null;
  if (status === '마감임박') {
    return (
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 99,
          background: 'rgba(251,191,36,0.15)',
          color: '#fbbf24',
          border: '1px solid rgba(251,191,36,0.3)',
        }}
      >
        마감임박
      </span>
    );
  }
  return (
    <span
      style={{
        fontSize: '0.68rem',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 99,
        background: 'rgba(134,239,172,0.15)',
        color: '#86efac',
        border: '1px solid rgba(134,239,172,0.3)',
      }}
    >
      모집중
    </span>
  );
}

function ProgressBar({ taken, total, status }: { taken: number; total: number; status: MatchStatus }) {
  const pct = Math.min((taken / total) * 100, 100);
  const full = taken >= total || status === '마감';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          borderRadius: 99,
          background: 'var(--tint-08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 99,
            background: full
              ? 'rgba(100,116,139,0.5)'
              : pct >= 66
                ? '#fbbf24'
                : 'var(--hook)',
            transition: 'width 0.3s',
          }}
        />
      </div>
      <span
        style={{
          fontSize: '0.72rem',
          color: full ? 'var(--text-mute)' : 'var(--text-dim)',
          whiteSpace: 'nowrap',
          fontWeight: 600,
        }}
      >
        {taken}/{total}명
      </span>
    </div>
  );
}

function MatchCard({ post }: { post: MatchPost }) {
  const closed = post.status === '마감';
  const lvlKey = post.authorLevel.split(' ')[1] ?? '중급';
  const lvlStyle = LEVEL_BADGE[lvlKey] ?? LEVEL_BADGE['중급'];

  return (
    <Link href={`/match/${post.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
    <article
      style={{
        background: 'var(--tint-04)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-card)',
        padding: '16px',
        opacity: closed ? 0.55 : 1,
        filter: closed ? 'grayscale(0.4)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
    >
      {/* 상단: D-day 배지 + 마감여부 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <DdayBadge dday={post.dday} status={post.status} />
        <StatusBadge status={post.status} />
      </div>

      {/* 날짜 / 지역 / 어종 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
          📅 {post.date}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
          📍 {post.region}
        </span>
        <span style={{ fontSize: '0.82rem', color: 'var(--ocean-300,#7dd3fc)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          🐟 {post.targetFish}
        </span>
      </div>

      {/* 작성자 닉네임 + 레벨 배지 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'var(--tint-08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >
          {post.authorNick[0]}
        </div>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-strong)' }}>
          {post.authorNick}
        </span>
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 99,
            background: lvlStyle.bg,
            color: lvlStyle.color,
            border: `1px solid ${lvlStyle.color}44`,
          }}
        >
          {post.authorLevel}
        </span>
      </div>

      {/* 한마디 */}
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text)',
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        {post.message}
      </p>

      {/* 인원 프로그레스바 + 참여 신청 버튼 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <ProgressBar taken={post.takenSlots} total={post.totalSlots} status={post.status} />
        </div>
        <span
          style={{
            padding: '0 18px',
            minHeight: 44,
            borderRadius: 'var(--r-sm)',
            background: closed ? 'var(--tint-08)' : 'var(--hook)',
            color: closed ? 'var(--text-mute)' : 'var(--ocean-950, #0a1628)',
            fontWeight: 700,
            fontSize: '0.8rem',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {closed ? '마감' : '자세히 →'}
        </span>
      </div>
    </article>
    </Link>
  );
}

export default function MatchPage() {
  const [tab, setTab] = useState<Tab>('전체');
  const [showForm, setShowForm] = useState(false);

  // 폼 상태
  const [formDate, setFormDate] = useState('');
  const [formRegion, setFormRegion] = useState('');
  const [formFish, setFormFish] = useState('');
  const [formSlots, setFormSlots] = useState('2');
  const [formMsg, setFormMsg] = useState('');

  const filtered = useMemo(() => {
    return MATCH_POSTS.filter((p) => {
      if (tab === '모집중') return p.status === '모집중';
      if (tab === '마감임박') return p.status === '마감임박';
      if (tab === '내가 올린글') return false; // 로그인 기능 미구현
      return true;
    });
  }, [tab]);

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .fl-match-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .fl-match-form { max-width: 600px !important; }
        }
      `}</style>
      {/* 히어로 */}
      <section className="fl-hero">
        <div className="fl-catch-hero-glow" />
        <div className="fl-tide-hero-inner">
          <div className="fl-catch-hero-kicker" style={{ color: '#60a5fa' }}>CREW MATCH</div>
          <h1 className="fl-catch-hero-title">합동출조 매칭</h1>
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '0.875rem',
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            혼자 가기 아쉬울 때,<br />딱 맞는 동행을 찾아보세요
          </p>
          <div className="fl-catch-hero-meta" style={{ marginTop: 14 }}>
            <span>🎣 {MATCH_POSTS.filter(p => p.status !== '마감').length}개 모집중</span>
            <span className="fl-cond-sep" />
            <span>📍 6개 지역</span>
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
        {/* 모집글 올리기 버튼 */}
        <div style={{ marginTop: 20, marginBottom: showForm ? 0 : 16 }}>
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: 'var(--r-card)',
              background: showForm ? 'var(--tint-06)' : 'var(--hook)',
              color: showForm ? 'var(--text-dim)' : 'var(--ocean-950, #0a1628)',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: showForm ? '1px solid var(--line-2)' : 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 0.2s',
            }}
          >
            <span style={{ fontSize: 18 }}>{showForm ? '✕' : '+'}</span>
            {showForm ? '닫기' : '모집글 올리기'}
          </button>
        </div>

        {/* 토글 폼 */}
        {showForm && (
          <div
            className="fl-match-form"
            style={{
              background: 'var(--tint-05)',
              border: '1px solid var(--line-2)',
              borderRadius: 'var(--r-card)',
              padding: '20px',
              marginBottom: 16,
              marginTop: 2,
            }}
          >
            <div style={{ fontWeight: 700, color: 'var(--text-strong)', marginBottom: 16, fontSize: '0.95rem' }}>
              합동출조 모집글 작성
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>
                  출조 날짜
                </label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--tint-08)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    color: 'var(--text)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>
                  지역
                </label>
                <select
                  value={formRegion}
                  onChange={(e) => setFormRegion(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--tint-08)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    color: formRegion ? 'var(--text)' : 'var(--text-mute)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="">지역 선택</option>
                  {REGION_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>
                  목표 어종
                </label>
                <select
                  value={formFish}
                  onChange={(e) => setFormFish(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--tint-08)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    color: formFish ? 'var(--text)' : 'var(--text-mute)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="">어종 선택</option>
                  {FISH_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>
                  모집 인원
                </label>
                <select
                  value={formSlots}
                  onChange={(e) => setFormSlots(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--tint-08)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    color: 'var(--text)',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}명</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>
                한마디
              </label>
              <textarea
                value={formMsg}
                onChange={(e) => setFormMsg(e.target.value)}
                placeholder="출조 계획, 경험 수준, 장비 여부 등을 알려주세요"
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--tint-08)',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  padding: '10px 12px',
                  color: 'var(--text)',
                  fontSize: '0.85rem',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <button
              onClick={() => {
                alert('로그인 후 모집글을 등록할 수 있습니다.');
                setShowForm(false);
              }}
              style={{
                padding: '10px 28px',
                borderRadius: 'var(--r-sm)',
                background: 'var(--hook)',
                color: 'var(--ocean-950, #0a1628)',
                fontWeight: 800,
                fontSize: '0.88rem',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              모집글 등록
            </button>
          </div>
        )}

        {/* 탭 */}
        <div className="fl-tabs" style={{ marginBottom: 16 }}>
          {TABS.map((t) => (
            <button
              key={t}
              className={`fl-tab ${tab === t ? 'on' : ''}`}
              onClick={() => setTab(t)}
              style={{ fontFamily: 'inherit' }}
            >
              {t}
              {tab === t && <span className="fl-tab-underline" />}
            </button>
          ))}
        </div>

        {/* 결과 수 */}
        <div className="fl-feed-result" style={{ marginBottom: 12 }}>
          <span>
            <strong>{filtered.length}</strong>개 모집글
          </span>
        </div>

        {/* 매칭 카드 리스트 */}
        {tab === '내가 올린글' ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0',
              color: 'var(--text-mute)',
              fontSize: '0.9rem',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎣</div>
            로그인 후 내 모집글을 확인할 수 있습니다
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0',
              color: 'var(--text-mute)',
              fontSize: '0.9rem',
            }}
          >
            해당 조건의 모집글이 없습니다
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: 12,
            }}
            className="fl-match-grid"
          >
            {filtered.map((post) => (
              <MatchCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <div style={{ height: 100 }} />
      </div>
    </>
  );
}
