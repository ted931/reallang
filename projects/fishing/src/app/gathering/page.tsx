"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DUMMY_GATHERINGS } from "@/lib/dummy-gatherings";
import type { FishingClub } from "@/lib/types";

const TABS = ["전체", "모집중", "입문자환영", "무료"] as const;
type Tab = typeof TABS[number];

export default function GatheringPage() {
  const [tab, setTab] = useState<Tab>("전체");

  const list = useMemo((): FishingClub[] => {
    if (tab === "모집중")
      return DUMMY_GATHERINGS.filter((c) => c.openRecruiting);
    if (tab === "입문자환영")
      return DUMMY_GATHERINGS.filter((c) => c.level === "입문" || c.level === "전체");
    if (tab === "무료")
      return DUMMY_GATHERINGS.filter((c) => c.monthlyFee === 0);
    return DUMMY_GATHERINGS;
  }, [tab]);

  const total = DUMMY_GATHERINGS.length;
  const recruiting = DUMMY_GATHERINGS.filter((c) => c.openRecruiting).length;
  const thisMonthOutings = DUMMY_GATHERINGS.filter((c) => {
    const d = new Date(c.nextOuting);
    return d.getFullYear() === 2026 && d.getMonth() === 4; // May 2026
  }).length;

  return (
    <>
      {/* 히어로 */}
      <div className="fl-gt-hero">
        <div
          className="fl-hero-glow"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(96,165,250,0.18), transparent 60%)",
          }}
        />
        <div className="fl-jw-hero-inner">
          <div className="fl-catch-hero-kicker" style={{ color: "#60a5fa" }}>
            CLUB
          </div>
          <h1 className="fl-catch-hero-title">낚시 동아리</h1>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "0.875rem",
              marginBottom: "1.25rem",
              lineHeight: 1.6,
            }}
          >
            제주의 낚시 동호인들과 함께<br />
            정기 출조, 강습, 대회까지
          </p>
          <div className="fl-jw-hero-stats">
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n">
                {total}<span>개</span>
              </div>
              <div className="fl-jw-hero-l">전체 클럽</div>
            </div>
            <div className="fl-jw-hero-divider" />
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n" style={{ color: "#86efac" }}>
                {recruiting}<span>개</span>
              </div>
              <div className="fl-jw-hero-l">모집중</div>
            </div>
            <div className="fl-jw-hero-divider" />
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n" style={{ color: "#60a5fa" }}>
                {thisMonthOutings}<span>회</span>
              </div>
              <div className="fl-jw-hero-l">이번달 출조</div>
            </div>
          </div>
        </div>
        <svg
          className="fl-wave fl-wave-1"
          viewBox="0 0 400 80"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </div>

      {/* 탭 */}
      <div className="fl-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`fl-tab ${tab === t ? "on" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
            {tab === t && <span className="fl-tab-underline" />}
          </button>
        ))}
      </div>

      <div className="fl-feed-result">
        <span>
          <strong>{list.length}</strong>개 클럽
        </span>
      </div>

      {/* 카드 목록 */}
      <div className="fl-gt-grid">
        {list.map((c) => (
          <ClubCard key={c.id} club={c} />
        ))}
      </div>

      {/* FAB */}
      <Link
        href="/gathering/new"
        className="fl-fab"
        aria-label="동아리 만들기"
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
        <span>동아리 만들기</span>
      </Link>
    </>
  );
}

const LEVEL_STYLE: Record<string, { bg: string; color: string }> = {
  입문: { bg: "rgba(134,239,172,0.15)", color: "#86efac" },
  중급: { bg: "rgba(96,165,250,0.15)", color: "#60a5fa" },
  고급: { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  전체: { bg: "rgba(167,139,250,0.15)", color: "#a78bfa" },
};

const ACCENT_COLORS = [
  "#60a5fa",
  "#86efac",
  "#fbbf24",
  "#f0abfc",
  "#5fa3cf",
  "#a78bfa",
  "#fb7185",
  "#34d399",
];

function ClubCard({ club }: { club: FishingClub }) {
  const router = useRouter();
  const full = club.memberCount >= club.maxMembers;
  const pct = Math.min((club.memberCount / club.maxMembers) * 100, 100);
  const lvlStyle = LEVEL_STYLE[club.level] ?? LEVEL_STYLE["전체"];
  const accent =
    ACCENT_COLORS[parseInt(club.id.replace("g", "")) % ACCENT_COLORS.length];

  const outingDate = (() => {
    const d = new Date(club.nextOuting);
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getMonth() + 1}/${d.getDate()}(${weekdays[d.getDay()]})`;
  })();

  const feeLabel =
    club.monthlyFee === 0
      ? "무료"
      : `월 ${club.monthlyFee.toLocaleString()}원`;

  return (
    <article
      className="fl-gt-card"
      onClick={() => router.push(`/gathering/${club.id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* 상단 사이드 바 */}
      <div
        className="fl-gt-side"
        style={{
          background: `linear-gradient(180deg, ${accent}, ${accent}88)`,
        }}
      >
        <div
          style={{
            writingMode: "vertical-rl",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.05em",
            padding: "4px 0",
            textAlign: "center",
          }}
        >
          {club.region}
        </div>
        <div style={{ fontSize: 22, lineHeight: 1, marginTop: "auto" }}>🎣</div>
      </div>

      <div className="fl-gt-body">
        {/* 클럽명 + 레벨 뱃지 */}
        <div className="fl-gt-top">
          <h3 className="fl-gt-title" style={{ marginBottom: 0, flex: 1 }}>
            {club.name}
          </h3>
          <span
            style={{
              fontSize: "0.65rem",
              padding: "2px 8px",
              borderRadius: 99,
              background: lvlStyle.bg,
              color: lvlStyle.color,
              border: `1px solid ${lvlStyle.color}44`,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {club.level}
          </span>
        </div>

        {/* 지역 + 전문 어종 */}
        <div className="fl-gt-meta" style={{ marginTop: 6 }}>
          <div className="fl-gt-meta-item">📍 {club.region}</div>
          <div className="fl-gt-meta-item">🐟 {club.specialty}</div>
        </div>

        {/* 주요 어종 태그 */}
        <div className="fl-gt-tags" style={{ marginTop: 6 }}>
          {club.fishTypes.map((f) => (
            <span key={f} className="fl-gt-tag">
              {f}
            </span>
          ))}
        </div>

        {/* 회비 + 다음 출조 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            fontSize: "0.78rem",
          }}
        >
          <span
            style={{
              color:
                club.monthlyFee === 0 ? "#86efac" : "var(--text-secondary)",
              fontWeight: 600,
            }}
          >
            {feeLabel}
          </span>
          <span style={{ color: "var(--text-dim)", fontSize: "0.72rem" }}>
            다음 출조 {outingDate}
          </span>
        </div>

        {/* 회원 수 진행 바 */}
        <div className="fl-gt-progress" style={{ marginTop: 10 }}>
          <div className="fl-gt-progress-head">
            <div className="fl-gt-progress-text">
              👥 회원&nbsp;
              <strong>{club.memberCount}</strong>
              <span>/{club.maxMembers}명</span>
            </div>
            <div
              className="fl-gt-progress-fee"
              style={{ color: "var(--text-dim)" }}
            >
              {club.meetingFrequency}
            </div>
          </div>
          <div className="fl-gt-bar">
            <div
              className="fl-gt-bar-fill"
              style={{
                width: `${pct}%`,
                background: full
                  ? "var(--text-dim)"
                  : `linear-gradient(90deg, ${accent}88, ${accent})`,
              }}
            />
          </div>
        </div>

        {/* 활동 태그 (최대 3개) */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
          {club.activities.slice(0, 3).map((act) => (
            <span
              key={act}
              style={{
                fontSize: "0.65rem",
                padding: "2px 8px",
                borderRadius: 99,
                background: `${accent}18`,
                color: accent,
                border: `1px solid ${accent}33`,
              }}
            >
              {act}
            </span>
          ))}
        </div>

        {/* 가입 신청 버튼 */}
        <button
          className="fl-gt-cta"
          disabled={!club.openRecruiting}
          onClick={(e) => {
            e.stopPropagation();
            if (club.openRecruiting) router.push(`/gathering/${club.id}`);
          }}
          style={
            !club.openRecruiting
              ? { opacity: 0.5, cursor: "not-allowed" }
              : undefined
          }
        >
          {club.openRecruiting ? "가입 신청" : "모집 마감"}
        </button>
      </div>
    </article>
  );
}
