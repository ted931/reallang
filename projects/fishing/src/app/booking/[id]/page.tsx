"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const BUSINESSES = [
  { id: "b1", name: "한림 황금좌대", category: "좌대배낚시", region: "한림읍", fish: ["갈치", "볼락", "감성돔"], price: 15000, rating: 4.8, slots: 8, desc: "한림항 인근 황금 포인트 좌대. 갈치·볼락 시즌 최고의 조황을 자랑합니다. 초보자도 OK, 채비 대여 가능.", includes: "낚싯대 대여 가능 · 미끼 포함 · 구명조끼 제공", notice: "우천·강풍 시 당일 취소 가능 (전액 환불)", lat: "33.41", lng: "126.26" },
  { id: "b2", name: "서귀포 황우지 좌대", category: "좌대배낚시", region: "서귀포시", fish: ["감성돔", "참돔"], price: 18000, rating: 4.9, slots: 6, desc: "황우지 해안 절경 속 좌대 낚시. 감성돔·참돔 포인트로 유명하며 경관이 뛰어납니다.", includes: "낚싯대 대여 · 미끼 포함", notice: "예약 후 24시간 이내 취소 시 전액 환불", lat: "33.24", lng: "126.56" },
  { id: "b3", name: "성산 참돔호", category: "낚시 배편", region: "성산읍", fish: ["참돔", "광어", "방어"], price: 45000, rating: 4.7, slots: 10, desc: "성산포항 출발 참돔·광어 전문 선상낚시. 타이라바·지깅 모두 가능. 당일 조황 최신 정보 안내.", includes: "선상 낚시 채비 · 음료 제공", notice: "출항 2시간 전 취소 가능", lat: "33.47", lng: "126.92" },
  { id: "b4", name: "모슬포 방어킹", category: "낚시 배편", region: "대정읍", fish: ["방어", "참돔"], price: 55000, rating: 4.6, slots: 8, desc: "방어 시즌 제주 최고 포인트! 지깅 전문 가이드 동승. 대물 방어를 노려보세요.", includes: "지깅 채비 일부 제공 · 점심 도시락", notice: "기상 악화 시 전액 환불", lat: "33.22", lng: "126.25" },
  { id: "b5", name: "제주 낚시민박", category: "낚시 숙소", region: "제주시", fish: ["갈치", "농어", "볼락"], price: 60000, rating: 4.5, slots: 4, desc: "낚시꾼을 위한 전용 민박. 조황 정보 공유, 채비 세척 공간, 냉동고 완비.", includes: "조식 포함 · 채비 세척 · 냉동 보관", notice: "체크인 당일 취소 불가", lat: "33.50", lng: "126.52" },
  { id: "b6", name: "애월 바다펜션", category: "낚시 숙소", region: "애월읍", fish: ["감성돔", "볼락"], price: 80000, rating: 4.8, slots: 3, desc: "애월 바다 전망 프리미엄 낚시 펜션. 전용 낚시 포인트 안내, BBQ 가능.", includes: "조식 · BBQ · 낚시 포인트 안내", notice: "2일 전 취소 시 50% 환불", lat: "33.46", lng: "126.31" },
  { id: "b7", name: "협재 광어루어 보트", category: "낚시 배편", region: "한림읍", fish: ["광어", "농어"], price: 30000, rating: 4.4, slots: 4, desc: "협재 앞바다 소형 보트 루어 낚시. 광어·농어 전문 가이드. 소수 인원 맞춤 출조.", includes: "루어 채비 일부 제공", notice: "우천 시 전액 환불", lat: "33.39", lng: "126.24" },
  { id: "b8", name: "구좌 해녀좌대", category: "좌대배낚시", region: "구좌읍", fish: ["갈치", "우럭", "방어"], price: 20000, rating: 4.7, slots: 6, desc: "구좌 해녀마을 앞 좌대. 우럭·방어 시즌 최고. 해녀 할머니가 운영하는 정감 있는 곳.", includes: "낚싯대 대여 · 미끼", notice: "당일 취소 가능 (환불 100%)", lat: "33.55", lng: "126.87" },
  { id: "b9", name: "표선 감성돔 갯바위", category: "좌대배낚시", region: "표선면", fish: ["감성돔", "벵에돔"], price: 12000, rating: 4.6, slots: 5, desc: "표선 갯바위 감성돔·벵에돔 명포인트. 찌낚시 전문 가이드 운영.", includes: "기본 채비 포함", notice: "기상 악화 시 전액 환불", lat: "33.33", lng: "126.84" },
];

const CAT_COLOR: Record<string, string> = {
  "좌대배낚시": "#5fa3cf",
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
  const bookingNo = useMemo(() => `BK-${Math.floor(100000 + Math.random() * 900000)}`, []);

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
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "40px 20px 100px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", letterSpacing: "-0.5px", marginBottom: 8 }}>예약 신청 완료!</div>
        <div style={{ fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6, marginBottom: 24 }}>
          업체 확인 후 연락처로 연락이 옵니다<br />
          <strong style={{ color: "var(--hook)" }}>보통 1시간 이내</strong>
        </div>
        <div style={{ background: "var(--tint-04)", border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: 20, marginBottom: 24, textAlign: "left" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-mute)", marginBottom: 14, letterSpacing: 0.5 }}>예약 내역</div>
          {[
            { label: "예약번호", value: bookingNo },
            { label: "업체명", value: biz.name },
            { label: "날짜", value: date },
            { label: "인원", value: `${people}명` },
            { label: "예상 금액", value: `${totalPrice.toLocaleString()}원` },
            ...(tel ? [{ label: "연락처", value: tel }] : []),
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ fontSize: 13, color: "var(--text-dim)" }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: row.label === "예상 금액" ? "var(--hook)" : "var(--text-strong)" }}>{row.value}</span>
            </div>
          ))}
        </div>
        <Link href="/booking" style={{
          display: "block", padding: "14px", background: "var(--tint-06)", border: "1px solid var(--line)",
          borderRadius: "var(--r-sm)", fontSize: 14, fontWeight: 700, color: "var(--text)", textDecoration: "none",
        }}>← 다른 업체 보기</Link>
      </div>
    );
  }

  const catColor = CAT_COLOR[biz.category] ?? "var(--hook)";

  return (
    <>
      <style>{`
        .bk-grid { display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 768px) {
          .bk-grid { flex-direction: row; align-items: flex-start; }
          .bk-main { flex: 1; min-width: 0; }
          .bk-side { width: 340px; flex-shrink: 0; }
        }
      `}</style>

      <div style={{ padding: "0 20px 16px" }}>
        <Link href="/booking" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, padding: "16px 0 4px", fontWeight: 600 }}>
          ← 목록으로
        </Link>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px 100px" }}>
        <div className="bk-grid">

          {/* 좌측 — 업체 상세 */}
          <div className="bk-main">
            {/* 업체 헤더 카드 */}
            <div style={{ background: "var(--tint-04)", border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: 20, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800,
                  background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44`,
                }}>{biz.category}</span>
                <span style={{ fontSize: 13, color: "#fbbf24", fontWeight: 800 }}>⭐ {biz.rating}</span>
                <span style={{ fontSize: 11, color: "var(--text-mute)", marginLeft: "auto" }}>잔여 {biz.slots}자리</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", letterSpacing: "-0.5px", marginBottom: 6 }}>{biz.name}</div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 12 }}>
                📍 {biz.region} · {biz.fish.join(" · ")}
              </div>
              <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.8, margin: 0 }}>{biz.desc}</p>
            </div>

            {/* 포함 사항 */}
            <div style={{ background: "var(--tint-04)", border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: 20, marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "var(--text-strong)", marginBottom: 12 }}>포함 사항</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {biz.includes.split(" · ").map(item => (
                  <span key={item} style={{
                    background: "var(--tint-08)", border: "1px solid var(--line)",
                    borderRadius: 99, padding: "4px 12px", fontSize: 12, color: "var(--text)", fontWeight: 600,
                  }}>✓ {item}</span>
                ))}
              </div>
            </div>

            {/* 취소·환불 안내 */}
            <div style={{ background: "rgba(251,191,36,0.06)", border: "1px solid rgba(251,191,36,0.2)", borderRadius: "var(--r-card)", padding: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#fbbf24", marginBottom: 6 }}>⚠️ 취소·환불 안내</div>
              <div style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.7 }}>{biz.notice}</div>
            </div>
          </div>

          {/* 우측 — 예약 폼 */}
          <div className="bk-side">
            <div style={{ background: "var(--tint-04)", border: "1px solid var(--line)", borderRadius: "var(--r-card)", padding: 20, position: "sticky", top: 60 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text-strong)", marginBottom: 18 }}>예약 신청</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* 날짜 */}
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginBottom: 6 }}>날짜</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{
                    width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)",
                    background: "var(--tint-08)", border: "1px solid var(--line)",
                    color: "var(--text-strong)", fontSize: 14, fontFamily: "inherit",
                    outline: "none", boxSizing: "border-box",
                  }} />
                </div>

                {/* 인원 */}
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginBottom: 6 }}>인원</label>
                  <div style={{ display: "flex" }}>
                    <button onClick={() => setPeople(n => Math.max(1, n - 1))} style={{
                      width: 44, height: 44, borderRadius: "var(--r-sm) 0 0 var(--r-sm)",
                      background: "var(--tint-08)", border: "1px solid var(--line)", borderRight: "none",
                      color: "var(--text-strong)", fontSize: 18, cursor: "pointer", fontFamily: "inherit",
                    }}>−</button>
                    <div style={{
                      flex: 1, height: 44, display: "flex", alignItems: "center", justifyContent: "center",
                      background: "var(--tint-04)", border: "1px solid var(--line)",
                      fontSize: 15, fontWeight: 800, color: "var(--text-strong)",
                    }}>{people}명</div>
                    <button onClick={() => setPeople(n => Math.min(biz.slots, n + 1))} style={{
                      width: 44, height: 44, borderRadius: "0 var(--r-sm) var(--r-sm) 0",
                      background: "var(--tint-08)", border: "1px solid var(--line)", borderLeft: "none",
                      color: "var(--text-strong)", fontSize: 18, cursor: "pointer", fontFamily: "inherit",
                    }}>+</button>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 4 }}>최대 {biz.slots}명</div>
                </div>

                {/* 연락처 */}
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginBottom: 6 }}>연락처</label>
                  <input type="tel" placeholder="010-0000-0000" value={tel} onChange={e => setTel(e.target.value)} style={{
                    width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)",
                    background: "var(--tint-08)", border: "1px solid var(--line)",
                    color: "var(--text-strong)", fontSize: 14, fontFamily: "inherit",
                    outline: "none", boxSizing: "border-box",
                  }} />
                </div>

                {/* 메모 */}
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "var(--text-dim)", fontWeight: 700, marginBottom: 6 }}>메모 (선택)</label>
                  <textarea placeholder="특이사항이나 요청사항" value={memo} onChange={e => setMemo(e.target.value)} rows={2} style={{
                    width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)",
                    background: "var(--tint-08)", border: "1px solid var(--line)",
                    color: "var(--text-strong)", fontSize: 14, fontFamily: "inherit",
                    outline: "none", resize: "none", boxSizing: "border-box",
                  }} />
                </div>

                {/* 금액 */}
                <div style={{ background: "var(--tint-08)", borderRadius: "var(--r-sm)", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{people}명 × {biz.price.toLocaleString()}원</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "var(--hook)" }}>{totalPrice.toLocaleString()}원</span>
                </div>

                {/* 신청 버튼 */}
                <button onClick={() => setShowConfirm(true)} style={{
                  width: "100%", padding: "14px", borderRadius: "var(--r-sm)",
                  background: "var(--hook)", border: "none",
                  color: "#fff", fontSize: 15, fontWeight: 900,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  예약 신청하기
                </button>
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--text-mute)", marginTop: -8 }}>
                  수수료 없음 · 업체 직접 연락
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
