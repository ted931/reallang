"use client";
import { useState } from "react";

/* ── 18개 로고 시안 데이터 ── */
const LOGOS = [
  /* ── A 시리즈: 아이콘 + 퐁당(한글) ── */
  {
    id: "A1", series: "A", label: "A1 · 리플 워드마크", sub: "물결 파문 + 한글",
    wordmark: "퐁당", lang: "ko",
    icon: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="6" fill="#1e6595"/>
  <circle cx="24" cy="24" r="12" fill="none" stroke="#3a82b3" stroke-width="1.6" opacity="0.7"/>
  <circle cx="24" cy="24" r="18" fill="none" stroke="#5fa3cf" stroke-width="1.4" opacity="0.5"/>
  <circle cx="24" cy="24" r="23" fill="none" stroke="#5fa3cf" stroke-width="1.2" opacity="0.25"/>
  <circle cx="24" cy="20" r="2.5" fill="#fbbf24"/>
</svg>`,
  },
  {
    id: "A2", series: "A", label: "A2 · 물방울 워드마크", sub: "물방울 + 낚싯줄",
    wordmark: "퐁당", lang: "ko",
    icon: `<svg width="44" height="48" viewBox="0 0 44 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 4 C 8 22, 8 40, 22 44 C 36 40, 36 22, 22 4 Z" fill="#1e6595"/>
  <path d="M20 18 L20 28 C 20 32, 24 34, 26 30" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="20" cy="16" r="1.2" fill="#fff"/>
</svg>`,
  },
  {
    id: "A3", series: "A", label: "A3 · 파도 워드마크", sub: "태양 + 파도",
    wordmark: "퐁당", lang: "ko",
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
  <circle cx="18" cy="14" r="6" fill="#fbbf24"/>
  <path d="M4 26 Q 18 20 32 26" stroke="#1e6595" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M2 30 Q 18 24 34 30" stroke="#5fa3cf" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.6"/>
</svg>`,
  },
  {
    id: "A4", series: "A", label: "A4 · 뱃지 워드마크", sub: "물고기 + 낚싯대",
    wordmark: "퐁당", lang: "ko",
    icon: `<svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="38" height="38" rx="11" fill="#1e6595"/>
  <path d="M11 10 L 11 26 M 11 26 Q 13 30, 16 30" stroke="#fbbf24" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="19" cy="30" r="1.5" fill="#fbbf24"/>
  <path d="M22 23 Q 28 19 33 23 Q 30 26 25 26 Q 22 26 22 23 Z" fill="#fff" opacity="0.92"/>
  <circle cx="30" cy="22.5" r="0.8" fill="#0f1a2e"/>
</svg>`,
  },
  {
    id: "A5", series: "A", label: "A5 · 캐릭터 워드마크", sub: "복어 캐릭터",
    wordmark: "퐁당", lang: "ko",
    icon: `<svg width="46" height="42" viewBox="0 0 46 42" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="13" cy="32" rx="11" ry="3.5" fill="#5fa3cf" opacity="0.4"/>
  <circle cx="13" cy="14" r="10" fill="#fbbf24"/>
  <circle cx="10" cy="11" r="2.4" fill="#fff" opacity="0.85"/>
  <path d="M28 18 Q 36 10 42 18 Q 38 22 32 22 Q 28 22 28 18 Z" fill="#1e6595"/>
  <path d="M42 18 L 46 14 L 46 22 Z" fill="#1e6595"/>
</svg>`,
  },
  {
    id: "A6", series: "A", label: "A6 · 원형 씰", sub: "레트로 스탬프",
    wordmark: "", lang: "ko",
    icon: `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
  <g transform="rotate(-8 30 30)">
    <circle cx="30" cy="30" r="26" fill="#dc2626"/>
    <circle cx="30" cy="30" r="23" fill="none" stroke="#fff" stroke-width="2"/>
    <text x="30" y="37" text-anchor="middle" font-family="'Noto Sans KR',system-ui" font-weight="900" font-size="20" letter-spacing="-1" fill="#fff">퐁당</text>
  </g>
</svg>`,
  },

  /* ── B 시리즈: 아이콘 + Pongdang(영문) ── */
  {
    id: "B1", series: "B", label: "B1 · 리플 워드마크", sub: "물결 파문 + 영문",
    wordmark: "Pongdang", lang: "en",
    icon: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="6" fill="#1e6595"/>
  <circle cx="24" cy="24" r="12" fill="none" stroke="#3a82b3" stroke-width="1.6" opacity="0.7"/>
  <circle cx="24" cy="24" r="18" fill="none" stroke="#5fa3cf" stroke-width="1.4" opacity="0.5"/>
  <circle cx="24" cy="20" r="2.5" fill="#fbbf24"/>
</svg>`,
  },
  {
    id: "B2", series: "B", label: "B2 · P 모노그램", sub: "P 레터마크 + 훅",
    wordmark: "Pongdang", lang: "en",
    icon: `<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="40" height="40" rx="10" fill="#1e6595"/>
  <path d="M14 10 L 14 34" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
  <path d="M14 10 Q 28 10, 28 20 Q 28 28, 18 28 L 18 24 Q 24 24, 24 20 Q 24 14, 14 14" fill="#fff"/>
  <path d="M30 25 Q 32 30, 36 30" stroke="#fbbf24" stroke-width="2" fill="none" stroke-linecap="round"/>
  <circle cx="36" cy="30" r="1.5" fill="#fbbf24"/>
</svg>`,
  },
  {
    id: "B3", series: "B", label: "B3 · 물방울 영문", sub: "물방울 앰버",
    wordmark: "Pongdang", lang: "en",
    icon: `<svg width="42" height="48" viewBox="0 0 42 48" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 4 C 6 24, 6 42, 21 46 C 36 42, 36 24, 21 4 Z" fill="#fbbf24"/>
  <path d="M18 12 C 14 22, 14 32, 18 36" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
</svg>`,
  },
  {
    id: "B4", series: "B", label: "B4 · 파도 영문", sub: "파도 + 낚시찌",
    wordmark: "Pongdang", lang: "en",
    icon: `<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 22 Q 18 14 34 22" stroke="#1e6595" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M2 28 Q 18 22 34 28" stroke="#5fa3cf" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.6"/>
  <circle cx="18" cy="10" r="4.5" fill="#fbbf24"/>
</svg>`,
  },
  {
    id: "B5", series: "B", label: "B5 · 나침반 영문", sub: "나침반 세리프",
    wordmark: "Pongdang", lang: "en",
    icon: `<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
  <circle cx="22" cy="22" r="20" fill="none" stroke="#1e6595" stroke-width="2"/>
  <circle cx="22" cy="22" r="3" fill="#1e6595"/>
  <path d="M22 9 Q 24 16, 22 22 Q 20 28, 22 35" stroke="#1e6595" stroke-width="1.5" fill="none"/>
  <text x="22" y="11" text-anchor="middle" font-size="6" fill="#1e6595" font-weight="700">N</text>
</svg>`,
  },
  {
    id: "B6", series: "B", label: "B6 · 필 워드마크", sub: "알약형 영문 배지",
    wordmark: "", lang: "en",
    icon: `<svg width="120" height="60" viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="2" width="116" height="56" rx="28" fill="none" stroke="#1e6595" stroke-width="2"/>
  <path d="M50 18 Q 54 14 58 18 T 70 18" stroke="#1e6595" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <circle cx="60" cy="13" r="1.8" fill="#fbbf24"/>
  <text x="60" y="36" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="12" letter-spacing="2" fill="#0f1a2e">PONGDANG</text>
  <text x="60" y="48" text-anchor="middle" font-family="system-ui" font-weight="700" font-size="7" letter-spacing="3" fill="#1e6595">EST · 2025</text>
</svg>`,
  },

  /* ── C 시리즈: 심볼 단독 ── */
  {
    id: "C1", series: "C", label: "C1 · 다크 리플", sub: "앱 아이콘용 그라데이션",
    wordmark: "", lang: "symbol",
    icon: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="c1g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#1e6595"/><stop offset="100%" stop-color="#0a1628"/>
  </linearGradient></defs>
  <rect width="120" height="120" rx="30" fill="url(#c1g)"/>
  <circle cx="60" cy="65" r="8" fill="#fbbf24"/>
  <circle cx="60" cy="65" r="18" fill="none" stroke="#fbbf24" stroke-width="2.5" opacity="0.7"/>
  <circle cx="60" cy="65" r="28" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.4"/>
  <circle cx="60" cy="35" r="5" fill="#fff"/>
</svg>`,
  },
  {
    id: "C2", series: "C", label: "C2 · 앰버 훅", sub: "노란 배경 낚싯대",
    wordmark: "", lang: "symbol",
    icon: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="30" fill="#fbbf24"/>
  <path d="M60 15 L 60 65 C 60 80, 75 85, 85 75 C 90 70, 87 62, 82 62" stroke="#0f1a2e" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M10 100 Q 60 90 110 100" stroke="#0f1a2e" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.5"/>
  <path d="M5 110 Q 60 100 115 110" stroke="#0f1a2e" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.3"/>
</svg>`,
  },
  {
    id: "C3", series: "C", label: "C3 · 화이트 물방울", sub: "화이트 카드 물방울",
    wordmark: "", lang: "symbol",
    icon: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="30" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>
  <path d="M60 12 C 20 60, 20 100, 60 110 C 100 100, 100 60, 60 12 Z" fill="#1e6595"/>
  <path d="M40 70 Q 45 88, 60 88" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/>
  <circle cx="78" cy="70" r="8" fill="#fbbf24"/>
</svg>`,
  },
  {
    id: "C4", series: "C", label: "C4 · 퐁 타이포", sub: "앰버 타이포그래피",
    wordmark: "", lang: "symbol",
    icon: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="c4g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#f59e0b"/>
  </linearGradient></defs>
  <rect width="120" height="120" rx="30" fill="url(#c4g)"/>
  <text x="60" y="86" text-anchor="middle" font-family="'Noto Sans KR',system-ui" font-weight="900" font-size="80" letter-spacing="-4" fill="#0f1a2e">퐁</text>
</svg>`,
  },
  {
    id: "C5", series: "C", label: "C5 · 블루 낚싯대", sub: "블루 그라데이션",
    wordmark: "", lang: "symbol",
    icon: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="c5g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#5fa3cf"/><stop offset="100%" stop-color="#1e6595"/>
  </linearGradient></defs>
  <rect width="120" height="120" rx="30" fill="url(#c5g)"/>
  <path d="M60 18 L 60 72 C 60 90, 80 100, 90 88 C 95 82, 93 73, 86 73" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="60" cy="18" r="5" fill="#fbbf24"/>
  <ellipse cx="40" cy="105" rx="22" ry="4" fill="#fff" opacity="0.35"/>
</svg>`,
  },
  {
    id: "C6", series: "C", label: "C6 · 다크 훅+물고기", sub: "딥 네이비 심볼",
    wordmark: "", lang: "symbol",
    icon: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="30" fill="#0a1628"/>
  <circle cx="60" cy="40" r="6" fill="#fbbf24"/>
  <circle cx="60" cy="40" r="15" fill="none" stroke="#fbbf24" stroke-width="2.5" opacity="0.5"/>
  <path d="M26 82 Q 50 72 74 82 Q 88 90 98 82 L 104 76 L 104 90 Z" fill="#5fa3cf" opacity="0.85"/>
  <circle cx="80" cy="80" r="2" fill="#0a1628"/>
</svg>`,
  },
];

const SERIES_INFO: Record<string, { title: string; desc: string; bg: string }> = {
  A: { title: "A — 한글 워드마크", desc: "아이콘 + 퐁당 · 국내 앱/모바일 헤더 권장", bg: "rgba(30,101,149,0.06)" },
  B: { title: "B — 영문 워드마크", desc: "아이콘 + Pongdang · 해외/모던 톤", bg: "rgba(251,191,36,0.06)" },
  C: { title: "C — 심볼 단독", desc: "앱 아이콘 · 파비콘 · 프로필 이미지", bg: "rgba(30,58,95,0.04)" },
};

function LogoPreview({ logo, size = 48 }: { logo: typeof LOGOS[0]; size?: number }) {
  if (logo.series === "C" || !logo.wordmark) {
    return <span dangerouslySetInnerHTML={{ __html: logo.icon }} />;
  }
  const isEn = logo.lang === "en";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <span dangerouslySetInnerHTML={{ __html: logo.icon }} />
      <span style={{
        fontSize: size * 0.65,
        fontWeight: 900,
        letterSpacing: isEn ? "-0.5px" : "-1.5px",
        color: "#0f1a2e",
        fontFamily: isEn ? "system-ui, sans-serif" : "'Noto Sans KR', sans-serif",
        lineHeight: 1,
        fontStyle: logo.id === "B5" ? "italic" : "normal",
      }}>
        {logo.wordmark}
      </span>
    </div>
  );
}

export default function BrandPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [darkPreview, setDarkPreview] = useState(false);

  const selectedLogo = LOGOS.find(l => l.id === selected);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    });
  };

  const getSvgCode = (logo: typeof LOGOS[0]) => {
    if (logo.series === "C" || !logo.wordmark) return logo.icon;
    const isEn = logo.lang === "en";
    return `<div style="display:flex;align-items:center;gap:12px">
  ${logo.icon}
  <span style="font-size:28px;font-weight:900;letter-spacing:${isEn ? "-0.5px" : "-1.5px"};color:#0f1a2e;font-family:${isEn ? "system-ui,sans-serif" : "'Noto Sans KR',sans-serif"}">
    ${logo.wordmark}
  </span>
</div>`;
  };

  return (
    <>
      <style>{`
        .brand-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (min-width: 640px) {
          .brand-grid { grid-template-columns: repeat(6, 1fr); }
        }
        @media (min-width: 1024px) {
          .brand-grid { grid-template-columns: repeat(6, 1fr); }
        }
        .brand-card {
          border: 2px solid var(--line);
          border-radius: 14px;
          padding: 16px 10px 12px;
          background: var(--tint-03);
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          min-height: 120px;
          justify-content: center;
        }
        .brand-card:hover {
          border-color: #5fa3cf;
          background: rgba(30,101,149,0.06);
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(30,101,149,0.12);
        }
        .brand-card.selected {
          border-color: #1e6595;
          background: rgba(30,101,149,0.10);
          box-shadow: 0 0 0 3px rgba(30,101,149,0.2), 0 4px 16px rgba(30,101,149,0.15);
        }
        .brand-card-label {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-mute);
          text-align: center;
          letter-spacing: 0.3px;
        }
        .brand-card.selected .brand-card-label {
          color: #1e6595;
        }
        .copy-btn {
          background: var(--tint-06);
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 700;
          color: var(--text-dim);
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .copy-btn:hover { background: var(--tint-10); color: var(--text); }
        .copy-btn.primary {
          background: #1e6595;
          border-color: #1e6595;
          color: #fff;
        }
        .copy-btn.primary:hover { background: #155280; }
        .copy-btn.done { background: #22c55e; border-color: #22c55e; color: #fff; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 120px" }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: "#1e6595", marginBottom: 6 }}>BRAND · LOGO PICKER</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-strong)", letterSpacing: "-0.6px", margin: 0 }}>퐁당 로고 선택</h1>
          <p style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6 }}>18개 시안 중 원하는 로고를 클릭해서 선택하세요</p>
        </div>

        {/* 시리즈별 섹션 */}
        {(["A", "B", "C"] as const).map(series => {
          const info = SERIES_INFO[series];
          const logos = LOGOS.filter(l => l.series === series);
          return (
            <div key={series} style={{ marginBottom: 32 }}>
              <div style={{
                background: info.bg,
                border: "1px solid var(--line)",
                borderRadius: 14,
                padding: "14px 16px",
                marginBottom: 12,
              }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-strong)" }}>{info.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{info.desc}</div>
              </div>

              <div className="brand-grid">
                {logos.map(logo => (
                  <button
                    key={logo.id}
                    className={`brand-card${selected === logo.id ? " selected" : ""}`}
                    onClick={() => setSelected(logo.id === selected ? null : logo.id)}
                  >
                    <div style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 64,
                    }}>
                      <LogoPreview logo={logo} size={series === "C" ? 80 : 36} />
                    </div>
                    <div className="brand-card-label">
                      {logo.id}
                      {selected === logo.id && <span style={{ marginLeft: 4 }}>✓</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {/* 선택된 로고 패널 */}
        {selectedLogo && (
          <div style={{
            position: "sticky",
            bottom: 80,
            left: 0, right: 0,
            zIndex: 40,
            marginTop: 20,
          }}>
            <div style={{
              background: "var(--ocean-950, #fff)",
              border: "1px solid var(--line)",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 8px 32px rgba(30,58,95,0.15)",
            }}>
              {/* 제목 + 닫기 */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text-strong)" }}>
                    {selectedLogo.label}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{selectedLogo.sub}</div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: "var(--tint-06)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "var(--text-dim)", fontFamily: "inherit" }}
                >✕ 닫기</button>
              </div>

              {/* 미리보기 — 밝은/어두운 전환 */}
              <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                {/* 밝은 배경 */}
                <div style={{
                  flex: 1, minWidth: 120,
                  background: darkPreview ? "#0a1628" : "#f8fafb",
                  border: "1px solid var(--line)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "28px 20px",
                  transition: "background 0.25s",
                }}>
                  <div style={{ filter: darkPreview && selectedLogo.series === "C" && selectedLogo.id !== "C6" ? "brightness(1.1)" : "none" }}>
                    <LogoPreview logo={selectedLogo} size={selectedLogo.series === "C" ? 100 : 46} />
                  </div>
                </div>
              </div>

              {/* 배경 토글 */}
              <div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setDarkPreview(false)}
                  style={{
                    padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    background: !darkPreview ? "#1e6595" : "var(--tint-06)",
                    color: !darkPreview ? "#fff" : "var(--text-dim)",
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                  }}
                >☀️ 라이트</button>
                <button
                  onClick={() => setDarkPreview(true)}
                  style={{
                    padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700,
                    background: darkPreview ? "#1e6595" : "var(--tint-06)",
                    color: darkPreview ? "#fff" : "var(--text-dim)",
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                  }}
                >🌙 다크</button>
              </div>

              {/* 색상 토큰 */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {[
                  { name: "Ocean", hex: "#1e6595" },
                  { name: "Surface", hex: "#5fa3cf" },
                  { name: "Hook", hex: "#fbbf24" },
                  { name: "Ink", hex: "#0f1a2e" },
                ].map(({ name, hex }) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: hex, border: "1px solid rgba(0,0,0,0.1)" }} />
                    <span style={{ fontSize: 10, color: "var(--text-dim)", fontWeight: 600 }}>{name} {hex}</span>
                  </div>
                ))}
              </div>

              {/* 복사 버튼 */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  className={`copy-btn primary${copied === "svg" ? " done" : ""}`}
                  onClick={() => copyToClipboard(getSvgCode(selectedLogo), "svg")}
                >
                  {copied === "svg" ? "✓ 복사됨" : "📋 SVG 코드 복사"}
                </button>
                <button
                  className={`copy-btn${copied === "id" ? " done" : ""}`}
                  onClick={() => copyToClipboard(selectedLogo.id, "id")}
                >
                  {copied === "id" ? "✓ 복사됨" : `ID: ${selectedLogo.id}`}
                </button>
                <button
                  className={`copy-btn${copied === "hex" ? " done" : ""}`}
                  onClick={() => copyToClipboard("#1e6595, #5fa3cf, #fbbf24, #0f1a2e", "hex")}
                >
                  {copied === "hex" ? "✓ 복사됨" : "🎨 색상 토큰 복사"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 선택 안내 */}
        {!selected && (
          <div style={{
            textAlign: "center",
            padding: "24px 20px",
            color: "var(--text-mute)",
            fontSize: 13,
            border: "2px dashed var(--line)",
            borderRadius: 14,
            marginTop: 8,
          }}>
            🎣 위 카드를 클릭해서 로고를 선택하세요
          </div>
        )}
      </div>
    </>
  );
}
