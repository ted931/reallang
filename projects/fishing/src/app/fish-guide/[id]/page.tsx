"use client";
import { use } from "react";
import Link from "next/link";
import { FISH_DATA } from "@/lib/fish-data";

const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

const DIFF_COLOR: Record<string, string> = {
  '입문': '#22c55e',
  '중급': '#f59e0b',
  '고급': '#ef4444',
};

export default function FishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const fish = FISH_DATA.find(f => f.id === id);

  if (!fish) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-mute)', fontSize: 16 }}>어종 정보를 찾을 수 없습니다.</p>
        <Link href="/fish-guide" style={{ color: 'var(--ocean-300)', fontSize: 14 }}>← 도감으로 돌아가기</Link>
      </div>
    );
  }

  const heroGradient = `linear-gradient(160deg, ${fish.color}bb 0%, ${fish.color}66 50%, #0a1628 100%)`;

  return (
    <div style={{ maxWidth: 720, width: '100%', margin: '0 auto', paddingBottom: 80 }}>

          {/* Back */}
          <div style={{ padding: '16px 20px 0' }}>
            <Link
              href="/fish-guide"
              style={{ color: 'var(--ocean-300)', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              ← 어종 도감
            </Link>
          </div>

          {/* Hero */}
          <div style={{
            margin: '12px 20px 0',
            borderRadius: 20,
            background: heroGradient,
            padding: '28px 24px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* decorative circles */}
            <div style={{
              position: 'absolute', right: -30, top: -30,
              width: 160, height: 160, borderRadius: '50%',
              background: `${fish.color}33`, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', right: 40, bottom: -40,
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', gap: 20 }}>
              {/* Emoji */}
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 44, flexShrink: 0,
              }}>
                {fish.emoji}
              </div>

              {/* Name */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px',
                    borderRadius: 999, background: 'rgba(255,255,255,0.18)',
                    color: '#fff', border: '1px solid rgba(255,255,255,0.25)',
                  }}>
                    {fish.typeLabel}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 8px',
                    borderRadius: 999, background: `${DIFF_COLOR[fish.difficulty]}33`,
                    color: DIFF_COLOR[fish.difficulty], border: `1px solid ${DIFF_COLOR[fish.difficulty]}55`,
                  }}>
                    {fish.difficulty}
                  </span>
                </div>
                <h1 style={{
                  margin: 0, fontSize: 30, fontWeight: 900,
                  color: '#fff', letterSpacing: '-1px', lineHeight: 1.1,
                }}>
                  {fish.name}
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.7)', letterSpacing: '-0.2px' }}>
                  {fish.nameEn}
                </p>
              </div>
            </div>

            {/* Description */}
            <p style={{
              position: 'relative', zIndex: 1,
              margin: '18px 0 0', fontSize: 13, lineHeight: 1.7,
              color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.2px',
            }}>
              {fish.description}
            </p>
          </div>

          {/* Season Calendar */}
          <section style={{ padding: '24px 20px 0' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.4px' }}>
              베스트 시즌
            </h2>
            <div style={{
              background: 'var(--tint-04)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-card)', padding: '16px',
              display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4,
            }}>
              {MONTHS.map((m, i) => {
                const month = i + 1;
                const active = fish.bestMonths.includes(month);
                return (
                  <div key={m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: 6,
                      background: active ? `${fish.color}cc` : 'var(--tint-06)',
                      border: active ? `1.5px solid ${fish.color}` : '1px solid var(--line)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: active ? 9 : 8,
                      fontWeight: active ? 700 : 500,
                      color: active ? '#fff' : 'var(--text-mute)',
                      transition: 'background 0.15s',
                    }}>
                      {month}
                    </div>
                    <span style={{ fontSize: 8, color: 'var(--text-mute)', whiteSpace: 'nowrap' }}>
                      {m.replace('월', '')}
                    </span>
                  </div>
                );
              })}
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--text-mute)' }}>
              시즌: {fish.season}
            </p>
          </section>

          {/* Info Cards */}
          <section style={{ padding: '24px 20px 0' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.4px' }}>
              낚시 정보
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '📏', label: '수심', value: fish.depth },
                { icon: '📐', label: '최대 크기', value: fish.maxSize },
                { icon: '🎣', label: '추천 채비', value: fish.tackle },
                { icon: '🪱', label: '추천 미끼', value: fish.bait },
              ].map(item => (
                <div key={item.label} style={{
                  background: 'var(--tint-04)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)', padding: '14px',
                }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-mute)', fontWeight: 700, marginBottom: 4, letterSpacing: '-0.2px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.3px', lineHeight: 1.3 }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Points */}
          <section style={{ padding: '24px 20px 0' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.4px' }}>
              주요 포인트
            </h2>
            <div style={{
              background: 'var(--tint-04)', border: '1px solid var(--line)',
              borderRadius: 'var(--r-card)', overflow: 'hidden',
            }}>
              {fish.points.map((pt, i) => (
                <div key={pt} style={{
                  padding: '13px 16px',
                  borderBottom: i < fish.points.length - 1 ? '1px solid var(--line)' : 'none',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: `${fish.color}22`, border: `1px solid ${fish.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, color: fish.color, flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text-strong)', fontWeight: 600, letterSpacing: '-0.3px' }}>
                    📍 {pt}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Tips */}
          <section style={{ padding: '24px 20px 0' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.4px' }}>
              낚시 팁
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {fish.tips.map((tip, i) => (
                <div key={i} style={{
                  background: 'var(--tint-04)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)', padding: '12px 14px',
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: '50%',
                    background: `${fish.color}22`, border: `1px solid ${fish.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 900, color: fish.color,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--text)', letterSpacing: '-0.3px', lineHeight: 1.5 }}>
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section style={{ padding: '28px 20px 0' }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text-strong)', letterSpacing: '-0.4px' }}>
              관련 페이지
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/catch" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--tint-04)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)', padding: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'border-color 0.15s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ocean-300)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>🏆</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.3px' }}>
                        이 어종 조황 보기
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>
                        다른 낚시인들의 실제 조과 기록
                      </div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--ocean-300)', fontSize: 16 }}>→</span>
                </div>
              </Link>

              <Link href="/map" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--tint-04)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)', padding: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'border-color 0.15s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ocean-300)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>🗺️</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.3px' }}>
                        포인트 지도
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>
                        제주 전 낚시 포인트 지도로 보기
                      </div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--ocean-300)', fontSize: 16 }}>→</span>
                </div>
              </Link>

              <Link href="/planner" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--tint-04)', border: '1px solid var(--line)',
                  borderRadius: 'var(--r-sm)', padding: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'border-color 0.15s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--ocean-300)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22 }}>📋</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', letterSpacing: '-0.3px' }}>
                        출조 플래너
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>
                        이 어종에 맞는 출조 일정 짜기
                      </div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--ocean-300)', fontSize: 16 }}>→</span>
                </div>
              </Link>
            </div>
          </section>

    </div>
  );
}
