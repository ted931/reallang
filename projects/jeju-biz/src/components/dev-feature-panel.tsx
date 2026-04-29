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
    title: "📊 비즈니스 대시보드",
    summary: "제주패스 파트너사(가게)를 위한 비즈니스 관리 허브. 오늘/이번 주 매출·예약 현황 카드, 홍보 관리·CS챗봇으로 빠른 진입. mock-data.ts 기반 데모 데이터 표시.",
    userFlow: [
      "페이지 진입 → getWeeklyStats()·getRecentReservations()·getCSTickets() 로컬 데이터 로드",
      "상단 탭(전체 현황/예약 관리/CS 현황) 클릭으로 뷰 전환",
      "전체 현황 탭: KPI 4개 카드 확인 (오늘 매출·예약, 주간 매출, 취소율)",
      "주간 매출 바 차트로 7일 추이 확인",
      "최근 예약 리스트(8건) + CS 대기·처리중·완료 현황 카드 확인",
      "예약 관리 탭 클릭 → 전체 예약 테이블 (상품·고객·금액·상태·날짜)",
      "CS 현황 탭 클릭 → CS 티켓 테이블 (제목·고객·카테고리·우선순위·상태)",
      "하단 안내: 'Supabase 연동 시 실시간 업데이트' 텍스트",
    ],
    features: [
      {
        name: "KPI 카드",
        desc: "오늘 매출(어제 대비 %변화 배지)·오늘 예약건수·최근 7일 주간 매출·주간 취소율(취소건/총건) 4개 카드. pctChange()로 전일 대비 증감률 계산. 양수 emerald, 음수 red 색상.",
        status: "완료",
      },
      {
        name: "주간 매출 바 차트",
        desc: "7일치 DailyStat 배열로 인라인 바 차트 렌더링. 오늘 막대 indigo-500, 이전일 indigo-200. 막대 상단에 만원 단위 금액, 하단에 날짜(MM-DD) 표시. 최대값 기준 비율 계산.",
        status: "완료",
      },
      {
        name: "최근 예약 리스트",
        desc: "getRecentReservations(15) 중 8건 표시. 카테고리 뱃지(렌터카/숙소/액티비티/패키지)·상품명·고객명·날짜·금액·상태(확정/대기/취소/완료) 표시. max-h-80 스크롤.",
        status: "완료",
      },
      {
        name: "CS 현황 요약",
        desc: "getCSTickets(10) 기반 대기/처리중/완료 건수 카드. 완료 제외 미처리 티켓 목록 — 우선순위(높음/보통/낮음)·제목·고객·ID. max-h-56 스크롤.",
        status: "완료",
      },
      {
        name: "예약 관리 탭",
        desc: "전체 예약 테이블(ID/고객/상품/카테고리/금액/상태/날짜). overflow-x-auto 가로 스크롤. 상태·카테고리 컬러 뱃지.",
        status: "완료",
      },
      {
        name: "CS 티켓 탭",
        desc: "전체 CS 티켓 테이블(ID/제목/고객/카테고리/우선순위/상태/생성일). 생성일 ko-KR 날짜 포맷. 우선순위·상태 컬러 뱃지.",
        status: "완료",
      },
      {
        name: "공지사항 및 KPI 확장",
        desc: "파트너 공지, 알림 센터, 지역별 분포 지도(히트맵) 기능 예정.",
        status: "기획중",
      },
    ],
  },
  "/promo": {
    title: "🏪 홍보 페이지 관리",
    summary: "파트너 가게의 홍보 페이지를 목록/생성/미리보기 3단계 step으로 관리. 가게명·업종·소개·연락처·영업시간·메뉴 입력 후 저장하면 여행자 지도에 자동 노출 예정.",
    userFlow: [
      "목록 화면(step=list) — 등록된 홍보 페이지 카드 확인 (데모: 흑돼지 본가, 해녀카페 우도점)",
      "'+ 새 홍보 페이지' 버튼 클릭 → step=create",
      "기본 정보 입력: 가게명(필수)·업종 선택·소개글·전화번호·영업시간·주소",
      "메뉴/서비스 추가: 메뉴명·가격 입력, 인기메뉴 ⭐ 토글, + 추가/✕ 삭제",
      "'홍보 페이지 생성하기' 클릭 → 가게명 공백 시 비활성화, 유효 시 savedShops에 추가 후 목록으로 이동",
      "목록에서 카드 클릭 → step=preview (미리보기 화면)",
      "미리보기: 헤더 그라데이션·업종 이모지·소개·주소·전화·영업시간·메뉴 확인",
      "'목록으로 돌아가기' 클릭 → step=list",
    ],
    features: [
      {
        name: "가게 소개 편집",
        desc: "가게명(필수, 공백 시 저장 버튼 disabled)·소개글(textarea)·카테고리(음식점/카페/체험·액티비티/숙박/기념품·쇼핑/기타 카드 선택)·전화번호(064- 형식)·영업시간·주소 입력. 모두 로컬 state 관리.",
        status: "완료",
      },
      {
        name: "메뉴/서비스 관리",
        desc: "메뉴명+가격 쌍 동적 추가/삭제. ⭐ 버튼 클릭 시 popular 토글(amber 강조). 메뉴 1개 이상일 때만 ✕ 삭제 버튼 표시. 빈 메뉴명은 미리보기에서 필터링.",
        status: "완료",
      },
      {
        name: "홍보 페이지 미리보기",
        desc: "실제 제주패스 앱 노출 형태로 미리보기. amber→orange 그라데이션 헤더. 소개·주소·전화(tel 링크)·영업시간·인기메뉴 뱃지 포함 메뉴 목록. '이 홍보 페이지는 여행자 지도에 자동 노출됩니다' 안내.",
        status: "완료",
      },
      {
        name: "운영시간 설정",
        desc: "요일별 영업시간 설정, 임시 휴무 처리 기능 예정. 현재는 단일 텍스트 입력.",
        status: "개발중",
      },
      {
        name: "이미지 관리",
        desc: "대표 이미지 및 갤러리 이미지 업로드/삭제 기능 예정. 현재 photos 배열은 문자열 ID 더미만 저장.",
        status: "개발중",
      },
    ],
  },
  "/cs": {
    title: "💬 CS 챗봇",
    summary: "Claude API 기반 AI 고객 상담 챗봇. 예약·취소·환불·렌터카·숙소 등 제주패스 관련 문의 자동 응대. FAQ 매칭 결과(matchedFAQs) 관련 질문 버튼으로 추가 안내.",
    userFlow: [
      "페이지 진입 → AI 상담사 웰컴 메시지 자동 표시",
      "초기 상태(메시지 1개): 자주 묻는 질문 4개 버튼 표시 (예약취소/환불/픽업장소/운영시간)",
      "버튼 클릭 또는 직접 텍스트 입력 후 '전송' 클릭 또는 Enter",
      "POST /api/chat, body: {messages 배열} 호출 → 로딩 점프 애니메이션",
      "AI 응답 말풍선 표시 (흰 배경, 'AI 상담사' 레이블)",
      "matchedFAQs 있을 경우 '관련 질문' 버튼 목록 표시 — 클릭 시 해당 질문 자동 전송",
      "오류 발생 시 '일시적 오류' 메시지 + 긴급 연락처(1588-0000) 안내",
      "messages 자동 스크롤 최하단 이동",
    ],
    features: [
      {
        name: "AI 채팅 인터페이스",
        desc: "user(파란 말풍선, 우측 정렬)/assistant(흰 말풍선, 좌측 정렬) 구분. whitespace-pre-wrap으로 줄바꿈 보존. 로딩 중 3점 bounce 애니메이션. scrollRef.scrollTo로 자동 스크롤.",
        status: "완료",
      },
      {
        name: "Claude API 연동",
        desc: "POST /api/chat, messages 배열 전송. 반환: {reply, matchedFAQs?}. 오류(res.ok 아닐 경우) → catch에서 '일시적 오류' + 긴급 연락처 메시지 표시. loading 상태 중 입력·전송 버튼 비활성화.",
        status: "완료",
      },
      {
        name: "빠른 질문 버튼",
        desc: "messages.length <= 1 일 때만 표시. '예약 취소는 어떻게 하나요?' 등 4개 프리셋. 클릭 시 sendMessage() 직접 호출. 첫 메시지 전송 후 사라짐.",
        status: "완료",
      },
      {
        name: "FAQ 매칭 표시",
        desc: "API 응답에 matchedFAQs 있으면 '[카테고리] 질문' 형태 관련 질문 버튼 표시. 클릭 시 해당 질문 즉시 전송. 다음 응답 시 이전 FAQ 목록 초기화.",
        status: "완료",
      },
      {
        name: "FAQ 설정 관리",
        desc: "자주 묻는 질문/답변 템플릿 추가·편집 UI. 현재는 API 내부 하드코딩.",
        status: "개발중",
      },
      {
        name: "미응답 내역 및 챗봇 ON/OFF",
        desc: "챗봇이 답변 못한 질문 목록 수동 처리, 영업시간 외 자동 응대 켜기/끄기 기능 예정.",
        status: "기획중",
      },
    ],
    notes: "Claude API 기반 AI 응대. FAQ는 RAG 방식으로 주입 예정.",
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
