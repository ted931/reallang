"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

export const BUSINESSES = [
  { id: "b1", name: "한림 황금좌대", category: "좌대배낚시", region: "한림읍", fish: ["갈치", "볼락", "감성돔"], price: 15000, rating: 4.8, seats: "빈자리 있음", seatColor: "#22c55e" },
  { id: "b2", name: "서귀포 황우지 좌대", category: "좌대배낚시", region: "서귀포시", fish: ["감성돔", "참돔"], price: 18000, rating: 4.9, seats: "잔여 3자리", seatColor: "#22c55e" },
  { id: "b3", name: "성산 참돔호", category: "낚시 배편", region: "성산읍", fish: ["참돔", "광어", "방어"], price: 45000, rating: 4.7, seats: "빈자리 있음", seatColor: "#22c55e" },
  { id: "b4", name: "모슬포 방어킹", category: "낚시 배편", region: "대정읍", fish: ["방어", "참돔"], price: 55000, rating: 4.6, seats: "잔여 2자리", seatColor: "#f59e0b" },
  { id: "b5", name: "제주 낚시민박", category: "낚시 숙소", region: "제주시", fish: ["갈치", "농어", "볼락"], price: 60000, rating: 4.5, seats: "빈자리 있음", seatColor: "#22c55e" },
  { id: "b6", name: "애월 바다펜션", category: "낚시 숙소", region: "애월읍", fish: ["감성돔", "볼락"], price: 80000, rating: 4.8, seats: "빈자리 있음", seatColor: "#22c55e" },
  { id: "b7", name: "협재 광어루어 보트", category: "낚시 배편", region: "한림읍", fish: ["광어", "농어"], price: 30000, rating: 4.4, seats: "잔여 4자리", seatColor: "#22c55e" },
  { id: "b8", name: "구좌 해녀좌대", category: "좌대배낚시", region: "구좌읍", fish: ["갈치", "우럭", "방어"], price: 20000, rating: 4.7, seats: "빈자리 있음", seatColor: "#22c55e" },
  { id: "b9", name: "표선 감성돔 갯바위", category: "좌대배낚시", region: "표선면", fish: ["감성돔", "벵에돔"], price: 12000, rating: 4.6, seats: "빈자리 있음", seatColor: "#22c55e" },
];

const CATEGORY_COLOR: Record<string, string> = {
  "좌대배낚시": "var(--ocean-300)",
  "낚시 배편": "#fbbf24",
  "낚시 숙소": "#a78bfa",
};

const TABS = ["전체", "좌대·배낚시", "낚시 숙소", "낚시 배편"];

const TAB_MAP: Record<string, string> = {
  "좌대·배낚시": "좌대배낚시",
  "낚시 숙소": "낚시 숙소",
  "낚시 배편": "낚시 배편",
};

export default function BookingPage() {
  const [tab, setTab] = useState("전체");

  const filtered = useMemo(() => {
    if (tab === "전체") return BUSINESSES;
    return BUSINESSES.filter((b) => b.category === TAB_MAP[tab]);
  }, [tab]);

  return (
    <>
      {/* 히어로 */}
      <section className="fl-hero">
        <div className="fl-hero-glow" />
        <div className="fl-hero-content">
          <div className="fl-hero-greet">BOOKING</div>
          <h1 className="fl-hero-title">간편 예약</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", margin: 0 }}>
            숙소·배편·좌대 한 곳에서 — 수수료 0원
          </p>
        </div>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      {/* 카테고리 탭 */}
      <div className="fl-cm-tabs" style={{ paddingTop: 16 }}>
        {TABS.map((t) => (
          <button
            key={t}
            className={`fl-cm-tab ${tab === t ? "on" : ""}`}
            style={{ fontFamily: "inherit" }}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 결과 수 */}
      <div style={{ padding: "0 20px 12px", fontSize: 12, color: "var(--text-dim)" }}>
        <strong style={{ color: "var(--text-strong)" }}>{filtered.length}</strong>개 업체
      </div>

      {/* 업체 카드 리스트 */}
      <style>{`
        @media (min-width: 768px) {
          .booking-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; max-width: 960px; margin: 0 auto; }
        }
      `}</style>
      <div className="booking-grid" style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 20px" }}>
        {filtered.map((b) => (
          <div key={b.id} style={{
            background: "var(--ocean-900)", border: "1px solid var(--line-2)",
            borderRadius: "var(--r-card)", padding: 18,
          }}>
            {/* 상단: 배지 + 평점 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{
                padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                background: `${CATEGORY_COLOR[b.category]}22`,
                color: CATEGORY_COLOR[b.category],
                border: `1px solid ${CATEGORY_COLOR[b.category]}44`,
              }}>
                {b.category}
              </span>
              <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 800 }}>⭐ {b.rating}</span>
            </div>

            {/* 업체명 */}
            <div style={{ fontSize: 17, fontWeight: 900, color: "var(--text-strong)", marginBottom: 4, letterSpacing: "-0.3px" }}>
              {b.name}
            </div>

            {/* 지역 + 어종 태그 */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "var(--text-dim)" }}>📍 {b.region}</span>
              {b.fish.map((f) => (
                <span key={f} style={{
                  padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: "var(--tint-06)", color: "var(--text-dim)",
                  border: "1px solid var(--line)",
                }}>
                  {f}
                </span>
              ))}
            </div>

            {/* 가격 + 잔여 + 예약 버튼 */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: 16, fontWeight: 900, color: "var(--hook)", letterSpacing: "-0.3px" }}>
                  {b.price.toLocaleString()}원~
                </span>
                <span style={{ fontSize: 11, color: "var(--text-mute)", marginLeft: 4 }}>1인</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: `${b.seatColor}18`, color: b.seatColor,
                  border: `1px solid ${b.seatColor}44`,
                }}>
                  {b.seats}
                </span>
                <Link href={`/booking/${b.id}`} style={{
                  padding: "8px 16px", borderRadius: "var(--r-sm)", fontSize: 13, fontWeight: 800,
                  background: "var(--hook)", color: "#fff", textDecoration: "none",
                  fontFamily: "inherit",
                }}>
                  예약하기
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 안내 배너 */}
      <div style={{
        margin: "20px 20px 100px",
        maxWidth: 960, marginLeft: "auto", marginRight: "auto",
        background: "var(--ocean-900)",
        border: "2px solid var(--hook)",
        borderRadius: "var(--r-card)", padding: 18,
      }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: "var(--hook)", marginBottom: 8 }}>💳 결제는 어떻게?</div>
        <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>
          예약 확정 후 업체에서 직접 안내드립니다. 현장결제·계좌이체 모두 가능. 수수료 없음.
        </div>
      </div>
    </>
  );
}
