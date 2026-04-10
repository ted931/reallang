"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface MatchedFAQ {
  id: string;
  question: string;
  category: string;
}

const QUICK_QUESTIONS = [
  "예약 취소는 어떻게 하나요?",
  "환불은 얼마나 걸리나요?",
  "렌터카 픽업 장소가 어디인가요?",
  "고객센터 운영시간이 궁금해요",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕하세요! 제주패스 AI 상담사입니다.\n예약, 취소, 환불, 렌터카, 숙소 등 궁금한 점을 편하게 물어보세요.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchedFAQs, setMatchedFAQs] = useState<MatchedFAQ[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setMatchedFAQs([]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((m) => m.role === "user" || m.role === "assistant"),
        }),
      });

      if (!res.ok) {
        throw new Error("응답 오류");
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
      if (data.matchedFAQs?.length) {
        setMatchedFAQs(data.matchedFAQs);
      }
    } catch {
      setMessages([
        ...newMessages,
        { role: "assistant", content: "죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.\n\n긴급 문의: 1588-0000" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur border-b border-sky-100">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">💬 AI 고객 상담</h1>
          <p className="text-xs text-gray-500 mt-0.5">제주패스 예약/취소/환불 등 무엇이든 물어보세요</p>
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-sky-500 text-white rounded-br-md"
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm"
                }`}
              >
                {msg.role === "assistant" && (
                  <span className="text-[10px] text-gray-400 block mb-1">AI 상담사</span>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                <span className="text-[10px] text-gray-400 block mb-1">AI 상담사</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* 매칭된 FAQ */}
          {matchedFAQs.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400">관련 질문</p>
              {matchedFAQs.map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => sendMessage(faq.question)}
                  className="block text-left w-full px-3 py-2 bg-sky-50 border border-sky-100 rounded-lg text-xs text-sky-700 hover:bg-sky-100 transition-colors"
                >
                  <span className="text-sky-400 mr-1">[{faq.category}]</span>
                  {faq.question}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Questions (초기 상태) */}
      {messages.length <= 1 && (
        <div className="max-w-2xl mx-auto px-6 pb-2 w-full">
          <p className="text-xs text-gray-400 mb-2">자주 묻는 질문</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-sky-300 hover:text-sky-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-gray-100 bg-white">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-6 py-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="궁금한 점을 입력하세요..."
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-100 outline-none text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 rounded-xl bg-sky-500 text-white font-medium text-sm hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            전송
          </button>
        </form>
        <div className="max-w-2xl mx-auto px-6 pb-3">
          <p className="text-[10px] text-gray-300 text-center">
            AI 상담은 참고용이며, 정확한 확인은 고객센터 1588-0000으로 문의해주세요
          </p>
        </div>
      </div>
    </div>
  );
}
