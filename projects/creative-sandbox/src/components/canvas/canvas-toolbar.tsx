"use client";

import { useRouter } from "next/navigation";
import { useCanvasStore } from "@/store/use-canvas-store";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface Props {
  canvasId: string;
  title: string;
}

export function CanvasToolbar({ canvasId, title }: Props) {
  const router = useRouter();
  const { visibility, setVisibility, editor, isChatOpen, toggleChat } = useCanvasStore();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [widgetCode, setWidgetCode] = useState("");
  const [widgetTitle, setWidgetTitle] = useState("");
  const supabase = createClient();

  const handleToggleVisibility = async () => {
    const newVisibility = visibility === "private" ? "public" : "private";
    setVisibility(newVisibility);
    await supabase
      .from("canvases")
      .update({ visibility: newVisibility })
      .eq("id", canvasId);
  };

  const handleAddWidget = () => {
    if (!editor || !widgetCode.trim()) return;

    const center = editor.getViewportScreenCenter();
    const pagePoint = editor.screenToPage(center);

    editor.createShape({
      type: "live-widget",
      x: pagePoint.x - 180,
      y: pagePoint.y - 140,
      props: {
        code: widgetCode.trim(),
        w: 360,
        h: 280,
        title: widgetTitle.trim() || "위젯",
      },
    });

    setWidgetCode("");
    setWidgetTitle("");
    setShowCodeInput(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b z-50 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 대시보드
          </button>
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleVisibility}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              visibility === "public"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-600 border-gray-200"
            }`}
          >
            {visibility === "public" ? "🌐 공개" : "🔒 비공개"}
          </button>

          <button
            onClick={toggleChat}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              isChatOpen
                ? "bg-purple-100 text-purple-700 border border-purple-200"
                : "bg-purple-600 text-white hover:bg-purple-500"
            }`}
          >
            🤖 AI 채팅
          </button>

          <button
            onClick={() => setShowCodeInput(true)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            + 위젯 추가
          </button>
        </div>
      </div>

      {/* 코드 입력 모달 */}
      {showCodeInput && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold">위젯 추가</h2>
              <p className="text-sm text-gray-500 mt-1">
                React 코드를 붙여넣으면 캔버스에 라이브 위젯으로 렌더링됩니다
              </p>
            </div>

            <div className="p-5 flex-1 overflow-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  위젯 이름
                </label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  placeholder="예: 카운터, 할일목록..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  React 코드
                </label>
                <textarea
                  value={widgetCode}
                  onChange={(e) => setWidgetCode(e.target.value)}
                  placeholder={`() => {
  const [count, setCount] = useState(0);
  return (
    <div style={{padding: 16}}>
      <p>{count}</p>
      <button onClick={() => setCount(c => c+1)}>+</button>
    </div>
  );
}`}
                  rows={14}
                  className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 space-y-1">
                <p className="font-medium text-gray-700">사용 가능한 scope:</p>
                <p>React hooks: useState, useEffect, useRef, useCallback, useMemo</p>
                <p>데이터: saveData(table, data), loadData(table), me()</p>
                <p>스타일: inline style만 사용 (Tailwind X)</p>
              </div>
            </div>

            <div className="p-5 border-t flex gap-2 justify-end">
              <button
                onClick={() => { setShowCodeInput(false); setWidgetCode(""); setWidgetTitle(""); }}
                className="px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleAddWidget}
                disabled={!widgetCode.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:opacity-40"
              >
                캔버스에 추가
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
