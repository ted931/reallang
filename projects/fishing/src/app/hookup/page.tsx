"use client";
import { useState, useRef } from "react";

/* ── 타입 ─────────────────────────────────────── */
type Style = "갯바위" | "선상" | "좌대" | "루어" | "민물";
type Level = "입문" | "초급" | "중급" | "고수" | "마스터";
type Region = "제주시" | "서귀포" | "성산" | "한림" | "애월" | "구좌";
type Fish = "갈치" | "참돔" | "감성돔" | "방어" | "광어";

interface MatchProfile {
  id: string;
  nick: string;
  initials: string;
  avatarHue: number;
  level: Level;
  region: Region;
  styles: Style[];
  fish: Fish[];
  matchRate: number;
  intro: string;
}

/* ── 더미 데이터 ─────────────────────────────── */
const PROFILES: MatchProfile[] = [
  {
    id: "p1",
    nick: "갈치왕김씨",
    initials: "갈",
    avatarHue: 220,
    level: "고수",
    region: "한림",
    styles: ["갯바위", "선상"],
    fish: ["갈치", "방어"],
    matchRate: 96,
    intro: "야간 갈치 전문. 채비 공유 환영, 같이 즐겁게요!",
  },
  {
    id: "p2",
    nick: "서귀포바다",
    initials: "서",
    avatarHue: 160,
    level: "중급",
    region: "서귀포",
    styles: ["갯바위"],
    fish: ["감성돔", "참돔"],
    matchRate: 91,
    intro: "새벽형 낚시인. 찌낚시 경험자면 더 좋아요.",
  },
  {
    id: "p3",
    nick: "성산출조대장",
    initials: "출",
    avatarHue: 30,
    level: "마스터",
    region: "성산",
    styles: ["선상"],
    fish: ["참돔", "방어"],
    matchRate: 88,
    intro: "배 대절 비용 나눠요. 입문자도 가르쳐 드립니다!",
  },
  {
    id: "p4",
    nick: "루어마니아",
    initials: "루",
    avatarHue: 280,
    level: "중급",
    region: "애월",
    styles: ["루어"],
    fish: ["광어", "방어"],
    matchRate: 84,
    intro: "저녁 루어 위주. 포인트 여러 곳 알고 있어요.",
  },
  {
    id: "p5",
    nick: "구좌민물꾼",
    initials: "민",
    avatarHue: 120,
    level: "초급",
    region: "구좌",
    styles: ["민물", "좌대"],
    fish: ["갈치", "광어"],
    matchRate: 78,
    intro: "주말 낚시 위주. 편하게 이야기 나눠요.",
  },
  {
    id: "p6",
    nick: "제주시갯바위",
    initials: "갯",
    avatarHue: 200,
    level: "고수",
    region: "제주시",
    styles: ["갯바위"],
    fish: ["감성돔", "참돔"],
    matchRate: 93,
    intro: "갯바위 포인트 다수 보유. 안전장비 필수!",
  },
  {
    id: "p7",
    nick: "좌대여왕",
    initials: "좌",
    avatarHue: 340,
    level: "입문",
    region: "서귀포",
    styles: ["좌대"],
    fish: ["갈치", "감성돔"],
    matchRate: 73,
    intro: "주말 좌대 즐겁게! 초보 환영이에요 🙋",
  },
  {
    id: "p8",
    nick: "애월방어헌터",
    initials: "방",
    avatarHue: 50,
    level: "마스터",
    region: "애월",
    styles: ["선상", "루어"],
    fish: ["방어", "참돔"],
    matchRate: 98,
    intro: "방어 시즌 전문 출조. 배 스팟 독점 보유.",
  },
];

const STYLES: Style[] = ["갯바위", "선상", "좌대", "루어", "민물"];
const LEVELS: Level[] = ["입문", "초급", "중급", "고수", "마스터"];
const REGIONS: Region[] = ["제주시", "서귀포", "성산", "한림", "애월", "구좌"];
const FISH_LIST: Fish[] = ["갈치", "참돔", "감성돔", "방어", "광어"];

const LEVEL_COLOR: Record<Level, string> = {
  입문: "#64748b",
  초급: "#0ea5e9",
  중급: "#10b981",
  고수: "#f59e0b",
  마스터: "#e94e3b",
};

export default function HookUpPage() {
  const profileRef = useRef<HTMLDivElement>(null);

  /* 내 프로필 상태 */
  const [myStyles, setMyStyles] = useState<Style[]>([]);
  const [myLevel, setMyLevel] = useState<Level | "">("");
  const [myRegion, setMyRegion] = useState<Region | "">("");
  const [myFish, setMyFish] = useState<Fish[]>([]);

  /* 매칭 / 필터 상태 */
  const [showMatches, setShowMatches] = useState(false);
  const [filterStyle, setFilterStyle] = useState<Style | "">("");
  const [filterLevel, setFilterLevel] = useState<Level | "">("");
  const [filterRegion, setFilterRegion] = useState<Region | "">("");
  const [requested, setRequested] = useState<Set<string>>(new Set());

  /* 프로필 토글 헬퍼 */
  const toggleStyle = (s: Style) =>
    setMyStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  const toggleFish = (f: Fish) =>
    setMyFish((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );

  /* 필터링 */
  const filtered = PROFILES.filter((p) => {
    if (filterStyle && !p.styles.includes(filterStyle)) return false;
    if (filterLevel && p.level !== filterLevel) return false;
    if (filterRegion && p.region !== filterRegion) return false;
    return true;
  }).sort((a, b) => b.matchRate - a.matchRate);

  /* 신청 토글 */
  const toggleRequest = (id: string) =>
    setRequested((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const scrollToProfile = () =>
    profileRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{`
        /* ── 페이지 래퍼 ── */
        .hu-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px 100px;
        }

        /* ── 히어로 ── */
        .fl-hero.hu-hero {
          padding: 36px 20px 60px;
        }
        .hu-hero-inner {
          position: relative; z-index: 2;
          max-width: 960px; margin: 0 auto;
        }
        .hu-hero-kicker {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 800; letter-spacing: 2.5px;
          color: rgba(255,255,255,0.6); margin-bottom: 10px;
        }
        .hu-hero-brand {
          font-size: 42px; font-weight: 900; letter-spacing: -2px;
          color: #ffffff; line-height: 1; margin: 0 0 10px;
        }
        .hu-hero-brand em {
          font-style: normal;
          background: linear-gradient(120deg, #fb7755, #e94e3b);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .hu-hero-slogan {
          font-size: 14px; color: rgba(255,255,255,0.65);
          margin: 0 0 20px; line-height: 1.6;
        }
        .hu-hero-stat {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          padding: 8px 16px; border-radius: 999px;
          font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 600;
        }
        .hu-hero-stat strong {
          font-size: 18px; font-weight: 900; color: #fb7755;
          font-variant-numeric: tabular-nums;
        }
        .hu-hero-glow {
          position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
          width: 300px; height: 300px; border-radius: 50%; pointer-events: none;
          background: radial-gradient(circle, rgba(233,78,59,0.18) 0%, transparent 60%);
          filter: blur(12px);
        }

        /* ── 프로필 카드 ── */
        .hu-profile-card {
          background: var(--ocean-900);
          border: 1px solid var(--line);
          border-radius: var(--r-card);
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 16px var(--tint-05);
        }
        .hu-profile-head {
          display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
        }
        .hu-avatar {
          width: 52px; height: 52px; border-radius: 50%;
          background: linear-gradient(135deg, var(--ocean-400), var(--ocean-600));
          display: grid; place-items: center;
          font-size: 20px; font-weight: 900; color: #fff;
          flex-shrink: 0;
        }
        .hu-profile-title {
          font-size: 16px; font-weight: 800; color: var(--text-strong);
          letter-spacing: -0.4px;
        }
        .hu-profile-sub { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

        /* ── 프로필 섹션 라벨 ── */
        .hu-field-label {
          font-size: 11px; font-weight: 700; color: var(--text-dim);
          letter-spacing: 0.5px; margin-bottom: 8px;
        }
        .hu-field { margin-bottom: 16px; }

        /* ── 토글 칩 ── */
        .hu-chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .hu-chip {
          display: inline-flex; align-items: center;
          font-size: 12px; font-weight: 700;
          background: var(--tint-04); border: 1px solid var(--line);
          color: var(--text-dim);
          padding: 6px 12px; border-radius: 999px; cursor: pointer;
          transition: background 0.15s, border-color 0.15s, color 0.15s;
          font-family: inherit;
        }
        .hu-chip:hover { background: var(--tint-08); color: var(--text); }
        .hu-chip.on {
          background: rgba(233,78,59,0.12);
          border-color: rgba(233,78,59,0.5);
          color: var(--hook);
        }
        .hu-chip.level-on {
          background: rgba(245,158,11,0.12);
          border-color: rgba(245,158,11,0.5);
          color: #f59e0b;
        }
        .hu-chip.region-on {
          background: rgba(14,165,233,0.12);
          border-color: rgba(14,165,233,0.5);
          color: #0ea5e9;
        }

        /* ── 매칭 시작 버튼 ── */
        .hu-match-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #e94e3b, #fb7755);
          border: none; border-radius: var(--r-sm);
          color: #fff; font-family: inherit;
          font-size: 15px; font-weight: 800; letter-spacing: -0.3px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 6px 20px rgba(233,78,59,0.35);
          transition: opacity 0.15s, transform 0.1s;
          margin-top: 4px;
        }
        .hu-match-btn:hover { opacity: 0.9; }
        .hu-match-btn:active { transform: scale(0.99); }

        /* ── 필터 바 ── */
        .hu-filter-bar {
          display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;
          padding-bottom: 14px; border-bottom: 1px solid var(--line);
        }
        .hu-filter-btn {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 12px; font-weight: 700;
          background: var(--tint-04); border: 1px solid var(--line);
          color: var(--text-dim); padding: 6px 12px; border-radius: 999px;
          cursor: pointer; transition: background 0.15s, color 0.15s;
          font-family: inherit;
        }
        .hu-filter-btn:hover { background: var(--tint-08); color: var(--text); }
        .hu-filter-btn.active {
          background: var(--tint-08); color: var(--text-strong);
          border-color: var(--line-2);
        }
        .hu-filter-sep {
          width: 1px; height: 22px; background: var(--tint-08);
          align-self: center; flex-shrink: 0;
        }

        /* ── 섹션 헤더 ── */
        .hu-section-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .hu-section-title {
          font-size: 16px; font-weight: 800; color: var(--text-strong);
          letter-spacing: -0.4px;
        }
        .hu-section-count {
          font-size: 12px; color: var(--text-dim); font-weight: 600;
        }

        /* ── 매칭 카드 그리드 ── */
        .hu-card-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 768px) {
          .hu-card-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── 매칭 카드 ── */
        .hu-card {
          background: var(--ocean-900); border: 1px solid var(--line);
          border-radius: var(--r-card); padding: 16px;
          box-shadow: 0 2px 8px var(--tint-05);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .hu-card:hover {
          border-color: rgba(233,78,59,0.25);
          box-shadow: 0 4px 16px rgba(233,78,59,0.1);
        }
        .hu-card-head {
          display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px;
        }
        .hu-card-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          display: grid; place-items: center;
          font-size: 17px; font-weight: 900; color: #fff;
          flex-shrink: 0;
        }
        .hu-card-info { flex: 1; min-width: 0; }
        .hu-card-nick {
          font-size: 15px; font-weight: 800; color: var(--text-strong);
          letter-spacing: -0.4px;
        }
        .hu-card-meta {
          display: flex; align-items: center; gap: 6px;
          margin-top: 3px; flex-wrap: wrap;
        }
        .hu-level-badge {
          display: inline-flex; align-items: center;
          font-size: 10px; font-weight: 800;
          padding: 2px 7px; border-radius: 5px;
          color: #fff;
        }
        .hu-region-tag {
          font-size: 11px; color: var(--text-dim); font-weight: 600;
          display: inline-flex; align-items: center; gap: 2px;
        }

        /* ── 매칭률 게이지 ── */
        .hu-match-rate {
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }
        .hu-rate-ring {
          width: 44px; height: 44px; position: relative; flex-shrink: 0;
        }
        .hu-rate-ring svg { transform: rotate(-90deg); }
        .hu-rate-num {
          position: absolute; inset: 0; display: grid; place-items: center;
          font-size: 11px; font-weight: 800; color: var(--text-strong);
          font-variant-numeric: tabular-nums;
        }

        /* ── 태그 행 ── */
        .hu-tag-row { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 12px; }
        .hu-style-tag {
          font-size: 10px; font-weight: 700;
          background: var(--tint-06); color: var(--text-dim);
          padding: 3px 8px; border-radius: 6px; border: 1px solid var(--line);
        }
        .hu-fish-tag {
          font-size: 10px; font-weight: 700;
          background: rgba(14,165,233,0.1); color: #38bdf8;
          padding: 3px 8px; border-radius: 6px;
          border: 1px solid rgba(14,165,233,0.25);
        }

        /* ── 소개글 ── */
        .hu-intro {
          font-size: 12px; color: var(--text-dim); line-height: 1.6;
          margin-bottom: 14px;
          padding: 10px 12px;
          background: var(--tint-04); border-radius: var(--r-sm);
          border: 1px solid var(--line);
        }

        /* ── 신청 버튼 ── */
        .hu-req-btn {
          width: 100%; padding: 10px;
          background: linear-gradient(135deg, var(--ocean-400), var(--ocean-600));
          border: none; border-radius: 10px;
          color: #fff; font-family: inherit;
          font-size: 13px; font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(30,101,149,0.3);
          transition: opacity 0.15s;
        }
        .hu-req-btn.done {
          background: var(--tint-06); color: var(--text-dim);
          box-shadow: none; cursor: default;
          border: 1px solid var(--line);
        }
        .hu-req-btn:not(.done):hover { opacity: 0.88; }

        /* ── 하단 CTA 배너 ── */
        .hu-cta-banner {
          margin-top: 32px;
          background: var(--ocean-900); border: 1px solid var(--line);
          border-radius: var(--r-card); padding: 24px 20px;
          text-align: center;
          box-shadow: 0 4px 16px var(--tint-05);
          position: relative; overflow: hidden;
        }
        .hu-cta-banner::before {
          content: "";
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(120% 80% at 50% 100%, rgba(233,78,59,0.08), transparent 60%);
        }
        .hu-cta-banner-icon {
          font-size: 32px; display: block; margin-bottom: 8px;
        }
        .hu-cta-banner-title {
          font-size: 17px; font-weight: 800; color: var(--text-strong);
          letter-spacing: -0.4px; margin-bottom: 6px;
        }
        .hu-cta-banner-sub {
          font-size: 13px; color: var(--text-dim); margin-bottom: 16px;
          line-height: 1.6;
        }
        .hu-cta-banner-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #e94e3b, #fb7755);
          border: none; border-radius: 999px;
          color: #fff; font-family: inherit;
          font-size: 14px; font-weight: 800;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(233,78,59,0.35);
          transition: opacity 0.15s;
        }
        .hu-cta-banner-btn:hover { opacity: 0.9; }

        /* ── 빈 결과 ── */
        .hu-empty {
          grid-column: 1 / -1;
          text-align: center; padding: 40px 20px;
          color: var(--text-dim); font-size: 14px;
        }
        .hu-empty-icon { font-size: 32px; display: block; margin-bottom: 8px; }
      `}</style>

      {/* ── 히어로 ── */}
      <section className="fl-hero hu-hero">
        <div className="hu-hero-glow" />
        <div className="fl-catch-hero-glow" />
        <div className="hu-hero-inner">
          <div className="hu-hero-kicker">
            <span>🎣</span>
            <span>FISHING COMPANION MATCHING</span>
          </div>
          <h1 className="hu-hero-brand">
            HOOK <em>UP</em>
          </h1>
          <p className="hu-hero-slogan">
            보이스피싱 아닙니다, 훅업입니다 🎣<br />
            낚시 스타일이 맞는 동반자를 찾아보세요
          </p>
          <div className="hu-hero-stat">
            🟢 현재 매칭 대기 중
            <strong>127명</strong>
          </div>
        </div>
      </section>

      <div className="hu-wrap">

        {/* ── 내 프로필 카드 ── */}
        <div ref={profileRef}>
          <div className="hu-profile-card">
            <div className="hu-profile-head">
              <div className="hu-avatar">나</div>
              <div>
                <div className="hu-profile-title">내 낚시 프로필</div>
                <div className="hu-profile-sub">스타일을 설정하면 더 정확한 매칭이 됩니다</div>
              </div>
            </div>

            {/* 낚시 스타일 */}
            <div className="hu-field">
              <div className="hu-field-label">낚시 스타일 (복수선택)</div>
              <div className="hu-chips">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    className={`hu-chip${myStyles.includes(s) ? " on" : ""}`}
                    onClick={() => toggleStyle(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* 실력 레벨 */}
            <div className="hu-field">
              <div className="hu-field-label">실력 레벨</div>
              <div className="hu-chips">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    className={`hu-chip${myLevel === l ? " level-on" : ""}`}
                    onClick={() => setMyLevel(myLevel === l ? "" : l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* 주요 지역 */}
            <div className="hu-field">
              <div className="hu-field-label">주요 지역</div>
              <div className="hu-chips">
                {REGIONS.map((r) => (
                  <button
                    key={r}
                    className={`hu-chip${myRegion === r ? " region-on" : ""}`}
                    onClick={() => setMyRegion(myRegion === r ? "" : r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 선호 어종 */}
            <div className="hu-field">
              <div className="hu-field-label">선호 어종 (복수선택)</div>
              <div className="hu-chips">
                {FISH_LIST.map((f) => (
                  <button
                    key={f}
                    className={`hu-chip${myFish.includes(f) ? " on" : ""}`}
                    onClick={() => toggleFish(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="hu-match-btn"
              onClick={() => setShowMatches(true)}
            >
              🎣 매칭 시작하기
            </button>
          </div>
        </div>

        {/* ── 필터 바 ── */}
        <div className="hu-filter-bar">
          {/* 스타일 필터 */}
          {STYLES.map((s) => (
            <button
              key={s}
              className={`hu-filter-btn${filterStyle === s ? " active" : ""}`}
              onClick={() => setFilterStyle(filterStyle === s ? "" : s)}
            >
              {s}
            </button>
          ))}
          <div className="hu-filter-sep" />
          {/* 실력 필터 */}
          {LEVELS.map((l) => (
            <button
              key={l}
              className={`hu-filter-btn${filterLevel === l ? " active" : ""}`}
              onClick={() => setFilterLevel(filterLevel === l ? "" : l)}
            >
              {l}
            </button>
          ))}
          <div className="hu-filter-sep" />
          {/* 지역 필터 */}
          {REGIONS.map((r) => (
            <button
              key={r}
              className={`hu-filter-btn${filterRegion === r ? " active" : ""}`}
              onClick={() => setFilterRegion(filterRegion === r ? "" : r)}
            >
              {r}
            </button>
          ))}
        </div>

        {/* ── 매칭 카드 리스트 ── */}
        <div className="hu-section-head">
          <div className="hu-section-title">
            {showMatches ? "내 스타일 매칭 결과" : "동반자 찾기"}
          </div>
          <div className="hu-section-count">{filtered.length}명</div>
        </div>

        <div className="hu-card-grid">
          {filtered.length === 0 ? (
            <div className="hu-empty">
              <span className="hu-empty-icon">🎣</span>
              해당 조건의 동반자가 없어요.<br />필터를 변경해 보세요.
            </div>
          ) : (
            filtered.map((p) => {
              const isDone = requested.has(p.id);
              const circumference = 2 * Math.PI * 17;
              const dash = (p.matchRate / 100) * circumference;

              return (
                <div key={p.id} className="hu-card">
                  <div className="hu-card-head">
                    <div
                      className="hu-card-avatar"
                      style={{
                        background: `linear-gradient(135deg, hsl(${p.avatarHue},60%,45%), hsl(${p.avatarHue},70%,30%))`,
                      }}
                    >
                      {p.initials}
                    </div>
                    <div className="hu-card-info">
                      <div className="hu-card-nick">{p.nick}</div>
                      <div className="hu-card-meta">
                        <span
                          className="hu-level-badge"
                          style={{ background: LEVEL_COLOR[p.level] }}
                        >
                          {p.level}
                        </span>
                        <span className="hu-region-tag">📍 {p.region}</span>
                      </div>
                    </div>
                    {/* 매칭률 링 */}
                    <div className="hu-match-rate">
                      <div className="hu-rate-ring">
                        <svg width="44" height="44" viewBox="0 0 44 44">
                          <circle
                            cx="22" cy="22" r="17"
                            fill="none" stroke="var(--tint-08)" strokeWidth="3"
                          />
                          <circle
                            cx="22" cy="22" r="17"
                            fill="none"
                            stroke={p.matchRate >= 90 ? "#e94e3b" : p.matchRate >= 80 ? "#f59e0b" : "#0ea5e9"}
                            strokeWidth="3"
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="hu-rate-num">{p.matchRate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* 스타일 + 어종 태그 */}
                  <div className="hu-tag-row">
                    {p.styles.map((s) => (
                      <span key={s} className="hu-style-tag">{s}</span>
                    ))}
                    {p.fish.map((f) => (
                      <span key={f} className="hu-fish-tag">🐟 {f}</span>
                    ))}
                  </div>

                  {/* 소개글 */}
                  <div className="hu-intro">{p.intro}</div>

                  {/* 신청 버튼 */}
                  <button
                    className={`hu-req-btn${isDone ? " done" : ""}`}
                    onClick={() => !isDone && toggleRequest(p.id)}
                  >
                    {isDone ? "✅ 신청완료" : "🎣 같이 가기 신청"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* ── 하단 CTA 배너 ── */}
        <div className="hu-cta-banner">
          <span className="hu-cta-banner-icon">🎣</span>
          <div className="hu-cta-banner-title">나도 동반자를 찾고 싶다면?</div>
          <div className="hu-cta-banner-sub">
            프로필을 등록하고 낚시 스타일이 맞는<br />
            동반자를 직접 찾아보세요
          </div>
          <button className="hu-cta-banner-btn" onClick={scrollToProfile}>
            프로필 등록하고 동반자 찾기
          </button>
        </div>

      </div>
    </>
  );
}
