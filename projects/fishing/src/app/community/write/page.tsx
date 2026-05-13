"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CATEGORIES = ["조황", "자유", "질문", "장터", "후기"] as const;
type Category = typeof CATEGORIES[number];

const REGIONS = ["전체", "서귀포", "성산", "모슬포", "한림", "애월", "구좌", "제주시"];
const FISH_LIST = ["갈치", "참돔", "감성돔", "방어", "부시리", "벵에돔", "볼락", "반열기", "학꽁치"];

const CAT_COLOR: Record<Category, string> = {
  "조황": "border-teal-600 bg-teal-500/20 text-teal-700",
  "자유": "border-ocean-500 bg-ocean-800 text-ocean-200",
  "질문": "border-blue-500 bg-blue-500/20 text-blue-700",
  "장터": "border-orange-500 bg-orange-500/20 text-orange-700",
  "후기": "border-purple-500 bg-purple-500/20 text-purple-700",
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
        if (w > h) { h = Math.round(h/w*maxDim); w = maxDim; }
        else { w = Math.round(w/h*maxDim); h = maxDim; }
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
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--text-strong)' }}>글이 등록됐습니다!</h1>
        <p className="text-sm mb-6" style={{ color: 'var(--text-dim)' }}>커뮤니티에서 확인해보세요</p>
        <div className="flex gap-3 justify-center">
          <Link href="/community" className="px-6 py-3 bg-hook text-ocean-950 font-black rounded-2xl">커뮤니티 보기</Link>
          <button onClick={() => { setCategory(""); setTitle(""); setContent(""); setFish([]); setPhotos([]); setSubmitted(false); }}
            className="px-6 py-3 border border-ocean-700 rounded-2xl font-bold" style={{ color: 'var(--text-dim)' }}>다시 작성</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-32">
      <Link href="/community" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 커뮤니티</Link>
      <h1 className="text-xl font-black mb-5" style={{ color: 'var(--text-strong)' }}>✏️ 글 작성</h1>

      {/* 카테고리 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold mb-3" style={{ color: 'var(--text-strong)' }}>카테고리 <span className="text-hook">*</span></h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${category === c ? CAT_COLOR[c] : "border-ocean-700 hover:border-ocean-500"}`}
              style={category !== c ? { color: 'var(--text-dim)' } : {}}>
              {c}
            </button>
          ))}
        </div>
        {category === "조황" && (
          <div className="mt-3 pt-3 border-t border-ocean-800">
            <div className="text-xs mb-2" style={{ color: 'var(--text-dim)' }}>어종 태그 (선택)</div>
            <div className="flex flex-wrap gap-1.5">
              {FISH_LIST.map(f => (
                <button key={f} onClick={() => toggleFish(f)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${fish.includes(f) ? "bg-hook text-ocean-950" : "bg-ocean-800"}`}
                  style={!fish.includes(f) ? { color: 'var(--text-dim)' } : {}}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 지역 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold mb-3" style={{ color: 'var(--text-strong)' }}>지역</h2>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${region === r ? "bg-ocean-600" : "bg-ocean-800"}`}
              style={{ color: region === r ? 'var(--ocean-950)' : 'var(--text-dim)' }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 제목 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold mb-3" style={{ color: 'var(--text-strong)' }}>제목 <span className="text-hook">*</span></h2>
        <input value={title} onChange={e => setTitle(e.target.value)} maxLength={80}
          placeholder="제목을 입력하세요"
          className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm focus:outline-none focus:border-ocean-500"
          style={{ color: 'var(--text)', fontFamily: 'inherit' }} />
        <div className="text-right text-[10px] mt-1" style={{ color: 'var(--text-mute)' }}>{title.length}/80</div>
      </div>

      {/* 내용 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold mb-3" style={{ color: 'var(--text-strong)' }}>내용 <span className="text-hook">*</span></h2>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} maxLength={3000}
          placeholder={category === "조황" ? "수심, 미끼, 조류, 날씨 등 조황 정보를 자세히 공유해주세요." : category === "질문" ? "궁금한 점을 자세히 적어주시면 더 정확한 답변을 받을 수 있어요." : "내용을 작성해주세요."}
          className="w-full bg-ocean-800 border border-ocean-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-ocean-500 resize-none leading-relaxed"
          style={{ color: 'var(--text)', fontFamily: 'inherit' }} />
        <div className="text-right text-[10px] mt-1" style={{ color: 'var(--text-mute)' }}>{content.length}/3000</div>
      </div>

      {/* 사진 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold" style={{ color: 'var(--text-strong)' }}>사진 첨부 <span className="text-sm font-normal" style={{ color: 'var(--text-dim)' }}>(선택)</span></h2>
          <span className="text-xs" style={{ color: 'var(--text-dim)' }}>{photos.length}/5장</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {photos.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-ocean-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center hover:bg-rose-600">✕</button>
            </div>
          ))}
          {photos.length < 5 && (
            <button onClick={() => inputRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-ocean-700 flex flex-col items-center justify-center hover:border-ocean-500 transition-colors"
              style={{ color: 'var(--text-dim)' }}>
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => e.target.files && handleFiles(e.target.files)} />
              <span className="text-2xl">{converting ? "⚙️" : "📸"}</span>
              <span className="text-[10px] mt-0.5">{converting ? "변환중" : "추가"}</span>
            </button>
          )}
        </div>
        <p className="text-[10px] mt-2" style={{ color: 'var(--text-mute)' }}>자동 WebP 변환 · 용량 최적화 저장</p>
      </div>

      {/* 하단 CTA */}
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-ocean-950/95 border-t border-ocean-800 px-4 py-3 backdrop-blur-sm">
        <div className="max-w-xl mx-auto">
          <button disabled={!canSubmit} onClick={() => setSubmitted(true)}
            className={`w-full py-4 font-black text-lg rounded-2xl transition-colors ${canSubmit ? "bg-hook text-ocean-950" : "bg-ocean-800 cursor-not-allowed"}`}
            style={!canSubmit ? { color: 'var(--text-mute)' } : {}}>
            ✏️ 글 등록하기
          </button>
          {!canSubmit && (
            <p className="text-center text-[10px] mt-1.5" style={{ color: 'var(--text-mute)' }}>
              {!category ? "카테고리를" : title.trim().length < 2 ? "제목을 (2자 이상)" : "내용을 (10자 이상)"} 입력해주세요
            </p>
          )}
          <button
            onClick={() => router.back()}
            className="w-full mt-2 py-3 font-bold text-sm rounded-2xl border border-ocean-700 bg-transparent hover:border-ocean-500 transition-colors"
            style={{ color: 'var(--text-dim)' }}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
