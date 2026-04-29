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
    title: "📊 제주패스 통합 대시보드",
    summary: "제주패스 전체 서비스(렌터카·숙소·액티비티·패키지) 운영 현황을 한눈에 볼 수 있는 내부 운영 대시보드. mock-data.ts 기반 데모 데이터, Supabase 연동 시 실시간 전환 예정.",
    userFlow: [
      "페이지 진입 → getWeeklyStats()·getRecentReservations(15)·getCSTickets(10) 로컬 데이터 로드",
      "상단 탭 3개(전체 현황/예약 관리/CS 현황) 확인",
      "전체 현황 탭(기본): KPI 4개 카드 — 오늘 매출(전일 대비%)·예약건수·주간 매출·취소율",
      "주간 매출 바 차트 — 최근 7일 인라인 바, 오늘 강조(indigo-500)",
      "최근 예약 8건 리스트 + CS 대기/처리중/완료 현황 카드 동시 확인",
      "예약 관리 탭 클릭 → 전체 예약 테이블 — 정렬·필터 없이 15건 목록 표시",
      "CS 현황 탭 클릭 → 전체 CS 티켓 테이블 — 우선순위·상태별 컬러 구분",
      "하단 안내 배너: 'Supabase 연동 시 실시간 업데이트됩니다'",
    ],
    features: [
      {
        name: "KPI 요약 카드",
        desc: "오늘 매출(억/만 단위 포맷, 전일 대비 ±% 배지)·오늘 예약건수(indigo)·주간 매출(7일 합산, emerald)·취소율(주간 취소건/총예약건, orange). pctChange()로 증감 계산. null이면 배지 미표시.",
        status: "완료",
      },
      {
        name: "주간 매출 바 차트",
        desc: "DailyStat 배열로 인라인 flex 바 차트. 최대 매출 기준 높이% 계산(minHeight 4px). 오늘 막대 indigo-500, 이전 indigo-200. 막대 상단 금액, 하단 날짜(MM-DD) 텍스트.",
        status: "완료",
      },
      {
        name: "최근 예약 리스트",
        desc: "getRecentReservations(15) 중 8건. 카테고리 뱃지(렌터카/숙소/액티비티/패키지)·상품명(truncate)·고객명·날짜·금액·상태(확정/대기/취소/완료) 컬러 뱃지. max-h-80 overflow 스크롤.",
        status: "완료",
      },
      {
        name: "CS 현황 카드",
        desc: "getCSTickets(10) 기반 대기(yellow)/처리중(blue)/완료(gray) 건수 3개 카드. 미완료 티켓 리스트: 우선순위 뱃지·제목(truncate)·고객·티켓ID. max-h-56 스크롤.",
        status: "완료",
      },
      {
        name: "예약 관리 테이블",
        desc: "tab=reservations 시 표시. 컬럼: ID(mono)/고객/상품/카테고리/금액/상태/날짜. overflow-x-auto 가로 스크롤. hover 행 하이라이트. 상태·카테고리 컬러 뱃지.",
        status: "완료",
      },
      {
        name: "CS 티켓 테이블",
        desc: "tab=cs 시 표시. 컬럼: ID(mono)/제목/고객/카테고리/우선순위/상태/생성일(ko-KR). 우선순위 높음(red)/보통(yellow)/낮음(gray) 뱃지. 생성일 toLocaleDateString('ko-KR').",
        status: "완료",
      },
      {
        name: "지역별 분포 지도 및 알림 센터",
        desc: "가게 밀집 히트맵, 갑작스런 취소 급증 이상 감지 알림 센터 기능 예정.",
        status: "기획중",
      },
    ],
    notes: "Supabase 실시간 구독으로 데이터 갱신 예정. 현재는 mock-data.ts 로컬 데이터.",
  },
  "/setup": {
    title: "⚙️ Supabase 셋업",
    summary: "제주패스 서비스에 필요한 Supabase DB 테이블 6개(generated_plans·parties·party_joins·weather_cache·analytics_events·pois)를 생성하는 SQL을 제공. 개발 환경 초기 세팅 전용.",
    userFlow: [
      "페이지 진입 → MIGRATION_SQL 텍스트 pre 코드 블록으로 표시",
      "'SQL 복사' 버튼 클릭 → navigator.clipboard.writeText() 실행",
      "복사 성공 시 버튼 텍스트 '복사됨!' 2초간 표시 후 원복",
      "Supabase SQL Editor(외부 링크) 열어 붙여넣기",
      "SQL 실행 → 6개 테이블 + 인덱스 생성 완료",
      "하단 테이블 설명 목록으로 생성 내용 확인",
    ],
    features: [
      {
        name: "SQL 복사 버튼",
        desc: "navigator.clipboard.writeText(MIGRATION_SQL) 실행. 성공 시 버튼 텍스트·배경 emerald로 2초 변경 후 원복(setTimeout). Supabase SQL Editor 링크는 프로젝트 ID 하드코딩된 외부 URL.",
        status: "완료",
      },
      {
        name: "생성 테이블 6개",
        desc: "generated_plans(AI 코스·일정 저장, type/result/view_count/share_count)·parties(취미 파티, 일정·인원·비용·렌터카·호스트)·party_joins(참여 신청, pending/approved/rejected)·weather_cache(날씨 캐시, 위치·기온·강수·풍속)·analytics_events(행동 로그, event_type·page·session_id)·pois(장소, 위치·카테고리·주소·실내여부).",
        status: "완료",
      },
      {
        name: "인덱스 생성",
        desc: "각 테이블 주요 조회 패턴 기반 인덱스: plans(type+created_at, view_count), parties(date+status, category+status), weather(location+fetched_at), events(event_type+created_at), pois(category, region).",
        status: "완료",
      },
      {
        name: "연결 상태 확인",
        desc: "현재는 SQL 복사만 제공. Supabase 연결 ping 확인 UI 및 테이블 생성 여부 자동 검증 기능 미구현.",
        status: "개발중",
      },
    ],
    notes: "프로덕션에서는 비활성화 필요. 개발/스테이징 환경 전용. SQL은 IF NOT EXISTS로 재실행 안전.",
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
