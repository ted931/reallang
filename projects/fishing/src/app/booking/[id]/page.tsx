"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const BUSINESSES = [
  { id: "b1", name: "한림 황금좌대", category: "좌대배낚시", region: "한림읍", fish: ["갈치", "볼락", "감성돔"], price: 15000, rating: 4.8 },
  { id: "b2", name: "서귀포 황우지 좌대", category: "좌대배낚시", region: "서귀포시", fish: ["감성돔", "참돔"], price: 18000, rating: 4.9 },
  { id: "b3", name: "성산 참돔호", category: "낚시 배편", region: "성산읍", fish: ["참돔", "광어", "방어"], price: 45000, rating: 4.7 },
  { id: "b4", name: "모슬포 방어킹", category: "낚시 배편", region: "대정읍", fish: ["방어", "참돔"], price: 55000, rating: 4.6 },
  { id: "b5", name: "제주 낚시민박", category: "낚시 숙소", region: "제주시", fish: ["갈치", "농어", "볼락"], price: 60000, rating: 4.5 },
  { id: "b6", name: "애월 바다펜션", category: "낚시 숙소", region: "애월읍", fish: ["감성돔", "볼락"], price: 80000, rating: 4.8 },
  { id: "b7", name: "협재 광어루어 보트", category: "낚시 배편", region: "한림읍", fish: ["광어", "농어"], price: 30000, rating: 4.4 },
  { id: "b8", name: "구좌 해녀좌대", category: "좌대배낚시", region: "구좌읍", fish: ["갈치", "우럭", "방어"], price: 20000, rating: 4.7 },
  { id: "b9", name: "표선 감성돔 갯바위", category: "좌대배낚시", region: "표선면", fish: ["감성돔", "벵에돔"], price: 12000, rating: 4.6 },
];

const CATEGORY_COLOR: Record<string, string> = {
  "좌대배낚시": "var(--ocean-300)",
  "낚시 배편": "#fbbf24",
  "낚시 숙소": "#a78bfa",
};

export default function BookingDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const biz = BUSINESSES.find((b) => b.id === id);

  const [date, setDate] = useState("2026-05-15");
  const [people, setPeople] = useState(2);
  const [tel, setTel] = useState("");
  const [memo, setMemo] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const totalPrice = useMemo(() => (biz ? biz.price * people : 0), [biz, people]);

  if (!biz) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>😢</div>
        <div style={{ fontSize: 16, color: "var(--text-strong)", fontWeight: 700, marginBottom: 8 }}>업체를 찾을 수 없습니다</div>
        <Link href="/booking" style={{ color: "var(--hook)", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
          ← 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  if (showConfirm) {
    return (
      <div style={{ padding: "40px 20px", maxWidth: 480, margin: "0 auto" }}>
        {/* 완료 헤더 */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", letterSpacing: "-0.5px", marginBottom: 8 }}>
            예약 신청 완료!
          </div>
          <div style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6 }}>
            업체 확인 후 연락처로 연락이 옵니다<br />
            <strong style={{ color: "var(--hook)" }}>보통 1시간 이내</strong>
          </div>
        </div>

        {/* 예약 내역 카드 */}
        <div style={{
          background: "var(--ocean-900)", border: "1px solid var(--line-2)",
          borderRadius: "var(--r-card)", padding: 20, marginBottom: 24,
        }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-mute)", letterSpacing: 0.5, marginBottom: 14 }}>
            예약 내역
          </div>
          {[
            { label: "업체명", value: biz.name },
            { label: "카테고리", value: biz.category },
            { label: "날짜", value: date },
            { label: "인원", value: `${people}명` },
            { label: "예상 금액", value: `${totalPrice.toLocaleString()}원` },
          ].map((row) => (
            <div key={row.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "9px 0", borderBottom: "1px solid var(--line)",
            }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{row.label}</span>
              <span style={{
                fontSize: 13, fontWeight: 700, color: "var(--text-strong)",
                ...(row.label === "예상 금액" ? { color: "var(--hook)", fontSize: 16 } : {}),
              }}>
                {row.value}
              </span>
            </div>
          ))}
          {tel && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 9 }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>연락처</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)" }}>{tel}</span>
            </div>
          )}
        </div>

        <Link href="/booking" style={{
          display: "block", textAlign: "center", padding: "14px",
          background: "var(--tint-06)", border: "1px solid var(--line-2)",
          borderRadius: "var(--r-sm)", fontSize: 14, fontWeight: 700,
          color: "var(--text)", textDecoration: "none",
        }}>
          ← /booking 으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 60px" }}>
      {/* 뒤로가기 */}
      <Link href="/booking" style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 13, color: "var(--ocean-300)", textDecoration: "none",
        padding: "16px 0 12px", fontWeight: 700,
      }}>
        ← 목록으로
      </Link>

      {/* 업체 헤더 */}
      <div style={{
        background: "var(--ocean-900)", border: "1px solid var(--line-2)",
        borderRadius: "var(--r-card)", padding: 18, marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{
            padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800,
            background: `${CATEGORY_COLOR[biz.category] ?? "var(--hook)"}22`,
            color: CATEGORY_COLOR[biz.category] ?? "var(--hook)",
            border: `1px solid ${CATEGORY_COLOR[biz.category] ?? "var(--hook)"}44`,
          }}>
            {biz.category}
          </span>
          <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 800 }}>⭐ {biz.rating}</span>
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text-strong)", letterSpacing: "-0.4px", marginBottom: 4 }}>
          {biz.name}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-dim)" }}>
          📍 {biz.region} · {biz.fish.join(" · ")}
        </div>
      </div>

      {/* 예약 폼 */}
      <div style={{
        background: "var(--ocean-900)", border: "1px solid var(--line-2)",
        borderRadius: "var(--r-card)", padding: 20, marginBottom: 16,
        display: "flex", flexDirection: "column", gap: 18,
      }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text-dim)", letterSpacing: 0.5 }}>예약 정보 입력</div>

        {/* 날짜 */}
        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginBottom: 6 }}>
            날짜
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              width: "100%", padding: "11px 14px", borderRadius: "var(--r-sm)",
              background: "var(--tint-05)", border: "1px solid var(--line-2)",
              color: "var(--text-strong)", fontSize: 14, fontFamily: "inherit",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* 인원 */}
        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginBottom: 6 }}>
            인원
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <button
              onClick={() => setPeople((n) => Math.max(1, n - 1))}
              style={{
                width: 40, height: 40, borderRadius: "var(--r-sm) 0 0 var(--r-sm)",
                background: "var(--ocean-800)", border: "1px solid var(--line-2)",
                color: "var(--text-strong)", fontSize: 18, cursor: "pointer",
                fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >−</button>
            <div style={{
              flex: 1, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--tint-05)", borderTop: "1px solid var(--line-2)", borderBottom: "1px solid var(--line-2)",
              fontSize: 16, fontWeight: 800, color: "var(--text-strong)",
            }}>
              {people}명
            </div>
            <button
              onClick={() => setPeople((n) => Math.min(20, n + 1))}
              style={{
                width: 40, height: 40, borderRadius: "0 var(--r-sm) var(--r-sm) 0",
                background: "var(--ocean-800)", border: "1px solid var(--line-2)",
                color: "var(--text-strong)", fontSize: 18, cursor: "pointer",
                fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >+</button>
          </div>
        </div>

        {/* 연락처 */}
        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginBottom: 6 }}>
            연락처
          </label>
          <input
            type="tel"
            placeholder="010-0000-0000"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            style={{
              width: "100%", padding: "11px 14px", borderRadius: "var(--r-sm)",
              background: "var(--tint-05)", border: "1px solid var(--line-2)",
              color: "var(--text-strong)", fontSize: 14, fontFamily: "inherit",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* 메모 */}
        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginBottom: 6 }}>
            메모 (선택)
          </label>
          <textarea
            placeholder="특이사항이나 요청사항을 적어주세요"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            style={{
              width: "100%", padding: "11px 14px", borderRadius: "var(--r-sm)",
              background: "var(--tint-05)", border: "1px solid var(--line-2)",
              color: "var(--text-strong)", fontSize: 14, fontFamily: "inherit",
              outline: "none", resize: "vertical", boxSizing: "border-box",
            }}
          />
        </div>

        {/* 예상 금액 */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 16px", background: "var(--tint-06)",
          borderRadius: "var(--r-sm)", border: "1px solid var(--line)",
        }}>
          <div style={{ fontSize: 13, color: "var(--text-dim)" }}>
            예상 금액 ({people}명 × {biz.price.toLocaleString()}원)
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: "var(--hook)", letterSpacing: "-0.4px" }}>
            {totalPrice.toLocaleString()}원
          </div>
        </div>
      </div>

      {/* 예약 신청 버튼 */}
      <button
        onClick={() => setShowConfirm(true)}
        style={{
          width: "100%", padding: "16px", borderRadius: "var(--r-card)",
          background: "var(--hook)", border: "none",
          color: "#fff", fontSize: 16, fontWeight: 900,
          cursor: "pointer", letterSpacing: "-0.3px",
          fontFamily: "inherit",
        }}
      >
        예약 신청하기 — {totalPrice.toLocaleString()}원
      </button>
      <div style={{ textAlign: "center", marginTop: 8, fontSize: 12, color: "var(--text-mute)" }}>
        수수료 없음 · 업체 직접 연락
      </div>
    </div>
  );
}
