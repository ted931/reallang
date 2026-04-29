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
    title: "🏠 홈 (Auth 리다이렉트)",
    summary: "로그인 상태에 따라 대시보드 또는 로그인 페이지로 리다이렉트하는 서버 컴포넌트 진입점. 렌더링 없이 즉시 분기.",
    userFlow: [
      "/ 접근 시 서버에서 createServerSupabase()로 세션 확인",
      "user 있으면 → /dashboard 리다이렉트",
      "user 없으면 → /login 리다이렉트",
    ],
    features: [
      {
        name: "인증 확인 및 분기",
        desc: "입력: 없음 (서버 컴포넌트). 출력: Supabase auth.getUser()로 세션 확인 → user 존재 시 redirect('/dashboard'), 없으면 redirect('/login'). 엣지 케이스: Supabase 연결 실패 시 에러 발생. 페이지 렌더링 없이 즉시 리다이렉트.",
        status: "완료"
      },
    ]
  },
  "/login": {
    title: "🔐 로그인",
    summary: "이메일 Magic Link 방식의 패스워드리스 로그인. 이메일 입력 후 링크 클릭으로 인증. Supabase Auth OTP 사용.",
    userFlow: [
      "이메일 입력 필드에 회사 이메일 입력",
      "'로그인 링크 받기' 버튼 클릭 → Supabase signInWithOtp() 호출",
      "성공 시 '이메일을 확인하세요' 화면으로 전환 — 이메일 주소 강조 표시",
      "이메일 수신함에서 링크 클릭 → /auth/callback 처리 → 대시보드 이동",
      "다른 이메일로 시도 링크 클릭 시 입력 폼으로 복귀",
    ],
    features: [
      {
        name: "이메일 입력",
        desc: "입력: type='email' 필드. 출력: email state 업데이트. 엣지 케이스: required 설정으로 빈 값 제출 방지. 미입력 시 '로그인 링크 받기' 버튼 disabled.",
        status: "완료"
      },
      {
        name: "OTP 링크 발송",
        desc: "입력: 유효한 이메일 주소. 출력: supabase.auth.signInWithOtp({ email, emailRedirectTo: origin/auth/callback }) 호출 → 성공 시 sent=true로 전환. 엣지 케이스: Supabase 오류 시 error.message를 빨간 박스로 표시. 발송 중 loading=true → 버튼 '전송 중...' + disabled.",
        status: "완료"
      },
      {
        name: "발송 완료 화면",
        desc: "입력: sent=true 상태. 출력: 이메일 아이콘 + '이메일을 확인하세요' + 발송된 이메일 주소 bold 강조 + 안내 문구. '다른 이메일로 시도' 링크로 폼 복귀. 엣지 케이스: 이메일 미도착 시 재발송 UX 미구현 (추후 추가 필요).",
        status: "완료"
      },
    ],
    notes: "Supabase Auth Magic Link 사용. 소셜 로그인(구글/카카오)은 추후 추가 예정."
  },
  "/dashboard": {
    title: "📋 캔버스 대시보드",
    summary: "사용자가 만든 캔버스(프로젝트) 목록 관리. Supabase DB에서 사용자별 캔버스 조회, 생성, 삭제, 공개 여부 표시.",
    userFlow: [
      "로그인 후 /dashboard 진입 — Supabase에서 내 캔버스 목록 자동 로딩",
      "빈 상태면 '아직 캔버스가 없습니다' 메시지 + 새 캔버스 생성 안내",
      "'+ 새 캔버스' 버튼 클릭 → 이름 입력 인라인 폼 표시",
      "캔버스 이름 입력(선택, 미입력 시 'Untitled Canvas') 후 '생성' 또는 Enter → DB insert → /canvas/[id] 이동",
      "기존 캔버스 카드 클릭 → /canvas/[id] 에디터 이동",
      "카드 hover 시 '삭제' 버튼 노출 → confirm 후 Supabase delete + 목록에서 즉시 제거",
      "상단 '로그아웃' 클릭 → signOut() + /login 이동",
    ],
    features: [
      {
        name: "캔버스 목록 로딩",
        desc: "입력: 없음 (마운트 시 자동). 출력: Supabase canvases 테이블에서 owner_id 일치 항목을 updated_at 내림차순으로 조회. 카드에 제목, 공개/비공개 뱃지, 수정일 표시. 엣지 케이스: 로딩 중 '불러오는 중...' 텍스트, 빈 배열이면 이모지 + 안내 문구 empty state.",
        status: "완료"
      },
      {
        name: "새 캔버스 생성",
        desc: "입력: 캔버스 이름 텍스트 (선택). 출력: Supabase insert({ title, owner_id }) → data.id로 /canvas/[id] 이동. 엣지 케이스: 이름 미입력 시 'Untitled Canvas' 기본값. Enter 키로도 생성 가능. '취소' 클릭 시 인라인 폼 숨김.",
        status: "완료"
      },
      {
        name: "공개/비공개 뱃지",
        desc: "입력: canvas.visibility 값 ('public' | 'private'). 출력: public이면 초록 뱃지 '공개', 아니면 회색 뱃지 '비공개'. 엣지 케이스: 토글 기능은 캔버스 에디터(CanvasToolbar)에서 처리.",
        status: "완료"
      },
      {
        name: "캔버스 삭제",
        desc: "입력: 카드 hover 후 '삭제' 버튼 클릭. 출력: window.confirm() 확인 → Supabase delete(id) → canvases 상태에서 즉시 filter 제거. 엣지 케이스: confirm 취소 시 아무 동작 없음. 삭제 버튼은 group-hover opacity-0→100 애니메이션으로 의도치 않은 클릭 방지.",
        status: "완료"
      },
      {
        name: "로그아웃",
        desc: "입력: 헤더 '로그아웃' 클릭. 출력: supabase.auth.signOut() → router.push('/login'). 엣지 케이스: 로그아웃 중 에러 처리 미구현.",
        status: "완료"
      },
    ]
  },
  "/test/canvas-demo": {
    title: "🖼️ 캔버스 데모",
    summary: "채팅과 위젯이 통합된 메인 캔버스 에디터 데모. 인증 없이 canvasId='demo'로 테스트 가능. CanvasToolbar + CreativeCanvas + ChatPanel 3구성.",
    userFlow: [
      "페이지 진입 시 canvasId='demo', visibility='private' 세팅, 데모 유저 주입",
      "CanvasToolbar에서 캔버스 제목, 공개 토글, 위젯 추가 버튼 확인",
      "위젯 추가 버튼(+) 클릭 → 위젯 팔레트 모달에서 텍스트/이미지/도형 등 선택",
      "캔버스 위젯 클릭으로 선택 → 드래그로 위치 이동, 핸들 드래그로 크기 조절",
      "우측 ChatPanel에서 'AI에게 요청' → AI가 위젯 생성/수정/삭제 처리",
      "변경사항 자동 저장 (또는 저장 버튼)",
    ],
    features: [
      {
        name: "캔버스 초기화",
        desc: "입력: 없음 (useEffect). 출력: useCanvasStore.setCanvasId('demo') + setVisibility('private') + window.__sandbox_user 데모 유저 주입. 엣지 케이스: SSR 방지를 위해 dynamic import + ssr:false 적용.",
        status: "완료"
      },
      {
        name: "위젯 추가",
        desc: "입력: CanvasToolbar의 '+ 위젯 추가' 버튼 → 팔레트에서 위젯 타입 선택. 출력: 캔버스 중앙에 선택한 위젯 배치. 엣지 케이스: 텍스트/이미지/도형 등 다양한 타입 지원, 각 타입별 기본 크기/스타일 다름.",
        status: "완료"
      },
      {
        name: "AI 채팅 (ChatPanel)",
        desc: "입력: 자연어 요청 (예: '파란 사각형 추가해줘'). 출력: AI가 캔버스 스토어를 통해 위젯 생성/수정/삭제. 엣지 케이스: AI 응답 중 로딩 표시, 명령 모호 시 확인 응답.",
        status: "완료"
      },
      {
        name: "드래그 이동",
        desc: "입력: 위젯 클릭 후 드래그. 출력: 위젯 x/y 좌표 실시간 업데이트. 엣지 케이스: 캔버스 경계 밖으로 드래그 제한 여부 미정.",
        status: "완료"
      },
      {
        name: "크기 조절",
        desc: "입력: 선택된 위젯의 리사이즈 핸들 드래그. 출력: width/height 실시간 업데이트. 엣지 케이스: 최소 크기(min-width/height) 제한 필요.",
        status: "완료"
      },
    ]
  },
  "/test/visibility-demo": {
    title: "👁️ 가시성 데모",
    summary: "캔버스 공개/비공개 토글 기능 집중 테스트 페이지. CanvasToolbar 우측 상단 🔒 버튼으로 토글.",
    userFlow: [
      "페이지 진입 시 canvasId='demo-vis', visibility='private'로 초기화",
      "CanvasToolbar 우측 🔒 버튼 확인 (비공개 상태)",
      "🔒 버튼 클릭 → visibility 'public'으로 변경, 아이콘 변경",
      "다시 클릭 → 'private'으로 복귀",
      "공개 전환 시 실제 DB 업데이트 여부 확인 (데모에서는 로컬 상태만 변경)",
    ],
    features: [
      {
        name: "공개/비공개 토글",
        desc: "입력: CanvasToolbar의 🔒/🌐 버튼 클릭. 출력: useCanvasStore visibility 상태 토글 ('private' ↔ 'public'). 아이콘 및 툴팁 변경. 엣지 케이스: 실제 저장된 캔버스의 경우 Supabase update 호출 필요, 데모에서는 로컬 상태만.",
        status: "완료"
      },
      {
        name: "레이어 목록",
        desc: "입력: (예정) 사이드 패널 열기. 출력: (예정) 모든 위젯을 레이어 목록으로 표시, 각 레이어별 눈 아이콘으로 개별 표시/숨김. 엣지 케이스: 레이어 순서 변경(z-index)과 가시성은 별도 제어.",
        status: "개발중"
      },
    ]
  },
  "/test/widget-add-demo": {
    title: "➕ 위젯 추가 데모",
    summary: "위젯 추가 모달 UI 집중 테스트 페이지. CanvasToolbar '+ 위젯 추가' 버튼으로 팔레트 모달 열기.",
    userFlow: [
      "페이지 진입 시 canvasId='demo-add', visibility='private' 초기화",
      "CanvasToolbar '+ 위젯 추가' 버튼 클릭",
      "위젯 팔레트 모달에서 추가 가능한 위젯 종류 목록 확인",
      "(예정) 위젯 카드 hover 시 미리보기 표시",
      "위젯 클릭 → 캔버스 중앙에 기본 크기로 배치, 모달 닫힘",
    ],
    features: [
      {
        name: "위젯 팔레트",
        desc: "입력: CanvasToolbar '+ 위젯 추가' 클릭. 출력: 추가 가능한 위젯 종류(텍스트, 이미지, 도형, 차트 등) 그리드 목록 표시. 엣지 케이스: 팔레트 외부 클릭 또는 ESC로 닫기.",
        status: "완료"
      },
      {
        name: "위젯 미리보기",
        desc: "입력: (예정) 팔레트 위젯 카드 hover. 출력: (예정) 선택 전 위젯 형태 미리보기 툴팁 또는 사이드 패널. 엣지 케이스: 커스텀 위젯은 미리보기 없음.",
        status: "개발중"
      },
      {
        name: "캔버스 배치",
        desc: "입력: 팔레트에서 위젯 타입 선택 (클릭). 출력: 캔버스 중앙 좌표에 기본 width/height로 위젯 추가, 팔레트 모달 닫힘. 엣지 케이스: 캔버스 스크롤 상태에 따라 중앙 좌표 계산 필요.",
        status: "완료"
      },
    ]
  },
  "/test/widget-interaction-demo": {
    title: "🖱️ 위젯 인터랙션 데모",
    summary: "3개 위젯이 사전 배치된 멀티 위젯 인터랙션 테스트. 다중 선택, 그룹화, 정렬 기능 집중 테스트용.",
    userFlow: [
      "페이지 진입 시 MultiWidgetCanvas — 3개 위젯 사전 배치된 상태로 로딩",
      "개별 위젯 클릭으로 단일 선택 확인",
      "Shift+클릭으로 위젯 추가 선택 (다중 선택)",
      "빈 캔버스 영역 드래그로 셀렉션 박스 그려 범위 내 위젯 다중 선택",
      "(예정) 다중 선택 상태에서 '그룹' 버튼 → 선택 위젯 그룹화",
      "(예정) 정렬 도구바에서 좌/우/중앙 정렬, 균등 배분 적용",
    ],
    features: [
      {
        name: "다중 선택",
        desc: "입력: Shift+클릭 또는 빈 영역 드래그 셀렉션. 출력: 선택된 위젯들에 다중 선택 표시(파란 테두리). 엣지 케이스: 빈 영역 클릭 시 전체 선택 해제. Shift+클릭으로 이미 선택된 위젯 선택 해제.",
        status: "완료"
      },
      {
        name: "그룹화",
        desc: "입력: 다중 선택 상태에서 '그룹' 버튼. 출력: 선택된 위젯들을 단일 Group 위젯으로 래핑, 함께 이동/크기 조절 가능. 엣지 케이스: 그룹 해제 기능 구현 필요, 그룹 내 위젯 개별 편집 UX 미정.",
        status: "개발중"
      },
      {
        name: "정렬",
        desc: "입력: 다중 선택 후 정렬 도구 클릭 (좌/우/중앙 정렬, 상/하/중간 정렬, 수평/수직 균등 배분). 출력: 선택된 위젯들의 x/y 좌표 일괄 업데이트. 엣지 케이스: 선택 위젯 1개이면 정렬 버튼 비활성화. 기준점(첫 선택 위젯 vs 경계박스 중앙) 정책 미정.",
        status: "개발중"
      },
    ]
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
