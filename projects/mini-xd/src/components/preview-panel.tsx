"use client";

import { useEffect, useRef, useState } from "react";
import { buildPreviewHTML } from "@/lib/preview-template";
import { useProjectStore } from "@/store/use-project-store";

export function PreviewPanel() {
  const { code, viewportWidth, imageBase64, imageMediaType, compareMode, overlayOpacity, setOverlayOpacity } = useProjectStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [debouncedCode, setDebouncedCode] = useState(code);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCode(code), 600);
    return () => clearTimeout(timer);
  }, [code]);

  useEffect(() => {
    if (iframeRef.current && debouncedCode) {
      iframeRef.current.srcdoc = buildPreviewHTML(debouncedCode);
    }
  }, [debouncedCode]);

  if (!code) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400 text-sm">
        코드가 생성되면 프리뷰가 표시됩니다
      </div>
    );
  }

  const iframeStyle = { width: viewportWidth === 1280 ? "100%" : `${viewportWidth}px` };
  const hasImage = imageBase64 && imageMediaType;
  const imageSrc = hasImage ? `data:${imageMediaType};base64,${imageBase64}` : "";

  // 기본 프리뷰 (비교 모드 off)
  if (compareMode === "off" || !hasImage) {
    return (
      <div className="h-full bg-white flex items-start justify-center overflow-auto p-2">
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts"
          title="Preview"
          style={iframeStyle}
          className="h-full border border-gray-200 rounded-lg bg-white transition-all duration-300"
        />
      </div>
    );
  }

  // 나란히 비교 (side-by-side)
  if (compareMode === "side") {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-center gap-4 px-3 py-1.5 bg-gray-100 border-b text-xs text-gray-500">
          <span>원본 디자인</span>
          <span>|</span>
          <span>생성 결과</span>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 overflow-auto p-2 border-r border-gray-200 bg-gray-50">
            <img src={imageSrc} alt="원본 디자인" className="w-full h-auto object-contain" />
          </div>
          <div className="w-1/2 overflow-auto p-2 bg-white">
            <iframe
              ref={iframeRef}
              sandbox="allow-scripts"
              title="Preview"
              className="w-full h-full border border-gray-200 rounded-lg bg-white"
            />
          </div>
        </div>
      </div>
    );
  }

  // 오버레이 비교
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-100 border-b">
        <span className="text-xs text-gray-500 shrink-0">투명도</span>
        <input
          type="range"
          min={0}
          max={100}
          value={overlayOpacity}
          onChange={(e) => setOverlayOpacity(Number(e.target.value))}
          className="flex-1 h-1 accent-blue-600"
        />
        <span className="text-xs text-gray-500 w-8 text-right">{overlayOpacity}%</span>
      </div>
      <div className="flex-1 relative overflow-auto p-2 bg-white">
        <iframe
          ref={iframeRef}
          sandbox="allow-scripts"
          title="Preview"
          style={iframeStyle}
          className="h-full border border-gray-200 rounded-lg bg-white"
        />
        <img
          src={imageSrc}
          alt="원본 디자인 오버레이"
          style={{ opacity: overlayOpacity / 100 }}
          className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] object-contain pointer-events-none"
        />
      </div>
    </div>
  );
}
