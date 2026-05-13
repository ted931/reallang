"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DUMMY_GATHERINGS } from "@/lib/dummy-gatherings";
import type { FishingClub } from "@/lib/types";

// ── 어종·방식 카테고리 (낚시 특화 8종) ────────────────────────────────────
const FISH_CATS = [
  { id: "galchi",    icon: "🐟", label: "갈치",      color: "#5fa3cf" },
  { id: "gamsungdom",icon: "🐡", label: "감성돔",    color: "#86efac" },
  { id: "paramdome", icon: "🐠", label: "참돔·벵에돔", color: "#f87171" },
  { id: "bangeo",    icon: "🐋", label: "방어·부시리", color: "#fbbf24" },
  { id: "lure",      icon: "🎯", label: "루어·지깅", color: "#a78bfa" },
  { id: "rockshore", icon: "🪨", label: "갯바위",    color: "#fb923c" },
  { id: "boat",      icon: "⛵", label: "선상",      color: "#38bdf8" },
  { id: "pier",      icon: "🌊", label: "방파제",    color: "#34d399" },
] as const;

// 특수 필터
const EXTRA_FILTERS = [
  { id: "free",      label: "무료",     emoji: "🎁" },
  { id: "beginner",  label: "입문환영", emoji: "🌱" },
  { id: "night",     label: "야간출조", emoji: "🌙" },
  { id: "veteran",   label: "고수전용", emoji: "🏆" },
] as const;

const REGIONS = ["전체", "한림", "애월", "서귀포", "성산", "모슬포", "구좌", "표선"];

const LEVEL_COLOR: Record<string, string> = {
  입문: "#86efac", 중급: "#60a5fa", 고급: "#fbbf24", 전체: "#a78bfa",
};

const ACCENT_COLORS = ["#5fa3cf","#86efac","#fbbf24","#f0abfc","#a78bfa","#fb7185","#34d399","#fb923c"];

function getDday(dateStr: string) {
  const today = new Date("2026-05-13");
  const target = new Date(dateStr);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return { label: "오늘!", urgent: true };
  if (diff < 0) return { label: "출조완료", urgent: false };
  return { label: `D-${diff}`, urgent: diff <= 3 };
}

function formatDate(str: string) {
  const d = new Date(str);
  const days = ["일","월","화","수","목","금","토"];
  return `${d.getMonth()+1}/${d.getDate()}(${days[d.getDay()]})`;
}

// 더미 리뷰
const REVIEWS = [
  { who: "갈치고수 · 한림", club: "한림야간갈치클럽", stars: 5, text: "혼자 밤낚시 무서웠는데 클럽 덕분에 안전하게 즐겼어요. 포인트 정보 공유가 진짜 핵심이에요." },
  { who: "입문자 · 서귀포", club: "서귀포감성돔동우회", stars: 5, text: "처음 낚시 시작했는데 선배 분들이 채비부터 다 가르쳐 주셔서 첫날 감성돔 잡았습니다!" },
  { who: "루어매니아 · 제주시", club: "제주바다낚시클럽", stars: 5, text: "지깅 장비 공구 정보랑 원정 스케줄 공유가 타 클럽과 차원이 달라요. 진짜 전문적." },
];

export default function GatheringPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [extraFilters, setExtraFilters] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"all"|"recruiting"|"hot">("all");

  const total = DUMMY_GATHERINGS.length;
  const recruiting = DUMMY_GATHERINGS.filter(c => c.openRecruiting).length;
  const thisMonthOutings = DUMMY_GATHERINGS.filter(c => {
    const d = new Date(c.nextOuting);
    return d.getFullYear() === 2026 && d.getMonth() === 4;
  }).length;
  const totalMembers = DUMMY_GATHERINGS.reduce((s, c) => s + c.memberCount, 0);

  const hotClubs = useMemo(() =>
    DUMMY_GATHERINGS
      .filter(c => c.openRecruiting && (c.maxMembers - c.memberCount) <= 3)
      .slice(0, 4),
    []
  );

  const toggleExtra = (id: string) =>
    setExtraFilters(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered = useMemo(() => {
    return DUMMY_GATHERINGS.filter(c => {
      if (search && !c.name.includes(search) && !c.specialty.includes(search) && !c.region.includes(search)) return false;
      if (selectedRegion !== "전체" && c.region !== selectedRegion) return false;
      if (tab === "recruiting" && !c.openRecruiting) return false;
      if (tab === "hot" && (c.maxMembers - c.memberCount) > 3) return false;
      if (extraFilters.has("free") && c.monthlyFee !== 0) return false;
      if (extraFilters.has("beginner") && c.level !== "입문" && c.level !== "전체") return false;
      if (extraFilters.has("night") && !c.activities.some(a => a.includes("야간") || a.includes("밤"))) return false;
      if (extraFilters.has("veteran") && c.level !== "고급") return false;
      return true;
    });
  }, [search, selectedRegion, tab, extraFilters]);

  return (
    <>
      {/* ── 히어로 ────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, #0a1e3d 0%, #0e2a50 60%, #0a1628 100%)',
        padding: '32px 20px 0', position: 'relative', overflow: 'hidden',
      }}>
        {/* BG glow */}
        <div style={{ position: 'absolute', top: -60, left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(95,163,207,0.12), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* 배지 */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11,
            padding: '4px 12px', borderRadius: 99, fontWeight: 700,
            background: 'rgba(95,163,207,0.12)', border: '1px solid rgba(95,163,207,0.25)',
            color: 'var(--ocean-300)', marginBottom: 14,
          }}>
            🎣 제주에서 함께 낚시할 동료를 찾아요
          </span>

          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1.2, letterSpacing: '-1px', margin: '0 0 10px' }}>
            혼자 가기 아쉬울 때<br />
            <span style={{ color: 'var(--ocean-300)' }}>함께 출조하는</span> 낚시 클럽
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20, lineHeight: 1.6 }}>
            갈치·감성돔·방어·루어 — 같은 포인트, 같은 물때를 함께할 낚시 동료를 만나요.
          </p>

          {/* 검색바 */}
          <div style={{
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16, padding: '6px 6px 6px 16px', display: 'flex', gap: 8,
            marginBottom: 20,
          }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="클럽명, 어종, 지역으로 검색..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: 14, fontFamily: 'inherit',
              }}
            />
            <button style={{
              padding: '10px 20px', background: 'var(--ocean-300)', color: '#0a1628',
              border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>검색</button>
          </div>

          {/* 빠른 검색 태그 */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, fontSize: 12 }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>자주 찾는:</span>
            {["야간 갈치", "감성돔 입문", "지깅 원정", "무료 클럽"].map(v => (
              <button key={v} onClick={() => setSearch(v)} style={{
                background: 'none', border: 'none', color: 'var(--ocean-300)',
                cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 12,
              }}>#{v}</button>
            ))}
          </div>
        </div>

        {/* 통계 바 */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 4 }}>
          <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 0', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4, textAlign: 'center' }}>
            {[
              [total, "클럽"],
              [totalMembers, "총 회원"],
              [recruiting, "모집중"],
              [thisMonthOutings, "이달 출조"],
            ].map(([v, l]) => (
              <div key={String(l)}>
                <div style={{ fontSize: 'clamp(14px, 4vw, 20px)', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{v}<span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginLeft: 2 }}>{l === "총 회원" || l === "이달 출조" ? "명" : "개"}</span></div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* ── 어종·방식 카테고리 ────────────────────────────────────── */}
        <section style={{ padding: '24px 20px 0', background: 'var(--tint-04)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-strong)', letterSpacing: '-0.5px' }}>어종·방식으로 찾기</div>
              <div style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 2 }}>관심 낚시 방식을 골라 바로 시작해요</div>
            </div>
            <button onClick={() => setSelectedCat("")} style={{ fontSize: 12, fontWeight: 700, color: 'var(--ocean-300)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>전체 보기 →</button>
          </div>
          <div className="fg-cat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, paddingBottom: 20 }}>
            {FISH_CATS.map(c => {
              const count = DUMMY_GATHERINGS.filter(g =>
                g.fishTypes.some(f => f.includes(c.label.split('·')[0])) ||
                g.specialty.includes(c.label.split('·')[0]) ||
                g.activities.some(a => a.includes(c.label.split('·')[0]))
              ).length;
              const isActive = selectedCat === c.id;
              return (
                <button key={c.id} onClick={() => setSelectedCat(isActive ? "" : c.id)} style={{
                  borderRadius: 16, padding: '14px 8px', textAlign: 'center',
                  background: isActive ? `${c.color}18` : 'var(--tint-06)',
                  border: isActive ? `1.5px solid ${c.color}` : '1px solid var(--line)',
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: isActive ? `${c.color}22` : 'var(--tint-08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, margin: '0 auto 8px',
                    border: isActive ? `1px solid ${c.color}44` : '1px solid var(--line)',
                  }}>{c.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: isActive ? c.color : 'var(--text-strong)', letterSpacing: '-0.3px' }}>{c.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-mute)', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>{count || Math.floor(Math.random()*4)+1}개</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── 마감 임박 HOT ──────────────────────────────────────────── */}
        {hotClubs.length > 0 && (
          <section style={{ padding: '24px 20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}>
              <div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 800,
                  padding: '3px 10px', borderRadius: 99,
                  background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)',
                  marginBottom: 6,
                }}>🔥 모집 마감 임박</span>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-strong)', letterSpacing: '-0.5px' }}>지금 신청 안 하면 마감!</div>
              </div>
              <button onClick={() => setTab("hot")} style={{ fontSize: 12, fontWeight: 700, color: 'var(--hook-300)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>더 보기 →</button>
            </div>
            <div className="fg-hot-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {hotClubs.map((c, i) => {
                const accent = ACCENT_COLORS[i % ACCENT_COLORS.length];
                const spotsLeft = c.maxMembers - c.memberCount;
                return (
                  <Link key={c.id} href={`/gathering/${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{
                      background: 'var(--tint-04)', border: '1px solid var(--line)',
                      borderRadius: 16, overflow: 'hidden',
                      transition: 'border-color 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = accent)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                    >
                      {/* 이미지 영역 */}
                      <div style={{
                        height: 90, position: 'relative',
                        background: `linear-gradient(135deg, ${accent}33, ${accent}11)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 36, opacity: 0.4 }}>🎣</span>
                        <span style={{
                          position: 'absolute', top: 8, right: 8,
                          fontSize: 10, fontWeight: 800, padding: '3px 8px',
                          borderRadius: 99, background: '#ef4444', color: '#fff',
                          animation: 'fl-pulse 1.5s ease-in-out infinite',
                        }}>잔여 {spotsLeft}자리</span>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: 9, color: 'var(--text-mute)', fontWeight: 700, marginBottom: 2 }}>{c.region}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-strong)', lineHeight: 1.3, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{c.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                          <span style={{ color: 'var(--text-mute)' }}>📅 {formatDate(c.nextOuting)}</span>
                          <span style={{ color: accent, fontWeight: 800 }}>
                            {c.monthlyFee === 0 ? "무료" : `월 ${(c.monthlyFee/1000).toFixed(0)}K`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── AI 출조 + 서비스 배너 ─────────────────────────────────── */}
        <section style={{ padding: '24px 20px 0' }}>
          <div style={{
            borderRadius: 20, overflow: 'hidden', padding: '24px 20px', color: '#fff', marginBottom: 12,
            background: 'linear-gradient(135deg, #1e3a5f 0%, #0e3060 50%, #0a1628 100%)',
            border: '1px solid rgba(95,163,207,0.2)',
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '1px', opacity: 0.7 }}>🤖 AI · 출조 계획</span>
            <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6, lineHeight: 1.3 }}>3분 만에 나만의<br />출조 플랜 완성</div>
            <p style={{ fontSize: 13, opacity: 0.8, marginTop: 8, marginBottom: 16, lineHeight: 1.6 }}>날짜와 어종만 알려주세요. 물때·포인트·채비까지 맞춤 계획을 드려요.</p>
            <Link href="/planner" style={{
              display: 'inline-block', padding: '10px 20px', background: 'var(--ocean-300)',
              color: '#0a1628', fontWeight: 800, borderRadius: 12, fontSize: 13, textDecoration: 'none',
            }}>출조 플래너 →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { emoji: '🗺️', label: '포인트 지도', sub: '제주 전역 포인트', href: '/map', color: '#5fa3cf' },
              { emoji: '📋', label: '쿠폰 허브', sub: '좌대·용품 할인', href: '/coupon', color: 'var(--hook)' },
            ].map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'var(--tint-04)', border: '1px solid var(--line)',
                  borderRadius: 16, padding: '16px', display: 'flex', gap: 12, alignItems: 'flex-start',
                  transition: 'border-color 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = item.color)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--tint-08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{item.emoji}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-strong)' }}>{item.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-mute)', marginTop: 2 }}>{item.sub} →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 클럽 목록 ─────────────────────────────────────────────── */}
        <section id="club-list" style={{ padding: '24px 20px 0' }}>

          {/* 탭 */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {[
              { key: "all", label: "전체" },
              { key: "recruiting", label: "🟢 모집중" },
              { key: "hot", label: "🔥 마감임박" },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key as typeof tab)} style={{
                padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                background: tab === t.key ? 'var(--hook)' : 'var(--tint-06)',
                color: tab === t.key ? 'white' : 'var(--text-dim)',
                border: tab === t.key ? 'none' : '1px solid var(--line)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{t.label}</button>
            ))}
          </div>

          {/* 지역 필터 */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 8, scrollbarWidth: 'none' }}>
            {REGIONS.map(r => (
              <button key={r} onClick={() => setSelectedRegion(r)} style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: selectedRegion === r ? 'var(--text-strong)' : 'var(--tint-06)',
                color: selectedRegion === r ? 'var(--ocean-950)' : 'var(--text-dim)',
                border: selectedRegion === r ? 'none' : '1px solid var(--line)',
                cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              }}>{r}</button>
            ))}
          </div>

          {/* 특수 필터 */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, scrollbarWidth: 'none' }}>
            {EXTRA_FILTERS.map(f => {
              const on = extraFilters.has(f.id);
              return (
                <button key={f.id} onClick={() => toggleExtra(f.id)} style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                  background: on ? 'rgba(245,158,11,0.15)' : 'var(--tint-06)',
                  color: on ? '#f59e0b' : 'var(--text-dim)',
                  border: on ? '1px solid rgba(245,158,11,0.4)' : '1px solid var(--line)',
                  cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                }}>{f.emoji} {f.label}</button>
              );
            })}
          </div>

          {/* 결과 수 */}
          <div style={{ fontSize: 12, color: 'var(--text-mute)', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-strong)' }}>{filtered.length}</span>개 클럽
            {selectedRegion !== "전체" && <span style={{ marginLeft: 6 }}>· {selectedRegion}</span>}
          </div>

          {/* 클럽 카드 목록 */}
          <div className="fg-club-list" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {filtered.map((club, idx) => (
              <ClubCard key={club.id} club={club} idx={idx} />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎣</div>
                <div style={{ fontWeight: 800, color: 'var(--text-strong)', marginBottom: 6 }}>조건에 맞는 클럽이 없어요</div>
                <div style={{ fontSize: 13, color: 'var(--text-mute)', marginBottom: 20 }}>직접 클럽을 만들어보는 건 어때요?</div>
                <Link href="/gathering/new" style={{
                  display: 'inline-block', padding: '12px 24px',
                  background: 'var(--hook)', color: 'white', fontWeight: 800,
                  borderRadius: 12, textDecoration: 'none', fontSize: 14,
                }}>클럽 만들기</Link>
              </div>
            )}
          </div>
        </section>

        {/* ── 후기 섹션 ─────────────────────────────────────────────── */}
        <section style={{ padding: '32px 20px 0', borderTop: '1px solid var(--line)', marginTop: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-strong)', letterSpacing: '-0.5px', marginBottom: 4 }}>먼저 다녀온 낚시인들</div>
          <div style={{ fontSize: 12, color: 'var(--text-mute)', marginBottom: 18 }}>평균 별점 4.8 · 후기 238건</div>
          <div className="fg-reviews-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{
                background: 'var(--tint-04)', border: '1px solid var(--line)',
                borderRadius: 14, padding: '16px',
              }}>
                <div style={{ color: '#f59e0b', fontSize: 13, marginBottom: 8 }}>{"★".repeat(r.stars)}</div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7, margin: '0 0 12px' }}>"{r.text}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 10, fontSize: 11 }}>
                  <span style={{ fontWeight: 800, color: 'var(--text-strong)' }}>{r.who}</span>
                  <span style={{ color: 'var(--text-mute)' }}>#{r.club}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: 100 }} />
      </div>

      {/* FAB — bottom: 100px (바텀 네비 70px + 여유) */}
      <Link href="/gathering/new" style={{
        position: 'fixed', bottom: 100, right: 20,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '14px 20px', background: 'var(--hook)', color: 'white',
        borderRadius: 99, fontWeight: 800, fontSize: 14, textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(233,78,59,0.4)',
        zIndex: 50,
      }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
        <span>클럽 만들기</span>
      </Link>

      {/* 반응형 스타일 */}
      <style>{`
        @media (min-width: 768px) {
          /* 카테고리 그리드: 모바일 4열 → PC 8열 */
          .fg-cat-grid { grid-template-columns: repeat(8,1fr) !important; }
          /* HOT 클럽: 모바일 2열 → PC 4열 */
          .fg-hot-grid { grid-template-columns: repeat(4,1fr) !important; }
          /* 클럽 카드 목록: PC 2열 그리드 */
          .fg-club-list { grid-template-columns: 1fr 1fr !important; }
          /* 후기 섹션: PC 3열 그리드 */
          .fg-reviews-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
      `}</style>
    </>
  );
}

function ClubCard({ club, idx }: { club: FishingClub; idx: number }) {
  const router = useRouter();
  const full = club.memberCount >= club.maxMembers;
  const pct = Math.min((club.memberCount / club.maxMembers) * 100, 100);
  const spotsLeft = club.maxMembers - club.memberCount;
  const accent = ACCENT_COLORS[parseInt(club.id.replace("g","")) % ACCENT_COLORS.length];
  const dday = getDday(club.nextOuting);
  const isFewSpots = !full && spotsLeft <= 3;

  return (
    <article
      onClick={() => router.push(`/gathering/${club.id}`)}
      style={{
        background: 'var(--tint-04)', border: '1px solid var(--line)',
        borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.boxShadow = `0 4px 20px ${accent}18`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--line)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* 이미지 영역 */}
      <div style={{
        height: 110, position: 'relative',
        background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 48, opacity: 0.2 }}>🎣</span>

        {/* 카테고리 배지 */}
        <span style={{
          position: 'absolute', top: 10, left: 10,
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
          background: `${accent}22`, color: accent, border: `1px solid ${accent}44`,
        }}>🎣 {club.specialty.split('·')[0]}</span>

        {/* 잔여 자리 배지 */}
        <span style={{
          position: 'absolute', top: 10, right: 10,
          fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 99,
          background: full ? 'var(--tint-08)' : isFewSpots ? 'rgba(239,68,68,0.9)' : 'rgba(34,197,94,0.15)',
          color: full ? 'var(--text-mute)' : isFewSpots ? '#fff' : '#22c55e',
          border: full || isFewSpots ? 'none' : '1px solid rgba(34,197,94,0.3)',
        }}>
          {full ? "모집 마감" : `잔여 ${spotsLeft}자리`}
        </span>

        {/* 레벨 배지 */}
        <span style={{
          position: 'absolute', bottom: 10, left: 10,
          fontSize: 9, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
          background: 'rgba(0,0,0,0.4)', color: LEVEL_COLOR[club.level] ?? '#fff',
          border: `1px solid ${LEVEL_COLOR[club.level] ?? '#fff'}44`,
        }}>{club.level}</span>
      </div>

      {/* 카드 본문 */}
      <div style={{ padding: '14px 16px' }}>
        {/* 지역 + 날짜 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: 'var(--text-mute)', fontWeight: 600, marginBottom: 6 }}>
          <span>{club.region}</span>
          <span>·</span>
          <span>다음 출조 {formatDate(club.nextOuting)}</span>
          {dday.urgent && (
            <span style={{ marginLeft: 'auto', color: '#ef4444', fontWeight: 800, fontSize: 10 }}>⏰ 마감 임박</span>
          )}
        </div>

        {/* 클럽명 */}
        <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 900, color: 'var(--text-strong)', letterSpacing: '-0.5px', lineHeight: 1.3 }}>
          {club.name}
        </h3>

        {/* 설명 */}
        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {club.description}
        </p>

        {/* 가격 블록 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '10px 12px', borderRadius: 10, marginBottom: 12,
          background: `${accent}0d`, border: `1px solid ${accent}22`,
        }}>
          <span style={{ fontSize: 18, fontWeight: 900, color: accent }}>
            {club.monthlyFee === 0 ? "무료" : `월 ${club.monthlyFee.toLocaleString()}원`}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>{club.meetingFrequency}</span>
        </div>

        {/* 어종 태그 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
          {club.fishTypes.map(f => (
            <span key={f} style={{
              fontSize: 10, padding: '3px 8px', borderRadius: 99,
              background: `${accent}18`, color: accent, border: `1px solid ${accent}33`,
              fontWeight: 700,
            }}>{f}</span>
          ))}
        </div>

        {/* 회원 프로그레스바 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
            <span style={{ color: 'var(--text-dim)' }}>👥 {club.memberCount}/{club.maxMembers}명</span>
            <span style={{ color: 'var(--text-mute)' }}>{Math.round(pct)}% 채워짐</span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: 'var(--tint-08)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: full ? 'var(--text-mute)' : `linear-gradient(90deg, ${accent}88, ${accent})`, transition: 'width 0.5s' }} />
          </div>
        </div>

        {/* 활동 태그 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {club.activities.slice(0, 3).map(act => (
            <span key={act} style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 99,
              background: 'var(--tint-06)', color: 'var(--text-dim)', border: '1px solid var(--line)',
              fontWeight: 600,
            }}>{act}</span>
          ))}
        </div>

        {/* 가입 신청 버튼 */}
        <button
          disabled={!club.openRecruiting}
          onClick={e => { e.stopPropagation(); if (club.openRecruiting) router.push(`/gathering/${club.id}`); }}
          style={{
            width: '100%', padding: '12px', borderRadius: 12, fontWeight: 800, fontSize: 14,
            border: 'none', cursor: club.openRecruiting ? 'pointer' : 'not-allowed',
            background: club.openRecruiting ? 'var(--hook)' : 'var(--tint-08)',
            color: club.openRecruiting ? 'white' : 'var(--text-mute)',
            opacity: club.openRecruiting ? 1 : 0.6,
            fontFamily: 'inherit', transition: 'background 0.15s',
          }}
        >
          {club.openRecruiting ? "가입 신청하기 →" : "모집 마감"}
        </button>
      </div>
    </article>
  );
}
