"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DUMMY_RESERVATIONS,
  ESCROW_STATUS_LABEL,
  type EscrowStatus,
  type Reservation,
} from "@/lib/dummy-reservations";

const TABS = [
  { k: "reserve", label: "예약 내역", n: DUMMY_RESERVATIONS.length },
  { k: "escrow", label: "에스크로", n: DUMMY_RESERVATIONS.filter((r) => r.escrowStatus === "holding").length },
  { k: "logbook", label: "내 일지", n: 18 },
  { k: "review", label: "리뷰", n: 6 },
] as const;
type TabKey = typeof TABS[number]["k"];

const STATE_META: Record<EscrowStatus, { label: string; color: string; icon: string }> = {
  holding:   { label: "에스크로 보관 중", color: "#fbbf24", icon: "🔒" },
  confirmed: { label: "출조 확정",         color: "#5fa3cf", icon: "🎣" },
  completed: { label: "정산 완료",         color: "#86efac", icon: "✓" },
  cancelled: { label: "취소됨",            color: "#f87171", icon: "✕" },
  refunded:  { label: "환불 완료",         color: "#f87171", icon: "↩" },
};

const PHASE_MAP: Record<EscrowStatus, number> = {
  holding: 1, confirmed: 2, completed: 3, cancelled: 0, refunded: 0,
};

export default function MyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("reserve");

  const escrowItems = DUMMY_RESERVATIONS.filter((r) => r.escrowStatus === "holding");
  const displayed =
    tab === "reserve" ? DUMMY_RESERVATIONS
    : tab === "escrow" ? escrowItems
    : [];

  const totalEscrow = escrowItems.reduce((a, r) => a + r.totalAmount, 0);

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .fl-mp-pc-outer {
            max-width: 960px;
            margin: 0 auto;
            padding: 0 24px;
          }
          .fl-mp-hero {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
          }
          .fl-tabs {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
          }
          .fl-mp-pc-body {
            max-width: 960px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 24px;
            padding: 0 24px 60px;
            align-items: start;
          }
          .fl-mp-pc-sidebar {
            display: block;
          }
          .fl-mp-list {
            margin: 0 !important;
            padding: 0 !important;
          }
          .fl-mp-logout {
            padding: 20px 24px 40px;
            max-width: 960px;
            margin: 0 auto;
            text-align: center;
          }
        }
      `}</style>

      {/* 프로필 히어로 */}
      <section className="fl-mp-hero">
        <div className="fl-mp-prof">
          <div className="fl-avatar fl-mp-avatar">T</div>
          <div>
            <div className="fl-mp-name">태드 <span>Lv.12</span></div>
            <div className="fl-mp-stats">조획 47마리 · 출조 18회 · 리뷰 6</div>
          </div>
          <button className="fl-mp-edit" aria-label="프로필 편집" onClick={() => router.push("/mypage/edit")}>→</button>
        </div>
        <div className="fl-mp-summary">
          <div>
            <div className="fl-mp-sn">{escrowItems.length}</div>
            <div className="fl-mp-sl">에스크로 보관</div>
          </div>
          <div className="fl-mp-sep" />
          <div>
            <div className="fl-mp-sn">
              {totalEscrow >= 10000
                ? `${Math.round(totalEscrow / 1000)}`
                : totalEscrow.toLocaleString()}
              <span>{totalEscrow >= 10000 ? "K" : "원"}</span>
            </div>
            <div className="fl-mp-sl">보관 금액</div>
          </div>
          <div className="fl-mp-sep" />
          <div>
            <div className="fl-mp-sn">{DUMMY_RESERVATIONS.filter((r) => r.escrowStatus !== "completed" && r.escrowStatus !== "cancelled" && r.escrowStatus !== "refunded").length}</div>
            <div className="fl-mp-sl">예정 출조</div>
          </div>
        </div>
      </section>

      {/* 탭 */}
      <div className="fl-tabs">
        {TABS.map((t) => (
          <button
            key={t.k}
            className={`fl-tab ${tab === t.k ? "on" : ""}`}
            onClick={() => setTab(t.k)}
          >
            {t.label} <span className="fl-tab-n">{t.n}</span>
            {tab === t.k && <span className="fl-tab-underline" />}
          </button>
        ))}
      </div>

      {/* PC 2컬럼 바디: 사이드바(좌) + 예약목록(우) */}
      <div className="fl-mp-pc-body">
        {/* 좌: 요약 사이드바 (PC에서만 노출) */}
        <aside
          className="fl-mp-pc-sidebar"
          style={{
            display: "none",
            background: "var(--tint-04)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-card, 16px)",
            padding: "20px",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-dim)", letterSpacing: "0.5px", marginBottom: 14 }}>
            계정 요약
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>에스크로 보관</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>{escrowItems.length}건</span>
            </div>
            <div style={{ height: 1, background: "var(--line)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>보관 금액</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>
                {totalEscrow >= 10000 ? `${Math.round(totalEscrow / 1000)}K` : `${totalEscrow.toLocaleString()}원`}
              </span>
            </div>
            <div style={{ height: 1, background: "var(--line)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>예정 출조</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>
                {DUMMY_RESERVATIONS.filter((r) => r.escrowStatus !== "completed" && r.escrowStatus !== "cancelled" && r.escrowStatus !== "refunded").length}회
              </span>
            </div>
            <div style={{ height: 1, background: "var(--line)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>조획</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>47마리</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>출조 횟수</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>18회</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>리뷰</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text-strong)" }}>6개</span>
            </div>
          </div>
          <button
            className="fl-mp-btn"
            style={{ marginTop: 20, width: "100%", background: "rgba(248,113,113,0.07)", borderColor: "rgba(248,113,113,0.25)", color: "#f87171", padding: "10px 0", fontSize: 13 }}
            onClick={() => alert("로그아웃 처리됩니다")}
          >
            로그아웃
          </button>
        </aside>

        {/* 우: 예약 목록 */}
        <div className="fl-mp-list">
          {displayed.length > 0 ? (
            displayed.map((r) => <ReserveCard key={r.id} r={r} />)
          ) : (
            <div className="fl-empty">
              <div className="fl-empty-title">표시할 항목이 없어요</div>
              <div className="fl-empty-sub">새로운 활동을 시작해보세요</div>
            </div>
          )}
        </div>
      </div>

      {/* 로그아웃 (모바일 전용) */}
      <div className="fl-mp-logout" style={{ padding: "20px 20px 40px", textAlign: "center" }}>
        <button
          className="fl-mp-btn"
          style={{ background: "rgba(248,113,113,0.07)", borderColor: "rgba(248,113,113,0.25)", color: "#f87171", padding: "10px 28px", fontSize: 13 }}
          onClick={() => alert("로그아웃 처리됩니다")}
        >
          로그아웃
        </button>
      </div>
    </>
  );
}

function ReserveCard({ r }: { r: Reservation }) {
  const [cancelled, setCancelled] = useState(false);
  const [reviewDone, setReviewDone] = useState(false);
  const m = STATE_META[r.escrowStatus];
  const phase = PHASE_MAP[r.escrowStatus];
  const status = ESCROW_STATUS_LABEL[r.escrowStatus];

  return (
    <div className="fl-mp-res">
      <div className="fl-mp-res-top">
        <div
          className="fl-mp-state-badge"
          style={{
            background: `${m.color}22`,
            color: m.color,
            borderColor: `${m.color}55`,
          }}
        >
          <span>{m.icon}</span> {m.label}
        </div>
        <div className="fl-mp-res-id">{r.id}</div>
      </div>

      <Link href={`/jwaedae/${r.jwaedaeId}`} className="fl-mp-res-name" style={{ textDecoration: "none", color: "inherit" }}>
        {r.jwaedaeName}
      </Link>
      <div className="fl-mp-res-meta">
        <span>📅 {r.date} {r.time} · {r.people}명</span>
        <span>📍 {r.region}</span>
      </div>

      <MiniTimeline phase={phase} />

      <div className="fl-mp-res-foot">
        <div>
          <div className="fl-mp-price">{r.totalAmount.toLocaleString()}<span>원</span></div>
          <div className="fl-mp-method">{r.escrowStatus === "completed" ? "정산 완료" : "에스크로 보관"}</div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a
            href={`tel:${r.operatorPhone}`}
            className="fl-mp-btn"
          >
            📞 업체
          </a>
          {(r.escrowStatus === "holding" || r.escrowStatus === "confirmed") && !cancelled && (
            <button
              className="fl-mp-btn"
              style={{ background: "rgba(248,113,113,0.1)", borderColor: "rgba(248,113,113,0.3)", color: "#f87171" }}
              onClick={() => setCancelled(true)}
            >
              예약 취소
            </button>
          )}
          {cancelled && (
            <span className="fl-mp-btn" style={{ background: "rgba(248,113,113,0.08)", borderColor: "rgba(248,113,113,0.2)", color: "#f87171", cursor: "default" }}>
              ✕ 취소됨
            </span>
          )}
          {r.escrowStatus === "completed" && (
            <Link
              href={`/catch/new?jwaedaeId=${r.jwaedaeId}`}
              className="fl-mp-btn"
              style={{ background: "rgba(245,158,11,0.1)", borderColor: "rgba(245,158,11,0.3)", color: "var(--hook-300)" }}
            >
              🎣 조황 등록
            </Link>
          )}
          {r.escrowStatus === "completed" && (
            <button
              className="fl-mp-btn"
              style={
                reviewDone
                  ? { background: "rgba(134,239,172,0.1)", borderColor: "rgba(134,239,172,0.3)", color: "#86efac", cursor: "default" }
                  : { background: "rgba(96,165,250,0.1)", borderColor: "rgba(96,165,250,0.3)", color: "#60a5fa" }
              }
              onClick={() => !reviewDone && setReviewDone(true)}
            >
              {reviewDone ? "✓ 리뷰완료" : "⭐ 리뷰 작성"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniTimeline({ phase }: { phase: number }) {
  const labels = ["결제", "보관", "출조", "정산"];
  return (
    <div className="fl-mini-tl">
      {labels.map((l, i) => (
        <span key={i} style={{ display: "contents" }}>
          <div className={`fl-mini-step ${i <= phase ? "on" : ""}`}>
            <div className="fl-mini-dot">{i < phase ? "✓" : ""}</div>
            <div className="fl-mini-l">{l}</div>
          </div>
          {i < labels.length - 1 && (
            <div className={`fl-mini-line ${i < phase ? "on" : ""}`} />
          )}
        </span>
      ))}
    </div>
  );
}
