"use client";
import { useState } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────
   더미 데이터
───────────────────────────────────────── */
const REGIONS = [
  {
    id: "seogwipo",
    name: "서귀포",
    fish: ["갈치", "방어"],
    prob: 94,
    bestTime: "오전 6~8시",
    depth: "30~50m",
    rig: "야광 지그, 갈치 전용 채비",
    caution: "조류 빠름, 원줄 150m 이상 준비",
  },
  {
    id: "marado",
    name: "마라도",
    fish: ["참돔", "감성돔"],
    prob: 88,
    bestTime: "오전 5~7시",
    depth: "10~20m",
    rig: "민장대·감성돔 채비",
    caution: "파도 1.2m 예상, 방파제 조심",
  },
  {
    id: "hyeopjae",
    name: "협재",
    fish: ["광어", "볼락"],
    prob: 78,
    bestTime: "오후 5~7시",
    depth: "5~15m",
    rig: "지그헤드 루어",
    caution: "간조 전후 2시간이 피크",
  },
  {
    id: "hamdeok",
    name: "함덕",
    fish: ["갈치"],
    prob: 72,
    bestTime: "오전 7~9시",
    depth: "20~40m",
    rig: "갈치 전용 형광 바늘",
    caution: "바람 방향 북동, 방풍 준비",
  },
  {
    id: "city",
    name: "제주시 도두",
    fish: ["방어", "참돔"],
    prob: 66,
    bestTime: "오전 6~8시",
    depth: "40~80m",
    rig: "메탈 지그 100~150g",
    caution: "배낚시 전용 포인트, 선박 예약 필수",
  },
  {
    id: "seongsan",
    name: "성산일출봉",
    fish: ["감성돔"],
    prob: 61,
    bestTime: "오전 5~6시",
    depth: "5~12m",
    rig: "민장대 4~5호",
    caution: "관광객 많은 낮 시간대 피할 것",
  },
];

const FISH_TABS = [
  { key: "갈치", emoji: "🐟" },
  { key: "감성돔", emoji: "🐠" },
  { key: "참돔", emoji: "🎣" },
  { key: "방어", emoji: "🐡" },
  { key: "광어", emoji: "🦈" },
];

const FISH_REGION_PROB: Record<string, { region: string; prob: number }[]> = {
  갈치: [
    { region: "서귀포", prob: 94 },
    { region: "함덕", prob: 72 },
    { region: "마라도", prob: 55 },
    { region: "성산일출봉", prob: 48 },
  ],
  감성돔: [
    { region: "마라도", prob: 88 },
    { region: "성산일출봉", prob: 61 },
    { region: "협재", prob: 52 },
    { region: "서귀포", prob: 47 },
  ],
  참돔: [
    { region: "마라도", prob: 82 },
    { region: "제주시 도두", prob: 66 },
    { region: "서귀포", prob: 58 },
    { region: "함덕", prob: 40 },
  ],
  방어: [
    { region: "서귀포", prob: 90 },
    { region: "제주시 도두", prob: 66 },
    { region: "마라도", prob: 60 },
    { region: "협재", prob: 35 },
  ],
  광어: [
    { region: "협재", prob: 78 },
    { region: "함덕", prob: 65 },
    { region: "성산일출봉", prob: 52 },
    { region: "서귀포", prob: 44 },
  ],
};

const INDICATORS = [
  {
    icon: "🌊",
    label: "물때",
    value: "6물",
    sub: "보통",
    desc: "6물은 중간 조류로 낚시 적합. 너무 세지도 잔잔하지도 않아 채비 조작이 쉽습니다.",
    ok: true,
  },
  {
    icon: "🌡️",
    label: "수온",
    value: "19.2°C",
    sub: "갈치 최적 18~22°C ✓",
    desc: "현재 수온은 갈치·참돔이 활발히 활동하는 범위입니다. 입질 빈도 높음.",
    ok: true,
  },
  {
    icon: "🧭",
    label: "기압",
    value: "1013 hPa",
    sub: "안정",
    desc: "고기압 안정 상태. 기압이 급변하지 않으면 어류가 부레 조절 없이 활동해 입질이 잦아집니다.",
    ok: true,
  },
  {
    icon: "🌙",
    label: "달 위상",
    value: "상현달",
    sub: "입질 활발",
    desc: "상현달~보름달 기간은 조류 변화가 커져 먹이 활동이 증가합니다. 야간 갈치낚시에 특히 유리.",
    ok: true,
  },
  {
    icon: "💨",
    label: "조류 속도",
    value: "보통",
    sub: "1~1.5노트",
    desc: "1~2노트 조류는 채비가 자연스럽게 흘러 미끼 어필이 최적화됩니다.",
    ok: true,
  },
];

/* ─────────────────────────────────────────
   유틸
───────────────────────────────────────── */
function probColor(p: number) {
  if (p >= 90) return { bg: "#fff0ee", border: "#e94e3b", badge: "#e94e3b", text: "#c0392b" };
  if (p >= 70) return { bg: "#fffbea", border: "#f59e0b", badge: "#f59e0b", text: "#b45309" };
  return { bg: "#f0fdf4", border: "#22c55e", badge: "#22c55e", text: "#15803d" };
}

function probLabel(p: number) {
  if (p >= 90) return "매우 좋음";
  if (p >= 70) return "좋음";
  return "보통";
}

/* ─────────────────────────────────────────
   메인 페이지
───────────────────────────────────────── */
export default function EoshinPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [fishTab, setFishTab] = useState("갈치");

  function toggleRegion(id: string) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <>
      <style>{`
        .es-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px 100px;
        }

        /* ── 히어로 ── */
        .fl-hero.es-hero {
          padding: 48px 20px 36px;
          text-align: center;
          position: relative;
        }
        .es-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--hook);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(233,78,59,0.08);
          border: 1px solid rgba(233,78,59,0.2);
          border-radius: 999px;
          padding: 4px 14px;
          margin-bottom: 16px;
        }
        .es-hero-title {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-strong);
          line-height: 1.35;
          margin: 0 0 8px;
        }
        .es-hero-title span { color: var(--hook); }
        .es-hero-sub {
          font-size: 14px;
          color: var(--text-dim);
          margin: 0 0 24px;
        }
        .es-weather-strip {
          display: inline-flex;
          gap: 20px;
          background: var(--tint-04);
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          padding: 10px 20px;
          font-size: 13px;
          color: var(--text);
          flex-wrap: wrap;
          justify-content: center;
        }
        .es-weather-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
        }
        .es-weather-item span { color: var(--text-dim); font-weight: 400; }

        /* ── 섹션 헤더 ── */
        .es-section {
          margin-top: 36px;
        }
        .es-section-title {
          font-size: 17px;
          font-weight: 800;
          color: var(--text-strong);
          margin: 0 0 4px;
        }
        .es-section-sub {
          font-size: 13px;
          color: var(--text-dim);
          margin: 0 0 16px;
        }

        /* ── 지역 카드 그리드 ── */
        .es-region-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 768px) {
          .es-region-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 960px) {
          .es-region-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .es-region-card {
          border-radius: var(--r-card);
          border: 2px solid var(--line);
          background: var(--tint-04);
          overflow: hidden;
          transition: box-shadow 0.18s, border-color 0.18s;
          cursor: pointer;
        }
        .es-region-card:hover {
          box-shadow: 0 4px 18px rgba(30,58,95,0.1);
        }
        .es-rc-head {
          padding: 16px 16px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .es-rc-left {}
        .es-rc-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-strong);
          margin-bottom: 4px;
        }
        .es-rc-fish {
          font-size: 12px;
          color: var(--text-dim);
        }
        .es-rc-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }
        .es-prob-badge {
          font-size: 22px;
          font-weight: 900;
          line-height: 1;
        }
        .es-prob-label {
          font-size: 11px;
          font-weight: 700;
          border-radius: 999px;
          padding: 2px 8px;
          color: #fff;
        }
        .es-prob-bar-wrap {
          height: 4px;
          background: var(--tint-08);
          border-radius: 2px;
          margin: 0 16px 12px;
          overflow: hidden;
        }
        .es-prob-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 0.4s ease;
        }
        .es-rc-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 100%;
          padding: 9px 16px;
          border: none;
          border-top: 1px solid var(--line);
          background: var(--tint-04);
          font-size: 12px;
          font-weight: 600;
          color: var(--text-dim);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .es-rc-toggle:hover {
          background: var(--tint-08);
          color: var(--text);
        }
        .es-rc-toggle.open {
          color: var(--hook);
        }
        .es-rc-expand {
          padding: 14px 16px;
          border-top: 1px solid var(--line);
          background: var(--tint-04);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .es-expand-item {}
        .es-expand-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-mute);
          letter-spacing: 0.04em;
          margin-bottom: 3px;
        }
        .es-expand-value {
          font-size: 13px;
          color: var(--text);
          font-weight: 600;
        }
        .es-expand-caution {
          grid-column: 1 / -1;
          background: rgba(233,78,59,0.06);
          border: 1px solid rgba(233,78,59,0.15);
          border-radius: var(--r-sm);
          padding: 8px 12px;
          font-size: 12px;
          color: #c0392b;
        }

        /* ── 어종 탭 ── */
        .es-fish-tabs {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
          margin-bottom: 16px;
        }
        .es-fish-tabs::-webkit-scrollbar { display: none; }
        .es-fish-tab {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1.5px solid var(--line);
          background: var(--tint-04);
          font-size: 13px;
          font-weight: 700;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.15s;
        }
        .es-fish-tab.active {
          border-color: var(--hook);
          background: rgba(233,78,59,0.08);
          color: var(--hook);
        }
        .es-fish-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .es-fish-row {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--tint-04);
          border: 1px solid var(--line);
          border-radius: var(--r-sm);
          padding: 12px 16px;
        }
        .es-fish-rank {
          font-size: 16px;
          font-weight: 900;
          color: var(--text-mute);
          width: 20px;
          text-align: center;
        }
        .es-fish-rank.top { color: var(--hook); }
        .es-fish-row-name {
          flex: 1;
          font-size: 14px;
          font-weight: 700;
          color: var(--text-strong);
        }
        .es-fish-prob {
          font-size: 15px;
          font-weight: 800;
        }
        .es-fish-bar-wrap {
          width: 80px;
          height: 6px;
          background: var(--tint-08);
          border-radius: 3px;
          overflow: hidden;
        }
        .es-fish-bar {
          height: 100%;
          border-radius: 3px;
        }

        /* ── 지표 ── */
        .es-indicators {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (min-width: 768px) {
          .es-indicators {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 960px) {
          .es-indicators {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .es-indicator {
          background: var(--tint-04);
          border: 1px solid var(--line);
          border-radius: var(--r-card);
          padding: 16px;
        }
        .es-ind-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .es-ind-icon {
          font-size: 24px;
          line-height: 1;
        }
        .es-ind-meta {}
        .es-ind-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-mute);
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }
        .es-ind-value {
          font-size: 18px;
          font-weight: 900;
          color: var(--text-strong);
          line-height: 1;
        }
        .es-ind-sub {
          font-size: 11px;
          font-weight: 700;
          color: #15803d;
          margin-top: 2px;
        }
        .es-ind-desc {
          font-size: 12px;
          color: var(--text-dim);
          line-height: 1.55;
          border-top: 1px solid var(--line);
          padding-top: 8px;
        }

        /* ── 프리미엄 배너 ── */
        .es-premium {
          margin-top: 40px;
          border-radius: var(--r-card);
          background: linear-gradient(135deg, #0f1a2e 0%, #1e3a5f 100%);
          padding: 32px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .es-premium::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 180px; height: 180px;
          background: radial-gradient(circle, rgba(233,78,59,0.25), transparent 70%);
          pointer-events: none;
        }
        .es-premium-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #f59e0b;
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 999px;
          padding: 3px 12px;
          margin-bottom: 12px;
        }
        .es-premium-title {
          font-size: 20px;
          font-weight: 900;
          color: #ffffff;
          margin: 0 0 6px;
          line-height: 1.3;
        }
        .es-premium-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin: 0 0 20px;
        }
        .es-premium-price {
          font-size: 13px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 14px;
        }
        .es-premium-price strong {
          font-size: 22px;
          font-weight: 900;
          color: #ffffff;
        }
        .es-premium-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--hook);
          color: #fff;
          border: none;
          border-radius: 999px;
          padding: 12px 28px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
        }
        .es-premium-btn:hover {
          opacity: 0.88;
          transform: translateY(-1px);
        }
        .es-premium-features {
          display: flex;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .es-pf-item {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .es-pf-item::before {
          content: '✓';
          color: #22c55e;
          font-weight: 800;
        }
      `}</style>

      {/* 히어로 */}
      <section className="fl-hero es-hero">
        <div className="es-brand">🎣 어신 (魚信) AI</div>
        <h1 className="es-hero-title">
          오늘 제주 낚시 확률을<br />
          <span>AI가 분석합니다</span>
        </h1>
        <p className="es-hero-sub">수온 · 조류 · 기압 · 물때 · 달위상 데이터 기반 실시간 예측</p>
        <div className="es-weather-strip">
          <div className="es-weather-item">🌡️ <span>기온</span> 18°C</div>
          <div className="es-weather-item">💨 <span>풍속</span> 3m/s</div>
          <div className="es-weather-item">🌊 <span>파고</span> 0.8m</div>
          <div className="es-weather-item">🕐 <span>업데이트</span> 오전 5:30</div>
        </div>
      </section>

      <div className="es-wrap">

        {/* ── 지역별 예측 카드 ── */}
        <section className="es-section">
          <h2 className="es-section-title">📍 오늘의 지역별 입질 예측</h2>
          <p className="es-section-sub">카드를 탭하면 상세 예측이 펼쳐집니다</p>
          <div className="es-region-grid">
            {REGIONS.map((r) => {
              const c = probColor(r.prob);
              const isOpen = expanded === r.id;
              return (
                <div
                  key={r.id}
                  className="es-region-card"
                  style={{ borderColor: isOpen ? c.border : undefined }}
                  onClick={() => toggleRegion(r.id)}
                >
                  <div className="es-rc-head">
                    <div className="es-rc-left">
                      <div className="es-rc-name">{r.name}</div>
                      <div className="es-rc-fish">{r.fish.join(" · ")}</div>
                    </div>
                    <div className="es-rc-right">
                      <div className="es-prob-badge" style={{ color: c.badge }}>{r.prob}%</div>
                      <div
                        className="es-prob-label"
                        style={{ background: c.badge }}
                      >
                        {probLabel(r.prob)}
                      </div>
                    </div>
                  </div>
                  <div className="es-prob-bar-wrap">
                    <div
                      className="es-prob-bar"
                      style={{ width: `${r.prob}%`, background: c.badge }}
                    />
                  </div>
                  <button className={`es-rc-toggle${isOpen ? " open" : ""}`}>
                    {isOpen ? "▲ 접기" : "▼ 상세 예측 보기"}
                  </button>
                  {isOpen && (
                    <div className="es-rc-expand" onClick={(e) => e.stopPropagation()}>
                      <div className="es-expand-item">
                        <div className="es-expand-label">최적 시간대</div>
                        <div className="es-expand-value">⏰ {r.bestTime}</div>
                      </div>
                      <div className="es-expand-item">
                        <div className="es-expand-label">추천 수심</div>
                        <div className="es-expand-value">🌊 {r.depth}</div>
                      </div>
                      <div className="es-expand-item" style={{ gridColumn: "1 / -1" }}>
                        <div className="es-expand-label">추천 채비</div>
                        <div className="es-expand-value">🎣 {r.rig}</div>
                      </div>
                      <div className="es-expand-caution">⚠️ {r.caution}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 어종별 예측 탭 ── */}
        <section className="es-section">
          <h2 className="es-section-title">🐟 어종별 지역 입질 확률</h2>
          <p className="es-section-sub">탭을 선택해 어종별로 유리한 지역을 확인하세요</p>
          <div className="es-fish-tabs">
            {FISH_TABS.map((t) => (
              <button
                key={t.key}
                className={`es-fish-tab${fishTab === t.key ? " active" : ""}`}
                onClick={() => setFishTab(t.key)}
              >
                {t.emoji} {t.key}
              </button>
            ))}
          </div>
          <div className="es-fish-list">
            {FISH_REGION_PROB[fishTab].map((row, i) => {
              const c = probColor(row.prob);
              return (
                <div className="es-fish-row" key={row.region}>
                  <div className={`es-fish-rank${i === 0 ? " top" : ""}`}>
                    {i === 0 ? "1위" : `${i + 1}위`}
                  </div>
                  <div className="es-fish-row-name">{row.region}</div>
                  <div className="es-fish-bar-wrap">
                    <div
                      className="es-fish-bar"
                      style={{ width: `${row.prob}%`, background: c.badge }}
                    />
                  </div>
                  <div className="es-fish-prob" style={{ color: c.badge }}>
                    {row.prob}%
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 예측 근거 지표 ── */}
        <section className="es-section">
          <h2 className="es-section-title">📊 AI 분석 지표</h2>
          <p className="es-section-sub">오늘의 자연 조건을 낚시 관점에서 해석합니다</p>
          <div className="es-indicators">
            {INDICATORS.map((ind) => (
              <div className="es-indicator" key={ind.label}>
                <div className="es-ind-top">
                  <div className="es-ind-icon">{ind.icon}</div>
                  <div className="es-ind-meta">
                    <div className="es-ind-label">{ind.label}</div>
                    <div className="es-ind-value">{ind.value}</div>
                    <div className="es-ind-sub">{ind.sub}</div>
                  </div>
                </div>
                <div className="es-ind-desc">{ind.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 프리미엄 배너 ── */}
        <div className="es-premium">
          <div className="es-premium-badge">PREMIUM</div>
          <h3 className="es-premium-title">
            7일 예측 + 포인트별<br />상세 분석
          </h3>
          <p className="es-premium-sub">
            어떤 포인트에서 몇 시에, 어떤 채비로 공략할지<br />
            AI가 구체적으로 알려드립니다
          </p>
          <div className="es-premium-price">
            월 <strong>9,900원</strong>
          </div>
          <button
            className="es-premium-btn"
            onClick={() => alert("준비 중입니다")}
          >
            🎣 프리미엄 시작하기
          </button>
          <div className="es-premium-features">
            <div className="es-pf-item">7일 예보</div>
            <div className="es-pf-item">100+ 낚시 포인트</div>
            <div className="es-pf-item">포인트별 수심 지도</div>
            <div className="es-pf-item">채비 AI 추천</div>
            <div className="es-pf-item">알림 설정</div>
          </div>
        </div>

      </div>
    </>
  );
}
