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
    title: "🏠 랜딩 페이지",
    summary: "제주패스 B2B 서비스 소개 페이지. 제주 가게 사장님들이 제주패스에 입점하도록 유도하는 마케팅 랜딩.",
    userFlow: [
      "사장님이 SNS 광고 또는 검색을 통해 랜딩 진입",
      "히어로 섹션에서 '무료로 시작하기' 또는 '가게 둘러보기' 선택",
      "'SNS 콘텐츠 자동 생성 / 검색 노출 / 카페패스 입점' 3가지 혜택 카드 확인",
      "'3분이면 충분해요' 섹션에서 등록 프로세스 3단계 확인",
      "하단 CTA '무료로 가게 등록하기' 클릭 → /register 이동",
    ],
    features: [
      {
        name: "히어로 섹션",
        desc: "입력: 없음 (정적 콘텐츠). 출력: '무료로 시작하기'(/register) + '가게 둘러보기'(/explore) 두 개의 CTA 버튼 표시. 엣지 케이스: 모바일에서는 버튼이 세로 스택으로 전환됨.",
        status: "완료"
      },
      {
        name: "서비스 소개 카드",
        desc: "입력: 없음 (정적). 출력: SNS 콘텐츠 자동 생성 / 검색 자동 노출 / 카페패스 입점 기회 3가지 혜택 카드 그리드로 표시. 엣지 케이스: sm 미만 화면에서 단일 컬럼으로 전환.",
        status: "완료"
      },
      {
        name: "이용 프로세스 안내",
        desc: "입력: 없음. 출력: '가게 정보 입력 → 사진 올리기 → SNS 콘텐츠 받기' 3단계 스텝 시각화. 엣지 케이스: 없음 (완전 정적).",
        status: "완료"
      },
      {
        name: "CTA 버튼",
        desc: "입력: 클릭 이벤트. 출력: /register 페이지로 라우팅. 엣지 케이스: 헤더 + 히어로 + 하단 총 3곳에 배치 — 어느 위치에서도 등록 시작 가능.",
        status: "완료"
      },
      {
        name: "탐색 링크",
        desc: "입력: 클릭. 출력: /explore 가게 목록으로 이동. 엣지 케이스: 헤더 nav와 히어로 보조 버튼 두 곳에 존재.",
        status: "완료"
      },
    ],
    notes: "B2B 랜딩 — 타겟은 제주 로컬 가게 사장님. 카페패스 입점 혜택 노출로 입점 동기 강화."
  },
  "/explore": {
    title: "🔍 가게 탐색",
    summary: "등록된 제주 가게 목록을 카드 형태로 탐색. 카테고리 + 지역 이중 필터와 API 연동 실시간 목록 제공.",
    userFlow: [
      "페이지 진입 시 전체 가게 목록 자동 로딩 (API: GET /api/shops)",
      "상단 가로 스크롤 카테고리 필터 탭 클릭 → 해당 카테고리만 표시",
      "지역 필터 (제주시/서귀포/한림/…) 추가 선택 → 카테고리+지역 교집합 결과",
      "가게 카드에서 썸네일, 상호명, 카테고리·지역, 인기 메뉴 확인",
      "카드 클릭 → /shop/[slug] 상세 페이지로 이동",
      "결과 없을 경우 '내 가게 등록하기' 링크로 /register 안내",
    ],
    features: [
      {
        name: "가게 카드 목록",
        desc: "입력: API 응답 Shop 배열. 출력: 썸네일(없으면 카테고리 이모지 플레이스홀더), 가게명, '카테고리 · 지역' 텍스트, 소개 2줄 말줄임, 인기 메뉴 최대 2개 뱃지. 엣지 케이스: 사진 없으면 getCategoryEmoji() 이모지 표시, 소개 없으면 해당 영역 숨김.",
        status: "완료"
      },
      {
        name: "카테고리 필터",
        desc: "입력: CATEGORIES 상수 배열의 value 선택. 출력: 선택된 카테고리만 API 재요청 (query param: category=cafe 등). 다시 클릭 시 선택 해제. 엣지 케이스: '전체' 버튼으로 필터 초기화. 선택 상태는 브랜드 컬러 배경으로 강조.",
        status: "완료"
      },
      {
        name: "지역 필터",
        desc: "입력: REGIONS 상수 배열의 value 선택. 출력: 카테고리 필터와 AND 조건으로 API 재요청 (query param: region=seogwipo 등). 엣지 케이스: '전 지역' 버튼으로 초기화. 카테고리·지역 동시 선택 시 두 조건 모두 URL params에 포함.",
        status: "완료"
      },
      {
        name: "가게 상세 이동",
        desc: "입력: 카드 클릭. 출력: /shop/[slug] 페이지로 Next.js Link 이동. 엣지 케이스: slug는 가게 등록 시 서버에서 생성됨 (이름 기반 kebab-case).",
        status: "완료"
      },
      {
        name: "빈 상태 처리",
        desc: "입력: API 응답이 빈 배열. 출력: '등록된 가게가 없습니다' 메시지 + '내 가게 등록하기' CTA 링크. 엣지 케이스: 로딩 중에는 '불러오는 중...' 텍스트 표시.",
        status: "완료"
      },
      {
        name: "검색 기능",
        desc: "입력: (미구현) 가게명 키워드. 출력: (예정) 키워드 포함 가게 필터링. 엣지 케이스: 공백 검색, 특수문자 처리 필요.",
        status: "개발중"
      },
    ]
  },
  "/register": {
    title: "📝 가게 등록",
    summary: "4단계 멀티스텝 폼으로 가게 입점 처리. 기본 정보 → 메뉴 → 사업자 인증 → 완료. 인증 없이도 SNS 콘텐츠 생성 가능.",
    userFlow: [
      "Step 1 — 기본 정보: 가게명·카테고리(그리드 선택)·지역·주소(필수) + 전화·소개(선택) 입력. 필수값 미입력 시 '다음' 버튼 비활성화",
      "Step 2 — 메뉴: 메뉴명+가격 행 추가/삭제, '인기' 토글 가능. 건너뛰기 가능",
      "Step 3 — 사업자 인증: 사업자등록증 사진 업로드 → AI OCR로 번호 자동 추출 + 사업자번호 직접 입력 → API 인증 두 가지 방법 지원",
      "인증 성공 시 초록 확인 박스에 상호/대표자/소재지 표시, 폼에 자동 반영",
      "인증 없이도 '인증 없이 등록' 버튼으로 진행 가능 — 가게 페이지는 비공개로 저장됨",
      "등록 API 호출 성공 → Step 4 완료 화면: '내 가게 페이지 보기' + 'SNS 콘텐츠 만들기' 버튼 제공",
    ],
    features: [
      {
        name: "Step 1: 기본 정보 입력",
        desc: "입력: 가게명(text), 카테고리(그리드 버튼 단일 선택), 지역(버튼 단일 선택), 주소(text), 전화번호(tel), 가게 소개(textarea). 출력: 상태 저장 후 Step 2 이동. 엣지 케이스: name/category/region/address 중 하나라도 빈값이면 '다음' 버튼 disabled. 테스트용 더미 데이터 기본 세팅.",
        status: "완료"
      },
      {
        name: "Step 2: 메뉴 입력",
        desc: "입력: 메뉴명(text) + 가격(number) + 인기 여부(toggle) 행 반복. 출력: menus 배열 상태 저장. 엣지 케이스: 메뉴 1개일 때 삭제 버튼 숨김. 비어있는 name은 최종 등록 시 필터링됨. 건너뛰기 가능(Step 3으로 바로 이동).",
        status: "완료"
      },
      {
        name: "Step 3: 사업자 OCR 인증",
        desc: "입력: 사업자등록증 이미지 파일. 출력: POST /api/verify-business/ocr 호출 → 사업자번호·상호·대표자·소재지 자동 추출. 성공 시 폼에 자동 반영 + verified=true. 엣지 케이스: OCR 실패 시 에러 메시지 표시, 직접 입력 대안 제공. 로딩 중 스피너 + '인식 중...' 텍스트.",
        status: "완료"
      },
      {
        name: "Step 3: 사업자번호 직접 입력",
        desc: "입력: 사업자번호 텍스트 (000-00-00000 형식). 출력: POST /api/verify-business 호출 → 유효성 확인. 성공 시 verified=true, 실패 시 오류 문구 표시. 엣지 케이스: 빈 입력시 '인증' 버튼 disabled, 하이픈 제거 후 전송.",
        status: "완료"
      },
      {
        name: "이미지 업로드",
        desc: "입력: (현재 미구현) 대표 이미지. 출력: 등록 데이터에 photos:[] 빈 배열로 전달. 엣지 케이스: 사진 없으면 탐색 페이지에서 카테고리 이모지 플레이스홀더 표시.",
        status: "기획중"
      },
      {
        name: "등록 완료 및 리다이렉트",
        desc: "입력: '등록 완료' 또는 '인증 없이 등록' 버튼. 출력: POST /api/shops 호출 → slug/id 응답. 인증 여부에 따라 isPublished 결정. 완료 화면에서 /shop/[slug] 및 /dashboard/sns?shopId=[id] 링크 제공. 엣지 케이스: 저장 중 버튼 disabled + '등록 중...' 텍스트.",
        status: "완료"
      },
    ]
  },
  "/shop/[slug]": {
    title: "🏪 가게 상세",
    summary: "개별 가게의 상세 정보 페이지 (서버 컴포넌트). slug로 가게 데이터 조회, SEO 메타데이터 자동 생성, JSON-LD 구조화 데이터 포함.",
    userFlow: [
      "/explore 카드 클릭 또는 직접 URL 접근으로 진입",
      "히어로 영역에서 대표 사진(없으면 카테고리 이모지 배경) + 가게명 + 카테고리·지역 배지 확인",
      "정보 카드에서 소개글, 주소, 전화번호(클릭 시 전화 연결), 오늘 영업 상태(영업중/휴무) 확인",
      "'전체 영업시간 보기' 아코디언 펼쳐서 요일별 시간 확인 (오늘 행 강조)",
      "메뉴 섹션에서 인기 메뉴 뱃지 포함 메뉴 + 가격 목록 확인",
      "사진 갤러리 3열 그리드에서 추가 사진 확인 (사진 2장 이상일 때만 노출)",
      "하단 제주패스 배지로 서비스 홍보",
    ],
    features: [
      {
        name: "가게 기본 정보",
        desc: "입력: URL slug → getShopBySlug(slug). 출력: 가게명·소개·카테고리·지역·주소·전화번호 표시. 엣지 케이스: slug 없거나 매칭 없으면 notFound() 호출 → 404. 전화번호 없으면 해당 행 숨김.",
        status: "완료"
      },
      {
        name: "영업시간 표시",
        desc: "입력: shop.businessHours 객체 (요일 key → 시간 문자열). 출력: 오늘 요일 자동 계산, 영업중/휴무 배지 + 오늘 시간 표시. '전체 영업시간 보기' details 아코디언에서 전체 확인. 엣지 케이스: 오늘 키 없거나 '휴무' 값이면 빨간 배지. 아코디언 기본 닫힘.",
        status: "완료"
      },
      {
        name: "대표 이미지",
        desc: "입력: shop.photos 배열. 출력: isPrimary=true인 사진 우선, 없으면 첫 번째 사진을 히어로 배경으로 표시. 엣지 케이스: 사진 없으면 카테고리별 이모지 배경(카페=☕, 나머지=🍽️).",
        status: "완료"
      },
      {
        name: "메뉴 목록",
        desc: "입력: shop.menus 배열. 출력: 메뉴명 + 가격(formatPrice 원화 포맷) + isPopular=true면 '인기' 뱃지. 엣지 케이스: menus 빈 배열이면 메뉴 섹션 전체 숨김.",
        status: "완료"
      },
      {
        name: "사진 갤러리",
        desc: "입력: shop.photos 배열. 출력: 3열 그리드로 추가 사진 표시. 엣지 케이스: 사진 1장 이하이면 갤러리 섹션 미표시 (히어로에만 노출).",
        status: "완료"
      },
      {
        name: "SEO 메타데이터",
        desc: "입력: slug → shop 데이터. 출력: generateMetadata()로 title/description/openGraph 자동 생성. JSON-LD Schema.org 구조화 데이터 삽입. 엣지 케이스: shop 없으면 '가게를 찾을 수 없습니다' 메타 반환.",
        status: "완료"
      },
    ]
  },
  "/dashboard": {
    title: "📊 가게 대시보드",
    summary: "등록된 가게 관리 허브. SNS 콘텐츠 생성, 새 가게 등록, 가게 탐색으로의 빠른 이동 메뉴 제공.",
    userFlow: [
      "가게 등록 완료 후 또는 직접 /dashboard 접근",
      "4개 메뉴 카드 확인 — SNS 만들기 / 새 가게 등록 / 가게 탐색 / 팁",
      "'SNS 콘텐츠 만들기' 카드 클릭 → /dashboard/sns 이동",
      "'새 가게 등록' 클릭 → /register 이동",
      "'가게 탐색' 클릭 → /explore 이동",
    ],
    features: [
      {
        name: "SNS 콘텐츠 이동 카드",
        desc: "입력: 클릭. 출력: /dashboard/sns 페이지로 이동. 엣지 케이스: hover 시 orange 테두리 + 그림자 효과.",
        status: "완료"
      },
      {
        name: "새 가게 등록 카드",
        desc: "입력: 클릭. 출력: /register 멀티스텝 폼으로 이동. 엣지 케이스: 이미 등록된 가게가 있어도 추가 등록 허용 (다중 가게 운영 고려).",
        status: "완료"
      },
      {
        name: "가게 탐색 카드",
        desc: "입력: 클릭. 출력: /explore 탐색 페이지로 이동. 엣지 케이스: 사장님이 자신의 가게가 목록에 노출되는지 확인하는 용도로도 활용.",
        status: "완료"
      },
      {
        name: "방문자 통계",
        desc: "입력: (미구현) 가게 ID별 페이지뷰·클릭 데이터. 출력: (예정) 조회수, 전화 클릭수, SNS 다운로드 수 등 기본 통계 카드. 엣지 케이스: 데이터 없으면 '-' 표시.",
        status: "기획중"
      },
      {
        name: "가게 정보 수정",
        desc: "입력: (예정) 등록된 가게 선택. 출력: (예정) 기존 정보 불러온 편집 폼. 엣지 케이스: 인증된 가게만 즉시 반영, 미인증 가게는 수정 후에도 비공개 유지.",
        status: "개발중"
      },
    ]
  },
  "/dashboard/sns": {
    title: "📸 SNS 콘텐츠 관리",
    summary: "가게의 SNS 홍보 이미지를 자동 생성하는 도구. 인스타 피드/스토리/카카오톡 3가지 템플릿, AI 홍보 문구, Canvas API 이미지 렌더링.",
    userFlow: [
      "대시보드에서 'SNS 콘텐츠 만들기' 클릭 또는 /dashboard/sns?shopId=[id] 직접 접근",
      "드롭다운에서 등록된 가게 선택 — URL param shopId가 있으면 자동 선택",
      "(선택) 가게 사진 업로드: 파일 선택 → POST /api/upload → 미리보기 표시. 사진 없으면 기본 디자인 적용",
      "템플릿 3종 중 선택: 인스타 피드(1080×1080) / 인스타 스토리(1080×1920) / 카카오톡(800×400)",
      "'AI가 작성해줘' 버튼 → POST /api/sns/generate-caption → 홍보 문구 + 해시태그 자동 생성. 필요 시 직접 수정",
      "'이미지 생성하기' 클릭 → POST /api/sns/generate-card → Canvas API로 PNG 렌더링 → 우측 미리보기 표시",
      "미리보기 확인 후 '다운로드' 버튼으로 [slug]-[template].png 저장, '캡션 복사'로 문구 클립보드 복사",
    ],
    features: [
      {
        name: "가게 선택",
        desc: "입력: select 드롭다운에서 등록된 가게 선택. 출력: 선택 시 caption/hashtags/previewUrl 초기화, 선택된 가게 정보가 이후 API 요청에 사용됨. 엣지 케이스: URL param shopId 있으면 마운트 시 자동 선택. 미선택 시 '이미지 생성하기' 버튼 disabled.",
        status: "완료"
      },
      {
        name: "사진 업로드",
        desc: "입력: 이미지 파일 선택 (file input). 출력: POST /api/upload → 업로드된 이미지 URL 반환, 미리보기 표시. 엣지 케이스: 업로드 중 input disabled + '업로드 중...' 표시. 사진 없으면 카드 생성 시 기본 디자인 적용. ✕ 버튼으로 삭제 가능.",
        status: "완료"
      },
      {
        name: "템플릿 선택",
        desc: "입력: 3개 버튼 중 하나 선택. 출력: template 상태 업데이트, 기존 previewUrl 초기화. 엣지 케이스: 템플릿 변경 시 이전 생성 이미지 자동 삭제 (재생성 유도).",
        status: "완료"
      },
      {
        name: "AI 홍보 문구 생성",
        desc: "입력: 선택된 가게 ID. 출력: POST /api/sns/generate-caption → caption 텍스트 + hashtags 배열 반환, textarea와 해시태그 뱃지에 자동 반영. 엣지 케이스: 가게 미선택 시 버튼 disabled. 생성 중 '생성 중...' 텍스트. 생성 후 직접 수정 가능.",
        status: "완료"
      },
      {
        name: "이미지 생성 및 미리보기",
        desc: "입력: shopId + template + caption(없으면 shop.description 사용) + photoUrl(선택). 출력: POST /api/sns/generate-card → PNG blob → createObjectURL로 img src 표시. 엣지 케이스: 응답 !ok 또는 blob.size < 100 이면 alert 오류 표시. 생성 중 스피너 애니메이션.",
        status: "완료"
      },
      {
        name: "다운로드 및 캡션 복사",
        desc: "입력: '다운로드' 또는 '캡션 복사' 버튼 클릭. 출력: 다운로드 — <a> 태그 programmatic click으로 [slug]-[template].png 저장. 캡션 복사 — 문구+해시태그+제주패스 홍보 문구 합쳐서 clipboard.writeText(). 엣지 케이스: previewUrl 또는 caption 없으면 복사 미실행.",
        status: "완료"
      },
    ],
    notes: "이미지 생성은 서버 Canvas API 기반 PNG 렌더링. 실제 AI 이미지 생성(Stable Diffusion 등) 연동은 추후 예정."
  }
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
