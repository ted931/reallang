"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { CanvasToolbar } from "@/components/canvas/canvas-toolbar";
import { ChatPanel } from "@/components/chat/chat-panel";
import { useCanvasStore } from "@/store/use-canvas-store";

const CreativeCanvas = dynamic(
  () =>
    import("@/components/canvas/creative-canvas").then((m) => m.CreativeCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-400">
        캔버스 로딩 중...
      </div>
    ),
  }
);

interface Props {
  canvasId: string;
  title: string;
  initialSnapshot: Record<string, unknown> | null;
  visibility: "private" | "public";
  user: { id: string; email: string };
}

export function CanvasEditorClient({
  canvasId,
  title,
  initialSnapshot,
  visibility,
  user,
}: Props) {
  const { setCanvasId, setVisibility, isChatOpen } = useCanvasStore();

  useEffect(() => {
    setCanvasId(canvasId);
    setVisibility(visibility);
    (window as unknown as Record<string, unknown>).__sandbox_user = user;
  }, [canvasId, visibility, user, setCanvasId, setVisibility]);

  return (
    <div className="h-screen flex flex-col">
      <CanvasToolbar canvasId={canvasId} title={title} />
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-hidden">
          <CreativeCanvas canvasId={canvasId} initialSnapshot={initialSnapshot} />
        </div>
        {isChatOpen && (
          <div className="w-80 border-l border-gray-200 flex-shrink-0">
            <ChatPanel />
          </div>
        )}
      </div>
    </div>
  );
}
