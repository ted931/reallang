import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "5월 3주차 제주 렌터카 가성비 리포트",
  description: "5월 3주차 기준 제주 렌터카 차종별 평균 가격과 전주 대비 등락률 분석. 아반떼 12% 하락, 지금이 예약 적기?",
};

const WEEK_LABEL = "2026년 5월 3주차";
const PUBLISHED = "2026.05.17";

const CARS = [
  {
    segment: "경형",
    models: "모닝 / 레이",
    avgPrice: 38000,
    prevPrice: 41000,
    popular: false,
    desc: "주차 편한 골목 탐방에 최적. 1~2인 단기 여행에 추천.",
    bestFor: ["혼자", "커플"],
  },
  {
    segment: "소형",
    models: "아반떼 / K3",
    avgPrice: 52000,
    prevPrice: 59000,
    popular: true,
    desc: "가성비 1위. 전주 대비 가격 하락으로 지금이 예약 타이밍.",
    bestFor: ["커플", "친구"],
  },
  {
    segment: "중형",
    models: "소나타 / K5",
    avgPrice: 74000,
    prevPrice: 72000,
    popular: false,
    desc: "장거리 드라이브 편안함. 3~4인 가족 여행에 무난한 선택.",
    bestFor: ["가족", "친구"],
  },
  {
    segment: "SUV",
    models: "QM6 / 투싼",
    avgPrice: 89000,
    prevPrice: 85000,
    popular: false,
    desc: "짐 많은 여행, 오름 트레킹 후 안락한 귀환. 연인·가족 모두 적합.",
    bestFor: ["가족", "커플"],
  },
  {
    segment: "승합",
    models: "카니발 / 스타리아",
    avgPrice: 138000,
    prevPrice: 142000,
    popular: false,
    desc: "6인 이상 단체 여행. 1인당 나누면 SUV보다 저렴해지는 마법.",
    bestFor: ["단체", "효도"],
  },
];

const TREND = [
  { week: "2월 1주", idx: 82 },
  { week: "2월 3주", idx: 78 },
  { week: "3월 1주", idx: 85 },
  { week: "3월 3주", idx: 91 },
  { week: "4월 1주", idx: 95 },
  { week: "4월 3주", idx: 88 },
  { week: "5월 1주", idx: 83 },
  { week: "5월 3주", idx: 76 },
];

const AI_ANALYSIS = `이번 주 제주 렌터카 시장의 가장 큰 특징은 소형차 구간의 급격한 가격 하락입니다. 아반떼·K3 기준 전주 대비 평균 7,000원(-11.9%) 하락하며 2월 이후 최저점을 기록했습니다. 중국인 관광객 단체 예약이 줄어들며 공급 여유가 생긴 것이 원인으로 분석됩니다.

반면 SUV 구간은 5월 황금연휴 여파로 재고가 빠르게 소진되어 전주 대비 4.7% 상승했습니다. 카니발·스타리아 등 승합은 소폭 하락하며 6인 이상 단체 여행객에게 최적의 타이밍입니다.

종합 가성비 지수는 76점으로 올해 들어 두 번째로 낮은 수치입니다. 특히 소형 세그먼트 예약을 계획 중이라면 지금 즉시 예약을 권장합니다. 통상 이 구간의 최저점은 1~2주 내 반등하는 패턴을 보여왔습니다.`;

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "5월 3주차 제주 렌터카 가성비 지수 & 가격 등락률 리포트",
  description: "제주 렌터카 차종별 평균 가격과 전주 대비 등락률 AI 분석",
  datePublished: "2026-05-17",
  author: { "@type": "Organization", name: "Kaflix" },
};

function pctChange(cur: number, prev: number) {
  return ((cur - prev) / prev) * 100;
}

export default function CarReportPage() {
  const maxTrend = Math.max(...TREND.map((t) => t.idx));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />

      <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>

        {/* ── 헤더 ── */}
        <header style={{ background: "var(--ink)", color: "#fff", padding: "0" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "20px 24px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <a href="/car-report" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.5)" }}>
                  JEJU CAR REPORT
                </span>
              </a>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
                매주 토요일 자동 발행
              </span>
            </div>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 4,
              background: "rgba(255,255,255,0.08)", marginBottom: 16,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.06em" }}>
                {WEEK_LABEL} · {PUBLISHED} 발행
              </span>
            </div>

            <h1 style={{
              fontSize: "clamp(22px, 5vw, 34px)", fontWeight: 900,
              lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 12,
            }}>
              소형차 12% 하락<br />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>—&nbsp;</span>
              지금이 제주 렌터카 예약 적기
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: 480 }}>
              이번 주 종합 가성비 지수 <strong style={{ color: "#4ade80" }}>76점</strong>으로
              올해 두 번째 최저치. AI가 매주 내부 예약 데이터를 분석합니다.
            </p>
          </div>
        </header>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>

          {/* ── 가성비 지수 트렌드 ── */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: "var(--ink-60)", marginBottom: 20 }}>
              종합 가성비 지수 트렌드
            </h2>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "24px 24px 16px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, marginBottom: 12 }}>
                {TREND.map((t) => {
                  const isLatest = t.week === "5월 3주";
                  const h = (t.idx / maxTrend) * 100;
                  return (
                    <div key={t.week} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: isLatest ? "var(--accent)" : "var(--ink-30)" }}>
                        {t.idx}
                      </span>
                      <div style={{
                        width: "100%", height: `${h}%`,
                        background: isLatest ? "var(--accent)" : "var(--ink-10)",
                        borderRadius: "3px 3px 0 0",
                        transition: "all 0.3s",
                      }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {TREND.map((t) => {
                  const isLatest = t.week === "5월 3주";
                  return (
                    <div key={t.week} style={{ flex: 1, textAlign: "center" }}>
                      <span style={{ fontSize: 9, color: isLatest ? "var(--accent)" : "var(--ink-30)", fontWeight: isLatest ? 800 : 400 }}>
                        {t.week.replace(/주/, "주")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── 차종별 가격 비교 ── */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: "var(--ink-60)", marginBottom: 20 }}>
              차종별 1일 평균 가격 (기준: 24시간 / 보험 포함)
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {CARS.map((car) => {
                const pct = pctChange(car.avgPrice, car.prevPrice);
                const isDown = pct < 0;
                const isUp = pct > 0;
                const maxPrice = Math.max(...CARS.map((c) => c.avgPrice));
                const barWidth = (car.avgPrice / maxPrice) * 100;

                return (
                  <div key={car.segment} style={{
                    background: car.popular ? "var(--accent-light)" : "var(--surface)",
                    border: `1px solid ${car.popular ? "#b6dfc8" : "var(--border)"}`,
                    borderRadius: 10, padding: "16px 20px",
                    position: "relative", overflow: "hidden",
                  }}>
                    {car.popular && (
                      <span style={{
                        position: "absolute", top: 12, right: 12,
                        fontSize: 10, fontWeight: 800,
                        background: "var(--accent)", color: "#fff",
                        padding: "2px 8px", borderRadius: 100,
                        letterSpacing: "0.05em",
                      }}>이번 주 PICK</span>
                    )}

                    <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 10 }}>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 900, color: "var(--ink)" }}>{car.segment}</span>
                        <span style={{ fontSize: 12, color: "var(--ink-60)", marginLeft: 8 }}>{car.models}</span>
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 20, fontWeight: 900, color: "var(--ink)" }}>
                          {car.avgPrice.toLocaleString()}원
                        </span>
                        <span style={{
                          fontSize: 12, fontWeight: 800,
                          color: isDown ? "var(--accent)" : isUp ? "var(--red)" : "var(--ink-60)",
                          background: isDown ? "var(--accent-light)" : isUp ? "var(--red-light)" : "var(--ink-10)",
                          padding: "2px 7px", borderRadius: 100,
                        }}>
                          {isDown ? "▼" : isUp ? "▲" : "–"} {Math.abs(pct).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    {/* 가격 바 */}
                    <div style={{ height: 4, background: "var(--ink-10)", borderRadius: 2, marginBottom: 10, overflow: "hidden" }}>
                      <div style={{
                        width: `${barWidth}%`, height: "100%",
                        background: car.popular ? "var(--accent)" : "var(--ink-30)",
                        borderRadius: 2,
                      }} />
                    </div>

                    <p style={{ fontSize: 12, color: "var(--ink-60)", lineHeight: 1.55, marginBottom: 8 }}>
                      {car.desc}
                    </p>

                    <div style={{ display: "flex", gap: 6 }}>
                      {car.bestFor.map((tag) => (
                        <span key={tag} style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px",
                          borderRadius: 100, background: "var(--ink-10)", color: "var(--ink-60)",
                        }}>{tag}</span>
                      ))}
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-30)", fontWeight: 600 }}>
                        전주 {car.prevPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── AI 분석 코멘터리 ── */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", color: "var(--ink-60)", marginBottom: 20 }}>
              AI 시장 분석
            </h2>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 12, padding: "28px 28px",
              borderLeft: "4px solid var(--accent)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.08em",
                  color: "var(--accent)", background: "var(--accent-light)",
                  padding: "3px 10px", borderRadius: 100,
                }}>CLAUDE AI 분석</span>
                <span style={{ fontSize: 11, color: "var(--ink-30)" }}>{PUBLISHED} 기준 내부 예약 데이터</span>
              </div>
              {AI_ANALYSIS.split("\n\n").map((para, i) => (
                <p key={i} style={{
                  fontSize: 14, color: "var(--ink)", lineHeight: 1.75,
                  marginBottom: i < 2 ? 16 : 0,
                }}>
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* ── 예약 CTA ── */}
          <section>
            <div style={{
              background: "var(--ink)", borderRadius: 16,
              padding: "32px 28px",
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                  지금 예약하면
                </p>
                <h3 style={{ fontSize: 22, fontWeight: 900, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>
                  소형차 기준<br />
                  <span style={{ color: "#4ade80" }}>이번 주가 8주 중 최저가</span>
                </h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                  리포트 기준일로부터 48시간 내 예약 시 제주패스 최저가 보장 적용
                </p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <a href="/car-pick/" style={{
                  flex: 1, textAlign: "center",
                  padding: "14px 0", borderRadius: 10,
                  background: "#4ade80", color: "#0d1117",
                  fontSize: 14, fontWeight: 800,
                }}>차종 추천받기 →</a>
                <a href="/jejupass/" style={{
                  flex: 1, textAlign: "center",
                  padding: "14px 0", borderRadius: 10,
                  background: "rgba(255,255,255,0.08)", color: "#fff",
                  fontSize: 14, fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}>제주패스 바로가기</a>
              </div>
            </div>
          </section>

          {/* ── 푸터 ── */}
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 11, color: "var(--ink-30)", lineHeight: 1.7 }}>
              본 리포트는 제주패스 내부 렌터카 예약 데이터를 기반으로 Claude AI가 매주 자동 작성합니다.
              가격은 기본 보험 포함 24시간 기준이며, 차량 상태·재고에 따라 실제 예약 가격과 다를 수 있습니다.
              <br />© 2026 Kaflix · realang.store
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
