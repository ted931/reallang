"use client";
import { useState } from "react";
import Link from "next/link";

// ─── 더미 데이터 ───────────────────────────────────────────────

const BIZ_ACCOUNTS = [
  {
    id: "biz1",
    name: "한림 황금좌대",
    category: "좌대",
    region: "한림",
    rating: 4.8,
    reviewCount: 142,
  },
];

const KPI = [
  { icon: "📅", label: "이번달 예약", value: "47건", sub: "↑12% 전월 대비", color: "#4ade80" },
  { icon: "💰", label: "이번달 매출", value: "705,000원", sub: "1인 평균 55,000원", color: "var(--hook-300)" },
  { icon: "⭐", label: "평균 평점", value: "4.8", sub: `리뷰 142개`, color: "var(--hook-300)" },
  { icon: "🐟", label: "조황 포스팅", value: "23개", sub: "이번달 등록", color: "#60a5fa" },
];

const RESERVATIONS = [
  { id: "R-2841", date: "2026-05-14", name: "김○○", people: 2, amount: 110000, status: "확정" as const },
  { id: "R-2842", date: "2026-05-14", name: "이○○", people: 4, amount: 220000, status: "대기" as const },
  { id: "R-2843", date: "2026-05-15", name: "박○○", people: 1, amount: 55000, status: "확정" as const },
  { id: "R-2844", date: "2026-05-15", name: "최○○", people: 3, amount: 165000, status: "대기" as const },
  { id: "R-2845", date: "2026-05-16", name: "정○○", people: 2, amount: 110000, status: "취소" as const },
];

const CATCH_POSTS = [
  { date: "2026-05-11", fish: "참돔", result: "참돔 48cm×2, 벵에돔 34cm×3", views: 312, converts: 7 },
  { date: "2026-05-09", fish: "감성돔", result: "감성돔 41cm, 볼락 22cm×6", views: 241, converts: 4 },
  { date: "2026-05-07", fish: "방어", result: "방어 62cm 대물 1마리", views: 589, converts: 12 },
  { date: "2026-05-04", fish: "벵에돔", result: "벵에돔 30~35cm ×5", views: 188, converts: 3 },
  { date: "2026-04-30", fish: "참돔", result: "참돔 52cm 포함 3마리", views: 402, converts: 9 },
];

const REVIEWS = [
  {
    nick: "갯바위왕자",
    stars: 5,
    date: "2026-05-10",
    text: "직원분이 처음부터 끝까지 도와주셔서 참돔 51cm 잡았어요. 시설도 깔끔하고 다음에 또 올게요!",
  },
  {
    nick: "제주낚시입문",
    stars: 4,
    date: "2026-04-28",
    text: "초보인데도 잘 챙겨주셨어요. 갈치 두 마리 잡았고 즉석 회도 너무 맛있었어요. 화장실이 좀 좁아요.",
  },
  {
    nick: "루어마니아",
    stars: 5,
    date: "2026-04-15",
    text: "방어 시즌에 맞춰 갔는데 대박이었습니다. 62cm 방어 끌어올렸어요. 사장님 인심도 최고!",
  },
];

// ─── 상태 배지 스타일 ───────────────────────────────────────────

const STATUS_STYLE = {
  확정: { background: "rgba(74,222,128,0.15)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" },
  대기: { background: "rgba(251,191,36,0.12)", color: "var(--hook-300)", border: "1px solid rgba(251,191,36,0.3)" },
  취소: { background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" },
};

// ─── 메인 컴포넌트 ─────────────────────────────────────────────

export default function BizDashboardPage() {
  const [activeBiz] = useState(0);
  const biz = BIZ_ACCOUNTS[activeBiz];

  // 조황 등록 폼 토글
  const [showCatchForm, setShowCatchForm] = useState(false);
  const [catchForm, setCatchForm] = useState({ fish: "", result: "", weather: "", tide: "", note: "" });

  // 리뷰 답변 토글
  const [replyOpen, setReplyOpen] = useState<Record<number, boolean>>({});
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  // 예약 액션 상태
  const [reservationStatuses, setReservationStatuses] = useState<Record<string, typeof RESERVATIONS[0]["status"]>>(
    Object.fromEntries(RESERVATIONS.map((r) => [r.id, r.status]))
  );

  // 미등록 상태 탭 (시뮬레이션)
  const [registerForm, setRegisterForm] = useState({ name: "", category: "", region: "", tel: "", intro: "" });

  function confirmReservation(id: string) {
    setReservationStatuses((prev) => ({ ...prev, [id]: "확정" }));
  }
  function rejectReservation(id: string) {
    setReservationStatuses((prev) => ({ ...prev, [id]: "취소" }));
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 0 80px" }}>

      {/* ── 상단 헤더 ── */}
      <div
        style={{
          padding: "20px 20px 0",
          borderBottom: "1px solid var(--line)",
          background: "var(--tint-04)",
        }}
      >
        {/* 업체 선택 탭 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, overflowX: "auto", scrollbarWidth: "none" }}>
          {BIZ_ACCOUNTS.map((b, i) => (
            <button
              key={b.id}
              style={{
                fontFamily: "inherit",
                flexShrink: 0,
                padding: "6px 16px",
                borderRadius: 999,
                border: "1px solid",
                fontSize: 13,
                fontWeight: activeBiz === i ? 700 : 500,
                cursor: "pointer",
                background: activeBiz === i ? "var(--hook)" : "transparent",
                borderColor: activeBiz === i ? "var(--hook)" : "var(--line-2)",
                color: activeBiz === i ? "#0a1628" : "var(--text-dim)",
              }}
            >
              {b.name}
            </button>
          ))}
          <button
            style={{
              fontFamily: "inherit",
              flexShrink: 0,
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px dashed var(--line-2)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              background: "transparent",
              color: "var(--text-mute)",
            }}
          >
            + 업체 추가
          </button>
        </div>

        {/* 업체 정보 */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "var(--r-sm, 12px)",
              background: "var(--tint-08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            🛖
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, fontSize: 17, color: "var(--text-strong)" }}>{biz.name}</span>
              <span
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(96,165,250,0.15)",
                  color: "#60a5fa",
                  border: "1px solid rgba(96,165,250,0.25)",
                  fontWeight: 700,
                }}
              >
                {biz.category}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>📍 {biz.region}</span>
              <span style={{ fontSize: 12, color: "var(--hook-300)", fontWeight: 700 }}>
                ⭐ {biz.rating}
                <span style={{ color: "var(--text-mute)", fontWeight: 400 }}> ({biz.reviewCount})</span>
              </span>
            </div>
          </div>
          <Link href="/biz/register">
            <button
              style={{
                fontFamily: "inherit",
                flexShrink: 0,
                padding: "7px 14px",
                borderRadius: "var(--r-sm, 10px)",
                border: "1px solid var(--line)",
                background: "transparent",
                color: "var(--text-dim)",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              정보 수정
            </button>
          </Link>
        </div>
      </div>

      {/* ── 핵심 지표 4개 ── */}
      <div style={{ padding: "20px 16px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
          }}
        >
          {KPI.map((k) => (
            <div
              key={k.label}
              style={{
                borderRadius: "var(--r-card, 16px)",
                border: "1px solid var(--line)",
                background: "var(--tint-05)",
                padding: "14px 16px",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>{k.label}</div>
              <div style={{ fontSize: 10, color: "var(--text-mute)", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 빠른 메뉴 ── */}
      <div style={{ padding: "20px 16px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
          }}
        >
          {[
            { icon: "📸", label: "조황 올리기", action: () => setShowCatchForm((v) => !v) },
            { icon: "📋", label: "예약 관리", action: () => document.getElementById("sec-reservation")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: "⭐", label: "리뷰 보기", action: () => document.getElementById("sec-review")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: "📊", label: "통계 보기", action: () => document.getElementById("sec-stats")?.scrollIntoView({ behavior: "smooth" }) },
          ].map((m) => (
            <button
              key={m.label}
              onClick={m.action}
              style={{
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "13px 16px",
                borderRadius: "var(--r-card, 16px)",
                border: "1px solid var(--line-2)",
                background: "var(--tint-06)",
                color: "var(--text)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                transition: "background 0.15s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* 조황 등록 인라인 폼 */}
      {showCatchForm && (
        <div
          style={{
            margin: "12px 16px 0",
            padding: "16px",
            borderRadius: "var(--r-card, 16px)",
            border: "1px solid var(--hook)",
            background: "var(--tint-05)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-strong)", marginBottom: 12 }}>
            📸 조황 포스팅 등록
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { key: "fish" as const, placeholder: "어종 (예: 참돔, 감성돔)", label: "어종" },
              { key: "result" as const, placeholder: "조과 (예: 참돔 48cm×2)", label: "조과 내용" },
              { key: "weather" as const, placeholder: "날씨 (예: 맑음, 파도 0.5m)", label: "날씨" },
              { key: "tide" as const, placeholder: "물때 (예: 7물)", label: "물때" },
            ].map((f) => (
              <input
                key={f.key}
                placeholder={f.placeholder}
                value={catchForm[f.key]}
                onChange={(e) => setCatchForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "var(--r-sm, 10px)",
                  border: "1px solid var(--line-2)",
                  background: "var(--tint-08)",
                  color: "var(--text)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            ))}
            <textarea
              placeholder="한마디 (예: 오늘 조황 최고였습니다!)"
              value={catchForm.note}
              onChange={(e) => setCatchForm((prev) => ({ ...prev, note: e.target.value }))}
              rows={3}
              style={{
                width: "100%",
                padding: "9px 12px",
                borderRadius: "var(--r-sm, 10px)",
                border: "1px solid var(--line-2)",
                background: "var(--tint-08)",
                color: "var(--text)",
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => { setShowCatchForm(false); setCatchForm({ fish: "", result: "", weather: "", tide: "", note: "" }); }}
                style={{
                  fontFamily: "inherit",
                  flex: 1,
                  padding: "10px",
                  borderRadius: "var(--r-sm, 10px)",
                  border: "1px solid var(--line-2)",
                  background: "transparent",
                  color: "var(--text-dim)",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                취소
              </button>
              <button
                onClick={() => { alert("조황이 등록되었습니다!"); setShowCatchForm(false); setCatchForm({ fish: "", result: "", weather: "", tide: "", note: "" }); }}
                style={{
                  fontFamily: "inherit",
                  flex: 2,
                  padding: "10px",
                  borderRadius: "var(--r-sm, 10px)",
                  border: "none",
                  background: "var(--hook)",
                  color: "#0a1628",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 오늘의 예약 현황 ── */}
      <div id="sec-reservation" style={{ padding: "24px 16px 0" }}>
        <div
          style={{
            borderRadius: "var(--r-card, 16px)",
            border: "1px solid var(--line)",
            background: "var(--tint-04)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-strong)" }}>📋 오늘의 예약 현황</span>
            <span style={{ fontSize: 11, color: "var(--text-mute)" }}>2026-05-12</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {RESERVATIONS.map((r) => {
              const status = reservationStatuses[r.id];
              const statusStyle = STATUS_STYLE[status];
              return (
                <div
                  key={r.id}
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid var(--line)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{r.id}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)" }}>{r.name}</span>
                      <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{r.people}명</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                      <span style={{ fontSize: 11, color: "var(--text-dim)" }}>{r.date}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--hook-300)" }}>
                        {r.amount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 999,
                        ...statusStyle,
                      }}
                    >
                      {status}
                    </span>
                    {status === "대기" && (
                      <>
                        <button
                          onClick={() => confirmReservation(r.id)}
                          style={{
                            fontFamily: "inherit",
                            padding: "4px 10px",
                            borderRadius: "var(--r-sm, 8px)",
                            border: "none",
                            background: "rgba(74,222,128,0.2)",
                            color: "#4ade80",
                            fontWeight: 700,
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          확정
                        </button>
                        <button
                          onClick={() => rejectReservation(r.id)}
                          style={{
                            fontFamily: "inherit",
                            padding: "4px 10px",
                            borderRadius: "var(--r-sm, 8px)",
                            border: "none",
                            background: "rgba(248,113,113,0.15)",
                            color: "#f87171",
                            fontWeight: 700,
                            fontSize: 11,
                            cursor: "pointer",
                          }}
                        >
                          거절
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 이번달 조황 포스팅 ── */}
      <div id="sec-stats" style={{ padding: "20px 16px 0" }}>
        <div
          style={{
            borderRadius: "var(--r-card, 16px)",
            border: "1px solid var(--line)",
            background: "var(--tint-04)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-strong)" }}>🐟 이번달 조황 포스팅</span>
            <span style={{ fontSize: 11, color: "var(--text-mute)" }}>총 23건</span>
          </div>
          <div>
            {CATCH_POSTS.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderBottom: i < CATCH_POSTS.length - 1 ? "1px solid var(--line)" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--r-sm, 10px)",
                    background: "var(--tint-08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  🐟
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {p.result}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{p.date}</span>
                    <span style={{ fontSize: 11, color: "var(--text-dim)" }}>👁 {p.views}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#4ade80" }}>+{p.converts}</div>
                  <div style={{ fontSize: 10, color: "var(--text-mute)" }}>예약전환</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 리뷰 섹션 ── */}
      <div id="sec-review" style={{ padding: "20px 16px 0" }}>
        <div
          style={{
            borderRadius: "var(--r-card, 16px)",
            border: "1px solid var(--line)",
            background: "var(--tint-04)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-strong)" }}>⭐ 리뷰</span>
            <span style={{ fontSize: 13, color: "var(--hook-300)", fontWeight: 800 }}>★ 4.8</span>
          </div>
          <div>
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text-strong)" }}>{r.nick}</span>
                    <span style={{ fontSize: 12, color: "var(--hook-300)" }}>{"★".repeat(r.stars)}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{r.date}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, margin: "0 0 10px" }}>{r.text}</p>
                {replyOpen[i] ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <textarea
                      placeholder="답변을 입력하세요..."
                      value={replyText[i] ?? ""}
                      onChange={(e) => setReplyText((prev) => ({ ...prev, [i]: e.target.value }))}
                      rows={3}
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "var(--r-sm, 10px)",
                        border: "1px solid var(--line-2)",
                        background: "var(--tint-08)",
                        color: "var(--text)",
                        fontSize: 13,
                        fontFamily: "inherit",
                        resize: "vertical",
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setReplyOpen((prev) => ({ ...prev, [i]: false }))}
                        style={{
                          fontFamily: "inherit",
                          flex: 1,
                          padding: "8px",
                          borderRadius: "var(--r-sm, 8px)",
                          border: "1px solid var(--line-2)",
                          background: "transparent",
                          color: "var(--text-dim)",
                          fontWeight: 600,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        취소
                      </button>
                      <button
                        onClick={() => { alert("답변이 등록되었습니다!"); setReplyOpen((prev) => ({ ...prev, [i]: false })); }}
                        style={{
                          fontFamily: "inherit",
                          flex: 2,
                          padding: "8px",
                          borderRadius: "var(--r-sm, 8px)",
                          border: "none",
                          background: "var(--hook)",
                          color: "#0a1628",
                          fontWeight: 800,
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        답변 등록
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyOpen((prev) => ({ ...prev, [i]: true }))}
                    style={{
                      fontFamily: "inherit",
                      padding: "6px 12px",
                      borderRadius: "var(--r-sm, 8px)",
                      border: "1px solid var(--line-2)",
                      background: "transparent",
                      color: "var(--text-dim)",
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    답변하기
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 업체 미등록 상태 — 신규 등록 폼 ── */}
      <div style={{ padding: "20px 16px 0" }}>
        <div
          style={{
            borderRadius: "var(--r-card, 16px)",
            border: "1px dashed var(--line-2)",
            background: "var(--tint-05)",
            padding: "20px 16px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏪</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text-strong)", marginBottom: 4 }}>
              업체 등록하기
            </div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
              새 업체를 추가로 등록하고 싶으신가요?
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { key: "name" as const, placeholder: "업체명 (예: 성산 바다낚시)", label: "업체명" },
              { key: "tel" as const, placeholder: "연락처 (예: 010-1234-5678)", label: "연락처" },
            ].map((f) => (
              <input
                key={f.key}
                placeholder={f.placeholder}
                value={registerForm[f.key]}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "var(--r-sm, 10px)",
                  border: "1px solid var(--line-2)",
                  background: "var(--tint-08)",
                  color: "var(--text)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <select
                value={registerForm.category}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, category: e.target.value }))}
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--r-sm, 10px)",
                  border: "1px solid var(--line-2)",
                  background: "var(--tint-08)",
                  color: registerForm.category ? "var(--text)" : "var(--text-mute)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">카테고리 선택</option>
                {["좌대", "배편(선상)", "낚시점", "숙소", "기타"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={registerForm.region}
                onChange={(e) => setRegisterForm((prev) => ({ ...prev, region: e.target.value }))}
                style={{
                  padding: "10px 12px",
                  borderRadius: "var(--r-sm, 10px)",
                  border: "1px solid var(--line-2)",
                  background: "var(--tint-08)",
                  color: registerForm.region ? "var(--text)" : "var(--text-mute)",
                  fontSize: 13,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                <option value="">지역 선택</option>
                {["제주시", "서귀포", "한림", "애월", "구좌", "성산", "표선", "남원", "안덕", "대정", "모슬포"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="업체 소개글 (예: 제주 성산 일출봉 앞 바다낚시 전문. 초보자 환영!)"
              value={registerForm.intro}
              onChange={(e) => setRegisterForm((prev) => ({ ...prev, intro: e.target.value }))}
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "var(--r-sm, 10px)",
                border: "1px solid var(--line-2)",
                background: "var(--tint-08)",
                color: "var(--text)",
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={() => alert("업체 등록 신청이 완료되었습니다!\n1~2일 내 검토 후 승인 알림을 보내드립니다.")}
              style={{
                fontFamily: "inherit",
                width: "100%",
                padding: "13px",
                borderRadius: "var(--r-card, 16px)",
                border: "none",
                background: "var(--hook)",
                color: "#0a1628",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              업체 등록 신청하기 →
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
