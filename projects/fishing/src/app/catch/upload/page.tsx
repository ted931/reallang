"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";

interface PhotoItem {
  id: string;
  originalName: string;
  originalSize: number;
  webpSize: number;
  dataUrl: string;
  savings: number; // %
}

async function convertToWebP(file: File, quality = 0.82): Promise<{ dataUrl: string; webpSize: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // 최대 1920px로 리사이즈
      const maxDim = 1920;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round((h / w) * maxDim); w = maxDim; }
        else { w = Math.round((w / h) * maxDim); h = maxDim; }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) { resolve({ dataUrl: url, webpSize: file.size }); return; }
        const reader = new FileReader();
        reader.onload = () => resolve({ dataUrl: reader.result as string, webpSize: blob.size });
        reader.readAsDataURL(blob);
      }, "image/webp", quality);
    };
    img.src = url;
  });
}

const FISH_LIST = ["갈치", "참돔", "감성돔", "방어", "부시리", "벵에돔", "볼락", "반열기", "학꽁치", "기타"];
const REGIONS = ["서귀포", "모슬포", "한림", "성산", "애월", "구좌", "제주시 외도", "화순", "기타"];

export default function CatchUploadPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [converting, setConverting] = useState(false);
  const [fish, setFish] = useState<string[]>([]);
  const [region, setRegion] = useState("");
  const [memo, setMemo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList) => {
    setConverting(true);
    const results: PhotoItem[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const { dataUrl, webpSize } = await convertToWebP(file);
      const savings = Math.round((1 - webpSize / file.size) * 100);
      results.push({
        id: `${Date.now()}-${Math.random()}`,
        originalName: file.name,
        originalSize: file.size,
        webpSize,
        dataUrl,
        savings: Math.max(0, savings),
      });
    }
    setPhotos((prev) => [...prev, ...results]);
    setConverting(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const removePhoto = (id: string) => setPhotos((prev) => prev.filter(p => p.id !== id));
  const toggleFish = (f: string) => setFish(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🎣</div>
        <h1 className="text-2xl font-black text-white mb-2">조황 등록 완료!</h1>
        <p className="text-slate-400 text-sm mb-6">
          {photos.length}장의 사진이 WebP로 변환되어 저장됐습니다.<br />
          평균 {Math.round(photos.reduce((a, p) => a + p.savings, 0) / (photos.length || 1))}% 용량 절감!
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/catch" className="px-6 py-3 bg-hook text-ocean-950 font-black rounded-2xl">조황 보러가기</Link>
          <button onClick={() => { setPhotos([]); setFish([]); setRegion(""); setMemo(""); setSubmitted(false); }}
            className="px-6 py-3 border border-ocean-700 text-slate-400 rounded-2xl font-bold">다시 등록</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-32">
      <Link href="/catch" className="text-sm text-ocean-400 hover:text-ocean-300 mb-6 inline-block">← 조황 목록</Link>

      <h1 className="text-xl font-black text-white mb-1">🎣 조황 사진 등록</h1>
      <p className="text-xs text-slate-500 mb-5">사진은 자동으로 WebP 변환 후 저장됩니다 (용량 절감)</p>

      {/* 사진 업로드 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="rounded-2xl border-2 border-dashed border-ocean-700 hover:border-ocean-500 bg-ocean-900/40 p-8 text-center cursor-pointer transition-colors mb-4">
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)} />
        {converting ? (
          <div>
            <div className="text-3xl mb-2 animate-pulse">⚙️</div>
            <div className="text-sm text-slate-400">WebP로 변환 중...</div>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-2">📸</div>
            <div className="text-sm text-slate-300 font-bold mb-1">사진을 끌어다 놓거나 클릭하세요</div>
            <div className="text-xs text-slate-500">JPG, PNG, HEIC → WebP 자동 변환 · 최대 1920px 리사이즈</div>
          </div>
        )}
      </div>

      {/* 변환된 사진 목록 */}
      {photos.length > 0 && (
        <div className="mb-5">
          <div className="text-xs text-slate-500 mb-2">업로드된 사진 ({photos.length}장)</div>
          <div className="grid grid-cols-2 gap-2">
            {photos.map((p) => (
              <div key={p.id} className="relative rounded-xl overflow-hidden bg-ocean-800 aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.dataUrl} alt={p.originalName} className="w-full h-full object-cover" />
                <button onClick={() => removePhoto(p.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-red-600 transition-colors">
                  ✕
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <div className="text-[10px] text-teal-300 font-bold">
                    WebP {(p.webpSize / 1024).toFixed(0)}KB
                    <span className="text-slate-400 ml-1">(↓{p.savings}%)</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 전체 절감 */}
          <div className="mt-2 text-xs text-teal-400 text-right">
            총 절감: {((photos.reduce((a, p) => a + p.originalSize, 0) - photos.reduce((a, p) => a + p.webpSize, 0)) / 1024).toFixed(0)}KB 절약
          </div>
        </div>
      )}

      {/* 어종 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-3">잡은 어종 (복수 선택)</h2>
        <div className="flex flex-wrap gap-2">
          {FISH_LIST.map(f => (
            <button key={f} onClick={() => toggleFish(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${fish.includes(f) ? "bg-hook text-ocean-950" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 지역 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-4">
        <h2 className="font-bold text-slate-200 mb-3">출조 지역</h2>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map(r => (
            <button key={r} onClick={() => setRegion(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${region === r ? "bg-ocean-600 text-white" : "bg-ocean-800 text-slate-400 hover:text-slate-200"}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div className="rounded-2xl border border-ocean-800 bg-ocean-900 p-5 mb-6">
        <h2 className="font-bold text-slate-200 mb-3">조황 메모</h2>
        <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={4}
          placeholder="오늘의 조황을 공유해주세요. 수심, 미끼, 날씨 등..."
          className="w-full bg-ocean-800 border border-ocean-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-ocean-500 resize-none" />
        <div className="text-right text-xs text-slate-600 mt-1">{memo.length}/500</div>
      </div>

      {/* 제출 버튼 */}
      <div className="fixed bottom-20 left-0 right-0 z-40 bg-ocean-950/95 border-t border-ocean-800 px-4 py-3 backdrop-blur-sm">
        <div className="max-w-xl mx-auto">
          <button
            disabled={photos.length === 0 || fish.length === 0 || !region}
            onClick={() => setSubmitted(true)}
            className={`w-full py-4 font-black text-lg rounded-2xl transition-colors ${photos.length > 0 && fish.length > 0 && region ? "bg-hook hover:bg-hook-light text-ocean-950" : "bg-ocean-800 text-slate-600 cursor-not-allowed"}`}>
            📸 조황 등록하기 {photos.length > 0 ? `(${photos.length}장)` : ""}
          </button>
          {(photos.length === 0 || fish.length === 0 || !region) && (
            <p className="text-center text-xs text-slate-600 mt-1.5">
              {photos.length === 0 ? "사진을" : fish.length === 0 ? "어종을" : "지역을"} 선택해주세요
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
