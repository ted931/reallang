"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface Feature {
  name: string;
  desc: string;
  status?: "완료" | "개발중" | "기획중";
}
interface PageDoc {
  title: string;
  summary: string;
  userFlow?: string[];
  features: Feature[];
  notes?: string;
}

const DOCS: Record<string, PageDoc> = {
  "/": {
    title: "💬 AI 고객 상담 챗봇",
    summary: "제주패스 서비스 관련 고객 문의를 AI가 자동 응대하는 CS 챗봇. 예약, 취소, 환불, 렌터카 등 FAQ를 시스템 프롬프트로 주입해 Claude API가 문맥을 이해하며 연속 대화 처리. 관련 FAQ 링크도 함께 제안.",
    userFlow: [
      "페이지 진입 시 AI 상담사 인삿말 자동 표시 + 자주 묻는 질문 버튼 4개 노출",
      "자주 묻는 질문 버튼 클릭 또는 직접 텍스트 입력 후 '전송' 버튼 클릭 (Enter 키도 지원)",
      "사용자 메시지 오른쪽 파란 말풍선으로 추가, 로딩 중 점 3개 애니메이션 표시",
      "/api/chat POST로 전체 대화 히스토리 전송 → Claude API가 맥락 유지하며 답변 생성",
      "AI 응답 왼쪽 흰색 말풍선으로 추가, 스크롤 자동 하단 이동",
      "응답과 함께 관련 FAQ 버튼 목록 표시 — 클릭 시 해당 FAQ 질문을 바로 전송",
      "네트워크 오류 시 사과 메시지 + 긴급 전화번호(1588-0000) 안내 자동 표시",
    ],
    features: [
      {
        name: "채팅 인터페이스",
        desc: "자연스러운 대화형 채팅 UI. 사용자 메시지는 오른쪽 파란 말풍선(rounded-br-md), AI 응답은 왼쪽 흰색 말풍선(rounded-bl-md) 스타일. 메시지 추가 시 scrollRef를 통해 최하단으로 자동 스크롤. 메시지 whitespace-pre-wrap으로 줄바꿈 보존",
        status: "완료",
      },
      {
        name: "자주 묻는 질문 빠른 입력",
        desc: "초기 메시지가 1개(인삿말)일 때만 표시. '예약 취소는 어떻게 하나요?' / '환불은 얼마나 걸리나요?' / '렌터카 픽업 장소가 어디인가요?' / '고객센터 운영시간이 궁금해요' 4가지 버튼. 클릭 시 해당 텍스트를 sendMessage()로 바로 전송",
        status: "완료",
      },
      {
        name: "FAQ 자동 응답",
        desc: "렌터카 취소 정책, 환불 소요 기간, 예약 변경 방법, 픽업 장소, 고객센터 운영시간 등 핵심 FAQ를 시스템 프롬프트에 주입. Claude API가 FAQ 내용 기반으로 정확한 답변 우선 생성. API 응답의 matchedFAQs 배열로 관련 질문 버튼 추가 표시",
        status: "완료",
      },
      {
        name: "문맥 이해 및 연속 대화",
        desc: "sendMessage() 호출 시 전체 messages 배열(user + assistant 역할 전체)을 /api/chat에 전송. Claude API가 대화 히스토리를 컨텍스트로 활용해 '그게 언제까지 가능한가요?' 같은 후속 질문도 앞 맥락을 참조해 처리",
        status: "완료",
      },
      {
        name: "로딩 상태 표시",
        desc: "API 요청 중 loading=true 상태에서 세 점(dots) 바운스 애니메이션 말풍선 표시 (animationDelay 0ms/150ms/300ms 순차). 전송 버튼 및 입력 필드 disabled 처리로 중복 전송 방지",
        status: "완료",
      },
      {
        name: "오류 처리",
        desc: "API 응답 !res.ok 또는 네트워크 예외 시 catch 블록에서 '죄송합니다. 일시적인 오류... 긴급 문의: 1588-0000' 메시지를 AI 말풍선으로 자동 추가. 사용자가 서비스 단절 없이 연락처 확인 가능",
        status: "완료",
      },
      {
        name: "상담원 연결",
        desc: "복잡한 분쟁·법적 문의 등 AI 처리 한계 상황에서 인간 상담원 연결 플로우 안내. 상담 예약 링크 또는 콜백 요청 UI 제공 예정",
        status: "개발중",
      },
      {
        name: "다국어 지원",
        desc: "한국어 외 영어/일본어/중국어(간체) 인터페이스 및 FAQ 데이터 추가. 언어 감지 자동 전환 또는 상단 언어 선택 버튼 제공 예정",
        status: "기획중",
      },
    ],
    notes: "Claude API 기반. 제주패스 서비스 FAQ 데이터를 시스템 프롬프트로 주입. /api/chat POST는 { messages: Message[] } 수신, { reply: string, matchedFAQs?: MatchedFAQ[] } 반환",
  },
};

export function DevFeaturePanel() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const key = Object.keys(DOCS).find(k => {
    if (k === pathname) return true;
    const pattern = k.replace(/\[.*?\]/g, "[^/]+");
    return new RegExp(`^${pattern}$`).test(pathname);
  }) ?? "/";
  const doc = DOCS[key];
  if (!doc) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{ writingMode: "vertical-rl" }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[9996] bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-4 px-2 rounded-l-xl shadow-lg transition-colors cursor-pointer"
        >
          기획서
        </button>
      )}
      {open && (
        <div className="fixed right-0 top-9 bottom-0 w-[500px] bg-white z-[9995] overflow-y-auto shadow-2xl border-l border-gray-200">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="font-bold text-base text-gray-900">{doc.title}</h2>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 text-xl transition-colors"
            >×</button>
          </div>
          <div className="px-6 py-5 space-y-6">
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">{doc.summary}</p>
            {doc.userFlow && doc.userFlow.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-3">유저 플로우</h3>
                <div className="space-y-2.5">
                  {doc.userFlow.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">기능 명세</h3>
              <div className="space-y-3">
                {doc.features.map((f, i) => (
                  <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">{f.name}</span>
                      {f.status && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          f.status === "완료" ? "bg-emerald-100 text-emerald-700" :
                          f.status === "개발중" ? "bg-blue-100 text-blue-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{f.status}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            {doc.notes && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-sm text-amber-800 leading-relaxed">📌 {doc.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
