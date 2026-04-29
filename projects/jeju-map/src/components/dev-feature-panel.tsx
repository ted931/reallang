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
    title: "🗺️ 제주 여행 지도",
    summary: "제주 관광지, 맛집, 숙소, 액티비티를 지도에서 탐색하는 인터랙티브 지도. Leaflet + VWorld(국토부) 타일, 마커 클러스터링, 날씨 오버레이 지원.",
    userFlow: [
      "진입 시 Leaflet 지도 초기화 → VWorld 타일 로드(키 없으면 OSM 폴백), 마커 클러스터 스크립트 로드",
      "DUMMY_PINS + EXTRA_PINS 기본 마커 렌더, 네이버 벌크 API + 공공데이터 API 비동기 병합",
      "상단 검색창에 장소명·주소 입력 → 실시간 드롭다운(최대 8건) 표시",
      "검색 결과 또는 지도 마커 클릭 → 해당 위치로 flyTo(zoom 14), 상세 패널 오픈",
      "카테고리 필터 패널 토글 → 체크된 카테고리 마커만 지도에 표시",
      "날씨 토글(🌤️ 버튼) 활성 → /api/weather 호출 후 온도·날씨 오버레이 마커 표시",
      "데스크톱: 오른쪽 사이드 패널에 상세 정보 표시. 모바일: 바텀시트 슬라이드업",
      "상세 패널에서 카카오맵 길찾기·카카오맵에서 보기·네이버 검색 링크 클릭 → 외부 이동",
    ],
    features: [
      {
        name: "POI 마커 + 클러스터링",
        desc: "DUMMY_PINS + EXTRA_PINS + 네이버 벌크 API + 공공데이터 API(type 12/39) 4개 소스 병합. 카테고리별 색상 원형 마커. leaflet.markercluster로 50px 내 마커 자동 그룹화. 클러스터 개수에 따라 32/40/48px 원형 뱃지",
        status: "완료",
      },
      {
        name: "카테고리 필터",
        desc: "CATEGORIES 기반 멀티 토글 칩. 활성 카테고리 색상 배경. 전체 선택/초기화 버튼. 카테고리별 장소 수 표시. 필터 변경 시 클러스터 즉시 재렌더",
        status: "완료",
      },
      {
        name: "실시간 장소 검색",
        desc: "검색어 입력 시 pins 배열에서 name·address·description 포함 검색(대소문자 무시). 최대 8건 드롭다운. 항목 클릭 시 카테고리 미활성이면 자동 활성화 후 flyTo",
        status: "완료",
      },
      {
        name: "마커 클릭 상세 패널",
        desc: "장소명, 카테고리 뱃지, 설명, 주소(📍), 전화번호(📞·클릭 tel: 링크). 데스크톱: 오른쪽 w-96 사이드 패널. 모바일: 바텀시트(max-h-[60vh], slide-up 애니메이션). 카카오맵 길찾기/보기 + 네이버 검색 외부 링크",
        status: "완료",
      },
      {
        name: "날씨 오버레이",
        desc: "상단 🌤️ 버튼 토글 → /api/weather 호출 → 지점별 온도·날씨 이모지 divIcon 마커 표시. 기온 구간별 배경색(≥25° red, ≥20° amber, ≥15° emerald, ≥10° cyan, 이하 blue). 재토글 시 마커 전체 제거",
        status: "완료",
      },
      {
        name: "현재 위치",
        desc: "GPS Geolocation API로 사용자 현재 위치 마커 표시 예정",
        status: "개발중",
      },
      {
        name: "경로 탐색",
        desc: "두 지점 간 경로 및 소요 시간 표시 (카카오 모빌리티 또는 OSRM 연동 예정)",
        status: "기획중",
      },
    ],
    notes: "지도 타일: VWorld(국토부, NEXT_PUBLIC_VWORLD_KEY 환경변수) 기본, 키 없으면 OSM 폴백. 한국어 지명 표시",
  },
  "/list": {
    title: "📋 제주 장소 목록",
    summary: "지도의 장소들을 리스트 형태로 탐색. DUMMY_PINS 기반 카테고리 필터 및 카드 목록 제공.",
    userFlow: [
      "진입 시 DUMMY_PINS 전체 목록 로드 — 카테고리별 장소 수 뱃지 표시",
      "상단 카테고리 필터 탭(전체·카페·맛집·관광지 등) 클릭 → 해당 카테고리 카드만 표시",
      "각 장소 카드 확인: 카테고리 이모지·이름·카테고리 뱃지·설명·주소",
      "카테고리 탭 재클릭으로 다른 카테고리로 전환",
      "원하는 장소 확인 후 지도(/)로 이동해 위치 확인 (지도에서 보기 기능 예정)",
    ],
    features: [
      {
        name: "장소 카드 목록",
        desc: "DUMMY_PINS 기반 카드 리스트. 카테고리 이모지·이름·카테고리 컬러 뱃지·설명(없으면 생략)·주소(📍) 표시. hover 시 shadow-sm 전환",
        status: "완료",
      },
      {
        name: "카테고리 필터 탭",
        desc: "CATEGORIES에서 count > 0인 카테고리만 탭 렌더. '전체(N)' 탭 항상 첫 위치. 활성 탭 cat.color 배경색 적용. 필터는 DUMMY_PINS 대상 (API 데이터 미포함)",
        status: "완료",
      },
      {
        name: "정렬",
        desc: "거리순(GPS 기반)/별점순/최신순 정렬 옵션 예정. 현재 DUMMY_PINS 기본 순서 고정",
        status: "개발중",
      },
      {
        name: "지도에서 보기",
        desc: "선택한 장소를 지도(/)에서 하이라이트하여 표시. URL 파라미터 또는 상태 공유 방식 검토 중",
        status: "기획중",
      },
    ],
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
