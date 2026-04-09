"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "@/store/use-project-store";
import { consumeSSE, extractCode } from "@/lib/stream-utils";
import { CodeEditor } from "@/components/code-editor";
import { PreviewPanel } from "@/components/preview-panel";
import { ChatPanel } from "@/components/chat-panel";
import { CodeToolbar } from "@/components/code-toolbar";

type Tab = "code" | "preview" | "chat";

export default function EditorPage() {
  const router = useRouter();
  const { ir, phase, setPhase, setCode, setError, error, code } = useProjectStore();
  const [activeTab, setActiveTab] = useState<Tab>("preview");

  // Redirect if no IR
  useEffect(() => {
    if (!ir) {
      router.push("/");
    }
  }, [ir, router]);

  // 코드가 이미 홈에서 생성되어 넘어옴 — 자동 생성 불필요
  // phase가 아직 analyzing이면 editing으로 전환
  useEffect(() => {
    if (code && (phase === "generating" || phase === "analyzing")) {
      setPhase("editing");
    }
  }, [code, phase, setPhase]);

  if (!ir) return null;

  const isStreaming = phase === "generating" || phase === "refining";

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <CodeToolbar />

      {/* Error bar */}
      {error && (
        <div className="px-4 py-2 bg-red-900/50 text-red-300 text-sm border-b border-red-800">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">닫기</button>
        </div>
      )}

      {/* Mobile tabs */}
      <div className="flex lg:hidden border-b border-gray-700">
        {(["code", "preview", "chat"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            {tab === "code" ? "코드" : tab === "preview" ? "프리뷰" : "채팅"}
          </button>
        ))}
      </div>

      {/* Desktop: 3-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className={`lg:w-[40%] lg:block ${activeTab === "code" ? "block w-full" : "hidden"}`}>
          <div className="h-full relative">
            <CodeEditor />
            {isStreaming && (
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                {phase === "generating" ? "생성 중..." : "수정 중..."}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className={`lg:w-[35%] lg:block border-l border-gray-700 ${activeTab === "preview" ? "block w-full" : "hidden"}`}>
          <PreviewPanel />
        </div>

        {/* Chat */}
        <div className={`lg:w-[25%] lg:block border-l border-gray-700 ${activeTab === "chat" ? "block w-full" : "hidden"}`}>
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
