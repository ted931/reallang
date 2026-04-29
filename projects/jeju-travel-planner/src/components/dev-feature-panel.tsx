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
    title: "✈️ AI 제주 여행 플래너",
    summary: "여행 날짜, 인원, 스타일, 예산을 입력하면 AI가 전체 제주 여행 일정을 자동 완성. 숙박수(1~7박), 인원(1~10명), 예산(10만~300만원), 여행 스타일(8종 복수선택)을 조합해 Day별 타임라인 + 예산 분석 + 준비물 팁까지 한 번에 생성.",
    userFlow: [
      "빠른 선택 버튼 중 하나 클릭 (예: '2박3일 커플 힐링 여행, 예산 50만원') → 입력창에 자동 채움",
      "또는 텍스트에어리어에 직접 여행 요구사항 자유 입력 (숙소 선호 지역, 특별 요청 등 세부 조건 추가 가능)",
      "숙박(1~7박) / 인원(1~10명) / 예산(10만~300만원) 스테퍼로 수치 설정",
      "여행 스타일 복수 선택 (힐링/액티비티/맛집탐방/카페투어/자연·올레길/문화·역사/포토스팟/가족여행) — 초록 하이라이트",
      "'일정 만들기' 클릭 → /api/plan POST 호출, 스피너 + 'AI가 일정을 만들고 있습니다...' 표시",
      "결과 헤더: 일정 제목, 요약, 일정·인원·예상 경비 3단 요약 카드 표시",
      "Day 탭 선택 → 해당 날짜의 스팟 타임라인 표시 (시간/카테고리/장소명/설명/주소/TIP/예상 비용)",
      "예산 분석 바 차트 및 준비물·꿀팁 리스트 표시, 렌터카 예약 CTA 배너 및 날씨/코스/지도 바로가기 링크",
    ],
    features: [
      {
        name: "빠른 선택 프롬프트",
        desc: "4가지 대표 시나리오 버튼 ('2박3일 커플 힐링 여행, 예산 50만원' 등). 클릭 시 텍스트에어리어에 자동 입력. 이미 선택된 버튼은 초록 테두리+배경으로 하이라이트. 재클릭해도 같은 값 유지",
        status: "완료",
      },
      {
        name: "자연어 프롬프트 입력",
        desc: "자유 형식 여행 요구사항 입력. 비워두면 API에 '(nights+1)일(nights)박 제주 여행' 기본값 전송. 프롬프트와 스타일 모두 비어있으면 에러 메시지('여행 스타일을 선택하거나 원하는 여행을 입력해주세요') 표시",
        status: "완료",
      },
      {
        name: "숙박·인원·예산 스테퍼",
        desc: "숙박: 1~7박 (±1 스테퍼). 인원: 1~10명 (±1 스테퍼). 예산: 10만~300만원 (±10만원 스테퍼). 각 스테퍼 흰색 카드 안에 배치. API에 nights, travelers, budget(원 단위 = 만원 × 10000)으로 전송",
        status: "완료",
      },
      {
        name: "여행 스타일 복수 선택",
        desc: "힐링🧘 / 액티비티🏄 / 맛집탐방🍊 / 카페투어☕ / 자연·올레길🌿 / 문화·역사🏛️ / 포토스팟📸 / 가족여행👨‍👩‍👧‍👦 8가지. 복수 선택 가능, 선택된 항목 초록색 하이라이트+그림자. selectedStyles 배열로 API에 전송",
        status: "완료",
      },
      {
        name: "AI 일정 생성 (Day별 타임라인)",
        desc: "/api/plan POST에 prompt/nights/travelers/budget/style 전송. 응답: TravelPlan 타입 — title, summary, nights, travelers, totalBudget, schedule(DaySchedule[] — day/theme/spots[]), budgetBreakdown[], packingTips[]. schedule 배열을 Day 탭으로 전환하며 spots 타임라인으로 렌더링",
        status: "완료",
      },
      {
        name: "예산 분석 바 차트",
        desc: "budgetBreakdown 배열을 시각화. 각 항목(교통/숙소/식비/액티비티 등)의 비율을 전체 totalBudget 대비 퍼센트로 계산해 초록색 바 표시. 항목명, 바, 금액(만원 단위 포맷)을 3열 flex로 정렬",
        status: "완료",
      },
      {
        name: "준비물 및 꿀팁",
        desc: "packingTips 배열을 리스트로 표시. 초록 '-' 불릿으로 각 팁 구분. 여행 스타일/날씨/일정에 맞는 맞춤 팁 포함 (예: 올레길 → 트레킹화 필수, 우비 준비)",
        status: "완료",
      },
      {
        name: "숙소 추천",
        desc: "예산과 위치(애월/중문/서귀포 등 선호 지역)에 맞는 숙소 옵션 2~3개 추천. 숙소 타입(호텔/게스트하우스/펜션), 가격대, 체크인·아웃 시각, 특징 태그 표시 예정",
        status: "개발중",
      },
      {
        name: "맛집 추천",
        desc: "일정 동선에 맞는 식당 추천. 스팟 간 이동 경로 상의 식당을 점심/저녁 시간대에 배치. 카카오맵 연동으로 영업시간·메뉴·리뷰 정보 연결 예정",
        status: "개발중",
      },
      {
        name: "일정 PDF 저장",
        desc: "완성된 전체 일정을 PDF로 다운로드. Day별 타임라인, 예산 분석, 준비물 포함. 인쇄 최적화 레이아웃 적용 예정",
        status: "기획중",
      },
    ],
    notes: "Claude API로 전체 일정 생성. /api/plan POST → { plan: TravelPlan } 반환. 결과 화면 하단 CTA: 렌터카 예약(/jejupass), 날씨 확인(/weather), 다른 코스(/course), 지도(/map) 링크 연결",
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
