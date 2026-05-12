"use client";
import { useState } from "react";

const CHALLENGES = [
  { id: 'c1',  title: '첫 갈치',      desc: '갈치를 처음으로 낚아보세요',    icon: '🐟', cat: '조황',    current: 1,  total: 1,  done: true,  badge: '🏅 갈치 입문',    color: '#f59e0b' },
  { id: 'c2',  title: '마릿수 달인',  desc: '하루 20마리 이상 조과',          icon: '🎣', cat: '조황',    current: 12, total: 20, done: false, badge: '🏆 마릿수 달인',  color: '#5fa3cf' },
  { id: 'c3',  title: '포인트 탐험가',desc: '5개 포인트 방문',                icon: '📍', cat: '탐험',    current: 3,  total: 5,  done: false, badge: '🗺️ 탐험가',       color: '#86efac' },
  { id: 'c4',  title: '일지 작성가',  desc: '낚시 일지 5회 작성',             icon: '📓', cat: '기록',    current: 5,  total: 5,  done: true,  badge: '✍️ 기록왕',       color: '#a78bfa' },
  { id: 'c5',  title: '대물 사냥꾼',  desc: '50cm 이상 어종 기록',            icon: '🐠', cat: '조황',    current: 1,  total: 1,  done: true,  badge: '🦈 대물 헌터',    color: '#f87171' },
  { id: 'c6',  title: '어종 컬렉터',  desc: '5가지 이상 어종 낚기',           icon: '🌊', cat: '컬렉션',  current: 3,  total: 5,  done: false, badge: '🎨 컬렉터',       color: '#fbbf24' },
  { id: 'c7',  title: '야간 조사',    desc: '야간 낚시 3회 기록',             icon: '🌙', cat: '기록',    current: 2,  total: 3,  done: false, badge: '🌙 야간 고수',    color: '#6366f1' },
  { id: 'c8',  title: '제주 전도사',  desc: '제주 4개 지역 이상 출조',        icon: '🏝️', cat: '탐험',    current: 2,  total: 4,  done: false, badge: '🏝️ 제주 달인',   color: '#10b981' },
  { id: 'c9',  title: '날씨 무결점',  desc: '강풍날 출조 경험',               icon: '💨', cat: '도전',    current: 0,  total: 1,  done: false, badge: '💪 강철 조사',    color: '#64748b' },
  { id: 'c10', title: '커뮤니티 스타',desc: '조황 게시글 작성 3회',           icon: '📝', cat: '소통',    current: 1,  total: 3,  done: false, badge: '⭐ 스타 조사',    color: '#ec4899' },
  { id: 'c11', title: '연속 출조',    desc: '3주 연속 출조 기록',             icon: '🔥', cat: '도전',    current: 2,  total: 3,  done: false, badge: '🔥 열정 조사',    color: '#f97316' },
  { id: 'c12', title: '만선',         desc: '10마리 이상 조과 5회',           icon: '🚢', cat: '조황',    current: 2,  total: 5,  done: false, badge: '⚓ 만선왕',       color: '#0ea5e9' },
];

const CATS = ['전체', '조황', '탐험', '기록', '컬렉션', '도전', '소통'];

export default function ChallengesPage() {
  const [cat, setCat] = useState('전체');

  const doneCount = CHALLENGES.filter(c => c.done).length;
  const totalScore = doneCount * 100;

  const filtered = cat === '전체' ? CHALLENGES : CHALLENGES.filter(c => c.cat === cat);

  return (
    <div style={{ paddingBottom: 32 }}>
      {/* ── 히어로 ── */}
      <section style={{
        background: 'linear-gradient(160deg, var(--ocean-100) 0%, var(--ocean-200) 100%)',
        padding: '36px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.12) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--hook)', marginBottom: 8, textTransform: 'uppercase' }}>
          CHALLENGES
        </div>
        <h1 style={{ margin: '0 0 12px', fontSize: 26, fontWeight: 900, color: 'var(--text-strong)', lineHeight: 1.25 }}>
          낚시 챌린지
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 14, color: 'var(--text-dim)', fontWeight: 500 }}>
            달성: <strong style={{ color: 'var(--text-strong)' }}>{doneCount}</strong> / {CHALLENGES.length}
          </div>
          <div style={{ flex: 1, height: 8, background: 'var(--tint-10)', borderRadius: 99 }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${(doneCount / CHALLENGES.length) * 100}%`,
              background: 'linear-gradient(90deg, #f59e0b, #f97316)',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#f59e0b' }}>
            {totalScore}pt
          </div>
        </div>
      </section>

      {/* ── 뱃지 월드 ── */}
      <section style={{ padding: '24px 20px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 14 }}>
          🏅 뱃지 월드
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {CHALLENGES.map(c => (
            <div key={c.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '12px 8px',
              background: c.done ? 'var(--tint-06)' : 'var(--tint-03)',
              borderRadius: 'var(--r-sm)',
              border: `1px solid ${c.done ? c.color + '44' : 'var(--line)'}`,
              opacity: c.done ? 1 : 0.38,
              transition: 'opacity 0.2s',
              position: 'relative',
            }}>
              {!c.done && (
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  fontSize: 10, color: 'var(--text-mute)',
                }}>🔒</div>
              )}
              <div style={{ fontSize: 26, lineHeight: 1 }}>{c.badge.split(' ')[0]}</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: c.done ? c.color : 'var(--text-mute)', textAlign: 'center', lineHeight: 1.3 }}>
                {c.badge.replace(/^\S+\s/, '')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 카테고리 탭 ── */}
      <div style={{ padding: '20px 20px 0', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                padding: '6px 14px',
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                background: cat === c ? 'var(--hook)' : 'var(--tint-06)',
                color: cat === c ? '#fff' : 'var(--text-dim)',
                transition: 'all 0.15s',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── 진행 중 챌린지 ── */}
      <section style={{ padding: '16px 20px 0' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginBottom: 12 }}>
          진행 중 챌린지 <span style={{ color: 'var(--text-mute)', fontWeight: 400 }}>({filtered.length})</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(c => {
            const pct = Math.round((c.current / c.total) * 100);
            return (
              <article key={c.id} style={{
                display: 'flex', alignItems: 'stretch', gap: 0,
                background: 'var(--tint-04)',
                borderRadius: 'var(--r-card)',
                border: '1px solid var(--line)',
                overflow: 'hidden',
              }}>
                {/* 카테고리 색상 세로 바 */}
                <div style={{ width: 4, background: c.color, flexShrink: 0, borderRadius: '0' }} />
                <div style={{ flex: 1, padding: '14px 14px 14px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: c.color + '22',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18, flexShrink: 0,
                      }}>
                        {c.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-strong)' }}>
                          {c.title}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
                          {c.desc}
                        </div>
                      </div>
                    </div>
                    {c.done ? (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '4px 10px', borderRadius: 99,
                        background: '#10b98122',
                        color: '#10b981', fontSize: 12, fontWeight: 700, flexShrink: 0,
                      }}>
                        ✓ 완료
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--text-mute)', flexShrink: 0 }}>
                        {c.current}/{c.total}
                      </div>
                    )}
                  </div>
                  {/* 프로그레스 바 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--tint-10)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: c.done
                          ? 'linear-gradient(90deg, #10b981, #34d399)'
                          : `linear-gradient(90deg, ${c.color}, ${c.color}cc)`,
                        borderRadius: 99,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                    <div style={{ fontSize: 11, color: c.done ? '#10b981' : 'var(--text-mute)', fontWeight: 700, minWidth: 30, textAlign: 'right' }}>
                      {pct}%
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── 총 점수 ── */}
      <section style={{ margin: '24px 20px 0' }}>
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, var(--ocean-100), var(--ocean-200))',
          borderRadius: 'var(--r-card)',
          border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>총 달성 점수</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f59e0b', lineHeight: 1 }}>
              {totalScore.toLocaleString()}
              <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 4 }}>pt</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>완료 챌린지</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-strong)' }}>
              {doneCount} <span style={{ fontSize: 14, color: 'var(--text-dim)' }}>/ {CHALLENGES.length}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
