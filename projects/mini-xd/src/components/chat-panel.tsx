"use client";

import { useState, useRef, useEffect } from "react";
import { useProjectStore } from "@/store/use-project-store";
import { consumeSSE, extractCode } from "@/lib/stream-utils";
import { cleanupCode } from "@/lib/code-cleanup";

export function ChatPanel() {
  const {
    chatMessages, addChatMessage,
    code, setCode, ir,
    phase, setPhase, setError,
    imageBase64, imageMediaType, pushHistory,
  } = useProjectStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = async () => {
    const message = input.trim();
    if (!message || phase === "refining") return;

    setInput("");
    addChatMessage({ role: "user", content: message });
    setPhase("refining");
    setError(null);

    let fullResponse = "";

    await consumeSSE(
      "/api/refine",
      { message, currentCode: code, ir, chatHistory: chatMessages, originalImage: imageBase64, imageMediaType },
      () => {},
      (fullText) => {
        const stripped = fullText.replace(/```html\s*/g, '').replace(/```\s*/g, '').trim();
        fullResponse = cleanupCode(stripped);
        setCode(fullResponse);
        pushHistory(fullResponse);
        addChatMessage({ role: "assistant", content: "코드를 수정했습니다." });
        setPhase("editing");
      },
      (error) => {
        setError(error);
        addChatMessage({ role: "assistant", content: `오류: ${error}` });
        setPhase("editing");
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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white">
        <h3 className="text-sm font-semibold text-gray-700">수정 채팅</h3>
        <p className="text-xs text-gray-400">원하는 변경사항을 말해주세요</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">예시:</p>
            <div className="mt-2 space-y-1">
              {["배경색을 더 어둡게 해줘", "버튼을 더 둥글게", "헤더에 로고 추가해줘"].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setInput(hint)}
                  className="block mx-auto text-xs text-blue-500 hover:text-blue-600 hover:underline"
                >
                  &quot;{hint}&quot;
                </button>
              ))}
            </div>
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
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-white text-gray-700 border rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {phase === "refining" && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl rounded-bl-md px-3 py-2 text-sm text-gray-400">
              수정 중...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="변경 사항을 입력하세요..."
            rows={1}
            className="flex-1 px-3 py-2 text-sm border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || phase === "refining"}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-500 disabled:opacity-40 transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
