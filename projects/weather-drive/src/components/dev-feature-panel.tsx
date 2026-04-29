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
    title: "🌤️🚗 날씨 드라이브 코스",
    summary: "지금 제주 날씨를 분석해서 최적의 드라이브 코스를 AI가 실시간으로 추천. 제주 주요 지역(제주시/서귀포/한림/성산/중문)별 날씨를 불러와 맑은 지역 중심 코스를 자동 생성. 드라이브 선호 스타일 6가지로 코스 방향 설정 가능.",
    userFlow: [
      "페이지 진입 시 /api/weather 자동 호출 → 제주 주요 지역 날씨 데이터 로드 (온도/강수량/풍속/하늘 상태)",
      "날씨 요약 카드에서 맑은 지역(강수 0mm)과 비 오는 지역 자동 구분 표시",
      "드라이브 선호 스타일 카드 선택 (날씨에 맡기기 / 바다 드라이브 / 숲길·올레길 / 카페 투어 / 맛집 드라이브 / 실내 위주) — 기본값 '날씨에 맡기기'",
      "'날씨 맞춤 코스 추천받기' 버튼 클릭 → /api/suggest POST 호출, 버튼 비활성화 및 로딩 텍스트 표시",
      "AI 코스 결과 카드 상단: 코스 타입 배지(야외/실내/복합), 총 드라이브 시간, 코스 이름, 설명 표시",
      "날씨 요약 및 추천 출발 시각 안내 배너 표시",
      "코스 경유지 타임라인: 각 스팟 번호/이름/카테고리/설명/이전 스팟에서의 이동 시간/팁 순차 표시",
      "'더 상세한 코스 만들기' 링크로 /course 페이지 이동",
    ],
    features: [
      {
        name: "실시간 날씨 분석",
        desc: "페이지 마운트 시 /api/weather 자동 호출. 제주 주요 지역(제주시·서귀포·한림·성산·중문)의 온도(°C), 습도(%), 강수량(mm), 풍속(m/s), 하늘 상태 데이터 수신. 강수량 0mm 지역은 '맑은 곳', 초과 지역은 '비 오는 곳'으로 자동 분류",
        status: "완료",
      },
      {
        name: "드라이브 선호 선택",
        desc: "날씨에 맡기기(기본) · 바다 드라이브 · 숲길/올레길 · 카페 투어 · 맛집 드라이브 · 실내 위주 6가지 카드 선택. '날씨에 맡기기' 선택 시 AI가 날씨 조건만으로 최적 코스 결정. 나머지 선택 시 해당 preference 레이블을 API에 전달해 코스 방향 고정",
        status: "완료",
      },
      {
        name: "AI 코스 생성",
        desc: "/api/suggest POST에 weatherData 배열 + preference 문자열 전송. Claude API가 날씨 조건을 분석해 courseName, description, weatherSummary, type(outdoor/indoor/mixed), stops 배열, totalDriveMinutes, bestTimeToGo를 JSON으로 반환",
        status: "완료",
      },
      {
        name: "코스 타입 배지",
        desc: "AI가 반환한 type 값에 따라 '야외'(초록 배지) / '실내'(보라 배지) / '복합'(파랑 배지)으로 구분 표시. 총 드라이브 시간(분)도 함께 표시",
        status: "완료",
      },
      {
        name: "경유지 타임라인",
        desc: "stops 배열을 순서대로 렌더링. 각 스팟: 번호 원형 배지, 스팟명, 카테고리 태그(관광지/카페/식당/체험/해변/박물관별 색상), 설명, 이전 스팟에서의 이동 시간(분), 방문 팁. 스팟 간 세로 연결선으로 경로 흐름 시각화",
        status: "완료",
      },
      {
        name: "날씨 변화 알림",
        desc: "드라이브 중 기상 변화(비·강풍 예보) 시 푸시 알림 또는 인앱 배너로 경로 변경 제안. 기상청 초단기예보 API 연동 예정",
        status: "기획중",
      },
      {
        name: "코스 저장/공유",
        desc: "마음에 드는 코스를 로컬 저장 또는 URL 공유 링크 생성. SNS 공유 시 코스 이름 + 주요 스팟 썸네일 OG 이미지 자동 생성",
        status: "기획중",
      },
    ],
    notes: "기상청 API(또는 OpenWeather) + Claude API 조합. /api/weather는 현재 목업 데이터 또는 외부 API 프록시. stops의 카테고리별 색상은 CATEGORY_COLORS 객체로 관리",
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
