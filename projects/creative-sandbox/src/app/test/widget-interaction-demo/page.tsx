"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useCanvasStore } from "@/store/use-canvas-store";

const MultiWidgetCanvas = dynamic(
  () => import("./multi-widget-canvas").then((m) => m.MultiWidgetCanvas),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">로딩 중...</div> }
);

export default function WidgetInteractionDemo() {
  const { setCanvasId, setVisibility } = useCanvasStore();

  useEffect(() => {
    setCanvasId("demo-multi");
    setVisibility("private");
  }, [setCanvasId, setVisibility]);

  return (
    <div className="h-screen flex flex-col">
      <div className="px-4 py-2 bg-white border-b flex items-center gap-3">
        <a href="/test" className="text-sm text-gray-500 hover:text-gray-700">← 테스트 목록</a>
        <span className="text-sm font-medium">위젯 인터랙션 데모 — 3개 위젯 동시 동작</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <MultiWidgetCanvas />
      </div>
    </div>
  );
}
