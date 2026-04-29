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
    title: "⛽ 스마트 주유 가이드",
    summary: "렌터카 반납 전 가장 가깝고 저렴한 주유소를 안내하고, 필요한 주유량을 자동으로 계산해주는 도구. 차종별 연료통 용량과 현재 잔량을 기반으로 정확한 주유량과 예상 금액을 산출.",
    userFlow: [
      "차종 선택 버튼 클릭 (아반떼/소나타/투싼/카니발 등) — 선택 즉시 해당 차량의 연료통 용량 및 연료 타입(휘발유/경유) 자동 세팅",
      "현재 연료 잔량 슬라이더 조작 (0~100%, 5% 단위) — 슬라이더 이동 시 '%' 수치 실시간 표시",
      "반납 위치 버튼 선택 (제주공항 / 서귀포 반납점 / 중문 반납점) — 반납지 기준으로 인근 주유소 필터링",
      "'주유량 계산하기' 버튼 클릭 → 즉시 계산 (API 없이 클라이언트 계산)",
      "필요 주유량(L) 및 예상 주유 금액 결과 카드 표시 — 연료가 충분하면 '주유 불필요' 메시지",
      "최저가 주유소 카드: 주유소명, 주소, 셀프/24시간 여부, 리터당 가격, 카카오맵 길찾기 링크",
      "전체 주유소 목록 리스트: 가격 오름차순 정렬, 브랜드·주소 서브 정보 함께 표시",
    ],
    features: [
      {
        name: "차종 선택",
        desc: "아반떼/소나타/투싼/카니발 등 렌터카 인기 차종 버튼 선택. 선택 즉시 /lib/fuel-data.ts의 CAR_FUEL_EFFICIENCY에서 해당 차종의 연료통 용량(L), 연료 타입(휘발유/경유), 연비 데이터를 자동 로드",
        status: "완료",
      },
      {
        name: "현재 연료 잔량",
        desc: "0~100% 범위의 range 슬라이더 (5% 단위). 슬라이더 위에 현재 % 수치 녹색 강조 표시. 입력값 × 연료통 용량으로 현재 잔량(L) 계산. E/F 레이블로 직관적 시각화",
        status: "완료",
      },
      {
        name: "반납 위치 선택",
        desc: "제주공항(위도 33.5066 / 경도 126.4928) / 서귀포 반납점 / 중문 반납점 중 선택. 반납지 좌표를 기반으로 인근 주유소 필터링 및 거리 계산에 활용",
        status: "완료",
      },
      {
        name: "주유량 계산",
        desc: "calculateFuel() 함수 호출 — 반납지까지 약 15km 주행 가정, 현재 잔량으로 반납지 도달 가능 여부 판단. 부족 시 필요 주유량(L) = 목표량 - 현재량으로 계산. 연료 충분 시 '주유 불필요' 메시지 반환",
        status: "완료",
      },
      {
        name: "최저가 주유소 추천",
        desc: "STATIONS 배열을 연료 타입(휘발유/경유)에 맞춰 가격 오름차순 정렬, 1위 주유소를 '최저가' 카드로 표시. 카드에는 주유소명, 주소, 셀프서비스 여부, 24시간 운영 여부, 리터당 가격 표시. 카카오맵 길찾기 딥링크 제공",
        status: "완료",
      },
      {
        name: "전체 주유소 목록",
        desc: "반납 위치 주변 모든 주유소를 가격 오름차순으로 목록 표시. 각 항목에 주유소명, 브랜드, 주소, 리터당 가격 표시. 주유가 필요한 경우에만 목록 노출",
        status: "완료",
      },
      {
        name: "지도 경로",
        desc: "현재 위치 → 추천 주유소 → 반납지 순서로 경로를 지도에 시각화. 현재는 카카오맵 외부 링크로 대체 중",
        status: "개발중",
      },
    ],
    notes: "주유소 가격 데이터는 오피넷 API 연동 예정. 현재는 /lib/fuel-data.ts 샘플 데이터 사용. 거리 계산은 좌표 기반 유클리드 근사값 사용",
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
