"use client";

import { useState, useRef, useEffect } from "react";
import { useCanvasStore } from "@/store/use-canvas-store";
import { consumeSSE, extractCode } from "@/lib/stream-utils";

export function ChatPanel() {
  const {
    chatMessages, addChatMessage,
    isGenerating, setIsGenerating,
    editor, setError, isChatOpen,
  } = useCanvasStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatMessages]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || isGenerating) return;

    setInput("");
    addChatMessage({ role: "user", content: message });
    setIsGenerating(true);
    setError(null);

    await consumeSSE(
      "/api/ai/generate",
      { message, chatHistory: chatMessages },
      () => {},
      (fullText) => {
        const code = extractCode(fullText);
        addChatMessage({
          role: "assistant",
          content: "위젯을 생성했습니다! 캔버스에 추가되었어요.",
          code,
        });

        // Insert widget onto canvas
        if (editor) {
          const center = editor.getViewportScreenCenter();
          const pagePoint = editor.screenToPage(center);
          editor.createShape({
            type: "live-widget",
            x: pagePoint.x - 160,
            y: pagePoint.y - 120,
            props: {
              code,
              w: 360,
              h: 280,
              title: message.slice(0, 30),
            },
          });
        }

        setIsGenerating(false);
      },
      (error) => {
        setError(error);
        addChatMessage({ role: "assistant", content: `오류: ${error}` });
        setIsGenerating(false);
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b">
        <h3 className="text-sm font-semibold text-gray-700">💬 AI 위젯 생성</h3>
        <p className="text-xs text-gray-400">원하는 위젯을 설명해주세요</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-400 mb-3">예시:</p>
            {[
              "할 일 목록 앱 만들어줘",
              "간단한 계산기 위젯",
              "메모장 위젯 만들어줘",
            ].map((hint) => (
              <button
                key={hint}
                onClick={() => setInput(hint)}
                className="block mx-auto text-xs text-indigo-500 hover:text-indigo-600 hover:underline mb-1"
              >
                &quot;{hint}&quot;
              </button>
            ))}
          </div>
        )}
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-700 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 text-sm text-gray-400">
              위젯 생성 중...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="어떤 위젯을 만들까요?"
            rows={1}
            className="flex-1 px-3 py-2 text-sm border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isGenerating}
            className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 disabled:opacity-40 transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
