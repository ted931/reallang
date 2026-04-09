"use client";

import { useEffect, useRef, useState } from "react";
import { buildPreviewHTML } from "@/lib/preview-template";
import { useProjectStore } from "@/store/use-project-store";

export function PreviewPanel() {
  const { code, viewportWidth } = useProjectStore();
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

  return (
    <div className="h-full bg-white flex items-start justify-center overflow-auto p-2">
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        title="Preview"
        style={{ width: viewportWidth === 1280 ? "100%" : `${viewportWidth}px` }}
        className="h-full border border-gray-200 rounded-lg bg-white transition-all duration-300"
      />
    </div>
  );
}
