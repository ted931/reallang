# 프로젝트별 필요 API 및 준비사항 체크리스트

> **작성일**: 2026-04-08  
> **목적**: 각 프로젝트에 필요한 외부 API/크레덴셜을 정리하고, 미보유 항목의 가입 방법을 안내

---

## 현재 보유 API 키 현황

| API | 환경변수 | 상태 | 비고 |
|-----|---------|------|------|
| OpenAI (GPT-4o) | `OPENAI_API_KEY` | ✅ 보유 | 여행 플래너, CS 챗봇, 코스 메이커 등에 활용 |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY` | ✅ 보유 | DB, 인증, 실시간 구독 |
| 공공데이터포털 | `DATA_GO_KR_KEY` | ✅ 보유 | 기상청, 관광 데이터, 교통 데이터 |
| V-World (브이월드) | `VWORLD_API_KEY` | ✅ 보유 | 지도 타일, 지오코딩 |

---

## 프로젝트별 API 요구사항

---

### 1. 제주 실시간 날씨 지도 (1순위)

| API/서비스 | 용도 | 상태 | 환경변수 |
|-----------|------|------|---------|
| V-World 지도 API | 배경 지도 타일 렌더링 | ✅ 보유 | `VWORLD_API_KEY` |
| 공공데이터포털 - 기상청 초단기실황 | 현재 기온/강수/풍속 | ✅ 보유 | `DATA_GO_KR_KEY` |
| 공공데이터포털 - 기상청 동네예보 | 3일 예보 데이터 | ✅ 보유 | `DATA_GO_KR_KEY` |
| 에어코리아 API | 미세먼지/UV 지수 | ✅ 보유 (동일 키) | `DATA_GO_KR_KEY` |

**추가 작업**: 공공데이터포털에서 아래 API를 **활용 신청**해야 함 (키는 동일, API별 승인 필요):
- 기상청_초단기실황_조회서비스: https://www.data.go.kr/data/15084084/openapi.do
- 기상청_단기예보_조회서비스: https://www.data.go.kr/data/15084670/openapi.do
- 에어코리아_대기오염정보: https://www.data.go.kr/data/15073861/openapi.do

> **결론: 추가 가입 불필요, API 활용 신청만 하면 즉시 개발 가능**

---

### 2. 제주 전용 지도 플랫폼 (2순위)

| API/서비스 | 용도 | 상태 | 환경변수 |
|-----------|------|------|---------|
| V-World 지도 API | 배경 지도 | ✅ 보유 | `VWORLD_API_KEY` |
| V-World 지오코딩 | 주소 → 좌표 변환 | ✅ 보유 | `VWORLD_API_KEY` |
| 공공데이터포털 - 한국관광공사 관광정보 | POI 데이터 (관광지, 맛집 등) | ✅ 보유 (동일 키) | `DATA_GO_KR_KEY` |
| 공공데이터포털 - 제주특별자치도 관광데이터 | 제주 특화 관광 정보 | ✅ 보유 (동일 키) | `DATA_GO_KR_KEY` |

**추가 작업**: 공공데이터포털에서 아래 API 활용 신청:
- 한국관광공사_관광정보서비스: https://www.data.go.kr/data/15101578/openapi.do
- 제주특별자치도_관광지정보: https://www.data.go.kr/data/15076257/openapi.do

> **결론: 추가 가입 불필요**

---

### 3. AI 여행 플래너 (3순위)

| API/서비스 | 용도 | 상태 | 환경변수 |
|-----------|------|------|---------|
| OpenAI GPT-4o | 자연어 파싱 + 일정 생성 | ✅ 보유 | `OPENAI_API_KEY` |
| 공공데이터포털 - 관광정보 | 숙소/식당/액티비티 데이터 | ✅ 보유 | `DATA_GO_KR_KEY` |
| Supabase | 사용자 일정 저장, 인증 | ✅ 보유 | `NEXT_PUBLIC_SUPABASE_*` |

> **결론: 추가 가입 불필요, 즉시 개발 가능**

---

### 4. AI 제주 코스 메이커 (4순위)

| API/서비스 | 용도 | 상태 | 환경변수 |
|-----------|------|------|---------|
| OpenAI GPT-4o | 코스 최적화/추천 | ✅ 보유 | `OPENAI_API_KEY` |
| V-World 지도 API | 코스 시각화 | ✅ 보유 | `VWORLD_API_KEY` |
| 공공데이터포털 - 기상청 | 날씨 기반 코스 전환 | ✅ 보유 | `DATA_GO_KR_KEY` |
| 공공데이터포털 - 관광정보 | 장소 데이터 | ✅ 보유 | `DATA_GO_KR_KEY` |

> **결론: 추가 가입 불필요**

---

### 5. 통합 대시보드 (5순위)

| API/서비스 | 용도 | 상태 | 환경변수 |
|-----------|------|------|---------|
| Supabase | 데이터 저장/실시간 구독 | ✅ 보유 | `NEXT_PUBLIC_SUPABASE_*` |
| OpenAI GPT-4o | 데이터 인사이트 요약 (선택) | ✅ 보유 | `OPENAI_API_KEY` |

> **결론: 추가 가입 불필요**

---

### 6. AI CS 챗봇 (6순위)

| API/서비스 | 용도 | 상태 | 환경변수 |
|-----------|------|------|---------|
| OpenAI GPT-4o | 자연어 이해/응답 생성 | ✅ 보유 | `OPENAI_API_KEY` |
| Supabase | FAQ 데이터/대화 로그 저장 | ✅ 보유 | `NEXT_PUBLIC_SUPABASE_*` |

**선행 작업**: 제주패스 FAQ, 환불 정책, 예약 절차 등 지식 베이스 문서 정리 필요

> **결론: 추가 가입 불필요, 지식 베이스 정리가 핵심**

---

### 7. 직원관리 ERP (7순위)

| API/서비스 | 용도 | 상태 | 환경변수 |
|-----------|------|------|---------|
| Supabase | DB, 인증, Row Level Security | ✅ 보유 | `NEXT_PUBLIC_SUPABASE_*` |

**선택적 추가 API**:

| API/서비스 | 용도 | 상태 | 가입 방법 |
|-----------|------|------|----------|
| Slack Webhook | 근태 알림 연동 | ❌ 미보유 | Slack App 생성 → Incoming Webhook URL 발급 |
| 카카오 알림톡 | 직원 알림 발송 | ❌ 미보유 | 아래 상세 참조 |

> **결론: 기본 기능은 추가 가입 불필요. 알림 기능 시 Slack/카카오 연동 필요**

---

### 8. 리뷰 엔진 (8순위)

| API/서비스 | 용도 | 상태 | 가입 방법 |
|-----------|------|------|----------|
| OpenAI GPT-4o | 감성분석/요약 | ✅ 보유 | — |
| Supabase | 리뷰 데이터 저장 | ✅ 보유 | — |
| 네이버 검색 API | 리뷰 데이터 수집 | ❌ 미보유 | 아래 참조 |
| 카카오 로컬 API | 장소 리뷰 연동 | ❌ 미보유 | 아래 참조 |
| Google Places API | 구글 리뷰 수집 | ❌ 미보유 | 아래 참조 |

**가입 필요 항목**:

#### 네이버 검색 API
- **가입 URL**: https://developers.naver.com/apps/#/register
- **절차**: 네이버 로그인 → 애플리케이션 등록 → "검색" API 선택 → Client ID/Secret 발급
- **무료 한도**: 25,000건/일
- **환경변수**: `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`

#### 카카오 로컬 API
- **가입 URL**: https://developers.kakao.com/console/app
- **절차**: 카카오 로그인 → 앱 생성 → REST API 키 발급
- **무료 한도**: 300,000건/일
- **환경변수**: `KAKAO_REST_API_KEY`

#### Google Places API
- **가입 URL**: https://console.cloud.google.com/apis/library/places-backend.googleapis.com
- **절차**: GCP 프로젝트 생성 → Places API 활성화 → API 키 발급 → 결제 계정 연결
- **무료 한도**: 월 $200 크레딧 (약 10,000건 Place Details)
- **환경변수**: `GOOGLE_PLACES_API_KEY`
- **주의**: 결제 계정 필수 (무료 크레딧 범위 내 사용 가능)

---

### 9. 제주 스케줄 빌더 (9순위)

| API/서비스 | 용도 | 상태 | 가입 방법 |
|-----------|------|------|----------|
| V-World 지도 API | 배경 지도 | ✅ 보유 | — |
| Supabase | 일정 데이터 저장 | ✅ 보유 | — |
| OpenAI GPT-4o | 빈 시간 추천 | ✅ 보유 | — |
| Kakao Mobility API | 실시간 길찾기/이동시간 | ❌ 미보유 | 아래 참조 |
| Liveblocks | 실시간 공동편집 (CRDT) | ❌ 미보유 | 아래 참조 |

**가입 필요 항목**:

#### Kakao Mobility API (길찾기)
- **가입 URL**: https://developers.kakaomobility.com/
- **절차**: 회원가입 → 앱 등록 → REST API 키 발급
- **무료 한도**: 10,000건/일 (자동차 길찾기)
- **환경변수**: `KAKAO_MOBILITY_API_KEY`
- **비고**: 카카오 디벨로퍼스(kakao.com)와 별도 플랫폼, 별도 가입 필요

#### Liveblocks (실시간 협업)
- **가입 URL**: https://liveblocks.io/dashboard
- **절차**: GitHub/Google 소셜 로그인 → 프로젝트 생성 → Public/Secret 키 발급
- **무료 한도**: Starter 플랜 무료 (월 300 동시접속자)
- **환경변수**: `LIVEBLOCKS_PUBLIC_KEY`, `LIVEBLOCKS_SECRET_KEY`
- **비고**: 유료 전환 시 Pro $99/월

**대안**: Liveblocks 대신 Supabase Realtime + Yjs로 자체 구현 가능 (추가 비용 없음, 개발 시간 증가)

---

### 10. 제주 소셜 허브 (10순위)

| API/서비스 | 용도 | 상태 | 가입 방법 |
|-----------|------|------|----------|
| Supabase | DB, 인증, Realtime | ✅ 보유 | — |
| OpenAI GPT-4o | 매칭 추천 | ✅ 보유 | — |
| V-World 지도 API | 이벤트 지도 표시 | ✅ 보유 | — |
| 카카오 소셜 로그인 | 간편 가입 | ❌ 미보유 | 아래 참조 |
| Firebase Cloud Messaging (FCM) | 푸시 알림 | ❌ 미보유 | 아래 참조 |
| Cloudinary 또는 Supabase Storage | 이미지 업로드 | ✅ Supabase Storage 사용 가능 | — |

**가입 필요 항목**:

#### 카카오 소셜 로그인
- **가입 URL**: https://developers.kakao.com/console/app
- **절차**: 앱 생성 → 카카오 로그인 활성화 → Redirect URI 설정 → 동의항목 설정
- **비용**: 무료
- **환경변수**: `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
- **비고**: 리뷰 엔진(8순위)에서 카카오 앱을 만들었다면 동일 앱에 로그인 기능 추가

#### Firebase Cloud Messaging (FCM)
- **가입 URL**: https://console.firebase.google.com/
- **절차**: Firebase 프로젝트 생성 → Cloud Messaging 활성화 → 서비스 계정 키 발급
- **비용**: 무료 (무제한 발송)
- **환경변수**: `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`
- **비고**: Google Places API(8순위)에서 GCP 프로젝트를 만들었다면 동일 프로젝트에 Firebase 연결

---

## 미보유 API 가입 우선순위 정리

당장 필요하지 않은 API는 해당 프로젝트 착수 시 가입하면 됩니다.

### 지금 당장 불필요 (Sprint 1~3은 보유 API만으로 충분)

1~6순위 프로젝트는 **이미 보유한 API만으로 개발 가능**합니다.

### Sprint 4 이후 필요

| 순서 | API | 사용 프로젝트 | 가입 소요시간 |
|------|-----|-------------|-------------|
| 1 | 카카오 디벨로퍼스 (REST API) | 리뷰 엔진, 소셜 허브 | 5분 (즉시 발급) |
| 2 | 네이버 디벨로퍼스 (검색 API) | 리뷰 엔진 | 5분 (즉시 발급) |
| 3 | Kakao Mobility | 스케줄 빌더 | 10분 (별도 플랫폼) |
| 4 | Google Cloud Platform | 리뷰 엔진 (Places) | 10분 (결제 계정 필요) |
| 5 | Firebase | 소셜 허브 (푸시) | 5분 (GCP 있으면 즉시) |
| 6 | Liveblocks | 스케줄 빌더 | 3분 (소셜 로그인) |

---

## .env.local 추가 항목 템플릿

Sprint 5 이후 필요한 환경변수를 미리 정리합니다. 해당 프로젝트 착수 시 값을 채우세요.

```bash
# === 카카오 (리뷰 엔진 + 소셜 허브 + 스케줄 빌더) ===
KAKAO_REST_API_KEY=          # https://developers.kakao.com
KAKAO_CLIENT_ID=             # 소셜 로그인용 (REST API 키와 동일)
KAKAO_CLIENT_SECRET=         # 카카오 로그인 보안 설정에서 발급
KAKAO_MOBILITY_API_KEY=      # https://developers.kakaomobility.com (별도)

# === 네이버 (리뷰 엔진) ===
NAVER_CLIENT_ID=             # https://developers.naver.com
NAVER_CLIENT_SECRET=

# === Google (리뷰 엔진 + 소셜 허브) ===
GOOGLE_PLACES_API_KEY=       # https://console.cloud.google.com
FIREBASE_PROJECT_ID=         # https://console.firebase.google.com
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# === Liveblocks (스케줄 빌더) ===
LIVEBLOCKS_PUBLIC_KEY=       # https://liveblocks.io
LIVEBLOCKS_SECRET_KEY=

# === Slack (ERP 알림, 선택) ===
SLACK_WEBHOOK_URL=           # Slack App → Incoming Webhook
```

---

## 공공데이터포털 API 활용 신청 목록

보유한 `DATA_GO_KR_KEY`로 사용 가능하지만, 각 API별로 **활용 신청**을 별도로 해야 합니다.

| API명 | 신청 URL | 사용 프로젝트 | 승인 방식 |
|-------|---------|-------------|----------|
| 기상청 초단기실황 조회서비스 | https://www.data.go.kr/data/15084084/openapi.do | 날씨 지도 | 자동 승인 |
| 기상청 단기예보 조회서비스 | https://www.data.go.kr/data/15084670/openapi.do | 날씨 지도 | 자동 승인 |
| 에어코리아 대기오염정보 | https://www.data.go.kr/data/15073861/openapi.do | 날씨 지도 | 자동 승인 |
| 한국관광공사 관광정보서비스 | https://www.data.go.kr/data/15101578/openapi.do | 지도 플랫폼, 여행 플래너 | 자동 승인 |
| 제주특별자치도 관광지정보 | https://www.data.go.kr/data/15076257/openapi.do | 지도 플랫폼 | 자동 승인 |
| 한국공항공사 항공편정보 | https://www.data.go.kr/data/15000444/openapi.do | 여행 플래너 (선택) | 자동 승인 |
