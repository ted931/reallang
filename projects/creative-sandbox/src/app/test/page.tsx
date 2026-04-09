"use client";

import { useRouter } from "next/navigation";

const SANDBOX_PAGES = [
  {
    step: 1,
    name: "로그인 페이지",
    path: "/login",
    desc: "이메일 입력 → 매직 링크 발송 UI",
  },
  {
    step: 2,
    name: "대시보드",
    path: "/dashboard",
    desc: "캔버스 목록 + 생성/삭제 (로그인 필요)",
  },
  {
    step: 3,
    name: "캔버스 — tldraw 무한 캔버스",
    path: "/test/canvas-demo",
    desc: "tldraw 그리기 + 카운터 데모 위젯 렌더링",
  },
  {
    step: 4,
    name: "위젯 추가 모달",
    path: "/test/widget-add-demo",
    desc: "코드 붙여넣기 → 캔버스에 라이브 위젯 추가",
  },
  {
    step: 5,
    name: "위젯 인터랙션",
    path: "/test/widget-interaction-demo",
    desc: "다양한 위젯(카운터, 메모장, 컬러피커) 동시 렌더링 + 클릭 동작",
  },
  {
    step: 6,
    name: "공개/비공개 토글",
    path: "/test/visibility-demo",
    desc: "상단 바 공개↔비공개 전환 UI",
  },
];

const MINIXD_PAGES = [
  {
    step: 7,
    name: "Mini XD — 이미지 업로드",
    path: "http://localhost:3000",
    desc: "디자인 이미지 드래그앤드롭 + 사이트 유형 선택",
    external: true,
  },
  {
    step: 8,
    name: "Mini XD — 코드 에디터 + 프리뷰",
    path: "http://localhost:3000/editor",
    desc: "Monaco 에디터 + iframe 프리뷰 + 뷰포트 토글",
    external: true,
  },
];

export default function TestPage() {
  const router = useRouter();

  const handleClick = (path: string, external?: boolean) => {
    if (external) {
      window.open(path, "_blank");
    } else {
      router.push(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">
          전체 페이지 <span className="text-indigo-600">테스트</span>
        </h1>
        <p className="text-gray-500 mb-8">Creative Sandbox + Mini XD 모든 화면 확인</p>

        {/* Creative Sandbox */}
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-indigo-500" />
          Creative Sandbox
        </h2>
        <div className="space-y-3 mb-8">
          {SANDBOX_PAGES.map(({ step, name, path, desc }) => (
            <button
              key={path}
              onClick={() => handleClick(path)}
              className="w-full text-left p-4 bg-white rounded-xl border hover:border-indigo-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center shrink-0">
                  {step}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 text-sm">
                    {name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{desc}</p>
                </div>
                <span className="text-gray-400 group-hover:text-indigo-500">→</span>
              </div>
            </button>
          ))}
        </div>

        {/* Mini XD */}
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          Mini XD
        </h2>
        <div className="space-y-3 mb-8">
          {MINIXD_PAGES.map(({ step, name, path, desc, external }) => (
            <button
              key={path}
              onClick={() => handleClick(path, external)}
              className="w-full text-left p-4 bg-white rounded-xl border hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center shrink-0">
                  {step}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 text-sm">
                    {name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate">{desc}</p>
                </div>
                <span className="text-xs text-gray-400">새 탭 ↗</span>
              </div>
            </button>
          ))}
        </div>

        {/* Checklist */}
        <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm">
          <h3 className="font-semibold text-indigo-800 mb-2">확인 체크리스트</h3>
          <ul className="space-y-1 text-indigo-700">
            <li>□ 1. 로그인 — 이메일 폼 렌더링</li>
            <li>□ 2. 대시보드 — 캔버스 목록 UI</li>
            <li>□ 3. 캔버스 — tldraw 그리기 + 데모 위젯</li>
            <li>□ 4. 위젯 추가 — 코드 입력 모달 → 캔버스 배치</li>
            <li>□ 5. 위젯 인터랙션 — 여러 위젯 동시 동작</li>
            <li>□ 6. 공개/비공개 — 토글 전환</li>
            <li>□ 7. Mini XD 업로드 — 이미지 드래그앤드롭</li>
            <li>□ 8. Mini XD 에디터 — 코드 + 프리뷰 + 뷰포트</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
