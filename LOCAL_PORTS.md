# 로컬 개발 포트 & 페이지 정리

> 모든 프로젝트는 루트에서 `npm run dev:[name]` 으로 실행

---

## 3001 — jejupass-promo (제주패스 프로모)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🏠 랜딩 |
| 2 | `/explore` | 🔍 가게 탐색 |
| 3 | `/register` | 📝 가게 등록 |
| 3-1 | `/shop/[slug]` | 🏪 가게 상세 |
| 4 | `/dashboard` | 📊 대시보드 |
| 4-1 | `/dashboard/sns` | 📸 SNS 관리 |

---

## 3002 — mini-xd

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🎨 업로드 (이미지 → 코드) |
| 2 | `/editor` | 💻 에디터 |

---

## 3003 — creative-sandbox

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🏠 홈 |
| 2 | `/login` | 🔐 로그인 |
| 3 | `/dashboard` | 📋 대시보드 |
| 4 | `/test/canvas-demo` | 🖼️ 캔버스 데모 |
| 4-1 | `/test/visibility-demo` | 👁️ 가시성 데모 |
| 4-2 | `/test/widget-add-demo` | ➕ 위젯 추가 |
| 4-3 | `/test/widget-interaction-demo` | 🖱️ 위젯 인터랙션 |

---

## 3004 — jeju-weather (제주 날씨)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🌤️ 날씨 지도 |
| 2 | `/forecast` | 📊 날씨 예보 |

---

## 3005 — jeju-map (제주 지도)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🗺️ 지도 |
| 2 | `/list` | 📋 장소 목록 |

---

## 3006 — jeju-travel-planner (AI 여행 플래너)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | ✈️ AI 여행 플래너 |

---

## 3007 — jeju-course-maker (AI 코스 메이커)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🗺️ AI 코스 메이커 |

---

## 3008 — dashboard (통합 대시보드)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 📊 제주패스 통합 대시보드 |
| 2 | `/setup` | ⚙️ Supabase 셋업 |

---

## 3009 — cs-chatbot (AI 고객 상담)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 💬 AI 고객 상담 챗봇 |

---

## 3010 — jeju-party (제주 취미 파티)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🎉 파티 피드 |
| 2 | `/create` | ✏️ 파티 만들기 |
| 3 | `/party/[id]` | 🎪 파티 상세 |
| 4 | `/privacy` | 📋 개인정보처리방침 |
| 5 | `/terms` | 📋 이용약관 |

---

## 3011 — car-pick (AI 차종 추천)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🚗 AI 차종 추천 |

---

## 3012 — weather-drive (날씨 드라이브)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🌤️🚗 날씨 드라이브 코스 |

---

## 3013 — smart-fuel (스마트 주유)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | ⛽ 스마트 주유 |

---

## 3020 — jeju-travel (제주 여행 허브)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🏠 홈 |
| 2 | `/weather` | 🌤️ 날씨 |
| 3 | `/course` | 🧭 코스 메이커 |
| 4 | `/planner` | ✈️ 여행 일정 |
| 5 | `/map` | 🗺️ 여행 지도 |
| 6 | `/drive` | 🛣️ 드라이브 코스 |

---

## 3021 — jeju-car (렌터카)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 🚗 차종 추천 |
| 2 | `/fuel` | ⛽ 주유 가이드 |
| 3 | `/cost` | 💰 비용 계산 |

---

## 3022 — jeju-biz (비즈니스)

| Step | 경로 | 페이지 |
|------|------|--------|
| 1 | `/` | 📊 대시보드 |
| 2 | `/promo` | 🏪 홍보 관리 |
| 3 | `/cs` | 💬 CS 챗봇 |

---

## 빠른 실행 명령어

```bash
npm run dev:jejupass      # 3001
npm run dev:mini-xd       # 3002
npm run dev:sandbox       # 3003
npm run dev:weather       # 3004
npm run dev:map           # 3005
npm run dev:travel        # 3006
npm run dev:course        # 3007
npm run dev:dashboard     # 3008
npm run dev:chatbot       # 3009
npm run dev:party         # 3010
npm run dev:car-pick      # 3011
npm run dev:weather-drive # 3012
npm run dev:smart-fuel    # 3013
npm run dev:jeju-travel   # 3020
npm run dev:jeju-car      # 3021
npm run dev:jeju-biz      # 3022
```
