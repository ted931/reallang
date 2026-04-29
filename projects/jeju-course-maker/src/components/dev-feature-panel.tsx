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
    title: "🗺️ AI 제주 코스 메이커",
    summary: "여행 스타일, 동행자, 일수, 예산, 렌터카 여부를 입력하면 AI가 제주 코스 3가지(A/B/C)를 동시에 생성. 각 코스는 Day별 타임라인, 경유지 상세, 예상 비용을 포함하며 추천 코스 자동 하이라이트.",
    userFlow: [
      "자연어 입력 텍스트에어리어에 원하는 여행 설명 작성 (선택사항 — 비워두면 동행자+일수 기본값으로 생성)",
      "일정(1~5일) / 예산(10만~300만원) 스테퍼 버튼으로 설정",
      "동행자 선택 (커플/가족/친구/혼자/효도/단체) 중 택1 — 보라색 하이라이트",
      "선호 테마 복수 선택 (바다/산·숲/맛집/카페/액티비티/문화/힐링/포토) — 복수 선택 가능",
      "렌터카 이용 여부 토글 스위치 설정 (ON=렌터카 동선, OFF=대중교통 동선)",
      "'코스 만들기' 클릭 → /api/course POST 호출, 스피너 애니메이션 표시",
      "3가지 코스 선택 카드 표시: 각 코스의 이름, 설명, 총 비용, 총 이동 km/분, 하이라이트 태그. AI 추천 코스에 '추천' 배지 자동 표시",
      "코스 카드 클릭 → Day 탭 + 스팟 타임라인 상세 표시 (시간/장소/카테고리/설명/팁/비용/이동시간)",
    ],
    features: [
      {
        name: "자연어 프롬프트 입력",
        desc: "자유 형식 텍스트로 여행 취향 입력 (예: '바다 좋아하고 인스타 사진 찍고 싶어요'). 비워두면 '동행자 N일 제주 여행' 기본 프롬프트로 대체. rows=3 텍스트에어리어, 포커스 시 보라색 ring 표시",
        status: "완료",
      },
      {
        name: "일정 및 예산 스테퍼",
        desc: "일정: 1~5일 범위 ±1 스테퍼 버튼. 예산: 10만~300만원 범위 ±10만원 스테퍼. 각각 흰색 카드 안에 현재 값 중앙 표시. 경계값(최소/최대)에서 버튼 동작은 Math.max/min으로 자동 제한",
        status: "완료",
      },
      {
        name: "동행자 선택",
        desc: "커플💑 / 가족👨‍👩‍👧‍👦 / 친구👫 / 혼자🧳 / 효도🧓 / 단체🧑‍🤝‍🧑 6가지 버튼 중 택1. 선택 시 보라색 배경 + 그림자(shadow-violet-200). 동행자 유형에 따라 AI 코스 분위기 변경 (예: 가족 → 체험 위주, 효도 → 이동 부담 최소화)",
        status: "완료",
      },
      {
        name: "선호 테마 복수 선택",
        desc: "바다🌊 / 산·숲🌿 / 맛집🍊 / 카페☕ / 액티비티🏄 / 문화🏛️ / 힐링🧘 / 포토📸 8가지. 복수 선택 가능, 선택된 항목 보라색 하이라이트. themes 배열로 API에 전송해 스팟 카테고리 가중치 조정",
        status: "완료",
      },
      {
        name: "렌터카 여부 토글",
        desc: "토글 ON(보라색): 렌터카 동선으로 코스 생성 (이동 시간 단축, 외곽 지역 포함 가능). 토글 OFF(회색): 대중교통 접근 가능 스팟 위주로 코스 제한. hasRentalCar boolean으로 API 전송",
        status: "완료",
      },
      {
        name: "3가지 코스 생성 및 추천",
        desc: "/api/course POST에 prompt/days/companions/themes/budget/hasRentalCar 전송. 응답: courses 배열(A/B/C) 각각 id/name/description/recommended/totalCost/totalDriveKm/totalDriveMinutes/highlights/days. recommended=true 코스에 '추천' 배지 자동 적용",
        status: "완료",
      },
      {
        name: "Day 탭 + 스팟 타임라인",
        desc: "다일 코스 시 Day 탭 버튼으로 일자 전환. 각 Day의 stops를 타임라인으로 렌더링: 시간(stop.time), 카테고리 아이콘(CATEGORY_STYLE 객체 매핑), 장소명, 카테고리 배지, 설명, 주소, TIP, 예상 비용(무료/금액), 이전 스팟에서 이동 시간(분). Day 하단에 당일 예상 비용 요약",
        status: "완료",
      },
      {
        name: "코스 지도 표시",
        desc: "선택된 코스의 모든 스팟 좌표를 지도에 마커로 표시하고 이동 경로 폴리라인 연결. 현재는 /map 링크로 이동 대체",
        status: "개발중",
      },
    ],
    notes: "Claude API로 코스 3개 동시 생성. /api/course POST → CourseResult 타입 반환. 장소 데이터는 내부 DB + 카카오맵 API 연동 예정. 결과 화면에서 '이 코스로 일정 만들기' → jeju-travel-planner 딥링크 연결",
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
