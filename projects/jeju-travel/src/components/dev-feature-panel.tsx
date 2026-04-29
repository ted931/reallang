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
    title: "🏠 제주 여행 허브",
    summary: "제주 여행에 필요한 모든 기능(날씨, 코스, 일정, 지도, 드라이브)의 허브 페이지. 여행 준비 5단계를 시각적으로 안내하고 빠른 시작 카드로 각 서비스 진입.",
    userFlow: [
      "페이지 진입 — 여행 준비 5단계 카드 한눈에 확인",
      "1단계 '날씨 확인' 클릭 → /weather 이동",
      "2단계 'AI 코스 생성' 클릭 → /course 이동",
      "3단계 '일정 만들기' 클릭 → /planner 이동",
      "4단계 '지도 탐색' 클릭 → /map 이동",
      "5단계 '드라이브' 클릭 → /drive 이동",
      "하단 퀵 시작 3개 카드로 주요 기능 바로 진입 가능",
    ],
    features: [
      {
        name: "여행 준비 5단계",
        desc: "날씨→코스→일정→지도→드라이브 순서로 5단계 카드 표시. 각 카드 클릭 시 해당 서브 페이지로 이동. 단계별 번호 아이콘이 hover 시 파란색으로 강조.",
        status: "완료",
      },
      {
        name: "빠른 시작 카드",
        desc: "AI 코스 바로 받기(/course), 지금 제주 날씨(/weather), 오늘의 드라이브 코스(/drive) 3개 카드. 각 카드에 설명 문구 포함. 클릭 시 basePath 포함 경로로 이동.",
        status: "완료",
      },
      {
        name: "하단 탭 네비게이션",
        desc: "홈·날씨·코스·일정·지도·드라이브 6개 탭. sticky bottom으로 고정. 현재 경로 활성 표시. basePath 환경변수 자동 반영.",
        status: "완료",
      },
    ],
  },
  "/weather": {
    title: "🌤️ 제주 실시간 날씨",
    summary: "기상청 초단기실황 API를 통해 제주 10개 지역 날씨를 10분마다 갱신. 맑은 지역/비 오는 지역 요약 후 코스 메이커로 연결하는 CTA 제공.",
    userFlow: [
      "페이지 진입 → 로딩 스피너 표시 중 /api/weather 호출",
      "10개 지역 카드 그리드 표시 (기온·날씨 아이콘·강수량)",
      "상단 4개 요약 카드 확인 (최고기온, 최저기온, 평균습도, 강수지역)",
      "맑은 지역 CTA — '이 지역 코스 만들기 →' 클릭 시 /course?theme=자연&region=제주시&weather=sunny 이동",
      "비 오는 지역 CTA — '실내 코스 보기 →' 클릭 시 /course?theme=카페&indoor=true 이동",
      "지역 카드 클릭 → 상세(습도·풍속·강수량·풍향) 인라인 펼침",
      "날씨 공유 상태(saveWeather) 자동 저장 → 코스/플래너에서 활용",
    ],
    features: [
      {
        name: "10개 지역 실시간 날씨",
        desc: "제주시·서귀포·성산·한림·애월·중문·조천·표선·대정·우도 10개 지역 기온·날씨·강수량 카드. /api/weather GET 호출. API 오류 시 '날씨 데이터를 가져올 수 없습니다' 안내 표시.",
        status: "완료",
      },
      {
        name: "전체 요약 카드",
        desc: "최고기온(빨강), 최저기온(파랑), 평균습도(청록), 강수지역 수(남색) 4개 요약. 전체 지역 값 계산 후 동적 표시. 로딩 중 빈 상태 없이 스피너 처리.",
        status: "완료",
      },
      {
        name: "맑음/비 CTA 연결",
        desc: "강수량 0 지역은 '맑은 곳' 박스에, 강수량 > 0 지역은 '비 오는 곳' 박스에 분류. 맑은 지역 최상위 1곳 기준으로 코스 메이커 딥링크 생성. 강수 지역 없으면 박스 미표시.",
        status: "완료",
      },
      {
        name: "지역 카드 상세 펼침",
        desc: "카드 클릭 시 습도·풍속·강수량·풍향 4개 항목 인라인 확장. 같은 카드 재클릭 시 닫힘(토글). 선택된 카드는 파란 테두리로 강조.",
        status: "완료",
      },
      {
        name: "날씨 공유 상태 저장",
        desc: "saveWeather()로 맑은지역/비오는지역/평균기온/갱신시간 저장 → /course·/planner·/drive에서 loadWeather()로 날씨 힌트 표시에 활용. 기온 단위 °C.",
        status: "완료",
      },
    ],
    notes: "기상청 초단기실황 Open API (공공데이터포털). 10분 캐시 처리 필요.",
  },
  "/course": {
    title: "🧭 AI 코스 메이커",
    summary: "동행 유형·테마(복수)·일수(1~5일)·예산·렌터카 여부를 입력하면 Claude API가 A/B/C 3가지 코스를 생성. 날씨 공유 상태 연동 힌트, 일정 메이커·지도 딥링크 제공.",
    userFlow: [
      "URL 파라미터(theme, region, weather) 또는 날씨 공유 상태 로드 → 자동 힌트 표시",
      "자연어 입력 textarea — 원하는 코스 자유 기술 (선택사항)",
      "일수(1~5일) +/- 버튼으로 선택",
      "예산(10~300만원) +/- 버튼으로 선택",
      "동행 유형 버튼 선택 (커플/가족/친구/혼자/효도/단체)",
      "테마 버튼 복수 선택 (바다/산·숲/맛집/카페/액티비티/문화/힐링/포토)",
      "렌터카 이용 여부 토글",
      "'코스 만들기' 클릭 → 로딩 스피너 표시 → Claude API 호출",
      "A/B/C 3개 코스 카드 표시 — 추천 코스 배지 표시",
      "코스 선택 후 Day 탭 전환, 타임라인 확인",
      "일정 만들기/지도 보기/공유하기 CTA 및 렌터카 비교 배너",
    ],
    features: [
      {
        name: "여행 조건 입력",
        desc: "동행(커플/가족/친구/혼자/효도/단체), 테마(바다/산·숲/맛집/카페/액티비티/문화/힐링/포토 — 복수선택), 일수(1~5일), 예산(10만~300만, 만원단위), 렌터카 ON/OFF 토글. 자연어 입력 textarea도 병행 지원.",
        status: "완료",
      },
      {
        name: "AI 코스 생성",
        desc: "POST /api/course 호출. 조건 JSON 전송 → Claude API가 A·B·C 3가지 코스 반환. 각 코스: 이름·설명·하이라이트·일별 스탑 타임라인·예상비용·이동거리·추천여부. 로딩 중 스피너, API 오류 시 빨간 에러 박스.",
        status: "완료",
      },
      {
        name: "코스 결과 카드",
        desc: "3개 코스 카드에 총비용·이동거리·소요시간 요약. 추천 코스 보라색 배지. 클릭 시 해당 코스 Day 타임라인 표시. 다일 코스는 Day 탭 전환 가능. 각 스팟: 시간·카테고리·이름·설명·주소·TIP·비용 표시.",
        status: "완료",
      },
      {
        name: "날씨 연동 힌트",
        desc: "loadWeather()로 비 오는 지역 자동 감지 → 실내 코스 힌트 표시. URL ?weather=sunny면 맑은 지역 야외 코스 prompt 자동 세팅. ?weather=rainy면 카페 테마 자동 추가.",
        status: "완료",
      },
      {
        name: "딥링크 CTA",
        desc: "일정 만들기: /travel?nights=N&budget=N&style=코스명으로 이동. 지도 보기: /map. 공유하기: navigator.share 지원 시 공유, 미지원 시 URL 클립보드 복사. 렌터카 비교 배너: /car/ utm 파라미터 포함.",
        status: "완료",
      },
      {
        name: "코스 저장 (공유상태)",
        desc: "코스 선택 변경 시 saveCourse()로 코스명·일수·비용·동행·테마·스팟목록 저장. /planner에서 loadCourse()로 불러와 자동 힌트 및 초기값 설정.",
        status: "완료",
      },
    ],
  },
  "/planner": {
    title: "✈️ AI 여행 일정 플래너",
    summary: "숙박일수(1~7박)·인원·예산·여행 스타일을 입력하면 Claude API가 일자별 타임라인 일정을 생성. 코스 메이커 공유 상태 연동, 예산 분석 바 차트, 렌터카 CTA 제공.",
    userFlow: [
      "페이지 진입 → URL 파라미터(nights/budget/style) 또는 코스 공유 상태 로드 → 초기값 자동 세팅",
      "빠른 선택 버튼 (2박3일 커플 힐링/3박4일 가족/1박2일 혼자 등) 클릭 시 textarea 자동 입력",
      "자연어 textarea에 여행 내용 상세 입력 (숙소 위치, 특별 요청 등)",
      "숙박(1~7박), 인원(1~10명), 예산(10~300만) 각각 +/- 조정",
      "여행 스타일 복수 선택 (힐링/액티비티/맛집탐방/카페투어/자연·올레길/문화·역사/포토스팟/가족여행)",
      "'일정 만들기' 클릭 → POST /api/plan 호출 → 로딩 스피너",
      "일정 제목·요약 표시, 요약 카드(일정·인원·예상경비) 확인",
      "Day 탭 전환하며 각 스팟 타임라인 확인 (시간·카테고리·이름·설명·주소·TIP·비용)",
      "예산 분석 바 차트로 숙소·식비·교통 등 항목별 비중 확인",
      "준비물·꿀팁 섹션 확인 후 렌터카 예약 CTA로 이동",
    ],
    features: [
      {
        name: "여행 조건 입력",
        desc: "빠른 선택 4개 프리셋 + 자유 텍스트 입력. 숙박(1~7박)·인원(1~10명)·예산(10~300만원) 스텝 버튼. 여행 스타일 8종 복수 선택. 입력 없을 시 '여행 스타일을 선택하거나 입력해주세요' 에러 표시.",
        status: "완료",
      },
      {
        name: "AI 일정 생성",
        desc: "POST /api/plan 호출. 결과: title·summary·nights·travelers·totalBudget·schedule(일별 스팟)·budgetBreakdown·packingTips. 로딩 스피너, 오류 시 에러 메시지. 생성 후 savePlan()으로 지도 공유 상태 저장.",
        status: "완료",
      },
      {
        name: "Day 타임라인",
        desc: "날짜 탭 가로 스크롤. 각 스팟: 시간·카테고리 뱃지(숙소/식당/카페/관광지/액티비티/이동)·이름·설명·주소·TIP(연두색 박스)·예상비용 표시. 무료 장소는 '무료'.",
        status: "완료",
      },
      {
        name: "예산 분석",
        desc: "budgetBreakdown 배열로 카테고리별 금액+비율 바 표시. 총 예산 대비 퍼센트로 바 너비 계산. 항목 없을 시 섹션 미표시.",
        status: "완료",
      },
      {
        name: "준비물 및 꿀팁",
        desc: "packingTips 배열 리스트 표시. 녹색 dash 불릿. API 응답에 없으면 섹션 미표시.",
        status: "완료",
      },
      {
        name: "코스 연동 힌트",
        desc: "loadCourse()로 이전 코스 메이커 결과 자동 로드. 코스명·일수·스팟수 힌트 배너 표시. nights·budget 자동 세팅. /planner?nights=N&budget=N&style=코스명 파라미터도 지원.",
        status: "완료",
      },
    ],
  },
  "/map": {
    title: "🗺️ 여행 지도",
    summary: "Leaflet + OpenStreetMap 기반 제주 지도. 관광지·맛집·카페·해변 등 카테고리별 POI 마커 표시. 공공데이터 API 실시간 로드, 날씨 마커 오버레이, 일정 연동 배너.",
    userFlow: [
      "페이지 진입 → Leaflet 동적 로드 → 지도 초기화 (제주 중심 zoom 10)",
      "loadPlan()으로 일정 공유 상태 확인 → 일정 배너 표시",
      "/api/places?type=12 (관광지) + /api/places?type=39 (음식점) 순차 호출",
      "카테고리 필터 버튼 토글로 마커 표시/숨기기",
      "날씨 토글 ON → /api/weather 호출 → 기온 컬러 날씨 마커 오버레이",
      "마커 클릭 → 지도 flyTo 이동 + 오른쪽 상세 패널 표시",
      "상세 패널: 카테고리·이름·설명·주소·전화 + 카카오맵 길찾기/보기 링크",
    ],
    features: [
      {
        name: "Leaflet 지도",
        desc: "SSR 회피를 위해 useEffect에서 동적 import. OpenStreetMap 타일 레이어. 초기 중심 제주도(33.38, 126.55) zoom 10. 줌 컨트롤 우측상단 배치. 지도 준비 전 스피너 표시.",
        status: "완료",
      },
      {
        name: "POI 마커",
        desc: "카테고리별 색상+이모지 divIcon. 활성 카테고리(cafe/restaurant/attraction/beach) 기본 선택. 클릭 시 flyTo(lat, lng, zoom 13) + 상세 패널 오픈. 기존 마커 제거 후 재생성(activeCategories 변경 시).",
        status: "완료",
      },
      {
        name: "카테고리 필터",
        desc: "카테고리 버튼 클릭 시 해당 마커 즉시 토글. 날씨 토글은 별도 분리. 버튼에 해당 카테고리 마커 수 뱃지 표시. 하단 좌측 현재 표시 장소수 카운터.",
        status: "완료",
      },
      {
        name: "날씨 오버레이",
        desc: "날씨 토글 ON 시 /api/weather 호출. 기온별 색상(빨강≥25°/주황≥20°/초록≥15°/청록≥10°/파랑) 라벨 마커 표시. 마커 hover 시 툴팁(이름·기온·날씨·습도·풍속). 토글 OFF 시 마커 제거.",
        status: "완료",
      },
      {
        name: "장소 상세 패널",
        desc: "우측 w-80 패널. 카테고리 뱃지·이름·설명·주소·전화(tel 링크). 카카오맵 길찾기(파란 버튼) + 카카오맵에서 보기(흰 버튼). ✕ 클릭으로 닫힘.",
        status: "완료",
      },
      {
        name: "일정 연동 배너",
        desc: "loadPlan()에 저장된 일정 있으면 상단 초록 배너로 '일정 장소 N곳이 지도에 표시됩니다' 안내. '닫기' 클릭으로 제거. 현재는 배너만 표시, 실제 마커 하이라이트는 미구현.",
        status: "개발중",
      },
    ],
  },
  "/drive": {
    title: "🛣️ 날씨 드라이브 코스",
    summary: "현재 제주 날씨를 실시간 로드 후 드라이브 선호(자동/바다/숲길/카페투어/맛집/실내)를 선택하면 Claude API가 날씨 최적 코스를 추천. 경유지 타임라인 표시.",
    userFlow: [
      "페이지 진입 → /api/weather 호출 → 현재 날씨 요약 표시",
      "맑은 지역(강수량 0) / 비 오는 지역(강수량 > 0) 자동 분류 표시",
      "드라이브 선호 6개 버튼 선택 (날씨에 맡기기/바다 드라이브/숲길·올레길/카페 투어/맛집 드라이브/실내 위주)",
      "'날씨 맞춤 코스 추천받기' 클릭 → POST /api/suggest 호출 → 로딩 스피너",
      "코스 이름·설명·야외/실내/복합 타입 뱃지 표시",
      "날씨 요약 박스 + 추천 출발 시간 표시",
      "경유지 타임라인: 순번 원·장소명·카테고리·설명·이전 지점에서 소요시간·TIP",
      "'더 상세한 코스 만들기 →' 클릭 시 /course로 이동",
    ],
    features: [
      {
        name: "실시간 날씨 요약",
        desc: "/api/weather GET 호출. 맑은 지역(기온 포함)·비 오는 지역(강수량mm 포함) 박스 분리 표시. 전체 지역 소형 뱃지도 함께 표시. 날씨 로드 중 '날씨 확인 중...' 텍스트.",
        status: "완료",
      },
      {
        name: "드라이브 선호 선택",
        desc: "6개 버튼 단일 선택. '날씨에 맡기기' 선택 시 AI에 선호 미전달(빈 문자열). 나머지는 선호 레이블을 API에 전달. 선택 버튼 파란 테두리 강조.",
        status: "완료",
      },
      {
        name: "AI 코스 추천",
        desc: "POST /api/suggest, body: {weatherData, preference}. 반환: courseName·description·weatherSummary·type(outdoor/indoor/mixed)·stops·totalDriveMinutes·bestTimeToGo. 오류 시 콘솔 에러(토스트 미표시 — 개선 필요).",
        status: "완료",
      },
      {
        name: "코스 경유지 타임라인",
        desc: "stops 배열: order 원형 번호·장소명·카테고리 뱃지(관광지/카페/식당/체험/해변/박물관)·설명·이전 지점에서 N분·TIP(노란색). 경유지 사이 세로선으로 연결.",
        status: "완료",
      },
      {
        name: "코스 상세 및 연결",
        desc: "weatherSummary(날씨 근거)·bestTimeToGo(추천 출발 시간) 박스 표시. 하단 '더 상세한 코스 만들기 →' /course 링크. 코스 지도 경로 표시는 미구현.",
        status: "개발중",
      },
    ],
    notes: "날씨 데이터 기상청 Open API 연동. /api/suggest는 Claude API 사용.",
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
