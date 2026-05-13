"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = ["조황", "자유", "질문", "장터", "후기"] as const;
type Category = typeof CATEGORIES[number];

const REGIONS = ["전체", "서귀포", "성산", "모슬포", "한림", "애월", "구좌", "제주시"];
const FISH_LIST = ["갈치", "참돔", "감성돔", "방어", "부시리", "벵에돔", "볼락", "반열기", "학꽁치"];

const CAT_COLORS: Record<Category, { bg: string; color: string; border: string }> = {
  조황: { bg: "rgba(20,184,166,0.15)", color: "#2dd4bf", border: "#2dd4bf" },
  자유: { bg: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "#60a5fa" },
  질문: { bg: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "#3b82f6" },
  장터: { bg: "rgba(251,146,60,0.15)", color: "#fb923c", border: "#f97316" },
  후기: { bg: "rgba(167,139,250,0.15)", color: "#c4b5fd", border: "#a78bfa" },
};

async function convertToWebP(file: File): Promise<{ dataUrl: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 1600;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h / w * maxDim); w = maxDim; }
        else { w = Math.round(w / h * maxDim); h = maxDim; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) { resolve({ dataUrl: url }); return; }
        const reader = new FileReader();
        reader.onload = () => resolve({ dataUrl: reader.result as string });
        reader.readAsDataURL(blob);
      }, "image/webp", 0.82);
    };
    img.src = url;
  });
}

const card: React.CSSProperties = {
  background: "var(--tint-04)",
  border: "1px solid var(--line)",
  borderRadius: "var(--r-card)",
  padding: "20px",
  marginBottom: 12,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--tint-08)",
  border: "1px solid var(--line)",
  borderRadius: "var(--r-sm)",
  padding: "10px 14px",
  color: "var(--text)",
  fontFamily: "inherit",
  fontSize: 14,
  boxSizing: "border-box",
  outline: "none",
};

export default function CommunityWritePage() {
  const router = useRouter();
  const [category, setCategory] = useState<Category | "">("");
  const [region, setRegion] = useState("전체");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fish, setFish] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [converting, setConverting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    if (photos.length + files.length > 5) { alert("사진은 최대 5장입니다."); return; }
    setConverting(true);
    const results: string[] = [];
    for (const file of Array.from(files).slice(0, 5 - photos.length)) {
      if (!file.type.startsWith("image/")) continue;
      const { dataUrl } = await convertToWebP(file);
      results.push(dataUrl);
    }
    setPhotos(prev => [...prev, ...results]);
    setConverting(false);
  }, [photos.length]);

  const toggleFish = (f: string) => setFish(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  const canSubmit = category && title.trim().length >= 2 && content.trim().length >= 10;

  if (submitted) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", marginBottom: 8 }}>글이 등록됐습니다!</h1>
        <p style={{ fontSize: 14, color: "var(--text-dim)", marginBottom: 24 }}>커뮤니티에서 확인해보세요</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Link href="/community" style={{ padding: "12px 24px", background: "var(--hook)", color: "var(--ocean-950,#0a1628)", fontWeight: 900, borderRadius: "var(--r-sm)", textDecoration: "none", fontSize: 14 }}>
            커뮤니티 보기
          </Link>
          <button
            onClick={() => { setCategory(""); setTitle(""); setContent(""); setFish([]); setPhotos([]); setSubmitted(false); }}
            style={{ padding: "12px 24px", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", background: "none", color: "var(--text-dim)", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
          >
            다시 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .cw-cta {
          position: fixed;
          bottom: 70px;
          left: 0; right: 0;
          z-index: 40;
          background: rgba(10,22,40,0.97);
          border-top: 1px solid var(--line);
          padding: 12px 16px 12px;
          backdrop-filter: blur(8px);
        }
        @media (min-width: 1024px) {
          .cw-cta { bottom: 0; left: 240px; }
        }
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px 180px" }}>
        <Link href="/community" style={{ fontSize: 13, color: "var(--text-dim)", textDecoration: "none", display: "inline-block", marginBottom: 16 }}>← 커뮤니티</Link>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: "var(--text-strong)", marginBottom: 20 }}>✏️ 글 작성</h1>

        {/* 카테고리 */}
        <div style={card}>
          <div style={{ fontWeight: 700, color: "var(--text-strong)", marginBottom: 12 }}>
            카테고리 <span style={{ color: "var(--hook)" }}>*</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map(c => {
              const active = category === c;
              const cs = CAT_COLORS[c];
              return (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: "8px 16px", borderRadius: "var(--r-sm)", border: `2px solid ${active ? cs.border : "var(--line)"}`,
                  background: active ? cs.bg : "transparent", color: active ? cs.color : "var(--text-dim)",
                  fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                }}>
                  {c}
                </button>
              );
            })}
          </div>
          {category === "조황" && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
              <div style={{ fontSize: 11, color: "var(--text-dim)", marginBottom: 8 }}>어종 태그 (선택)</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {FISH_LIST.map(f => (
                  <button key={f} onClick={() => toggleFish(f)} style={{
                    padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                    background: fish.includes(f) ? "var(--hook)" : "var(--tint-08)",
                    color: fish.includes(f) ? "var(--ocean-950,#0a1628)" : "var(--text-dim)",
                    border: "none", cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 지역 */}
        <div style={card}>
          <div style={{ fontWeight: 700, color: "var(--text-strong)", marginBottom: 12 }}>지역</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegion(r)} style={{
                padding: "6px 14px", borderRadius: 99, fontSize: 12, fontWeight: 700,
                background: region === r ? "var(--ocean-500,#5fa3cf)" : "var(--tint-08)",
                color: region === r ? "var(--ocean-950,#0a1628)" : "var(--text-dim)",
                border: "none", cursor: "pointer", fontFamily: "inherit",
              }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 제목 */}
        <div style={card}>
          <div style={{ fontWeight: 700, color: "var(--text-strong)", marginBottom: 10 }}>
            제목 <span style={{ color: "var(--hook)" }}>*</span>
          </div>
          <input
            value={title} onChange={e => setTitle(e.target.value)} maxLength={80}
            placeholder="제목을 입력하세요" style={{ ...inputStyle, height: 44 }}
          />
          <div style={{ textAlign: "right", fontSize: 10, marginTop: 4, color: "var(--text-mute)" }}>{title.length}/80</div>
        </div>

        {/* 내용 */}
        <div style={card}>
          <div style={{ fontWeight: 700, color: "var(--text-strong)", marginBottom: 10 }}>
            내용 <span style={{ color: "var(--hook)" }}>*</span>
          </div>
          <textarea
            value={content} onChange={e => setContent(e.target.value)} rows={8} maxLength={3000}
            placeholder={category === "조황" ? "수심, 미끼, 조류, 날씨 등 조황 정보를 자세히 공유해주세요." : category === "질문" ? "궁금한 점을 자세히 적어주시면 더 정확한 답변을 받을 수 있어요." : "내용을 작성해주세요."}
            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
          />
          <div style={{ textAlign: "right", fontSize: 10, marginTop: 4, color: "var(--text-mute)" }}>{content.length}/3000</div>
        </div>

        {/* 사진 */}
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 700, color: "var(--text-strong)" }}>사진 첨부 <span style={{ fontWeight: 400, fontSize: 13, color: "var(--text-dim)" }}>(선택)</span></span>
            <span style={{ fontSize: 12, color: "var(--text-mute)" }}>{photos.length}/5장</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {photos.map((url, i) => (
              <div key={i} style={{ position: "relative", width: 80, height: 80, borderRadius: 12, overflow: "hidden", background: "var(--tint-08)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                  style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 10, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            ))}
            {photos.length < 5 && (
              <button onClick={() => inputRef.current?.click()} style={{
                width: 80, height: 80, borderRadius: 12, border: "2px dashed var(--line)",
                background: "transparent", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                color: "var(--text-dim)", cursor: "pointer",
              }}>
                <input ref={inputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                  onChange={e => e.target.files && handleFiles(e.target.files)} />
                <span style={{ fontSize: 24 }}>{converting ? "⚙️" : "📸"}</span>
                <span style={{ fontSize: 10, marginTop: 2 }}>{converting ? "변환중" : "추가"}</span>
              </button>
            )}
          </div>
          <p style={{ fontSize: 10, marginTop: 8, color: "var(--text-mute)" }}>자동 WebP 변환 · 용량 최적화</p>
        </div>
      </div>

      {/* 고정 하단 CTA */}
      <div className="cw-cta">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <button
            disabled={!canSubmit}
            onClick={() => setSubmitted(true)}
            style={{
              width: "100%", padding: "14px", borderRadius: "var(--r-card)", fontWeight: 900, fontSize: 15,
              background: canSubmit ? "var(--hook)" : "var(--tint-08)",
              color: canSubmit ? "var(--ocean-950,#0a1628)" : "var(--text-mute)",
              border: "none", cursor: canSubmit ? "pointer" : "not-allowed", fontFamily: "inherit",
            }}
          >
            ✏️ 글 등록하기
          </button>
          {!canSubmit && (
            <p style={{ textAlign: "center", fontSize: 11, marginTop: 6, color: "var(--text-mute)" }}>
              {!category ? "카테고리를" : title.trim().length < 2 ? "제목을 (2자 이상)" : "내용을 (10자 이상)"} 입력해주세요
            </p>
          )}
          <button
            onClick={() => router.back()}
            style={{
              width: "100%", marginTop: 8, padding: "12px", fontWeight: 700, fontSize: 13,
              borderRadius: "var(--r-sm)", border: "1px solid var(--line)", background: "transparent",
              color: "var(--text-dim)", cursor: "pointer", fontFamily: "inherit",
            }}
          >
            취소
          </button>
        </div>
      </div>
    </>
  );
}
