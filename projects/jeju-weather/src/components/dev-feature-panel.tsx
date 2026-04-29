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
    title: "🌤️ 제주 실시간 날씨 지도",
    summary: "제주 전역 날씨를 지역별 카드로 표시. 10개 지점 실시간 기상 데이터(기상청 API) + 맑은 곳/비 오는 곳 요약.",
    userFlow: [
      "진입 시 /api/weather 호출 → 제주 10개 지점 날씨 데이터 로드 (로딩 스피너 표시)",
      "API 실패 시 '날씨 데이터를 가져올 수 없습니다' 에러 화면 표시",
      "전체 요약 카드(최고기온·최저기온·평균습도·강수지역 수) 확인",
      "맑은 곳/비 오는 곳 요약 배너 확인 → 코스 만들기·실내 코스 CTA 클릭 가능",
      "지역 카드 클릭 → 해당 지역 습도·풍속·강수량·풍향 상세 인라인 펼침",
      "같은 카드 재클릭 → 상세 접힘 (토글)",
      "상단 네비 '예보' 탭 또는 링크 클릭 → /forecast 시간별 예보 페이지 이동",
    ],
    features: [
      {
        name: "전체 요약 카드",
        desc: "10개 지점 중 최고기온(red), 최저기온(blue), 평균습도(cyan), 강수 지역 수(indigo) 4개 지표 요약. locations 배열 연산으로 실시간 계산",
        status: "완료",
      },
      {
        name: "맑은 곳 / 비 오는 곳 배너",
        desc: "rainfall > 0인 지점을 비 오는 곳으로 분류. 맑은 곳 → '이 지역 코스 만들기' 링크(/course?theme=자연&region=). 비 오는 곳 → '실내 코스 보기' 링크(/course?theme=카페&indoor=true). 한쪽만 있으면 1컬럼",
        status: "완료",
      },
      {
        name: "지역 날씨 카드",
        desc: "지점명·이모지·하늘상태·기온(온도별 색상)·강수 뱃지 표시. 기온 구간: 30°↑ red, 25° orange, 20° yellow, 15° green, 10° cyan, 이하 blue. 클릭 시 습도·풍속·강수량·풍향 상세 인라인 펼침",
        status: "완료",
      },
      {
        name: "예보 페이지 이동",
        desc: "시간별/일별 예보 /forecast 페이지로 이동. 네비게이션 탭 또는 버튼 제공",
        status: "완료",
      },
    ],
    notes: "기상청 초단기실황 Open API 연동. API 키는 WEATHER_API_KEY 환경변수. 10분마다 자동 업데이트",
  },
  "/forecast": {
    title: "📊 제주 날씨 예보",
    summary: "제주 3개 지점(제주시·서귀포·성산) 시간별 단기예보. 기온·하늘·강수확률·습도·풍속 테이블 형태로 제공.",
    userFlow: [
      "진입 시 /api/forecast 호출 → 3개 지점 시간별 예보 데이터 로드",
      "지역 탭(제주시·서귀포·성산 등) 클릭 → 해당 지점 예보 테이블 전환",
      "예보 행 확인: 날짜·시간·날씨이모지·기온(색상 구분)·강수확률·습도·풍속",
      "강수확률 60% 이상 행에 '우산' 뱃지 자동 표시",
      "스크롤 내려 전체 예보 슬롯 확인 (보통 3시간 단위 20~24슬롯)",
      "하단 출처 안내 확인 (기상청 단기예보, 30분 업데이트)",
    ],
    features: [
      {
        name: "지역 탭 선택",
        desc: "locations 배열 기반 동적 탭 생성. 탭 클릭 시 selectedIdx 변경 → 해당 지점 forecast 배열 렌더. 기본 첫 번째 지점 선택",
        status: "완료",
      },
      {
        name: "시간별 예보 테이블",
        desc: "그리드 7컬럼: 날짜+시간 / 날씨이모지+상태 / 기온(색상) / 강수확률 / 습도 / 풍속 / 우산뱃지. 기온 색상: 30°↑ red, 25° orange, 20° yellow, 15° green, 10° cyan, 이하 blue. 강수확률 60%↑ blue, 30%↑ sky",
        status: "완료",
      },
      {
        name: "우산 권고 뱃지",
        desc: "강수확률(pop) 60% 이상인 슬롯에 '우산' 파란 뱃지 자동 표시",
        status: "완료",
      },
      {
        name: "강수 확률 색상",
        desc: "60%↑ text-blue-600, 30%↑ text-sky-500, 미만 text-gray-400로 위험도 시각화",
        status: "완료",
      },
    ],
    notes: "기상청 단기예보 API 연동. 30분마다 업데이트. API 키 없으면 빈 화면 표시",
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
