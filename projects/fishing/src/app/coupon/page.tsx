"use client";
import { useState } from "react";
import Link from "next/link";

type CatKey = "전체" | "좌대·배낚시" | "렌터카" | "숙소" | "낚시용품" | "식당";
type SortKey = "최신순" | "할인율높은순" | "마감임박";

interface HubCoupon {
  id: string;
  cat: CatKey;
  bizName: string;
  title: string;
  condition: string;
  validUntil: string;
  dday: number;
  discountLabel: string; // "30% OFF" | "1만원 할인"
  discountType: "percent" | "fixed";
  discountValue: number; // 숫자 (% 또는 원)
  catColor: string;
  urgent?: boolean;
  code: string;
  isNew?: boolean;
}

const COUPONS: HubCoupon[] = [
  {
    id: "c01", cat: "좌대·배낚시", bizName: "한림 황금좌대",
    title: "2인 이상 20% 할인 쿠폰",
    condition: "2인 이상 예약 시", validUntil: "~5/20", dday: 8,
    discountLabel: "20% OFF", discountType: "percent", discountValue: 20,
    catColor: "#3b82f6", code: "GOLD20",
  },
  {
    id: "c02", cat: "렌터카", bizName: "제주렌터카",
    title: "첫 이용 고객 30% 할인",
    condition: "첫예약 한정", validUntil: "~5/15", dday: 3,
    discountLabel: "30% OFF", discountType: "percent", discountValue: 30,
    catColor: "#8b5cf6", code: "FIRST30", urgent: true,
  },
  {
    id: "c03", cat: "숙소", bizName: "서귀포 황우지펜션",
    title: "주중 숙박 15% 할인",
    condition: "주중 한정", validUntil: "~5/31", dday: 19,
    discountLabel: "15% OFF", discountType: "percent", discountValue: 15,
    catColor: "#0d9488", code: "WEEK15",
  },
  {
    id: "c04", cat: "숙소", bizName: "애월 바다펜션",
    title: "3박 이상 1만원 할인",
    condition: "3박 이상 예약 시", validUntil: "~6/10", dday: 29,
    discountLabel: "1만원 할인", discountType: "fixed", discountValue: 10000,
    catColor: "#0d9488", code: "STAY3",
  },
  {
    id: "c05", cat: "좌대·배낚시", bizName: "성산 참돔호",
    title: "4인 이상 배낚시 25% 할인",
    condition: "4인 이상", validUntil: "~5/18", dday: 6,
    discountLabel: "25% OFF", discountType: "percent", discountValue: 25,
    catColor: "#3b82f6", code: "BOAT25", urgent: true,
  },
  {
    id: "c06", cat: "낚시용품", bizName: "한림낚시마트",
    title: "채비·소품 10% 할인",
    condition: "3만원 이상 구매 시", validUntil: "~5/25", dday: 13,
    discountLabel: "10% OFF", discountType: "percent", discountValue: 10,
    catColor: "#f59e0b", code: "MART10",
  },
  {
    id: "c07", cat: "좌대·배낚시", bizName: "모슬포 방어킹",
    title: "신규 가입 20% 할인",
    condition: "첫예약 한정", validUntil: "~5/17", dday: 5,
    discountLabel: "20% OFF", discountType: "percent", discountValue: 20,
    catColor: "#3b82f6", code: "NEW20", urgent: true, isNew: true,
  },
  {
    id: "c08", cat: "좌대·배낚시", bizName: "구좌 해녀좌대",
    title: "평일 한정 30% 대할인",
    condition: "평일 한정", validUntil: "~5/14", dday: 2,
    discountLabel: "30% OFF", discountType: "percent", discountValue: 30,
    catColor: "#3b82f6", code: "WEEK30", urgent: true,
  },
  {
    id: "c09", cat: "숙소", bizName: "제주 낚시민박",
    title: "연박 할인 2만원 쿠폰",
    condition: "2박 이상", validUntil: "~6/5", dday: 24,
    discountLabel: "2만원 할인", discountType: "fixed", discountValue: 20000,
    catColor: "#0d9488", code: "STAY2",
  },
  {
    id: "c10", cat: "좌대·배낚시", bizName: "협재 광어보트",
    title: "2인 이상 보트낚시 15%",
    condition: "2인 이상", validUntil: "~5/22", dday: 10,
    discountLabel: "15% OFF", discountType: "percent", discountValue: 15,
    catColor: "#3b82f6", code: "BOAT15",
  },
  {
    id: "c11", cat: "낚시용품", bizName: "표선낚시점",
    title: "미끼·소품 15% 할인",
    condition: "2만원 이상 구매 시", validUntil: "~5/30", dday: 18,
    discountLabel: "15% OFF", discountType: "percent", discountValue: 15,
    catColor: "#f59e0b", code: "BAIT15",
  },
  {
    id: "c12", cat: "식당", bizName: "서귀포 바다식당",
    title: "낚시 당일 식사 10% 할인",
    condition: "낚시 당일 영수증 지참", validUntil: "~5/19", dday: 7,
    discountLabel: "10% OFF", discountType: "percent", discountValue: 10,
    catColor: "#ef4444", code: "FISH10",
  },
];

const CATS: CatKey[] = ["전체", "좌대·배낚시", "렌터카", "숙소", "낚시용품", "식당"];
const SORTS: SortKey[] = ["최신순", "할인율높은순", "마감임박"];

const CAT_BG: Record<CatKey, string> = {
  "전체": "#3b82f6",
  "좌대·배낚시": "#3b82f6",
  "렌터카": "#8b5cf6",
  "숙소": "#0d9488",
  "낚시용품": "#f59e0b",
  "식당": "#ef4444",
};

export default function CouponHubPage() {
  const [cat, setCat] = useState<CatKey>("전체");
  const [sort, setSort] = useState<SortKey>("최신순");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = COUPONS
    .filter(c => cat === "전체" || c.cat === cat)
    .sort((a, b) => {
      if (sort === "할인율높은순") return b.discountValue - a.discountValue;
      if (sort === "마감임박") return a.dday - b.dday;
      return 0; // 최신순: 원래 순서 유지
    });

  const todayNew = COUPONS.filter(c => c.isNew).length + 23;

  const handleCopy = (c: HubCoupon) => {
    navigator.clipboard.writeText(c.code).catch(() => {});
    setCopied(c.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      {/* 히어로 */}
      <section className="fl-hero">
        <div className="fl-hero-glow" />
        <div className="fl-hero-content">
          <div className="fl-hero-greet">COUPON HUB</div>
          <h1 className="fl-hero-title">
            쿠폰 허브<br />
            <span className="fl-hero-accent">할인 모아보기</span>
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: "0 0 18px", lineHeight: 1.5 }}>
            좌대·렌터카·숙소·낚시용품 할인 한눈에
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "var(--hook)", color: "#fff",
              fontWeight: 800, fontSize: 12, padding: "5px 12px",
              borderRadius: 999,
            }}>
              오늘 {todayNew}개 신규
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>매일 업데이트</span>
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      {/* 카테고리 탭 */}
      <div className="fl-cm-tabs" style={{ paddingTop: 12 }}>
        {CATS.map(c => (
          <button
            key={c}
            className={`fl-cm-tab${cat === c ? " on" : ""}`}
            onClick={() => setCat(c)}
            style={{ fontFamily: "inherit" }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 정렬 칩 */}
      <div className="fl-chips" style={{ padding: "0 20px 16px" }}>
        {SORTS.map(s => (
          <button
            key={s}
            className={`fl-chip${sort === s ? " on" : ""}`}
            onClick={() => setSort(s)}
            style={{ fontFamily: "inherit" }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 쿠폰 카드 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 16px 12px" }}>
        {filtered.map(c => {
          const isCopied = copied === c.id;
          return (
            <div
              key={c.id}
              style={{
                background: "var(--tint-04)",
                border: `1px solid ${c.urgent ? "rgba(239,68,68,0.35)" : "var(--line)"}`,
                borderRadius: "var(--r-card)",
                overflow: "hidden",
              }}
            >
              <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>
                {/* 왼쪽: 할인율 */}
                <div style={{
                  width: 80, flexShrink: 0,
                  background: c.catColor,
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: "16px 8px", gap: 2,
                }}>
                  <span style={{
                    fontSize: c.discountType === "percent" ? 22 : 14,
                    fontWeight: 900,
                    color: "#fff",
                    lineHeight: 1,
                    letterSpacing: "-0.5px",
                    textAlign: "center",
                  }}>
                    {c.discountLabel.replace(" OFF", "")}
                  </span>
                  {c.discountType === "percent" && (
                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", fontWeight: 700 }}>OFF</span>
                  )}
                  <span style={{
                    marginTop: 6, fontSize: 9, fontWeight: 700,
                    background: "rgba(0,0,0,0.2)", color: "#fff",
                    padding: "2px 6px", borderRadius: 999,
                  }}>
                    {c.cat}
                  </span>
                </div>

                {/* 오른쪽: 정보 */}
                <div style={{ flex: 1, padding: "12px 14px", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)", lineHeight: 1.3 }}>
                      {c.bizName}
                    </span>
                    <div style={{ display: "flex", gap: 4, flexShrink: 0, alignItems: "center" }}>
                      {c.isNew && (
                        <span style={{
                          fontSize: 9, fontWeight: 800, background: "var(--hook)",
                          color: "#fff", padding: "2px 5px", borderRadius: 4,
                        }}>NEW</span>
                      )}
                      {c.urgent && (
                        <span style={{
                          fontSize: 9, fontWeight: 800,
                          background: "rgba(239,68,68,0.12)", color: "#ef4444",
                          border: "1px solid rgba(239,68,68,0.3)",
                          padding: "2px 6px", borderRadius: 4,
                        }}>⚡마감임박</span>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 600, marginBottom: 4 }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-mute)", marginBottom: 8 }}>
                    {c.condition}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "var(--text-dim)" }}>유효 {c.validUntil}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 800,
                        color: c.dday <= 3 ? "#ef4444" : c.dday <= 7 ? "#f59e0b" : "var(--text-dim)",
                        background: c.dday <= 3 ? "rgba(239,68,68,0.1)" : c.dday <= 7 ? "rgba(245,158,11,0.1)" : "var(--tint-05)",
                        padding: "2px 6px", borderRadius: 6,
                      }}>
                        D-{c.dday}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(c)}
                      style={{
                        fontFamily: "inherit",
                        padding: "6px 14px",
                        borderRadius: "var(--r-sm)",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 800,
                        background: isCopied ? "rgba(16,185,129,0.15)" : "var(--hook)",
                        color: isCopied ? "#10b981" : "#fff",
                        transition: "all 0.15s",
                      }}
                    >
                      {isCopied ? "✓ 복사됨" : "쿠폰 받기"}
                    </button>
                  </div>
                  {isCopied && (
                    <div style={{
                      marginTop: 6, fontSize: 11, color: "#10b981",
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      borderRadius: 8, padding: "4px 8px",
                      fontWeight: 600,
                    }}>
                      코드 복사됨: <strong>{c.code}</strong> — 예약 시 입력하세요
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 업체 입점 배너 */}
      <div style={{ padding: "8px 16px 32px" }}>
        <Link href="/biz" style={{ textDecoration: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.12))",
            border: "1px solid var(--line-2)",
            borderRadius: "var(--r-card)",
            padding: "16px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-strong)", marginBottom: 3 }}>
                업체라면? 쿠폰 올리고 신규 고객 유치
              </div>
              <div style={{ fontSize: 11, color: "var(--text-dim)" }}>
                무료 입점 · 쿠폰 등록 · 노출 상위
              </div>
            </div>
            <div style={{
              fontSize: 13, fontWeight: 800,
              color: "var(--ocean-300)",
              display: "flex", alignItems: "center", gap: 2,
            }}>
              등록하기 →
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
