# Mini XD — AI 코드 생성 규칙 (v1.0)

> 디자인 스크린샷으로부터 HTML+CSS+JS를 생성할 때 반드시 준수해야 하는 규칙.

---

## 1. 시맨틱 HTML (규칙 1–12)

### R01. 페이지 랜드마크 필수 사용
모든 페이지는 `<header>`, `<main>`, `<footer>`를 반드시 포함한다. `<main>`은 페이지당 하나만 존재한다.

```html
<body>
  <a href="#main-content" class="skip-link">본문으로 건너뛰기</a>
  <header class="gnb">…</header>
  <main id="main-content">…</main>
  <footer class="footer">…</footer>
</body>
```

### R02. 내비게이션은 `<nav>` + 리스트 구조
내비게이션은 반드시 `<nav>` 안에 `<ul> > <li> > <a>` 구조로 작성한다. 주 내비게이션(GNB)과 보조 내비게이션(LNB)을 `aria-label`로 구분한다.

```html
<nav aria-label="메인 내비게이션">
  <ul class="gnb__list">
    <li class="gnb__item"><a href="/about" class="gnb__link">소개</a></li>
    <li class="gnb__item"><a href="/learn" class="gnb__link">학습</a></li>
  </ul>
</nav>
<nav aria-label="사이드 내비게이션">
  <ul class="lnb__list">…</ul>
</nav>
```

### R03. 제목 계층 엄수
`<h1>`은 페이지당 하나. `<h2>` → `<h3>` → `<h4>` 순서대로 사용하며 레벨을 건너뛰지 않는다. 시각적 크기 조절은 CSS 클래스로 한다.

```html
<!-- 올바름 -->
<h1>메인 제목</h1>
<h2>섹션 제목</h2>
<h3>하위 제목</h3>

<!-- 금지: 레벨 건너뛰기 -->
<h1>메인 제목</h1>
<h4>하위 제목</h4> <!-- ❌ h2, h3 없이 h4 사용 -->
```

### R04. `<section>`과 `<article>` 구분
- `<section>`: 관련 콘텐츠 그룹. 반드시 제목(`h2`–`h6`)을 포함한다.
- `<article>`: 독립적으로 배포 가능한 콘텐츠(블로그 글, 카드, 댓글).
- 의미 없는 그룹핑은 `<div>`를 사용한다.

### R05. 이미지 + 캡션은 `<figure>` 사용

```html
<figure class="card__figure">
  <img src="photo.webp" alt="서울 남산타워 야경" width="600" height="400" loading="lazy">
  <figcaption class="card__caption">2024년 촬영된 남산타워</figcaption>
</figure>
```

### R06. 테이블은 데이터 표시에만 사용
레이아웃용 `<table>` 금지. 데이터 테이블은 `<caption>`, `<thead>`, `<th scope="col|row">`를 반드시 포함한다.

### R07. `<div>` 사용 조건
시맨틱 태그가 적합하지 않을 때만 `<div>`를 사용한다. 레이아웃 래퍼, 스타일링 후크 등에 한정.

### R08. 인라인 텍스트 시맨틱
- 강조: `<strong>` (중요), `<em>` (강세)
- 시간: `<time datetime="2024-01-01">`
- 약어: `<abbr title="검색엔진최적화">SEO</abbr>`

### R09. 폼 요소 시맨틱

```html
<form>
  <fieldset>
    <legend>배송 정보</legend>
    <div class="form-group">
      <label for="name">이름</label>
      <input type="text" id="name" name="name" required autocomplete="name">
    </div>
  </fieldset>
</form>
```

### R10. 리스트 올바르게 사용
- 순서 없는 항목: `<ul>`
- 순서 있는 항목(단계, 순위): `<ol>`
- 용어 정의: `<dl> > <dt> + <dd>`
- 메뉴, 태그 목록, 브레드크럼 등도 `<ul>/<ol>`로 마크업

### R11. `<button>` vs `<a>` 명확히 구분
- 페이지 이동 → `<a href="…">`
- 동작 실행(모달 열기, 토글 등) → `<button type="button">`
- `<div onclick>` 절대 금지

### R12. `<dialog>` 활용
모달/팝업은 `<dialog>` 요소를 사용한다. 커스텀 모달 시에도 `role="dialog"`, `aria-modal="true"`를 적용한다.

---

## 2. 접근성 — WCAG 2.1 AA (규칙 13–28)

### R13. 건너뛰기 링크 필수

```html
<a href="#main-content" class="skip-link">본문으로 건너뛰기</a>
```
```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 9999;
  padding: 0.75rem 1.5rem;
  background: #000;
  color: #fff;
}
.skip-link:focus {
  top: 0;
}
```

### R14. 모든 이미지에 `alt` 속성
- 정보 전달 이미지: 내용을 설명하는 `alt` 텍스트
- 장식 이미지: `alt=""` (빈 문자열) + `aria-hidden="true"`
- `alt` 속성 자체를 생략하지 않는다

### R15. 색상 대비 비율 준수
- 일반 텍스트: 최소 4.5:1
- 큰 텍스트(18px bold 이상 또는 24px 이상): 최소 3:1
- UI 컴포넌트/그래픽: 최소 3:1
- 색상만으로 정보를 전달하지 않는다 (아이콘, 텍스트 등 보조 수단 병행)

### R16. 포커스 표시 필수
`:focus-visible` 스타일을 모든 인터랙티브 요소에 적용한다. `outline: none`만 단독 사용 금지.

```css
:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

### R17. ARIA 라벨링 규칙
- 텍스트가 없는 버튼: `aria-label` 필수
- 아이콘 버튼: `aria-label` + 아이콘에 `aria-hidden="true"`
- 동일 역할 여러 개: `aria-label`로 구분

```html
<button type="button" aria-label="메뉴 열기" class="hamburger">
  <svg aria-hidden="true">…</svg>
</button>
```

### R18. 랜드마크 역할 명시
동일 타입 랜드마크가 2개 이상이면 `aria-label`로 구분한다.

### R19. 키보드 접근성
- 모든 인터랙티브 요소는 `Tab`으로 접근 가능
- 커스텀 위젯은 적절한 `role`과 키보드 핸들링 구현
- 포커스 트랩: 모달 열릴 때 포커스를 모달 내부로 가두고, 닫힐 때 트리거 요소로 복귀

### R20. 폼 접근성
- 모든 입력에 `<label>` 연결 (`for`/`id` 매칭)
- 에러 메시지는 `aria-describedby`로 입력과 연결
- 필수 필드는 `required` + `aria-required="true"`
- 에러 상태는 `aria-invalid="true"`

```html
<div class="form-group">
  <label for="email">이메일</label>
  <input type="email" id="email" name="email"
         required aria-required="true"
         aria-invalid="true"
         aria-describedby="email-error">
  <p id="email-error" class="form-error" role="alert">
    올바른 이메일 주소를 입력해주세요.
  </p>
</div>
```

### R21. 동적 콘텐츠 알림
실시간 변경 사항은 `aria-live` 리전으로 알린다.
- 중요 알림: `aria-live="assertive"` 또는 `role="alert"`
- 보조 정보: `aria-live="polite"`

### R22. 터치 타겟 크기
모든 클릭/탭 가능 요소는 최소 44x44px.

### R23. 반응형에서도 접근성 유지
모바일에서 숨겨진 내비게이션(햄버거 메뉴)도 `aria-expanded`, `aria-controls`를 사용한다.

```html
<button type="button"
        aria-label="메뉴"
        aria-expanded="false"
        aria-controls="mobile-nav">
  <svg aria-hidden="true">…</svg>
</button>
<nav id="mobile-nav" hidden>…</nav>
```

### R24. 미디어 접근성
- 동영상: 자막 제공
- 자동 재생 금지 (사용자 컨트롤 필수)
- `prefers-reduced-motion` 존중

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### R25. `lang` 속성 지정
```html
<html lang="ko">
```
영어 등 다른 언어 삽입 시 해당 요소에 `lang="en"` 적용.

### R26. 탭 순서
DOM 순서가 시각적 순서와 일치하도록 작성한다. `tabindex` 양수 값 사용 금지. 필요 시 `tabindex="0"` 또는 `tabindex="-1"`만 허용.

### R27. 텍스트 크기 조절 보장
`200%`까지 확대해도 콘텐츠가 잘리거나 겹치지 않아야 한다. `rem`/`em` 단위 사용 권장.

### R28. 명확한 링크 텍스트
"여기", "더보기"만 단독 사용 금지. 링크 목적이 텍스트만으로 이해 가능해야 한다.
```html
<!-- ❌ -->
<a href="/pricing">자세히 보기</a>

<!-- ✅ -->
<a href="/pricing">요금제 자세히 보기</a>
```

---

## 3. SEO (규칙 29–38)

### R29. 필수 메타 태그

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>페이지 제목 | 사이트명</title>
  <meta name="description" content="60–160자 설명">
  <link rel="canonical" href="https://example.com/page">

  <!-- Open Graph -->
  <meta property="og:title" content="페이지 제목">
  <meta property="og:description" content="페이지 설명">
  <meta property="og:image" content="https://example.com/og.jpg">
  <meta property="og:url" content="https://example.com/page">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="페이지 제목">
  <meta name="twitter:description" content="페이지 설명">
</head>
```

### R30. `<h1>`은 페이지의 핵심 키워드를 포함
R03의 계층 규칙에 더해, `<h1>`에 페이지 핵심 주제를 포함한다. `<title>` 태그와 의미적으로 일관성을 유지한다.

### R31. 이미지 `alt`에 키워드 자연스럽게 포함
키워드 스터핑 금지. 이미지 내용을 자연어로 설명하되 관련 키워드를 포함한다.

### R32. 구조화된 데이터 (JSON-LD)
적용 가능한 경우 페이지 유형에 맞는 JSON-LD를 `<head>` 또는 `<body>` 끝에 삽입한다.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "페이지 제목",
  "description": "페이지 설명",
  "publisher": {
    "@type": "Organization",
    "name": "사이트명"
  }
}
</script>
```

### R33. 시맨틱 랜드마크 = SEO 신호
R01의 랜드마크 구조는 검색엔진에게 페이지 구조를 전달한다. `<main>` 내부에 핵심 콘텐츠를 배치한다.

### R34. 내부 링크에 설명적 앵커 텍스트
R28과 동일. 검색엔진은 앵커 텍스트로 링크 대상의 주제를 판단한다.

### R35. 모바일 퍼스트 설계
반응형은 모바일 퍼스트로 구현한다. 이는 구글의 모바일 우선 인덱싱에 대응한다.

### R36. Core Web Vitals 대응
- LCP: 히어로 이미지에 `fetchpriority="high"`, `loading="eager"`
- CLS: 이미지/비디오에 `width`/`height` 명시
- INP: 무거운 JS 핸들러는 디바운스/쓰로틀 적용

### R37. 브레드크럼 마크업

```html
<nav aria-label="브레드크럼">
  <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/"><span itemprop="name">홈</span></a>
      <meta itemprop="position" content="1">
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name" aria-current="page">현재 페이지</span>
      <meta itemprop="position" content="2">
    </li>
  </ol>
</nav>
```

### R38. robots 메타
필요 시 `<meta name="robots" content="index, follow">` 명시. SPA의 경우 SSR/SSG를 권장하되, 클라이언트 렌더링만 가능한 경우 이를 주석으로 알린다.

---

## 4. 성능 (규칙 39–48)

### R39. 이미지 최적화 필수

```html
<!-- 히어로 이미지: 즉시 로드, 우선순위 높음 -->
<img src="hero.webp"
     srcset="hero-480.webp 480w, hero-768.webp 768w, hero-1200.webp 1200w"
     sizes="(max-width: 768px) 100vw, 1200px"
     alt="히어로 이미지 설명"
     width="1200" height="600"
     fetchpriority="high">

<!-- 스크롤 아래 이미지: 지연 로드 -->
<img src="card.webp" alt="카드 설명"
     width="400" height="300"
     loading="lazy" decoding="async">
```

### R40. 이미지 포맷
WebP 우선. `<picture>` 요소로 폴백 제공.

```html
<picture>
  <source srcset="photo.avif" type="image/avif">
  <source srcset="photo.webp" type="image/webp">
  <img src="photo.jpg" alt="설명" width="600" height="400" loading="lazy">
</picture>
```

### R41. 크리티컬 CSS 인라인
Above-the-fold 스타일은 `<style>` 태그로 `<head>`에 인라인한다. 나머지 CSS는 비동기 로드.

```html
<head>
  <style>/* 크리티컬 CSS: 헤더, 히어로 영역 스타일 */</style>
  <link rel="preload" href="main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="main.css"></noscript>
</head>
```

### R42. JS 로딩 전략
- 핵심 JS: `<script defer src="main.js">`
- 서드파티/분석: `<script async src="analytics.js">`
- 인라인 JS는 최소화 (`<body>` 끝에 배치)

### R43. 폰트 로딩

```css
@font-face {
  font-family: 'Pretendard';
  src: url('Pretendard-Regular.subset.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+AC00-D7A3, U+0020-007E; /* 한글 + 기본 라틴 */
}
```
```html
<link rel="preload" href="Pretendard-Regular.subset.woff2" as="font" type="font/woff2" crossorigin>
```

### R44. 리소스 힌트

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
```

### R45. CSS 애니메이션 성능
`transform`과 `opacity`만 애니메이션한다. `width`, `height`, `top`, `left` 애니메이션 금지. `will-change`는 필요한 요소에만 적용.

### R46. 레이아웃 시프트 방지
- 이미지/비디오에 항상 `width`/`height` 명시
- 동적 콘텐츠 영역에 `min-height` 지정
- 웹폰트 로드 전후 레이아웃 변경 최소화 (`font-display: swap` + 유사 폴백 폰트)

### R47. 인라인 SVG 아이콘
작은 아이콘은 인라인 SVG로 삽입하여 HTTP 요청을 줄인다. 장식용 SVG에는 `aria-hidden="true"`.

### R48. `<iframe>` 지연 로드
외부 삽입물(지도, 동영상)은 `loading="lazy"`를 적용한다.

---

## 5. 코드 구조 (규칙 49–60)

### R49. BEM 네이밍 컨벤션

```css
/* Block */
.card { }

/* Element */
.card__title { }
.card__image { }
.card__body { }

/* Modifier */
.card--featured { }
.card__title--large { }
```

### R50. CSS 커스텀 속성(변수)으로 디자인 토큰 관리

```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-text: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-bg: #ffffff;
  --color-border: #e5e7eb;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;

  /* Typography */
  --font-sans: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;

  /* Shadow */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
}
```

### R51. 모바일 퍼스트 미디어 쿼리
기본 스타일은 모바일. `min-width`로 확장한다.

```css
/* 모바일 (기본) */
.grid { display: flex; flex-direction: column; gap: var(--space-md); }

/* 태블릿 */
@media (min-width: 768px) {
  .grid { flex-direction: row; flex-wrap: wrap; }
  .grid__item { flex: 0 0 calc(50% - var(--space-md)); }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .grid__item { flex: 0 0 calc(33.333% - var(--space-md)); }
}
```

### R52. 컨테이너 패턴

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-md);
}

@media (min-width: 768px) {
  .container { padding-inline: var(--space-xl); }
}
```

### R53. Flexbox vs Grid 선택 기준
- 1차원 배치(한 방향): Flexbox
- 2차원 배치(행 + 열): Grid
- 카드 레이아웃, 갤러리: Grid
- 내비게이션, 인라인 정렬: Flexbox

### R54. CSS 작성 순서
각 규칙 블록 내에서 속성 순서를 통일한다:
1. 레이아웃 (display, position, flex/grid)
2. 박스 모델 (width, height, margin, padding)
3. 타이포그래피 (font, line-height, color)
4. 비주얼 (background, border, shadow)
5. 기타 (transition, animation, cursor)

### R55. CSS 파일 구조
단일 파일 생성 시 다음 순서로 작성한다:
1. CSS 변수 (`:root`)
2. 리셋/노멀라이즈
3. 기본 요소 (body, a, img 등)
4. 유틸리티 (.sr-only, .skip-link 등)
5. 레이아웃 (.container, .grid)
6. 컴포넌트 (BEM 블록별)
7. 미디어 쿼리 (또는 각 컴포넌트 바로 아래)

### R56. 스크린 리더 전용 클래스

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### R57. z-index 관리
z-index 값을 변수로 체계화한다.

```css
:root {
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-overlay: 300;
  --z-modal: 400;
  --z-toast: 500;
}
```

### R58. 반복 회피
동일한 스타일 패턴이 3회 이상 반복되면 공통 클래스로 추출한다.

### R59. `!important` 사용 금지
유틸리티 클래스(`.sr-only` 등)와 `prefers-reduced-motion` 오버라이드를 제외하고 `!important` 사용 금지.

### R60. box-sizing 리셋

```css
*, *::before, *::after {
  box-sizing: border-box;
}
```

---

## 6. 한국 웹 표준 (규칙 61–72)

### R61. 한국어 폰트 스택

```css
:root {
  --font-sans: 'Pretendard', 'Pretendard Variable',
               -apple-system, BlinkMacSystemFont, system-ui,
               'Noto Sans KR', 'Malgun Gothic', '맑은 고딕',
               sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

### R62. 한국어 텍스트 줄바꿈

```css
body {
  word-break: keep-all;       /* 한글 단어 단위 줄바꿈 */
  overflow-wrap: break-word;  /* 긴 영문/URL 대응 */
}
```

### R63. 한국어 라인하이트
한글은 라틴 문자보다 높은 `line-height`가 필요하다. 본문 텍스트는 최소 `1.6`–`1.8`.

```css
body {
  line-height: 1.7;
}

h1, h2, h3 {
  line-height: 1.3;
}
```

### R64. 한국어 letter-spacing
한글 본문에는 `letter-spacing`을 `-0.01em`–`0.02em` 범위로 미세 조정한다. 과도한 자간 금지.

### R65. GNB(Global Navigation Bar) 패턴

```html
<header class="gnb">
  <div class="container">
    <a href="/" class="gnb__logo" aria-label="홈으로">
      <img src="logo.svg" alt="사이트명" width="120" height="32">
    </a>
    <nav aria-label="메인 내비게이션">
      <ul class="gnb__list">
        <li class="gnb__item"><a href="/service" class="gnb__link">서비스</a></li>
        <li class="gnb__item"><a href="/pricing" class="gnb__link">요금제</a></li>
        <li class="gnb__item"><a href="/support" class="gnb__link">고객지원</a></li>
      </ul>
    </nav>
    <div class="gnb__actions">
      <a href="/login" class="btn btn--ghost">로그인</a>
      <a href="/signup" class="btn btn--primary">회원가입</a>
    </div>
  </div>
</header>
```

### R66. 한국형 푸터 패턴

```html
<footer class="footer">
  <div class="container">
    <div class="footer__info">
      <p class="footer__company">주식회사 OOO</p>
      <address class="footer__address">
        서울특별시 강남구 테헤란로 123 | 대표: 홍길동<br>
        사업자등록번호: 123-45-67890 |
        <a href="https://ftc.go.kr" target="_blank" rel="noopener">사업자정보확인</a><br>
        통신판매업신고: 제2024-서울강남-12345호<br>
        고객센터: <a href="tel:1588-1234">1588-1234</a> |
        이메일: <a href="mailto:help@example.com">help@example.com</a>
      </address>
    </div>
    <nav class="footer__nav" aria-label="푸터 내비게이션">
      <ul class="footer__links">
        <li><a href="/terms">이용약관</a></li>
        <li><a href="/privacy"><strong>개인정보처리방침</strong></a></li>
        <li><a href="/about">회사소개</a></li>
      </ul>
    </nav>
    <p class="footer__copyright">&copy; 2024 사이트명. All rights reserved.</p>
  </div>
</footer>
```

### R67. 한국 전화번호 입력

```html
<fieldset>
  <legend>연락처</legend>
  <div class="phone-input">
    <label for="phone" class="sr-only">휴대폰 번호</label>
    <input type="tel" id="phone" name="phone"
           placeholder="010-1234-5678"
           pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
           autocomplete="tel"
           inputmode="tel"
           maxlength="13">
  </div>
</fieldset>
```

### R68. 사업자등록번호 입력

```html
<div class="form-group">
  <label for="biz-number">사업자등록번호</label>
  <input type="text" id="biz-number" name="bizNumber"
         placeholder="123-45-67890"
         pattern="[0-9]{3}-[0-9]{2}-[0-9]{5}"
         inputmode="numeric"
         maxlength="12">
</div>
```

### R69. 개인정보처리방침 링크 강조
푸터의 "개인정보처리방침" 링크는 `<strong>` 또는 굵은 스타일로 시각적으로 구분한다 (한국 관행).

### R70. 한국어 날짜 포맷
날짜는 `YYYY.MM.DD` 또는 `YYYY년 MM월 DD일` 형식으로 표시한다.

```html
<time datetime="2024-12-25">2024.12.25</time>
```

### R71. 한국 주소 입력
주소 입력은 우편번호 검색 API(다음 우편번호 등) 연동을 고려한 구조로 설계한다.

```html
<fieldset>
  <legend>주소</legend>
  <div class="form-group">
    <label for="zipcode">우편번호</label>
    <div class="input-with-button">
      <input type="text" id="zipcode" name="zipcode" readonly placeholder="우편번호">
      <button type="button" class="btn btn--secondary">주소 검색</button>
    </div>
  </div>
  <div class="form-group">
    <label for="address1">기본 주소</label>
    <input type="text" id="address1" name="address1" readonly placeholder="기본 주소">
  </div>
  <div class="form-group">
    <label for="address2">상세 주소</label>
    <input type="text" id="address2" name="address2" placeholder="상세 주소를 입력해주세요">
  </div>
</fieldset>
```

### R72. 완성형 문서 구조 템플릿

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>페이지 제목 | 사이트명</title>
  <meta name="description" content="페이지 설명">
  <meta property="og:title" content="페이지 제목">
  <meta property="og:description" content="페이지 설명">
  <meta property="og:image" content="https://example.com/og.jpg">
  <meta property="og:locale" content="ko_KR">
  <link rel="preload" href="Pretendard-Regular.subset.woff2" as="font" type="font/woff2" crossorigin>
  <style>/* 크리티컬 CSS */</style>
  <link rel="stylesheet" href="main.css">
</head>
<body>
  <a href="#main-content" class="skip-link">본문으로 건너뛰기</a>

  <header class="gnb">
    <div class="container">
      <a href="/" class="gnb__logo" aria-label="홈으로">
        <img src="logo.svg" alt="사이트명" width="120" height="32">
      </a>
      <nav aria-label="메인 내비게이션">
        <ul class="gnb__list">
          <li><a href="/about" class="gnb__link">소개</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="main-content">
    <section aria-labelledby="hero-title">
      <div class="container">
        <h1 id="hero-title">메인 제목</h1>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <nav aria-label="푸터 내비게이션">
        <ul class="footer__links">
          <li><a href="/terms">이용약관</a></li>
          <li><a href="/privacy"><strong>개인정보처리방침</strong></a></li>
        </ul>
      </nav>
      <p class="footer__copyright">&copy; 2024 사이트명</p>
    </div>
  </footer>

  <script defer src="main.js"></script>
</body>
</html>
```

---

## 빠른 참조: 규칙 요약표

| 영역 | 규칙 번호 | 핵심 |
|------|----------|------|
| 시맨틱 HTML | R01–R12 | 랜드마크, 제목 계층, 시맨틱 태그 |
| 접근성 | R13–R28 | 건너뛰기 링크, ARIA, 키보드, 대비, 포커스 |
| SEO | R29–R38 | 메타 태그, 구조화 데이터, Core Web Vitals |
| 성능 | R39–R48 | 이미지 최적화, 폰트, CSS/JS 로딩 |
| 코드 구조 | R49–R60 | BEM, CSS 변수, 모바일 퍼스트, z-index |
| 한국 웹 | R61–R72 | 폰트, 줄바꿈, GNB/푸터, 폼 패턴 |

**총 72개 규칙**
