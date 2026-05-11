"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DUMMY_GATHERINGS } from "@/lib/dummy-gatherings";
import type { FishingGathering } from "@/lib/types";

const TABS = ["전체", "모집중", "마감임박", "초보환영"] as const;
type Tab = typeof TABS[number];

export default function GatheringPage() {
  const [tab, setTab] = useState<Tab>("전체");

  const list = useMemo(() => {
    const now = new Date("2026-05-11");
    if (tab === "모집중")
      return DUMMY_GATHERINGS.filter((g) => g.currentMembers < g.maxMembers);
    if (tab === "마감임박")
      return DUMMY_GATHERINGS.filter(
        (g) => g.currentMembers < g.maxMembers && g.maxMembers - g.currentMembers <= 2
      );
    if (tab === "초보환영")
      return DUMMY_GATHERINGS.filter((g) => g.beginnerWelcome);
    return DUMMY_GATHERINGS;
  }, [tab]);

  const total = DUMMY_GATHERINGS.length;
  const open = DUMMY_GATHERINGS.filter((g) => g.currentMembers < g.maxMembers).length;
  const closing = DUMMY_GATHERINGS.filter(
    (g) => g.currentMembers < g.maxMembers && g.maxMembers - g.currentMembers <= 2
  ).length;

  return (
    <>
      {/* 히어로 */}
      <div className="fl-gt-hero">
        <div className="fl-hero-glow" style={{ background: "radial-gradient(circle at 50% 0%, rgba(134,239,172,0.18), transparent 60%)" }} />
        <div className="fl-jw-hero-inner">
          <div className="fl-catch-hero-kicker" style={{ color: "#86efac" }}>MEETUP</div>
          <h1 className="fl-catch-hero-title">함께 떠나는 낚시</h1>
          <div className="fl-jw-hero-stats">
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n">{total}<span>개</span></div>
              <div className="fl-jw-hero-l">전체 모임</div>
            </div>
            <div className="fl-jw-hero-divider" />
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n" style={{ color: "#86efac" }}>{open}<span>개</span></div>
              <div className="fl-jw-hero-l">모집중</div>
            </div>
            <div className="fl-jw-hero-divider" />
            <div className="fl-jw-hero-stat">
              <div className="fl-jw-hero-n" style={{ color: "#f59e0b" }}>{closing}<span>개</span></div>
              <div className="fl-jw-hero-l">마감임박</div>
            </div>
          </div>
        </div>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
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
        <span><strong>{list.length}</strong>개 모임</span>
      </div>

      {/* 카드 목록 */}
      <div className="fl-gt-grid">
        {list.map((g) => (
          <GatheringCard key={g.id} g={g} />
        ))}
      </div>

      {/* FAB */}
      <Link href="/gathering/new" className="fl-fab" aria-label="모임 만들기">
        <span style={{ fontSize: 20, lineHeight: 1 }}>+</span>
        <span>모임 만들기</span>
      </Link>
    </>
  );
}

function GatheringCard({ g }: { g: FishingGathering }) {
  const router = useRouter();
  const full = g.currentMembers >= g.maxMembers;
  const urgent = !full && g.maxMembers - g.currentMembers <= 2;
  const pct = (g.currentMembers / g.maxMembers) * 100;

  const dday = (() => {
    const now = new Date("2026-05-11");
    const target = new Date(g.date);
    return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86400000));
  })();

  const COLORS = ["#f59e0b", "#5fa3cf", "#86efac", "#f0abfc", "#fbbf24", "#a78bfa"];
  const color = COLORS[parseInt(g.id.replace("g", "")) % COLORS.length];

  const feeLabel =
    g.costType === "free"
      ? "무료"
      : g.costAmount
      ? `${(g.costAmount / 10000).toFixed(0)}만원`
      : "";

  return (
    <article
      className={`fl-gt-card${urgent ? " urgent" : ""}${full ? " full" : ""}`}
      onClick={() => router.push(`/gathering/${g.id}`)}
      style={{ cursor: "pointer" }}
    >
      {urgent && <div className="fl-gt-pulse" />}
      <div className="fl-gt-side" style={{ background: `linear-gradient(180deg, ${color}, ${color}aa)` }}>
        <div className="fl-gt-dday">
          <span className="fl-gt-dday-l">D</span>
          <span className="fl-gt-dday-n">-{dday}</span>
        </div>
        <div className="fl-gt-side-fish" style={{ fontSize: 26 }}>🎣</div>
      </div>

      <div className="fl-gt-body">
        <div className="fl-gt-top">
          <div className="fl-gt-tags">
            {g.tags.slice(0, 3).map((t) => (
              <span key={t} className="fl-gt-tag">{t}</span>
            ))}
          </div>
          {urgent && <span className="fl-gt-urgent">🔥 마감임박</span>}
          {full && <span className="fl-gt-full">모집 완료</span>}
        </div>

        <h3 className="fl-gt-title">{g.title}</h3>

        <div className="fl-gt-meta">
          <div className="fl-gt-meta-item">📅 {g.date} {g.time}</div>
          <div className="fl-gt-meta-item">📍 {g.location}</div>
        </div>

        <div className="fl-gt-host">
          <div className="fl-avatar fl-gt-host-avatar">{g.hostName[0]}</div>
          <div className="fl-gt-host-info">
            <div className="fl-gt-host-name">
              {g.hostName}
              <span className="fl-gt-host-lvl">⭐{g.hostRating}</span>
            </div>
            <div className="fl-gt-host-trust">
              🎣 누적 조획 <strong>{g.hostCatchCount}</strong>마리
            </div>
          </div>
        </div>

        <div className="fl-gt-progress">
          <div className="fl-gt-progress-head">
            <div className="fl-gt-progress-text">
              👥 참가자&nbsp;
              <strong className={urgent ? "urgent" : ""}>{g.currentMembers}</strong>
              <span>/{g.maxMembers}명</span>
            </div>
            {feeLabel && (
              <div className="fl-gt-progress-fee">
                참가비 <strong>{feeLabel}</strong>
              </div>
            )}
          </div>
          <div className="fl-gt-bar">
            <div
              className="fl-gt-bar-fill"
              style={{
                width: `${pct}%`,
                background: full
                  ? "var(--text-dim)"
                  : urgent
                  ? "linear-gradient(90deg, #f59e0b, #ef4444)"
                  : `linear-gradient(90deg, ${color}88, ${color})`,
              }}
            />
          </div>
        </div>

        <button
          className="fl-gt-cta"
          disabled={full}
          onClick={(e) => {
            e.stopPropagation();
            if (!full) router.push(`/gathering/${g.id}`);
          }}
        >
          {full ? "모집 완료" : "참가 신청"}
        </button>
      </div>
    </article>
  );
}
