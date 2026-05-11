# 디자인 개선 프롬프트 모음

> 우선순위 순서대로 Claude에 복붙해서 사용

---

## 1. jeju-map 메인 지도 페이지

```
/Users/ted/reallang/projects/jeju-map/src/app/page.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4, Leaflet 지도
색상: 주색 indigo-500~600, 보조 gray 계열
폰트: Noto Sans KR

개선 요청:
1. 지도 로딩 중 스피너만 있는데 — 스켈레톤 or 그라데이션 로딩 화면으로 교체
2. 검색 결과 0건일 때 empty state UI 추가 (아이콘 + 안내 문구)
3. 사이드 패널(가게 목록)이 고정 너비 w-96인데 — 큰 화면에서 더 넓게, 작은 화면에서 bottom sheet로 전환
4. 가게 카드 hover 시 지도 마커 하이라이트 느낌이 안 남 — 카드에 시각적 액티브 상태 강화
5. 전체적으로 카드 간격/타이포 정리

유지할 것:
- 기존 useState, useEffect, Leaflet 연동 로직 그대로
- DevNav 건드리지 말 것
- "use client" 유지
```

---

## 2. jejupass-promo 대시보드

```
/Users/ted/reallang/projects/jejupass-promo/src/app/dashboard/page.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4
색상: 주색 orange-500, 보조 gray 계열
폰트: Noto Sans KR

개선 요청:
1. 로그인 안 된 상태일 때 — 빈 화면 대신 로그인 유도 카드 UI (중앙 정렬, 아이콘, CTA 버튼)
2. 가게 등록 0개일 때 empty state — "아직 등록된 가게가 없어요" + 등록하기 버튼
3. 통계 숫자 카드들 (조회수, 리뷰 등) — 현재 단조로운데 아이콘 + 컬러 포인트 추가
4. 섹션 간 시각적 구분이 약함 — 카드 컴포넌트화, 그림자/border 정리
5. 모바일에서 카드 그리드가 깨지는 부분 수정

유지할 것:
- 기존 fetch 로직, sessionStorage, router 로직 건드리지 말 것
- DevNav 건드리지 말 것
```

---

## 3. jeju-biz 사업자 파티 대시보드

```
/Users/ted/reallang/projects/jeju-biz/src/app/commercial/page.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4
색상: 주색 blue-600, 보조 gray 계열 (사업자 파티는 blue 계열 유지)
폰트: Noto Sans KR

개선 요청:
1. 상단 요약 카드 4개 — 숫자만 나열되어 있는데 아이콘 + 증감 표시(↑↓) + 색상 포인트 추가
2. 파티 카드들 — 상태 뱃지(모집중/마감/완료) 색상이 단조로움, 더 명확하게
3. 예약자 아코디언 — 열렸을 때 레이아웃이 밋밋함, 테이블 or 리스트 카드 스타일로
4. 수수료 내역 탭 — 월별 테이블이 너무 단순, 차트 느낌 바 or 색상 강조 추가
5. 탭 전환 UI — 현재 버튼 스타일인데 underline 탭 or 세그먼트 컨트롤로 개선
6. 빈 상태(예약 없을 때) empty state 추가

유지할 것:
- 기존 useState, 탭 로직, 아코디언 로직 건드리지 말 것
- DevNav 건드리지 말 것
```

---

## 4. jeju-party AI 일정 페이지

```
/Users/ted/reallang/projects/jeju-party/src/app/ai-plan/page.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4
색상: 주색 orange-500, AI/생성 느낌은 violet-500 포인트 사용 가능
폰트: Noto Sans KR

개선 요청:
1. 입력 폼 단계 — 칩 선택 버튼들이 단조로움, 선택됐을 때 애니메이션/강조 개선
2. AI 생성 중 로딩 — 단순 스피너 대신 "일정 분석 중..." 텍스트 순환 or 단계별 진행 표시
3. 코스 카드 A/B/C — 3개 카드가 너무 비슷하게 생김, 각 코스 성격(힐링/액티브/미식)을 색상/아이콘으로 차별화
4. 일정 타임라인 — 현재 단순 리스트, 세로 타임라인 UI (왼쪽 시간, 점선, 오른쪽 내용)로 개선
5. 하단 CTA ("파티 만들기", "렌터카") — 더 눈에 띄게, 고정 하단 바로 변경

유지할 것:
- fetch/API 호출 로직, step 상태 건드리지 말 것
- DevNav 건드리지 말 것
```

---

## 5. jeju-party 약관 / 개인정보처리방침

```
/Users/ted/reallang/projects/jeju-party/src/app/terms/page.tsx 와
/Users/ted/reallang/projects/jeju-party/src/app/privacy/page.tsx 를 읽고 디자인을 개선해줘.
두 파일 동시에 작업해줘.

스택: Next.js App Router, Tailwind CSS v4
색상: 주색 orange-500, 보조 gray 계열

개선 요청:
1. 현재 텍스트 나열 수준 — 섹션별 접기/펼치기 아코디언 추가
2. 목차(Table of Contents) 상단 또는 사이드에 추가, 클릭 시 해당 섹션으로 스크롤
3. 섹션 헤더에 번호 + 아이콘으로 시각적 구분
4. 중요 항목 (개인정보 항목, 보유 기간 등) highlight 박스 처리
5. 마지막 업데이트 날짜, 문의처 강조

유지할 것:
- 기존 텍스트 내용 그대로 (수정 없이 디자인만)
- DevNav 건드리지 말 것
```

---

## 6. 피싱로그 홈 피드

```
/Users/ted/reallang/projects/fishing/src/app/page.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4
색상: 주색 ocean-500 (#1e6595), 어센트 hook (#f59e0b), 배경 ocean-950 (#080f1e)
색상 토큰 위치: /Users/ted/reallang/projects/fishing/src/app/globals.css
폰트: Noto Sans KR

개선 요청:
1. 히어로 섹션 — 물결/파도 느낌이 부족함, 바다 분위기 강화 (물결 SVG 데코 or 그라디언트 개선)
2. 통계 바 4개 숫자 — 단조로움, 숫자 카운트업 애니메이션 느낌 or 아이콘 + 컬러 강조
3. HOT 조황 카드 그리드 — 수평 스크롤 캐러셀로 변경 (모바일 UX 개선)
4. 좌대 예약 섹션 — 잔여석 적은 카드에 "마감임박" 강조가 약함, 더 눈에 띄게
5. 전체적으로 섹션 간 구분이 약함 — 섹션 헤더에 왼쪽 컬러 border or 배경 변화 추가

유지할 것:
- 더미 데이터 import 로직 건드리지 말 것
- DevNav, Header, BottomNav 건드리지 말 것
- ocean-*, hook 색상 토큰 그대로 사용
```

---

## 7. 피싱로그 조황 피드

```
/Users/ted/reallang/projects/fishing/src/app/catch/page.tsx 와
/Users/ted/reallang/projects/fishing/src/components/catch-card.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4
색상: 주색 ocean-500, 어센트 hook (#f59e0b), 배경 ocean-950
폰트: Noto Sans KR

개선 요청:
1. 필터 칩들 — 활성화 상태가 없어서 선택 여부가 안 보임, 활성 스타일 추가 (ocean-500 배경 + 흰 텍스트)
2. CatchCard 어획 뱃지 — 큰 어종(50cm+)은 더 눈에 띄게 강조 (사이즈 폰트 크게 or 골드 색상)
3. 카드 내 날씨·조류 정보 — 아이콘이 이모지라 통일감 없음, 작은 인라인 아이콘으로 정리
4. 리스트 전체 — 스크롤 시 카드 사이 구분이 약함, 구분선 or 공간감 개선
5. 빈 필터 결과 empty state 추가 (물고기 못 잡은 일러스트 느낌 텍스트)

유지할 것:
- 더미 데이터 로직, import 건드리지 말 것
- DevNav 건드리지 말 것
```

---

## 8. 피싱로그 좌대 목록 + 상세

```
/Users/ted/reallang/projects/fishing/src/app/jwaedae/page.tsx 와
/Users/ted/reallang/projects/fishing/src/components/jwaedae-card.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4
색상: 주색 ocean-500, 어센트 hook (#f59e0b), 배경 ocean-950
폰트: Noto Sans KR

개선 요청:
1. 카드 이미지 플레이스홀더 — 단순 그라디언트인데 바다/낚시 느낌 나는 CSS 패턴으로 개선
2. 잔여석 표시 — "잔여 2석"처럼 숫자만 있는데 시각적 진행바 or 좌석 아이콘으로 표현
3. 카드 요금 표시 — 주간/야간 가격 비교가 한눈에 안 들어옴, 레이아웃 개선
4. 조황등급 "상/중/하" — 별 아이콘 3개 or 색상 게이지로 시각화
5. 상세 페이지 CTA 버튼 — sticky 하단에 있는데 그림자/블러 처리 강화해서 더 부각

유지할 것:
- 더미 데이터, notFound 로직 건드리지 말 것
- DevNav 건드리지 말 것
```

---

## 9. 피싱로그 낚시 모임

```
/Users/ted/reallang/projects/fishing/src/app/gathering/page.tsx 와
/Users/ted/reallang/projects/fishing/src/components/gathering-card.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4
색상: 주색 ocean-500, 어센트 hook (#f59e0b), 배경 ocean-950
폰트: Noto Sans KR

개선 요청:
1. GatheringCard 참가 현황 바 — 얇고 눈에 안 띔, 더 두껍게 + 남은 자리 숫자 강조
2. 마감임박 카드 — 뱃지만 있는데 카드 전체 border를 rose 계열로 강조 (펄스 애니메이션 옵션)
3. 호스트 정보 — 조획 마리 수가 신뢰 지표인데 더 눈에 띄게 (물고기 아이콘 + 색상)
4. 날짜/시간 표시 — D-day 카운트다운 배지 추가 (D-6 식으로)
5. "모임 만들기" CTA — 현재 필터 옆에 작게 있는데, 하단 플로팅 버튼으로 이동

유지할 것:
- 더미 데이터, import 로직 건드리지 말 것
- DevNav 건드리지 말 것
```

---

## 10. 피싱로그 포인트 지도

```
/Users/ted/reallang/projects/fishing/src/app/map/page.tsx 를 읽고 디자인을 개선해줘.

스택: Next.js App Router, Tailwind CSS v4 (SVG 정적 지도)
색상: 주색 ocean-500, 어센트 hook (#f59e0b), 배경 ocean-950
폰트: Noto Sans KR

개선 요청:
1. SVG 지도 — 제주도 윤곽이 단순 타원, 실제 제주 섬 형태에 가까운 폴리곤으로 개선
2. 마커 — 단순 원인데 스팟 유형별로 다른 모양 (방파제: 닻, 갯바위: 바위, 좌대: 집, 선상: 배)
3. 포인트 클릭 시 — 지도 아래에 슬라이드업 상세 카드 표시 (useState로 선택 상태 관리)
4. 조황 HOT 마커 — 황금색 링 + 펄스 애니메이션으로 더 눈에 띄게
5. 오른쪽 포인트 목록 — 호버 시 지도 해당 마커 강조되는 연동 UX

유지할 것:
- DUMMY_POINTS 데이터, toSVG 좌표 변환 함수 건드리지 말 것
- DevNav 건드리지 말 것
```
