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
    title: "🚗 AI 차종 추천",
    summary: "여행 인원, 짐, 목적지 스타일, 예산을 입력하면 최적의 제주 렌터카 차종을 AI가 추천해주는 단일 페이지 앱. Claude API가 차종 DB와 입력 조건을 결합해 1순위 + 대안 차종을 반환.",
    userFlow: [
      "여행 인원 버튼 선택 (1~7명 이상) — 선택된 버튼 파란색 하이라이트, 5명 이상 시 SUV/승합 우선 추천 로직 활성화",
      "여행 일수 선택 (1/2/3/4/5/7일) — 일수에 따라 총 예상 비용 계산 기준값 변경",
      "짐 크기 선택 (캐리어 1개 ~ 캐리어+등산/서핑 장비) — 트렁크 용량 요구사항에 반영",
      "여행 목적 카드 선택 (힐링/드라이브/등산/맛집/가족/캠핑) — 목적별 추천 차종 우선순위 다름",
      "렌터카 예산 입력 (선택사항, 만원 단위) — 입력 시 해당 예산 초과 차종 필터링",
      "'차종 추천받기' 버튼 클릭 → 로딩 중 스피너 및 'AI가 분석 중...' 텍스트 표시",
      "1순위 추천 결과: 차량 이미지, 이름, 카테고리, 좌석수, 연료타입, 일 렌트비, 추천 이유, 비용 내역, 제주 팁 표시",
      "대안 차종 카드: 가격 차이 및 대안 선택 이유 요약 표시",
    ],
    features: [
      {
        name: "인원 선택",
        desc: "1~6명 또는 7명 이상 버튼 선택. 선택된 버튼은 파란색 하이라이트. 인원 수는 차종 트렁크/좌석 추천에 직접 반영됨 (예: 5명 이상 → SUV/미니밴 우선 추천, 7명 이상 → 승합차 전용 추천)",
        status: "완료",
      },
      {
        name: "여행 일수",
        desc: "1/2/3/4/5/7일 버튼 선택. 선택된 일수 × 차종 일 렌트비로 총 예상 비용 계산. 7일 이상 장기 렌트 할인 안내도 추천 결과에 포함",
        status: "완료",
      },
      {
        name: "짐 크기",
        desc: "캐리어 1개 / 캐리어 2개 / 캐리어 3개 이상 / 캐리어+등산·서핑 장비 / 짐 거의 없음 중 선택. 짐 옵션은 차량 트렁크 용량 기준(소형 350L~대형 700L+)과 매핑되어 추천 차종 필터링에 사용됨",
        status: "완료",
      },
      {
        name: "여행 목적",
        desc: "힐링/휴양 · 드라이브 · 올레길/등산 · 맛집투어 · 가족여행 · 캠핑 6가지 카드 중 택1. 목적에 따라 AI 추천 이유 문구와 강조 차종이 달라짐 (예: 캠핑 → 트렁크 넓은 SUV, 가족여행 → 2열 공간 넓은 미니밴)",
        status: "완료",
      },
      {
        name: "예산 입력",
        desc: "렌터카 총 예산을 만원 단위로 숫자 입력 (선택사항). 입력 시 (예산 ÷ 여행일수) 계산으로 일 렌트비 상한을 설정하고, 상한 초과 차종은 추천에서 제외. 빈 값이면 예산 무제한으로 처리",
        status: "완료",
      },
      {
        name: "AI 추천 결과 — 1순위",
        desc: "차량 이모지 이미지, 차종명, 카테고리(경차/준중형/SUV 등), 좌석수, 연료타입, 일 렌트비, 추천 이유 텍스트, 일별 비용 내역, 차량 특징 태그, 제주 맞춤 팁(급커브·협로 주의 등) 표시",
        status: "완료",
      },
      {
        name: "AI 추천 결과 — 대안 차종",
        desc: "2순위 대안 차종 카드. 1순위와의 가격 차이(±X원), 대안 선택 이유 요약 문구 표시. 사용자가 1순위 외 선택지를 비교할 수 있도록 제공",
        status: "완료",
      },
    ],
    notes: "Claude API 추천 로직. 차종 데이터는 /lib/car-data.ts 하드코딩 (경차~SUV~승합차). /api/recommend POST 엔드포인트로 travelers, days, luggage, purpose, budget 전송",
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
