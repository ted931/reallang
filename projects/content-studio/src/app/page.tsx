"use client";
import { useState, useRef } from "react";

const CATEGORIES = [
  { id: "rental_car", label: "렌터카", emoji: "🚗" },
  { id: "cafepass",   label: "카페패스", emoji: "☕" },
  { id: "attraction", label: "관광지", emoji: "🏝️" },
  { id: "review",     label: "리뷰 기반", emoji: "⭐" },
  { id: "free",       label: "자유 주제", emoji: "✏️" },
];

type Mode = "blog" | "insta";
type BlogResult = { title: string; sections: { heading: string; body: string }[]; seoKeywords: string[]; summary: string };
type InstaResult = { captions: { style: string; text: string; hashtags: string[] }[] };

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} style={{
      padding: "4px 12px", borderRadius: 6, fontSize: 11, fontWeight: 700,
      background: copied ? "var(--green-light)" : "var(--ink-08)",
      color: copied ? "var(--green)" : "var(--ink-60)",
      border: "none", cursor: "pointer", transition: "all 0.15s",
    }}>
      {copied ? "✓ 복사됨" : "복사"}
    </button>
  );
}

function InputField({ label, value, onChange, placeholder, multiline = false, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; rows?: number;
}) {
  const style: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 8, fontSize: 14,
    border: "1px solid var(--border)", background: "var(--surface)",
    color: "var(--ink)", outline: "none", resize: "vertical",
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--ink-60)", marginBottom: 6 }}>
        {label}
      </label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={style} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
      }
    </div>
  );
}

/* ── 카테고리별 입력 폼 ── */
function CategoryForm({ category, data, onChange }: {
  category: string;
  data: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  const f = (key: string) => data[key] ?? "";
  const set = (key: string) => (v: string) => onChange(key, v);

  if (category === "rental_car") return <>
    <InputField label="주제 / 포커스" value={f("topic")} onChange={set("topic")} placeholder="예: 아반떼 vs 소나타 가성비 비교" />
    <InputField label="차종 (선택)" value={f("carType")} onChange={set("carType")} placeholder="예: 아반떼, 소나타, QM6" />
    <InputField label="가격 정보 (선택)" value={f("priceInfo")} onChange={set("priceInfo")} placeholder="예: 아반떼 52,000원/일, 전주 대비 12% 하락" />
    <InputField label="추가 메모" value={f("notes")} onChange={set("notes")} placeholder="예: 황금연휴 전 예약 추천 이유 포함" multiline rows={2} />
  </>;

  if (category === "cafepass") return <>
    <InputField label="카페 이름 또는 지역" value={f("cafeName")} onChange={set("cafeName")} placeholder="예: 협재 카페패스 추천 3곳 / 서귀포 오션뷰 카페" />
    <InputField label="테마 / 분위기" value={f("theme")} onChange={set("theme")} placeholder="예: 부모님 모시기 좋은, 노트북 작업, 커플 데이트" />
    <InputField label="리뷰 키워드" value={f("reviewKeywords")} onChange={set("reviewKeywords")} placeholder="예: 주차 편함, WiFi 빠름, 오션뷰 최고" />
    <InputField label="추가 메모" value={f("notes")} onChange={set("notes")} placeholder="예: 카페패스 쿠폰 절약 금액 언급" multiline rows={2} />
  </>;

  if (category === "attraction") return <>
    <InputField label="장소명" value={f("placeName")} onChange={set("placeName")} placeholder="예: 성산일출봉, 협재해변, 사려니숲길" />
    <InputField label="지역" value={f("area")} onChange={set("area")} placeholder="예: 서귀포 성산읍" />
    <InputField label="특징 / 볼거리" value={f("features")} onChange={set("features")} placeholder="예: 유네스코 세계자연유산, 일출 명소, 트레킹 코스" multiline rows={2} />
    <InputField label="방문 팁" value={f("tips")} onChange={set("tips")} placeholder="예: 오전 8시 이전 방문 추천, 입장료 5,000원" multiline rows={2} />
  </>;

  if (category === "review") return <>
    <InputField label="장소 / 서비스명" value={f("targetName")} onChange={set("targetName")} placeholder="예: 제주패스 렌터카, 카페 이음" />
    <InputField label="리뷰 내용 붙여넣기" value={f("reviews")} onChange={set("reviews")} placeholder="실제 리뷰 텍스트를 복붙해주세요. 여러 개도 OK" multiline rows={6} />
    <InputField label="주요 키워드 (선택)" value={f("keywords")} onChange={set("keywords")} placeholder="예: 친절함, 가성비, 빠른 처리" />
  </>;

  // free
  return <>
    <InputField label="주제" value={f("topic")} onChange={set("topic")} placeholder="예: 5월 제주 여행 추천 코스, 제주 흑돼지 맛집 총정리" />
    <InputField label="추가 정보 / 데이터" value={f("notes")} onChange={set("notes")} placeholder="포함하고 싶은 내용이나 데이터를 입력해주세요" multiline rows={4} />
  </>;
}

/* ── 블로그 결과 ── */
function BlogResult({ result }: { result: BlogResult }) {
  const fullText = [
    `# ${result.title}`,
    ...result.sections.map(s => `## ${s.heading}\n\n${s.body}`),
  ].join("\n\n");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800 }}>블로그 초안</h2>
        <CopyButton text={fullText} />
      </div>

      {/* 제목 */}
      <div style={{ background: "var(--purple-light)", borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "var(--purple)", letterSpacing: "0.08em", marginBottom: 6 }}>H1 제목</p>
            <p style={{ fontSize: 16, fontWeight: 900, color: "var(--ink)", lineHeight: 1.4 }}>{result.title}</p>
          </div>
          <CopyButton text={result.title} />
        </div>
      </div>

      {/* SEO 요약 */}
      <div style={{ background: "var(--ink-08)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 800, color: "var(--ink-60)", letterSpacing: "0.06em", marginBottom: 4 }}>META DESCRIPTION</p>
          <p style={{ fontSize: 12, color: "var(--ink-60)", lineHeight: 1.5 }}>{result.summary}</p>
        </div>
        <CopyButton text={result.summary} />
      </div>

      {/* 섹션들 */}
      {result.sections.map((sec, i) => (
        <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "16px 20px", marginBottom: 12, background: "var(--surface)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: "var(--purple)" }}>{sec.heading}</p>
            <CopyButton text={`## ${sec.heading}\n\n${sec.body}`} />
          </div>
          <p style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{sec.body}</p>
        </div>
      ))}

      {/* SEO 키워드 */}
      <div style={{ marginTop: 20, padding: "14px 16px", background: "var(--green-light)", borderRadius: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 800, color: "var(--green)", letterSpacing: "0.08em", marginBottom: 8 }}>SEO 추천 키워드</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {result.seoKeywords.map((kw) => (
            <span key={kw} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 100, background: "white", color: "var(--green)", fontWeight: 700, border: "1px solid #a7f3d0" }}>
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 인스타 결과 ── */
function InstaResult({ result }: { result: InstaResult }) {
  const STYLE_COLOR: Record<string, { bg: string; color: string }> = {
    감성형: { bg: "var(--pink-light)", color: "var(--pink)" },
    정보형: { bg: "var(--purple-light)", color: "var(--purple)" },
    유머형: { bg: "#fef9c3", color: "#a16207" },
  };

  return (
    <div>
      <h2 style={{ fontSize: 15, fontWeight: 800, marginBottom: 20 }}>인스타 캡션 3종</h2>
      {result.captions.map((cap, i) => {
        const color = STYLE_COLOR[cap.style] ?? STYLE_COLOR["감성형"];
        const fullText = `${cap.text}\n\n${cap.hashtags.join(" ")}`;
        return (
          <div key={i} style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 16, background: "var(--surface)" }}>
            {/* 헤더 */}
            <div style={{ background: color.bg, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: color.color }}>{cap.style}</span>
              <CopyButton text={fullText} />
            </div>
            {/* 캡션 */}
            <div style={{ padding: "16px 18px" }}>
              <p style={{ fontSize: 14, color: "var(--ink)", lineHeight: 1.8, marginBottom: 14, whiteSpace: "pre-wrap" }}>{cap.text}</p>
              {/* 해시태그 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {cap.hashtags.map((tag) => (
                  <span key={tag} style={{ fontSize: 11, color: "#2563eb", fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
              <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                <CopyButton text={cap.hashtags.join(" ")} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════ */
export default function ContentStudioPage() {
  const [mode, setMode] = useState<Mode>("blog");
  const [category, setCategory] = useState("rental_car");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [blogResult, setBlogResult] = useState<BlogResult | null>(null);
  const [instaResult, setInstaResult] = useState<InstaResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const setField = (key: string, val: string) => setFormData(p => ({ ...p, [key]: val }));
  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setFormData({});
    setBlogResult(null);
    setInstaResult(null);
    setError("");
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setBlogResult(null);
    setInstaResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, category, data: formData }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "생성 실패");

      if (mode === "blog") setBlogResult(data);
      else setInstaResult(data);

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasResult = blogResult || instaResult;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)" }}>

      {/* ── 헤더 ── */}
      <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>✨</span>
              <span style={{ fontSize: 15, fontWeight: 900, color: "var(--ink)" }}>콘텐츠 스튜디오</span>
              <span style={{ fontSize: 11, color: "var(--ink-30)", fontWeight: 600 }}>by Kaflix</span>
            </div>

            {/* Blog / Insta 토글 */}
            <div style={{ display: "flex", background: "var(--ink-08)", borderRadius: 10, padding: 3, gap: 2 }}>
              {([
                { key: "blog", label: "📝 블로그", color: "var(--purple)" },
                { key: "insta", label: "📸 인스타", color: "var(--pink)" },
              ] as const).map(m => (
                <button key={m.key} onClick={() => { setMode(m.key); setBlogResult(null); setInstaResult(null); }} style={{
                  padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                  background: mode === m.key ? "var(--surface)" : "transparent",
                  color: mode === m.key ? m.color : "var(--ink-60)",
                  boxShadow: mode === m.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s",
                }}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 카테고리 탭 */}
          <div style={{ display: "flex", gap: 0, borderTop: "1px solid var(--border)" }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => handleCategoryChange(cat.id)} style={{
                padding: "10px 18px", fontSize: 13, fontWeight: 700,
                borderBottom: `2px solid ${category === cat.id ? (mode === "blog" ? "var(--purple)" : "var(--pink)") : "transparent"}`,
                color: category === cat.id ? (mode === "blog" ? "var(--purple)" : "var(--pink)") : "var(--ink-60)",
                background: "transparent", transition: "all 0.15s", whiteSpace: "nowrap",
              }}>
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── 메인 ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px", display: "grid", gridTemplateColumns: hasResult ? "1fr 1fr" : "1fr", gap: 24, alignItems: "start" }}>

        {/* 입력 패널 */}
        <div style={{ background: "var(--surface)", borderRadius: 14, border: "1px solid var(--border)", overflow: "hidden" }}>
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid var(--border)",
            background: mode === "blog" ? "var(--purple-light)" : "var(--pink-light)",
          }}>
            <p style={{ fontSize: 13, fontWeight: 800, color: mode === "blog" ? "var(--purple)" : "var(--pink)" }}>
              {mode === "blog" ? "📝 블로그 초안" : "📸 인스타 캡션"} 생성 —
              {" "}{CATEGORIES.find(c => c.id === category)?.emoji} {CATEGORIES.find(c => c.id === category)?.label}
            </p>
            <p style={{ fontSize: 11, color: "var(--ink-60)", marginTop: 2 }}>
              {mode === "blog" ? "SEO 최적화 블로그 글 · H1/H2 구조 + 키워드" : "3가지 스타일 캡션 + 해시태그 자동 생성"}
            </p>
          </div>

          <div style={{ padding: "24px 20px" }}>
            <CategoryForm category={category} data={formData} onChange={setField} />

            {error && (
              <div style={{ padding: "10px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#b91c1c", marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button onClick={handleGenerate} disabled={loading} style={{
              width: "100%", padding: "14px 0", borderRadius: 10,
              background: loading ? "var(--ink-08)" : (mode === "blog" ? "var(--purple)" : "var(--pink)"),
              color: loading ? "var(--ink-30)" : "#fff",
              fontSize: 14, fontWeight: 800, transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid var(--ink-30)", borderTopColor: "var(--purple)", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                  AI가 작성 중…
                </>
              ) : (
                `${mode === "blog" ? "블로그 초안" : "인스타 캡션"} 생성하기 →`
              )}
            </button>
          </div>
        </div>

        {/* 결과 패널 */}
        {hasResult && (
          <div ref={resultRef} style={{ background: "var(--surface)", borderRadius: 14, border: "1px solid var(--border)", padding: "24px 20px" }}>
            {blogResult && <BlogResult result={blogResult} />}
            {instaResult && <InstaResult result={instaResult} />}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus { border-color: ${mode === "blog" ? "#7c3aed" : "#db2777"} !important; box-shadow: 0 0 0 3px ${mode === "blog" ? "rgba(124,58,237,0.1)" : "rgba(219,39,119,0.1)"}; }
      `}</style>
    </div>
  );
}
