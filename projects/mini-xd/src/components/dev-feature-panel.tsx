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
    title: "🎨 이미지 업로드",
    summary: "디자인 시안(이미지/PDF)을 업로드하면 AI(GPT-4o)가 분석하여 실제 동작하는 HTML/CSS 코드로 변환해주는 서비스의 진입점.",
    userFlow: [
      "페이지 진입 — 업로드 영역(드래그앤드롭 또는 파일 선택) 확인",
      "ImageUploader로 디자인 시안 이미지 선택 또는 드롭",
      "ContextSelector에서 사이트 유형(랜딩/대시보드/쇼핑몰 등) 선택",
      "'코드 생성하기' 버튼 클릭 → 버튼이 '코드 생성 중...' 스피너로 전환",
      "POST /api/analyze → SSE 스트리밍으로 코드 실시간 생성 (analyzing 페이즈)",
      "스트리밍 완료 후 마크다운 펜스 제거 + cleanupCode() 처리",
      "Zustand 스토어에 code + IR 저장 후 /editor로 자동 라우팅",
    ],
    features: [
      {
        name: "이미지 업로드",
        desc: "입력: ImageUploader 컴포넌트 — 드래그앤드롭 또는 파일 선택. 출력: imageBase64 + imageMediaType을 Zustand 스토어에 저장. 엣지 케이스: imageBase64 없으면 '코드 생성하기' 버튼 disabled. 이미지 미선택 시 회색 버튼(cursor-not-allowed).",
        status: "완료"
      },
      {
        name: "사이트 유형 선택",
        desc: "입력: ContextSelector — 사이트 유형 enum 선택. 출력: siteType 스토어에 저장, 분석 API 요청 시 함께 전송. 엣지 케이스: 미선택 시 기본값 사용 (null → API에서 'landing' fallback).",
        status: "완료"
      },
      {
        name: "AI 코드 생성 (SSE 스트리밍)",
        desc: "입력: imageBase64 + imageMediaType + siteType. 출력: POST /api/analyze → Server-Sent Events로 HTML 코드 청크 스트리밍. consumeSSE()로 청크 누적하며 setCode() 실시간 반영. 완료 시 마크다운 펜스(```html) 제거 + cleanupCode() 정리. 엣지 케이스: SSE 오류 시 setError() + phase='upload'로 복구.",
        status: "완료"
      },
      {
        name: "에디터 자동 이동",
        desc: "입력: SSE 완료 콜백. 출력: pushHistory(cleanedCode)로 Undo 히스토리 초기화, setIR()로 IR 객체 생성, setPhase('editing'), router.push('/editor'). 엣지 케이스: IR 없으면 에디터에서 / 로 리다이렉트됨.",
        status: "완료"
      },
      {
        name: "에러 표시",
        desc: "입력: SSE 오류 또는 API 실패. 출력: 업로드 폼 하단에 빨간 배경 에러 메시지 박스 표시. 엣지 케이스: error state가 null이면 에러 박스 미표시. 새 시도 시 setError(null)로 초기화.",
        status: "완료"
      },
      {
        name: "URL 입력",
        desc: "입력: (예정) 참고 URL. 출력: (예정) URL 기반 분석 시작. 엣지 케이스: CORS 이슈 있는 URL, 로그인 필요 페이지 등 처리 필요.",
        status: "개발중"
      },
    ],
    notes: "Figma → 코드, 스케치 → 코드 워크플로우 지원 목표. 현재 GPT-4o 비전 API 사용."
  },
  "/editor": {
    title: "💻 코드 에디터",
    summary: "AI가 생성한 HTML/CSS 코드를 실시간 편집하고 미리보기하는 3패널 에디터. 코드 에디터(40%) + 프리뷰(35%) + AI 채팅(25%) 레이아웃.",
    userFlow: [
      "홈에서 코드 생성 완료 후 /editor 자동 진입 (IR 없으면 / 리다이렉트)",
      "기본 탭은 'preview' — 오른쪽 프리뷰 패널에서 생성된 결과물 확인",
      "코드 탭 전환 → CodeEditor에서 HTML/CSS 직접 수정 (신택스 하이라이팅)",
      "채팅 탭 전환 → ChatPanel에서 '버튼 색을 파란색으로' 등 자연어로 수정 요청",
      "AI가 SSE로 수정 코드 스트리밍 → 코드 에디터 + 프리뷰 실시간 반영",
      "Undo/Redo로 히스토리 이동 (CodeToolbar)",
      "원본 비교 모드로 업로드 시안과 현재 결과물 나란히 비교",
      "완성 후 코드 다운로드 (예정)",
    ],
    features: [
      {
        name: "코드 편집기 (CodeEditor)",
        desc: "입력: 직접 타이핑 또는 AI 스트리밍으로 코드 업데이트. 출력: Zustand code 상태 업데이트 → PreviewPanel 즉시 반영. 신택스 하이라이팅 지원. 엣지 케이스: 스트리밍 중에는 상단 우측에 '생성 중...' / '수정 중...' 파란 뱃지 표시.",
        status: "완료"
      },
      {
        name: "실시간 미리보기 (PreviewPanel)",
        desc: "입력: code 상태. 출력: iframe 또는 srcdoc으로 HTML 실시간 렌더링. 엣지 케이스: code 빈 문자열이면 빈 프리뷰. 스크립트 실행 포함(JS 동작 확인 가능).",
        status: "완료"
      },
      {
        name: "AI 채팅 수정 (ChatPanel)",
        desc: "입력: 자연어 수정 요청 텍스트 (예: '배경색을 네이비로 바꿔줘'). 출력: POST API → SSE 스트리밍으로 수정된 코드 반환 → extractCode()로 코드 블록 추출. 엣지 케이스: 스트리밍 중 phase='refining', 완료 시 pushHistory()로 Undo 히스토리에 추가.",
        status: "완료"
      },
      {
        name: "Undo/Redo (CodeToolbar)",
        desc: "입력: Ctrl+Z / Ctrl+Y 또는 툴바 버튼. 출력: pushHistory()/undoHistory()/redoHistory()로 코드 스냅샷 이동. 엣지 케이스: 히스토리 시작점에서 Undo 불가(버튼 disabled), 최신에서 Redo 불가.",
        status: "완료"
      },
      {
        name: "원본 비교 모드",
        desc: "입력: CodeToolbar의 비교 모드 토글 버튼. 출력: 업로드 원본 이미지와 현재 코드 프리뷰를 좌우 분할 화면으로 표시. 엣지 케이스: 원본 이미지(imageBase64) 없으면 비교 모드 버튼 비활성화.",
        status: "완료"
      },
      {
        name: "모바일 탭 전환",
        desc: "입력: 하단 탭 버튼 클릭 (코드/프리뷰/채팅). 출력: lg 미만 화면에서 활성 탭만 표시, 나머지 hidden. 엣지 케이스: lg 이상(데스크탑)에서는 탭 바 숨김, 3패널 항상 표시.",
        status: "완료"
      },
      {
        name: "에러 바",
        desc: "입력: error 상태 (스트리밍 실패 등). 출력: 상단에 빨간 배경 에러 메시지 바 + '닫기' 버튼. 엣지 케이스: '닫기' 클릭 시 setError(null).",
        status: "완료"
      },
      {
        name: "코드 다운로드",
        desc: "입력: (예정) 다운로드 버튼. 출력: (예정) 현재 code 상태를 .html 파일로 저장. 엣지 케이스: 파일명 자동 생성 규칙 미정.",
        status: "개발중"
      },
    ],
    notes: "AI 코드 생성 품질은 GPT-4o API에 의존. 복잡한 인터랙션(React 컴포넌트 등)은 별도 수작업 필요."
  }
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
