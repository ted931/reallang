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
    summary: "여행 인원(1~7명), 일수, 짐 크기, 여행 목적, 선택적 예산을 입력하면 Claude API가 1순위+대안 차종을 추천. 추천 결과는 공유 상태에 저장되어 주유·비용 페이지로 자동 전달.",
    userFlow: [
      "인원 버튼 선택 (1~7명, 7+ 포함)",
      "여행 일수 선택 (1/2/3/4/5/7일 버튼)",
      "짐 크기 선택 (캐리어 1~3개 이상, 장비 포함, 짐 거의 없음)",
      "여행 목적 카드 선택 (힐링/드라이브/올레길·등산/맛집투어/가족여행/캠핑)",
      "렌터카 예산 입력 — 선택사항, 만원 단위 숫자 입력",
      "'차종 추천받기' 클릭 → POST /api/recommend → AI 분석 중 버튼 비활성화",
      "1순위 추천 차종 카드 표시 (이미지·이름·카테고리·좌석·연료·일일요금·추천이유·비용분석·제주팁)",
      "대안 차종 카드 표시 (가격 차이 안내 포함)",
      "추천 결과 saveSelectedCar()로 저장 → 주유 가이드·비용 계산 자동 연동",
      "하단 CTA: 주유 가이드 보기(/fuel), 총 비용 계산하기(/cost)",
    ],
    features: [
      {
        name: "여행 정보 입력",
        desc: "인원(1~7+ 버튼), 일수(1/2/3/4/5/7일 버튼), 짐(캐리어 1개/2개/3개 이상/캐리어+장비/짐 거의 없음 버튼), 목적(힐링/드라이브/올레길·등산/맛집투어/가족여행/캠핑 카드). 예산은 숫자 입력(만원단위, 미입력 시 미전달).",
        status: "완료",
      },
      {
        name: "AI 차종 추천",
        desc: "POST /api/recommend, body: {travelers, days, luggage, purpose, budget?}. Claude API가 car-data.ts 기반 차종 중 최적 1순위+대안 선정. 반환: recommendation(carId·reason·tips·totalCost·costBreakdown)·alternative(carId·reason·priceDiff)·summary.",
        status: "완료",
      },
      {
        name: "1순위 추천 카드",
        desc: "이모지 이미지·이름·카테고리·좌석수·연료타입·일일요금 표시. 추천 이유 텍스트. 비용 분석(totalCost 기준). 제주 팁 노란 박스(tips 배열). 차종 features 태그 목록. 파란 테두리로 강조.",
        status: "완료",
      },
      {
        name: "대안 차종 카드",
        desc: "2순위 차종 이모지·이름·일일요금·가격 차이(priceDiff 문자열)·대안 이유. 회색 테두리의 서브 카드. alternative.car 없으면 미표시.",
        status: "완료",
      },
      {
        name: "공유 상태 저장",
        desc: "saveSelectedCar({carId, carName, pricePerDay, fuelType, days}) 저장. /fuel에서 loadSelectedCar()로 차종 자동 적용. /cost에서도 동일하게 차종·일수 자동 적용. 엣지케이스: car 정보 없으면 저장 스킵.",
        status: "완료",
      },
    ],
    notes: "Claude API로 추천 로직 처리. 차종 데이터는 car-data.ts 하드코딩.",
  },
  "/fuel": {
    title: "⛽ 스마트 주유 가이드",
    summary: "렌터카 반납 전 현재 연료 잔량·차종·반납 위치를 입력하면 필요 주유량과 예상 비용을 계산. fuel-data.ts 하드코딩 주유소 목록 중 최저가 추천 및 카카오맵 길찾기 연동.",
    userFlow: [
      "페이지 진입 → loadSelectedCar()로 이전에 추천받은 차종 자동 적용",
      "차종 버튼 선택 (아반떼/소나타/그랜저/스포티지/팰리세이드/모델3 등)",
      "현재 연료 잔량 슬라이더 조절 (0~100%, 5% 단위)",
      "반납 위치 선택 (제주공항/서귀포 반납점/중문 반납점)",
      "'주유량 계산하기' 클릭 → 즉시 계산 (API 미호출)",
      "필요 주유량(L)·예상 비용·연료 타입 요약 카드 표시",
      "잔량 충분 시(needed=0) '충전 불필요' 안내",
      "최저가 주유소 카드 표시 — 주유소명·주소·셀프·24시간·가격·카카오맵 길찾기 버튼",
      "주변 주유소 전체 목록 가격순 정렬 표시",
    ],
    features: [
      {
        name: "차종 선택 및 자동 적용",
        desc: "CAR_FUEL_EFFICIENCY 객체의 차종명 버튼 목록. loadSelectedCar()로 이전 추천 차종 자동 매칭(carName 뒷 단어 기준). 매칭 없으면 기본값 '아반떼'. 차종별 연비(kmPerLiter)·연료타입(gasoline/diesel) 참조.",
        status: "완료",
      },
      {
        name: "연료 잔량 입력",
        desc: "range 슬라이더 0~100% (step 5). 실시간 % 텍스트 업데이트. E(비어있음) ~ F(가득) 레이블. calculateFuel(carName, fuelPercent, 15km) 함수로 필요량 계산.",
        status: "완료",
      },
      {
        name: "반납 위치 선택",
        desc: "제주공항(lat 33.5066)/서귀포 반납점/중문 반납점 3개 버튼. 선택한 위치로 RETURN_LOCATIONS 매칭. 현재는 반납점까지 거리 15km 하드코딩(실제 거리 계산 미구현).",
        status: "완료",
      },
      {
        name: "주유량 계산",
        desc: "calculateFuel() 반환: needed(필요 리터, 0이면 충분), message, fuelType. 필요량 0 시 '충분' 안내. 필요량 > 0 시 STATIONS 중 최저가 주유소 찾아 단가×필요량=예상비용 계산.",
        status: "완료",
      },
      {
        name: "주유소 추천 및 목록",
        desc: "STATIONS 배열을 연료 타입(휘발유/경유)에 따라 가격순 정렬. 최저가 1개를 '최저가 주유소' 카드로 강조. 카카오맵 길찾기 링크 포함. 전체 목록도 가격순 표시. 지도 경로 표시 미구현.",
        status: "개발중",
      },
    ],
  },
  "/cost": {
    title: "💰 렌터카 비용 계산",
    summary: "차종·대여 기간·보험 유형·하루 주행거리를 선택하면 렌트비+보험료+주유비(또는 충전비)+주차비를 합산한 총 예상 비용을 실시간 시뮬레이션. 이전 AI 추천 차종/일수 자동 반영.",
    userFlow: [
      "페이지 진입 → loadSelectedCar()로 추천 차종·일수 자동 적용",
      "차종 카드 클릭으로 선택 변경 (경차/준중형/중형/SUV/대형SUV/전기차)",
      "대여 기간 +/- 버튼으로 조정 (1~14일)",
      "하루 주행거리 슬라이더 조절 (50~250km, step 10)",
      "보험 유형 카드 선택 (기본/일반/완전자차)",
      "총 비용 그라데이션 박스에서 실시간 합계 확인",
      "비용 비율 바 차트로 렌트비·보험·주유비·주차비 비중 시각화",
      "상세 분석 항목별 금액 확인",
      "하단 최저가 주유소 3개 참고 (전기차 선택 시 미표시)",
    ],
    features: [
      {
        name: "차종 선택",
        desc: "CARS 배열 카드 그리드. 이모지·이름(짧은 이름)·일일요금 표시. 선택 시 emerald 테두리. 차종 features 태그도 선택 후 하단에 표시. loadSelectedCar()로 AI 추천 차종 자동 선택.",
        status: "완료",
      },
      {
        name: "대여 기간",
        desc: "+/- 버튼, 1~14일 범위. 일수 변경 시 모든 비용 즉시 재계산. 초기값: loadSelectedCar()의 days 또는 3일.",
        status: "완료",
      },
      {
        name: "보험 선택",
        desc: "기본(면책 50만, 무료)/일반(면책 30만, +8,000원/일)/완전자차(면책 0, +15,000원/일). 카드 선택 시 emerald 테두리. 보험료 = 옵션 일일요금 × 대여일수.",
        status: "완료",
      },
      {
        name: "실시간 총 비용",
        desc: "렌트비(일일요금×일수)+보험료+주유비(연비·주행거리·유가 계산, 전기차는 40원/km)+주차비(5,000원/일). 1인당 비용(2인 기준)도 함께 표시. 비용 항목별 컬러 비율 바.",
        status: "완료",
      },
      {
        name: "최저가 주유소 참고",
        desc: "선택 차종 연료타입 기준 가격순 상위 3개 표시. 주유소명·주소·셀프여부·가격/L. 전기차 선택 시 이 섹션 미표시.",
        status: "완료",
      },
    ],
    notes: "실제 렌터카사 API 미연동. 내부 요금표(car-data.ts) 기준 계산.",
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
