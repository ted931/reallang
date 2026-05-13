"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MARKET_CATEGORY_LABEL, MARKET_CATEGORY_ICON, type MarketCategory } from "@/lib/dummy-market";

const CATEGORIES: MarketCategory[] = ["rod", "reel", "lure", "line", "hook", "box", "wear", "etc"];
const CONDITIONS = [
  { key: "S", label: "미사용", desc: "개봉·사용 없음" },
  { key: "A", label: "상태양호", desc: "미세 사용감, 기능 이상 없음" },
  { key: "B", label: "보통", desc: "사용감 있으나 기능 정상" },
  { key: "C", label: "하자있음", desc: "일부 이상 있음 (설명 필수)" },
] as const;
const REGIONS = ["서귀포", "성산", "모슬포", "한림", "애월", "구좌", "제주시", "온라인(택배)"];
const TRADE = [
  { key: "direct", label: "직거래", icon: "🤝" },
  { key: "delivery", label: "택배", icon: "📦" },
  { key: "both", label: "모두 가능", icon: "✅" },
] as const;

async function convertToWebP(file: File): Promise<{ dataUrl: string; webpSize: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 1200;
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round((h / w) * maxDim); w = maxDim; }
        else { w = Math.round((w / h) * maxDim); h = maxDim; }
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) { resolve({ dataUrl: url, webpSize: file.size }); return; }
        const reader = new FileReader();
        reader.onload = () => resolve({ dataUrl: reader.result as string, webpSize: blob.size });
        reader.readAsDataURL(blob);
      }, "image/webp", 0.85);
    };
    img.src = url;
  });
}

interface PhotoItem { id: string; dataUrl: string; webpSize: number; originalSize: number; }

export default function MarketSellPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MarketCategory | "">("");
  const [condition, setCondition] = useState<"S" | "A" | "B" | "C" | "">("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [region, setRegion] = useState("");
  const [tradeType, setTradeType] = useState<"direct" | "delivery" | "both" | "">("");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    if (photos.length + files.length > 5) { alert("사진은 최대 5장까지 등록 가능합니다."); return; }
    setConverting(true);
    const results: PhotoItem[] = [];
    for (const file of Array.from(files).slice(0, 5 - photos.length)) {
      if (!file.type.startsWith("image/")) continue;
      const { dataUrl, webpSize } = await convertToWebP(file);
      results.push({ id: `${Date.now()}-${Math.random()}`, dataUrl, webpSize, originalSize: file.size });
    }
    setPhotos(prev => [...prev, ...results]);
    setConverting(false);
  }, [photos.length]);

  const canSubmit = photos.length > 0 && title.trim() && category && condition && price && region && tradeType;

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-black text-ocean-50 mb-2">등록 완료!</h1>
        <p className="text-slate-400 text-sm mb-6">판매글이 마켓에 등록됐습니다</p>
        <div className="flex gap-3 justify-center">
          <Link href="/market" className="px-6 py-3 bg-hook text-ocean-950 font-black rounded-2xl">마켓 보러가기</Link>
          <button onClick={() => { setPhotos([]); setTitle(""); setCategory(""); setCondition(""); setPrice(""); setOriginalPrice(""); setRegion(""); setTradeType(""); setDesc(""); setSubmitted(false); }}
            className="px-6 py-3 border border-ocean-700 text-slate-400 rounded-2xl font-bold">다시 등록</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-32">
      <Link href="/market" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 마켓 목록</Link>
      <h1 className="text-xl font-black text-ocean-50 mb-5">📝 판매 등록</h1>

      {/* 사진 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-200">상품 사진 <span className="text-hook">*</span></h2>
          <span className="text-xs text-slate-500">{photos.length}/5장</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {photos.map((p, i) => (
            <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden bg-ocean-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.dataUrl} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-1 left-1 text-[9px] bg-hook text-ocean-950 px-1 rounded font-black">대표</span>}
              <button onClick={() => setPhotos(prev => prev.filter(x => x.id !== p.id))}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center hover:bg-rose-600">✕</button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[8px] text-teal-300 text-center py-0.5">
                WebP {(p.webpSize/1024).toFixed(0)}KB
              </div>
            </div>
          ))}
          {photos.length < 5 && (
            <button onClick={() => inputRef.current?.click()}
              className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-slate-500 hover:border-ocean-500 hover:text-slate-300 transition-colors ${converting ? "animate-pulse" : ""} border-ocean-700`}>
              <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => e.target.files && handleFiles(e.target.files)} />
              <span className="text-2xl">{converting ? "⚙️" : "+"}</span>
              <span className="text-[10px] mt-0.5">{converting ? "변환중" : "사진추가"}</span>
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-600 mt-2">📸 자동으로 WebP 변환 · 최대 1200px 리사이즈</p>
      </div>

      {/* 제목 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-3">제목 <span className="text-hook">*</span></h2>
        <input value={title} onChange={e => setTitle(e.target.value)} maxLength={60}
          placeholder="예) 다이와 BG 5000 릴 — 2회 사용"
          className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-ocean-500" />
        <div className="text-right text-[10px] text-slate-600 mt-1">{title.length}/60</div>
      </div>

      {/* 카테고리 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-3">카테고리 <span className="text-hook">*</span></h2>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border text-xs font-bold transition-colors ${category === c ? "border-hook bg-hook/10 text-hook" : "border-ocean-700 text-slate-400 hover:border-ocean-500"}`}>
              <span className="text-xl">{MARKET_CATEGORY_ICON[c]}</span>
              {MARKET_CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      {/* 상태 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-3">상품 상태 <span className="text-hook">*</span></h2>
        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map(c => (
            <button key={c.key} onClick={() => setCondition(c.key)}
              className={`flex items-start gap-2 p-3 rounded-xl border text-left transition-colors ${condition === c.key ? "border-hook bg-hook/10" : "border-ocean-700 hover:border-ocean-500"}`}>
              <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${condition === c.key ? "border-hook bg-hook" : "border-ocean-600"}`}>
                {condition === c.key && <div className="w-1.5 h-1.5 rounded-full bg-ocean-950" />}
              </div>
              <div>
                <div className={`text-sm font-bold ${condition === c.key ? "text-hook" : "text-slate-200"}`}>{c.label}</div>
                <div className="text-[10px] text-slate-500">{c.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 가격 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-3">가격 <span className="text-hook">*</span></h2>
        <div className="space-y-2">
          <div className="relative">
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="판매 가격"
              className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 pr-10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-ocean-500" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">원</span>
          </div>
          <div className="relative">
            <input type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value)} placeholder="구매가 (선택)"
              className="w-full h-11 bg-ocean-800 border border-ocean-700 rounded-xl px-4 pr-10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-ocean-500" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">원</span>
          </div>
          {price && originalPrice && Number(originalPrice) > 0 && (
            <div className="text-xs text-teal-400">
              할인율: {Math.round((1 - Number(price) / Number(originalPrice)) * 100)}%
            </div>
          )}
        </div>
      </div>

      {/* 지역 + 거래 방식 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4 space-y-4">
        <div>
          <h2 className="font-bold text-slate-200 mb-3">지역 <span className="text-hook">*</span></h2>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${region === r ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
                {r}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-slate-200 mb-3">거래 방식 <span className="text-hook">*</span></h2>
          <div className="flex gap-2">
            {TRADE.map(t => (
              <button key={t.key} onClick={() => setTradeType(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-bold transition-colors ${tradeType === t.key ? "border-hook bg-hook/10 text-hook" : "border-ocean-700 text-slate-400 hover:border-ocean-500"}`}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 상세 설명 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-6">
        <h2 className="font-bold text-slate-200 mb-3">상세 설명</h2>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={5} maxLength={1000}
          placeholder="구매 시기, 사용 횟수, 보관 상태, 부속품 포함 여부 등을 자세히 적어주세요."
          className="w-full bg-ocean-800 border border-ocean-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-ocean-500 resize-none" />
        <div className="text-right text-[10px] text-slate-600 mt-1">{desc.length}/1000</div>
      </div>

      {/* 하단 CTA */}
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-ocean-950/95 border-t border-ocean-800 px-4 py-3 backdrop-blur-sm">
        <div className="max-w-xl mx-auto">
          <button disabled={!canSubmit} onClick={() => setSubmitted(true)}
            className={`w-full py-4 font-black text-lg rounded-2xl transition-colors ${canSubmit ? "bg-hook hover:bg-hook-light text-ocean-950" : "bg-ocean-800 text-slate-600 cursor-not-allowed"}`}>
            🛒 판매 등록하기
          </button>
          {!canSubmit && (
            <p className="text-center text-[10px] text-slate-600 mt-1.5">
              {!photos.length ? "사진" : !title.trim() ? "제목" : !category ? "카테고리" : !condition ? "상품상태" : !price ? "가격" : !region ? "지역" : "거래방식"}을 입력해주세요
            </p>
          )}
          <button
            onClick={() => router.back()}
            className="w-full mt-2 py-3 font-bold text-sm rounded-2xl border border-ocean-700 text-slate-500 hover:text-slate-300 transition-colors bg-transparent">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
