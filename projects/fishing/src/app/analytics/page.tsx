"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

const FISH_STATS = [
  { name: "갈치", emoji: "🐟", count: 147, rate: 78, best: "82cm", point: "한림 야간", color: "var(--hook)" },
  { name: "감성돔", emoji: "🐡", count: 43, rate: 52, best: "54cm", point: "서귀포 황우지", color: "#a78bfa" },
  { name: "참돔", emoji: "🐠", count: 28, rate: 44, best: "61cm", point: "성산 선상", color: "#f87171" },
  { name: "광어", emoji: "🐟", count: 34, rate: 61, best: "67cm", point: "협재 루어", color: "var(--ocean-300)" },
  { name: "볼락", emoji: "🐡", count: 89, rate: 83, best: "28cm", point: "애월 방파제", color: "#86efac" },
  { name: "방어", emoji: "🐠", count: 12, rate: 38, best: "74cm", point: "마라도 선상", color: "#fbbf24" },
];

const MONTHLY_DATA = [
  { month: "1월", count: 12 },
  { month: "2월", count: 8 },
  { month: "3월", count: 19 },
  { month: "4월", count: 31 },
  { month: "5월", count: 24 },
];

const TOP_POINTS = [
  { rank: 1, name: "한림 갯바위", region: "한림읍", visits: 18, catches: 112, best: "갈치·볼락" },
  { rank: 2, name: "서귀포 황우지", region: "서귀포시", visits: 11, catches: 64, best: "감성돔·참돔" },
  { rank: 3, name: "성산 일출봉 앞", region: "성산읍", visits: 8, catches: 47, best: "참돔·광어" },
];

const BADGES = [
  { label: "갈치 마스터", emoji: "🏆", color: "var(--hook)" },
  { label: "100마리 달성", emoji: "🎖️", color: "#fbbf24" },
  { label: "연속 조황 7일", emoji: "🔥", color: "#f87171" },
];

// May 2026 calendar — days with catches
const MAY_CATCHES = new Set([2, 4, 5, 9, 11, 14, 16, 17, 22, 23, 25, 28, 30]);

const PERIODS = ["1개월", "3개월", "6개월", "1년", "전체"] as const;
type Period = typeof PERIODS[number];

const FISH_TABS = FISH_STATS.map((f) => f.name);

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("전체");
  const [selectedFish, setSelectedFish] = useState<string>("전체");
  const maxBar = Math.max(...MONTHLY_DATA.map((d) => d.count));

  const filteredFishStats = selectedFish === "전체"
    ? FISH_STATS
    : FISH_STATS.filter((f) => f.name === selectedFish);

  // Build May 2026 calendar grid (1st = Friday → offset 5)
  const firstDayOffset = 5; // 0=Mon … 6=Sun (May 1, 2026 = Friday)
  const totalDays = 31;
  const cells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  // pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <>
      {/* 히어로 */}
      <section className="fl-hero">
        <div className="fl-hero-glow" />
        <div className="fl-hero-content">
          <div className="fl-hero-greet">MY STATS</div>
          <h1 className="fl-hero-title">내 조과 분석</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0 }}>
            지금까지 낚은 물고기들의 이야기
          </p>
        </div>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      {/* 기간 필터 */}
      <div style={{ display: "flex", gap: 6, padding: "16px 20px 0", overflowX: "auto", scrollbarWidth: "none" }}>
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPeriod(p)}
            style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 99,
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              background: selectedPeriod === p ? "var(--hook)" : "var(--tint-06)",
              color: selectedPeriod === p ? "var(--ocean-950)" : "var(--text-dim)",
              border: selectedPeriod === p ? "none" : "1px solid var(--line)",
            }}
          >{p}</button>
        ))}
      </div>

      {/* 어종 탭 */}
      <div style={{ display: "flex", gap: 6, padding: "10px 20px 0", overflowX: "auto", scrollbarWidth: "none" }}>
        {["전체", ...FISH_TABS].map((f) => (
          <button
            key={f}
            onClick={() => setSelectedFish(f)}
            style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 99,
              fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              background: selectedFish === f ? "var(--ocean-900)" : "transparent",
              color: selectedFish === f ? "var(--text-strong)" : "var(--text-dim)",
              border: selectedFish === f ? "1px solid var(--line-2)" : "1px solid transparent",
            }}
          >{f}</button>
        ))}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .fl-fish-stats-list {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            overflow-x: visible !important;
            flex-wrap: unset !important;
          }
          .fl-fish-stats-list > div {
            width: auto !important;
            flex-shrink: unset !important;
          }
        }
      `}</style>
      <div style={{ padding: "0 20px", maxWidth: 960, margin: "0 auto" }}>

        {/* 프로필 요약 카드 */}
        <div style={{
          background: "var(--ocean-900)", border: "1px solid var(--line-2)",
          borderRadius: "var(--r-card)", padding: 20, marginTop: 20, marginBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{
              width: 54, height: 54, borderRadius: "50%",
              background: "var(--hook)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 900, color: "#fff", flexShrink: 0,
            }}>T</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>바다낚시꾼</div>
              <div style={{ fontSize: 12, color: "var(--hook)", marginTop: 2, fontWeight: 700 }}>Lv.12 조사</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
            {[
              { label: "총 출조", value: "47", unit: "회" },
              { label: "총 조과", value: "283", unit: "마리" },
              { label: "최장 어획", value: "82", unit: "cm" },
            ].map((s) => (
              <div key={s.label} style={{
                background: "var(--tint-05)", borderRadius: "var(--r-sm)",
                padding: "10px 0", textAlign: "center", border: "1px solid var(--line)",
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text-strong)", letterSpacing: "-0.5px" }}>
                  {s.value}<span style={{ fontSize: 11, color: "var(--text-dim)", fontWeight: 500 }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: 10, color: "var(--text-mute)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {BADGES.map((b) => (
              <div key={b.label} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 10px", borderRadius: 999,
                background: `${b.color}18`, border: `1px solid ${b.color}44`,
                fontSize: 12, fontWeight: 700, color: b.color,
              }}>
                <span>{b.emoji}</span> {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* AI 분석 카드 */}
        <div style={{
          background: "var(--ocean-900)",
          border: "2px solid var(--hook)",
          borderRadius: "var(--r-card)", padding: 20, marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--hook)", letterSpacing: 0.5, marginBottom: 10 }}>
            🤖 AI 조과 분석
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text-strong)", marginBottom: 12, letterSpacing: "-0.4px" }}>
            당신은 갈치 전문가입니다
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {[
              "야간 갈치 성공률 78%로 전체 상위 5%입니다.",
              "가장 좋은 시간대는 밤 10시~새벽 1시이며, 한림·서귀포 포인트에서 특히 강세를 보입니다.",
              "물때 7~9물에 조과가 집중되는 패턴이 확인됩니다.",
            ].map((t, i) => (
              <div key={i} style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, display: "flex", gap: 8 }}>
                <span style={{ color: "var(--hook)", fontWeight: 900, flexShrink: 0 }}>•</span>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 14, padding: "10px 14px",
            background: "var(--tint-06)", borderRadius: "var(--r-sm)",
            fontSize: 13, color: "var(--hook-300)", fontWeight: 700,
          }}>
            📅 다음 출조 추천: 5월 15일 (8물) 한림 야간갈치
          </div>
        </div>

        {/* 어종별 통계 — 가로 스크롤 */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-dim)", marginBottom: 10, letterSpacing: 0.5 }}>
            어종별 통계
          </div>
        </div>
        <div
          className="fl-fish-stats-list"
          style={{
            display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8,
            scrollbarWidth: "none", marginBottom: 16,
          }}
        >
          {filteredFishStats.map((f) => (
            <div key={f.name} style={{
              flexShrink: 0, width: 140,
              background: "var(--ocean-900)", border: "1px solid var(--line-2)",
              borderRadius: "var(--r-card)", padding: "14px 12px",
            }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{f.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-strong)", marginBottom: 2 }}>{f.name}</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: f.color, letterSpacing: "-0.6px", lineHeight: 1 }}>
                {f.count}<span style={{ fontSize: 12, color: "var(--text-dim)", fontWeight: 500 }}>마리</span>
              </div>

              {/* 성공률 바 */}
              <div style={{ margin: "10px 0 6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-mute)", marginBottom: 4 }}>
                  <span>성공률</span>
                  <span style={{ color: f.color, fontWeight: 700 }}>{f.rate}%</span>
                </div>
                <div style={{ height: 4, background: "var(--tint-08)", borderRadius: 99 }}>
                  <div style={{ height: 4, width: `${f.rate}%`, background: f.color, borderRadius: 99 }} />
                </div>
              </div>

              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>최고 <span style={{ color: "var(--text-strong)", fontWeight: 700 }}>{f.best}</span></div>
              <div style={{ fontSize: 10, color: "var(--text-mute)", marginTop: 2 }}>📍 {f.point}</div>
            </div>
          ))}
        </div>

        {/* 월별 조과 차트 */}
        <div style={{
          background: "var(--ocean-900)", border: "1px solid var(--line-2)",
          borderRadius: "var(--r-card)", padding: 20, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-dim)", marginBottom: 16, letterSpacing: 0.5 }}>
            월별 조과 현황
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, fontSize: 12, color: "var(--text-mute)", flexShrink: 0, textAlign: "right" }}>{d.month}</div>
                <div style={{ flex: 1, height: 26, background: "var(--tint-05)", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${(d.count / maxBar) * 100}%`,
                    background: "linear-gradient(90deg, var(--hook), var(--hook-300))",
                    borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8,
                    transition: "width 0.5s ease",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#fff" }}>{d.count}마리</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 자주 가는 포인트 TOP3 */}
        <div style={{
          background: "var(--ocean-900)", border: "1px solid var(--line-2)",
          borderRadius: "var(--r-card)", padding: 20, marginBottom: 16,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-dim)", marginBottom: 14, letterSpacing: 0.5 }}>
            자주 가는 포인트 TOP3
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TOP_POINTS.map((p) => (
              <div key={p.rank} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                background: "var(--tint-04)", borderRadius: "var(--r-sm)",
                border: "1px solid var(--line)",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: p.rank === 1 ? "#fbbf24" : p.rank === 2 ? "var(--ocean-300)" : "var(--text-dim)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: p.rank === 1 ? "#0a1628" : "#fff",
                }}>
                  {p.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-strong)" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>
                    📍 {p.region} · 방문 {p.visits}회 · 총 {p.catches}마리
                  </div>
                  <div style={{ fontSize: 11, color: "var(--hook)", marginTop: 2, fontWeight: 700 }}>🎣 {p.best}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5월 조황 캘린더 */}
        <div style={{
          background: "var(--ocean-900)", border: "1px solid var(--line-2)",
          borderRadius: "var(--r-card)", padding: 20, marginBottom: 100,
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-dim)", marginBottom: 14, letterSpacing: 0.5 }}>
            5월 조황 캘린더
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
            {["월", "화", "수", "목", "금", "토", "일"].map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, color: "var(--text-mute)", fontWeight: 700, paddingBottom: 4 }}>
                {d}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {cells.map((day, i) => {
              const hasCatch = day !== null && MAY_CATCHES.has(day);
              return (
                <div key={i} style={{
                  aspectRatio: "1", borderRadius: 6,
                  background: day === null ? "transparent" : hasCatch ? "var(--hook)" : "var(--tint-04)",
                  border: day === null ? "none" : `1px solid ${hasCatch ? "var(--hook)" : "var(--line)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: hasCatch ? 900 : 400,
                  color: hasCatch ? "#fff" : "var(--text-dim)",
                }}>
                  {day ?? ""}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "var(--hook)" }} />
            <span style={{ fontSize: 11, color: "var(--text-mute)" }}>조황 있는 날 ({MAY_CATCHES.size}일)</span>
          </div>
        </div>

      </div>
    </>
  );
}
