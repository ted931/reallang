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
  "/dashboard/cafepass": {
    title: "☕ 카페패스 관리",
    summary: "사장님이 카페패스 입점 현황을 확인하고 패스 적용 메뉴를 설정하는 페이지.",
    userFlow: [
      "대시보드에서 '카페패스' 메뉴 진입",
      "현재 카페패스 입점 상태(활성/대기) 확인",
      "패스 적용 메뉴 목록 설정 및 저장",
      "방문 횟수 통계 확인",
    ],
    features: [
      {
        name: "입점 상태 표시",
        desc: "카페패스 활성/대기/미입점 상태 표시. 상태에 따라 배지 색상 분기.",
        status: "완료"
      },
      {
        name: "적용 메뉴 설정",
        desc: "패스 적용 가능 메뉴 토글 선택 + 저장. 엣지 케이스: 메뉴 없으면 '메뉴를 먼저 등록해주세요' 안내.",
        status: "완료"
      },
    ]
  },
  "/dashboard/shop/[id]/edit": {
    title: "✏️ 가게 정보 수정",
    summary: "등록된 가게의 기본 정보, 메뉴, 영업시간을 수정하는 편집 폼.",
    userFlow: [
      "대시보드 가게 목록에서 '수정' 클릭 → /dashboard/shop/[id]/edit 진입",
      "기존 가게 정보 자동 로딩",
      "가게명 / 소개 / 주소 / 카테고리 수정",
      "메뉴 추가·삭제·인기 여부 토글",
      "'저장하기' 클릭 → PUT /api/shops/[id] 호출 → 성공 시 /shop/[slug]으로 이동",
    ],
    features: [
      {
        name: "기본 정보 편집",
        desc: "입력: 가게명·카테고리·지역·주소·전화·소개. 출력: PUT /api/shops/[id] 저장. 엣지 케이스: 필수값 비면 저장 버튼 disabled.",
        status: "완료"
      },
      {
        name: "메뉴 편집",
        desc: "행 추가/삭제, 인기 토글. 저장 시 기존 menus 배열 교체.",
        status: "완료"
      },
    ]
  },
  "/rentcar": {
    title: "🚗 렌터카 연계",
    summary: "여행자에게 제주 렌터카 업체를 소개하고 파티(동승) 연계 예약을 안내하는 페이지.",
    userFlow: [
      "내비 또는 jeju-party 배너에서 /rentcar 진입",
      "렌터카 업체 목록 카드 확인 (차종·가격·좌석)",
      "AI 추천 버튼 클릭 → 인원·일정 입력 → 추천 차량 반환",
      "예약 문의 클릭 → 외부 업체 페이지 또는 문의 모달",
    ],
    features: [
      {
        name: "차량 목록",
        desc: "차종·좌석·일일 요금·엔빵 계산 카드 그리드 표시. 엣지 케이스: 목록 없으면 '준비 중' 표시.",
        status: "완료"
      },
      {
        name: "AI 차량 추천",
        desc: "인원·카테고리 입력 → POST /api/rentcar/recommend → 추천 차량 + 이유 반환.",
        status: "완료"
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

const STRATEGY = {
  oneLiner: "제주를 여행하는 사람과 제주에서 장사하는 사람 사이의 모든 거래를 연결하는 SEO 기반 플랫폼",
  phases: [
    {
      label: "초기 (0~6개월)",
      color: "emerald",
      title: "SEO + 데이터 축적",
      goal: "수익보다 트래픽. 사람들이 실제로 원하는지 검증한다.",
      items: [
        "구글 롱테일 키워드 상위노출 50개 확보",
        "파티 후기 500건 · 가게 리뷰 2,000건 누적 → 자동 SEO",
        "서핑·낚시·자전거 업체 10곳 직접 섭외 (0% 수수료 6개월)",
        "인스타 감성 계정 팔로워 5,000명",
        "가게 등록 300개 · 파티 월 100개",
      ],
    },
    {
      label: "중기 (6~18개월)",
      color: "blue",
      title: "수익화 검증",
      goal: "트래픽을 돈으로. 어떤 사장님이 왜 결제하는지 패턴을 찾는다.",
      items: [
        "사장님 유료 플랜 출시 (3만/10만/30만원)",
        "렌터카 제휴 수수료 (예약당 3,000~15,000원)",
        "파티 예약 수수료 (거래액 3~5%)",
        "유료 사장님 200명 · MRR 1,500만원",
        "월 순방문자 20만",
      ],
    },
    {
      label: "장기 (18개월~)",
      color: "violet",
      title: "제주 여행 인프라",
      goal: "네이버 없이도 제주 여행자가 반드시 거치는 플랫폼이 된다.",
      items: [
        "직접 트래픽 30% 이상 (광고·검색 의존 탈출)",
        "렌터카·숙박·체험·파티 한 곳에서 예약",
        "제주 관광공사 · 카드사 B2B 제휴",
        "MRR 5,000만원",
        "강원 · 부산 · 오키나와 확장",
      ],
    },
  ],
  why: [
    { who: "혼자 여행자", pain: "동행 찾을 공식 창구가 없다", value: "카테고리·날짜·지역 필터로 1클릭 신청" },
    { who: "렌터카 비용 절감", pain: "혼자 빌리면 비쌈", value: "동승자 모집 → 반값" },
    { who: "일정 짜기 귀찮음", pain: "블로그 수십 개 읽어야 함", value: "AI가 1분 안에 내 스타일 코스" },
    { who: "사장님", pain: "마케팅 비용 대비 효과 불투명", value: "3분 가입 · AI 홍보글 자동 · 수수료는 매출 후" },
  ],
  acquisition: [
    "액티비티 업체 10곳 직접 섭외 → 파티 50개 · 후기 200개로 SEO 시작",
    "제주 한달살기 유튜버·블로거 5~10명 협업 (카페패스 무료 제공)",
    "제주살기 네이버카페 · 당근 제주 커뮤니티 홍보",
    "인스타 '제주에서 이런 사람 만났다' 스토리 연재",
  ],
};

export function DevFeaturePanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"guide" | "flow" | "spec">("guide");
  const pathname = usePathname();
  const key = Object.keys(DOCS).find(k => {
    if (k === pathname) return true;
    const pattern = k.replace(/\[.*?\]/g, "[^/]+");
    return new RegExp(`^${pattern}$`).test(pathname);
  }) ?? "/";
  const doc = DOCS[key];
  if (!doc) return null;

  const phaseColor: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
  };
  const phaseDot: Record<string, string> = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    violet: "bg-violet-500",
  };

  const tabLabel = { guide: "전체가이드", flow: "유저플로우", spec: "기능명세" } as const;
  const headerTitle = tab === "guide" ? "🧭 전략 개요" : tab === "flow" ? `${doc.title} — 유저플로우` : doc.title;

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
          <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
            <div className="px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-base text-gray-900">{headerTitle}</h2>
              <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 text-xl transition-colors">×</button>
            </div>
            <div className="flex px-6 gap-1 pb-3">
              {(["guide", "flow", "spec"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${tab === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                  {tabLabel[t]}
                </button>
              ))}
            </div>
          </div>

          {tab === "guide" && (
            <div className="px-6 py-5 space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">한 줄 정의</p>
                <p className="text-sm text-indigo-900 font-medium leading-relaxed">{STRATEGY.oneLiner}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">단계별 목표</h3>
                <div className="space-y-3">
                  {STRATEGY.phases.map((phase, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${phaseColor[phase.color]}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${phaseDot[phase.color]}`} />
                        <span className="text-xs font-semibold">{phase.label}</span>
                      </div>
                      <p className="font-bold text-sm mb-1">{phase.title}</p>
                      <p className="text-xs opacity-70 mb-2">{phase.goal}</p>
                      <ul className="space-y-1">
                        {phase.items.map((item, j) => (
                          <li key={j} className="text-xs flex gap-1.5"><span>•</span><span>{item}</span></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">쓸 수밖에 없는 이유</h3>
                <div className="space-y-2">
                  {STRATEGY.why.map((w, i) => (
                    <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                      <span className="text-xs font-semibold text-gray-700">{w.who}</span>
                      <div className="flex gap-2 mt-1 text-xs text-gray-500">
                        <span className="text-rose-400">😓 {w.pain}</span>
                      </div>
                      <div className="text-xs text-emerald-700 mt-0.5">✓ {w.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">초기 사람 모으는 법</h3>
                <div className="space-y-2">
                  {STRATEGY.acquisition.map((item, i) => (
                    <div key={i} className="flex gap-2.5 text-xs text-gray-600">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex-shrink-0 flex items-center justify-center font-bold">{i + 1}</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "flow" && (
            <div className="px-6 py-5 space-y-6">
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">{doc.summary}</p>
              {doc.userFlow && doc.userFlow.length > 0 ? (
                <div className="space-y-2.5">
                  {doc.userFlow.map((step, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">이 페이지의 유저플로우가 아직 작성되지 않았습니다.</p>
              )}
            </div>
          )}

          {tab === "spec" && (
            <div className="px-6 py-5 space-y-6">
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
              {doc.notes && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-800 leading-relaxed">📌 {doc.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
