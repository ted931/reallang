"use client";

import { useState } from "react";
import { useProjectStore } from "@/store/use-project-store";
import { useRouter } from "next/navigation";
import { downloadHtml, downloadCode } from "@/lib/export-utils";

const VIEWPORTS = [
  { width: 375, label: "모바일", icon: "📱" },
  { width: 768, label: "태블릿", icon: "📋" },
  { width: 1280, label: "데스크탑", icon: "🖥️" },
];

export function CodeToolbar() {
  const { code, viewportWidth, setViewportWidth, reset, undo, redo, canUndo, canRedo, compareMode, setCompareMode } = useProjectStore();
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const router = useRouter();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNew = () => {
    reset();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <button
          onClick={handleNew}
          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← 새 디자인
        </button>
        <span className="text-xs text-gray-500">Mini XD</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Undo/Redo */}
        <div className="hidden sm:flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo()}
            title="실행취소 (Undo)"
            className="px-2 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            ↩
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            title="다시실행 (Redo)"
            className="px-2 py-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            ↪
          </button>
        </div>

        {/* Compare mode */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
          {([
            { mode: "off" as const, label: "프리뷰", icon: "👁" },
            { mode: "side" as const, label: "나란히 비교", icon: "⬜⬜" },
            { mode: "overlay" as const, label: "겹쳐 비교", icon: "🔲" },
          ]).map(({ mode, label, icon }) => (
            <button
              key={mode}
              onClick={() => setCompareMode(mode)}
              title={label}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                compareMode === mode
                  ? "bg-gray-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Viewport toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-gray-800 rounded-lg p-0.5">
          {VIEWPORTS.map(({ width, label, icon }) => (
            <button
              key={width}
              onClick={() => setViewportWidth(width)}
              title={label}
              className={`px-2 py-1 text-sm rounded-md transition-colors ${
                viewportWidth === width
                  ? "bg-gray-600 text-white"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          disabled={!code}
          className="px-3 py-1.5 text-xs font-medium text-gray-300 bg-gray-800 rounded-lg hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {copied ? "✓ 복사됨" : "코드 복사"}
        </button>

        {/* Export dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExport(!showExport)}
            disabled={!code}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-40 transition-colors"
          >
            내보내기 ▾
          </button>
          {showExport && code && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowExport(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden">
                <button
                  onClick={() => { downloadHtml(code); setShowExport(false); }}
                  className="w-full px-4 py-2.5 text-left text-xs text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                >
                  <span>🌐</span> HTML 파일 다운로드
                  <span className="text-gray-500 ml-auto">.html</span>
                </button>
                <button
                  onClick={() => { downloadCode(code); setShowExport(false); }}
                  className="w-full px-4 py-2.5 text-left text-xs text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                >
                  <span>📄</span> TSX 코드 다운로드
                  <span className="text-gray-500 ml-auto">.tsx</span>
                </button>
                <button
                  onClick={() => { handleCopy(); setShowExport(false); }}
                  className="w-full px-4 py-2.5 text-left text-xs text-gray-200 hover:bg-gray-700 flex items-center gap-2"
                >
                  <span>📋</span> 클립보드에 복사
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
