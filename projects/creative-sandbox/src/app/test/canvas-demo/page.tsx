"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { useCanvasStore } from "@/store/use-canvas-store";

const CreativeCanvasDemo = dynamic(
  () => import("./demo-canvas").then((m) => m.DemoCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">
        캔버스 로딩 중...
      </div>
    ),
  }
);

export default function CanvasDemoPage() {
  const { setCanvasId, setVisibility } = useCanvasStore();

  useEffect(() => {
    setCanvasId("demo");
    setVisibility("private");
    (window as unknown as Record<string, unknown>).__sandbox_user = {
      id: "demo-user",
      email: "demo@test.com",
    };
  }, [setCanvasId, setVisibility]);

  return (
    <div className="h-screen flex flex-col">
      <CanvasToolbar canvasId="demo" title="데모 캔버스" />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <CreativeCanvasDemo />
        </div>
        <ChatPanel />
      </div>
    </div>
  );
}
