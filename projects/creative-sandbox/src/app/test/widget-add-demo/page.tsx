"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";
import { useCanvasStore } from "@/store/use-canvas-store";

const DemoCanvas = dynamic(
  () => import("../canvas-demo/demo-canvas").then((m) => m.DemoCanvas),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">로딩 중...</div> }
);

export default function WidgetAddDemo() {
  const { setCanvasId, setVisibility } = useCanvasStore();

  useEffect(() => {
    setCanvasId("demo-add");
    setVisibility("private");
    (window as unknown as Record<string, unknown>).__sandbox_user = { id: "demo", email: "demo@test.com" };
  }, [setCanvasId, setVisibility]);

  return (
    <div className="h-screen flex flex-col">
      <CanvasToolbar canvasId="demo-add" title="위젯 추가 데모 — 우측 상단 '+ 위젯 추가' 클릭" />
      <div className="flex-1 overflow-hidden">
        <DemoCanvas />
      </div>
    </div>
  );
}
