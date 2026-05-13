"use client";
import { useState } from "react";

const PACKAGES = [
  {
    id: "birthday",
    emoji: "🎂",
    title: "생일파티 크루즈",
    desc: "배 위에서 주인공이 되는 하루. 케이터링, 케이크, 음향 장비까지 — 필요한 건 다 있습니다.",
    pax: "최대 15명",
    duration: "3시간",
    price: "189,000원~/인",
    tags: ["케이터링 포함", "케이크 옵션", "음향 시스템", "포토 서비스"],
    accent: "#f59e0b",
  },
  {
    id: "team",
    emoji: "🏢",
    title: "기업 팀빌딩",
    desc: "바다 위 낚시 대결부터 BBQ 파티까지. 딱딱한 회의실을 탈출해 진짜 팀워크를 만드세요.",
    pax: "최대 30명",
    duration: "반일 (4~5시간)",
    price: "139,000원~/인",
    tags: ["낚시 대결", "BBQ 갑판", "레크레이션", "단체 사진"],
    accent: "#3b82f6",
  },
  {
    id: "propose",
    emoji: "💍",
    title: "프러포즈 패키지",
    desc: "석양이 물드는 제주 바다 위, 세상에서 가장 특별한 순간. 샴페인과 꽃다발이 준비됩니다.",
    pax: "2인 전용",
    duration: "2시간",
    price: "490,000원",
    tags: ["석양 코스", "샴페인", "꽃다발", "프라이빗 데크"],
    accent: "#ec4899",
  },
  {
    id: "sunset",
    emoji: "🌅",
    title: "선셋 크루즈",
    desc: "제주 수평선 너머로 사라지는 태양. 음료 한 잔 들고 누구와도 즐길 수 있는 황혼 크루즈.",
    pax: "최대 20명",
    duration: "1.5시간",
    price: "79,000원~/인",
    tags: ["음료 포함", "석양 포인트", "스낵바", "오픈 데크"],
    accent: "#f97316",
  },
];

const REVIEWS = [
  {
    id: 1,
    pkg: "생일파티 크루즈",
    text: "생일파티로 갔는데 인생 최고의 날이었어요. 케이터링 음식도 맛있고 스태프분들이 너무 세심하게 챙겨주셔서 감동받았습니다.",
    author: "김지수",
    date: "2025.11.03",
    rating: 5,
  },
  {
    id: 2,
    pkg: "프러포즈 패키지",
    text: "프러포즈 성공했습니다! 석양이 지는 타이밍에 딱 맞춰주셔서 완벽했어요. 평생 잊지 못할 추억이 될 것 같아요.",
    author: "박민준",
    date: "2025.10.18",
    rating: 5,
  },
  {
    id: 3,
    pkg: "기업 팀빌딩",
    text: "회사 워크샵을 선상파티로 진행했는데 역대급 반응이었어요. 낚시 대결에 다들 열심히 하시더라고요. 내년에도 꼭 다시 올게요.",
    author: "이현아 (팀장)",
    date: "2025.09.27",
    rating: 5,
  },
];

const VESSELS = [
  {
    id: "v1",
    name: "제주파티 1호 — 블루오션",
    capacity: "최대 30명",
    features: ["케이터링룸", "BBQ 갑판", "음향 시스템", "야외 선베드"],
    note: "팀빌딩·생일파티 최적",
    emoji: "🛥️",
  },
  {
    id: "v2",
    name: "제주파티 2호 — 선셋퀸",
    capacity: "최대 20명",
    features: ["프라이빗 데크", "스낵바", "조명 세트", "블루투스 스피커"],
    note: "선셋 크루즈·소규모 파티 전용",
    emoji: "⛵",
  },
  {
    id: "v3",
    name: "제주파티 3호 — 로맨틱",
    capacity: "최대 6명",
    features: ["샴페인 서비스", "꽃장식", "촛불 테이블", "프라이빗 선미"],
    note: "프러포즈·커플 전용",
    emoji: "🚢",
  },
];

export default function SeongsangPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("birthday");
  const [selectedVessel, setSelectedVessel] = useState("");
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("");
  const [contact, setContact] = useState("");
  const [request, setRequest] = useState("");

  function openModal(pkgId: string, vesselId = "") {
    setSelectedPkg(pkgId);
    setSelectedVessel(vesselId);
    setModalOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setModalOpen(false);
    setDate(""); setPax(""); setContact(""); setRequest("");
    alert("문의가 접수됐습니다. 24시간 내 연락드립니다.");
  }

  return (
    <>
      <style>{`
        .sp-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 20px 100px;
        }
        .sp-pkg-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 768px) {
          .sp-pkg-grid {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);
          }
          .sp-vessel-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr);
          }
          .sp-review-grid {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .sp-pkg-card {
          background: var(--ocean-900);
          border: 1.5px solid var(--line-2);
          border-radius: var(--r-card);
          padding: 24px 22px 20px;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .sp-pkg-card:hover {
          border-color: var(--tint-15);
          box-shadow: 0 4px 24px var(--tint-08);
        }
        .sp-tag {
          display: inline-flex;
          align-items: center;
          padding: 3px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          background: var(--tint-06);
          border: 1px solid var(--line);
          color: var(--text-dim);
        }
        .sp-btn-primary {
          display: inline-block;
          padding: 11px 22px;
          border-radius: var(--r-sm);
          font-size: 14px;
          font-weight: 800;
          background: var(--hook);
          color: #fff;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.15s;
        }
        .sp-btn-primary:hover { opacity: 0.88; }
        .sp-btn-ghost {
          display: inline-block;
          padding: 10px 20px;
          border-radius: var(--r-sm);
          font-size: 13px;
          font-weight: 700;
          background: transparent;
          color: var(--hook);
          border: 1.5px solid var(--hook);
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .sp-btn-ghost:hover { background: var(--tint-04); }
        /* 모달 */
        .sp-modal-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55);
          z-index: 200;
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .sp-modal {
          background: var(--ocean-950);
          border: 1.5px solid var(--line-2);
          border-radius: var(--r-card);
          width: 100%;
          max-width: 480px;
          padding: 28px 24px 24px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .sp-form-row {
          margin-bottom: 14px;
        }
        .sp-form-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);
          margin-bottom: 5px;
        }
        .sp-form-input {
          width: 100%;
          background: var(--tint-04);
          border: 1.5px solid var(--line-2);
          border-radius: var(--r-sm);
          padding: 10px 13px;
          font-size: 14px;
          color: var(--text-strong);
          font-family: inherit;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.15s;
        }
        .sp-form-input:focus { border-color: var(--hook); }
        .sp-radio-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sp-radio-label {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px 13px;
          border-radius: var(--r-sm);
          border: 1.5px solid var(--line-2);
          background: var(--tint-04);
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: var(--text);
          transition: border-color 0.15s;
        }
        .sp-radio-label.selected {
          border-color: var(--hook);
          background: var(--tint-08);
          color: var(--text-strong);
        }
        .sp-vessel-card {
          background: var(--ocean-900);
          border: 1.5px solid var(--line-2);
          border-radius: var(--r-card);
          padding: 22px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .sp-stat-box {
          text-align: center;
        }
        .sp-review-card {
          background: var(--ocean-900);
          border: 1.5px solid var(--line-2);
          border-radius: var(--r-card);
          padding: 20px;
        }
      `}</style>

      {/* 히어로 */}
      <section className="fl-hero">
        <div className="fl-hero-glow" />
        <div className="fl-hero-content">
          <div className="fl-hero-greet">🛥️ PARTY CRUISE</div>
          <h1 className="fl-hero-title">선상파티</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.75)", margin: "6px 0 0", fontWeight: 600 }}>
            제주 바다 위에서 특별한 순간을
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
            {["🎣 낚시", "🎉 파티", "🌅 선셋", "🍽️ 케이터링"].map((tag) => (
              <span key={tag} style={{
                padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700,
                background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>{tag}</span>
            ))}
          </div>
        </div>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      <div className="sp-wrap">

        {/* 패키지 카드 */}
        <div style={{ padding: "32px 0 8px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--hook)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>PACKAGES</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", margin: 0, letterSpacing: "-0.4px" }}>
            어떤 파티를 원하세요?
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6, marginBottom: 24 }}>
            배 한 척 통째로 — 당신의 이야기를 바다 위에서
          </p>
          <div className="sp-pkg-grid">
            {PACKAGES.map((pkg) => (
              <div key={pkg.id} className="sp-pkg-card">
                {/* 이모지 이미지 영역 */}
                <div style={{
                  background: `${pkg.accent}12`,
                  border: `1.5px solid ${pkg.accent}30`,
                  borderRadius: "var(--r-sm)",
                  height: 100,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 52,
                  marginBottom: 18,
                }}>
                  {pkg.emoji}
                </div>

                {/* 제목 */}
                <div style={{ fontSize: 18, fontWeight: 900, color: "var(--text-strong)", marginBottom: 6, letterSpacing: "-0.3px" }}>
                  {pkg.title}
                </div>

                {/* 설명 */}
                <p style={{ fontSize: 13, color: "var(--text-dim)", lineHeight: 1.65, margin: "0 0 14px" }}>
                  {pkg.desc}
                </p>

                {/* 태그 */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                  {pkg.tags.map((t) => (
                    <span key={t} className="sp-tag">{t}</span>
                  ))}
                </div>

                {/* 스펙 */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4,
                  background: "var(--tint-04)", borderRadius: "var(--r-sm)", padding: "10px 12px",
                  marginBottom: 18, border: "1px solid var(--line)",
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "var(--text-mute)", fontWeight: 700, marginBottom: 2 }}>인원</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-strong)" }}>{pkg.pax}</div>
                  </div>
                  <div style={{ textAlign: "center", borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)" }}>
                    <div style={{ fontSize: 10, color: "var(--text-mute)", fontWeight: 700, marginBottom: 2 }}>소요</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "var(--text-strong)" }}>{pkg.duration}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "var(--text-mute)", fontWeight: 700, marginBottom: 2 }}>가격</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: pkg.accent }}>{pkg.price}</div>
                  </div>
                </div>

                <button className="sp-btn-primary" style={{ width: "100%" }} onClick={() => openModal(pkg.id)}>
                  예약 문의하기
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 신뢰 지표 */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3,1fr)",
          gap: 12, margin: "40px 0",
          background: "var(--tint-04)", border: "1.5px solid var(--line-2)",
          borderRadius: "var(--r-card)", padding: "24px 16px",
        }}>
          {[
            { value: "347회", label: "누적 파티" },
            { value: "4.9 ⭐", label: "평균 평점" },
            { value: "68%", label: "재예약률" },
          ].map((stat) => (
            <div key={stat.label} className="sp-stat-box">
              <div style={{ fontSize: 26, fontWeight: 900, color: "var(--hook)", letterSpacing: "-0.5px" }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-mute)", fontWeight: 700, marginTop: 3 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 후기 섹션 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--hook)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>REVIEWS</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", margin: "0 0 20px", letterSpacing: "-0.4px" }}>
            실제 고객 후기
          </h2>
          <div className="sp-review-grid" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {REVIEWS.map((r) => (
              <div key={r.id} className="sp-review-card">
                <div style={{ display: "flex", gap: 1, marginBottom: 10 }}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <span key={i} style={{ fontSize: 14, color: "#f59e0b" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, margin: "0 0 14px" }}>
                  "{r.text}"
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{
                    padding: "3px 9px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                    background: "var(--tint-06)", border: "1px solid var(--line)",
                    color: "var(--text-dim)",
                  }}>{r.pkg}</span>
                  <span style={{ fontSize: 12, color: "var(--text-mute)" }}>
                    {r.author} · {r.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 운영 선박 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--hook)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>VESSELS</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
            운영 선박
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 0, marginBottom: 20 }}>
            파티 목적에 최적화된 3척이 대기 중입니다
          </p>
          <div className="sp-vessel-grid" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {VESSELS.map((v) => (
              <div key={v.id} className="sp-vessel-card">
                <div style={{ fontSize: 36, marginBottom: 4 }}>{v.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "var(--text-strong)", letterSpacing: "-0.3px" }}>
                  {v.name}
                </div>
                <span style={{
                  display: "inline-block", padding: "3px 10px",
                  borderRadius: 999, fontSize: 11, fontWeight: 700,
                  background: "var(--tint-08)", border: "1px solid var(--line-2)",
                  color: "var(--text-dim)",
                }}>
                  정원 {v.capacity}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 4 }}>
                  {v.features.map((f) => (
                    <span key={f} className="sp-tag">{f}</span>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "var(--text-mute)", margin: "4px 0 0", fontWeight: 600 }}>
                  💡 {v.note}
                </p>
                <button className="sp-btn-ghost" style={{ marginTop: 6, width: "100%" }} onClick={() => openModal("sunset", v.id)}>
                  이 배로 예약하기
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 예약 문의 모달 */}
      {modalOpen && (
        <div className="sp-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--hook)", letterSpacing: "0.06em", textTransform: "uppercase" }}>INQUIRY</div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "var(--text-strong)", margin: "2px 0 0", letterSpacing: "-0.3px" }}>
                  예약 문의
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: "var(--text-dim)", padding: 4 }}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* 패키지 선택 */}
              <div className="sp-form-row">
                <label className="sp-form-label">패키지 선택</label>
                <div className="sp-radio-group">
                  {PACKAGES.map((pkg) => (
                    <label
                      key={pkg.id}
                      className={`sp-radio-label ${selectedPkg === pkg.id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="package"
                        value={pkg.id}
                        checked={selectedPkg === pkg.id}
                        onChange={() => setSelectedPkg(pkg.id)}
                        style={{ accentColor: "var(--hook)" }}
                      />
                      <span>{pkg.emoji} {pkg.title}</span>
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-mute)", fontWeight: 600 }}>
                        {pkg.price}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 희망 날짜 */}
              <div className="sp-form-row">
                <label className="sp-form-label" htmlFor="sp-date">희망 날짜</label>
                <input
                  id="sp-date"
                  type="date"
                  className="sp-form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* 인원 수 */}
              <div className="sp-form-row">
                <label className="sp-form-label" htmlFor="sp-pax">인원 수</label>
                <input
                  id="sp-pax"
                  type="number"
                  className="sp-form-input"
                  placeholder="예: 10"
                  min={1}
                  value={pax}
                  onChange={(e) => setPax(e.target.value)}
                  required
                />
              </div>

              {/* 연락처 */}
              <div className="sp-form-row">
                <label className="sp-form-label" htmlFor="sp-contact">연락처</label>
                <input
                  id="sp-contact"
                  type="tel"
                  className="sp-form-input"
                  placeholder="010-0000-0000"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </div>

              {/* 특별 요청 */}
              <div className="sp-form-row">
                <label className="sp-form-label" htmlFor="sp-request">특별 요청 (선택)</label>
                <textarea
                  id="sp-request"
                  className="sp-form-input"
                  rows={3}
                  placeholder="케이크 문구, 알레르기, 특별 이벤트 등 요청사항을 적어주세요"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  style={{ resize: "vertical" }}
                />
              </div>

              <button type="submit" className="sp-btn-primary" style={{ width: "100%", marginTop: 4, padding: "14px" }}>
                문의 보내기
              </button>
              <p style={{ fontSize: 11, color: "var(--text-mute)", textAlign: "center", margin: "10px 0 0" }}>
                24시간 내 담당자가 직접 연락드립니다
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
