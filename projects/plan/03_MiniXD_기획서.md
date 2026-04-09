# Mini XD — AI Design-to-Code Tool

> 이미지 시안을 분석하여 즉시 작동하는 웹 코드로 변환해주는 AI 기반 프로토타이핑 도구

---

## 1. 프로젝트 개요 (Overview)

**목적**: 디자인 캡처 이미지를 업로드하면 AI(Claude)가 이를 분석하여 React + Tailwind CSS 코드로 즉시 변환.

**핵심 가치**: 전문 디자인 툴(Figma, XD) 없이도 아이디어를 빠르게 웹 결과물로 시각화.

**해결 과제**: 이미지 인식의 부정확성을 **구조적 프롬프트(Structural Prompting)** + **JSON 중간 표현(IR)** + 사용자 피드백 루프로 보완.

**포지셔닝**: "디자인 이미지에서 프로덕션 코드까지, AI가 분석 과정을 투명하게 보여주며 함께 만들어가는 도구"

---

## 1-1. Figma/XD와의 차이점 — "왜 Mini XD인가"

### 근본적 차이: 입력 방식

| | Figma / Adobe XD | Mini XD |
|--|------------------|---------|
| **입력** | 툴 안에서 직접 디자인 | **아무 이미지나 업로드** |
| **과정** | 요소마다 정확한 좌표/속성을 알고 있음 | AI가 이미지를 보고 구조를 추측 |
| **코드 정확도** | 100% (데이터 기반) | 70~90% (AI 추론 기반) |
| **전제 조건** | 해당 툴로 만든 파일 필요 | **파일 불필요, 이미지만 있으면 됨** |

**Figma 방식**: 디자이너가 버튼을 `width: 120px, color: #3B82F6, border-radius: 8px`로 만들면 → 그 속성을 **정확히 알고 있으므로** → 코드가 픽셀 퍼펙트하게 나옴.

**Mini XD 방식**: 스크린샷에서 "이건 파란색 둥근 버튼인 것 같다"를 AI가 **추측** → 근사치로 코드를 생성 → 채팅으로 미세 조정.

### Mini XD만의 강점

1. **범용성**: Figma 파일이 없어도 됨. 드리블 캡처, 경쟁사 사이트 스크린샷, 손그림 사진, PPT 와이어프레임 — **아무 이미지나** 넣으면 코드가 나옴.

2. **접근성**: Figma/XD를 다룰 줄 몰라도 됨. 기획자가 레퍼런스 이미지만 던지면 개발 시작점이 나옴.

3. **속도**: 디자인 없이 아이디어 단계에서 바로 코드 프로토타입을 만들 수 있음. "이런 느낌이요"가 3분 만에 동작하는 코드가 됨.

4. **반복 수정**: 채팅으로 "버튼 더 크게", "색상 바꿔줘" 같은 자연어 수정이 가능. Figma에서 수정하고 다시 export할 필요 없음.

### Figma/XD가 더 나은 경우

- 픽셀 퍼펙트한 정밀도가 필요할 때
- 디자인 시스템과 컴포넌트 라이브러리를 관리할 때
- 팀원 간 디자인 협업이 핵심일 때
- 프로토타이핑 인터랙션(화면 전환, 애니메이션)이 필요할 때

### 결론: 경쟁이 아니라 용도가 다르다

```
Figma/XD:  "정밀한 디자인 제작 → 코드 추출"     (디자이너 중심)
Mini XD:   "아무 이미지 → 작동하는 코드 시작점"   (누구나 사용)
```

Mini XD는 Figma를 대체하는 게 아니라, **Figma가 없는 상황에서 빠르게 코드 프로토타입을 뽑는 도구**. 완벽한 코드가 아니라 **80% 완성도의 시작점**을 제공하고, 나머지 20%는 채팅 수정이나 직접 코딩으로 마무리.

---

## 2. 사용자 페르소나

### A. 비개발자 기획자 (김서연, 32세, 스타트업 PM)
- **상황**: Figma는 다룰 줄 알지만 코드를 모른다. "이런 느낌이요"라고 레퍼런스 스크린샷을 보여주면 "구현이 어렵다"는 답변에 좌절.
- **Pain Point**: 머릿속 UI를 개발자가 이해할 수 있는 동작하는 프로토타입으로 빠르게 만들고 싶다.
- **기대 행동**: 드리블/Pinterest 캡처 이미지 업로드 → "이거랑 비슷하게" → 채팅으로 미세 조정 → 코드 전달.
- **성공 기준**: 업로드 후 3분 이내에 개발팀에 보여줄 수 있는 결과물 확보.

### B. 주니어 프론트엔드 개발자 (박민수, 26세, 경력 1년)
- **상황**: React는 쓸 줄 알지만 디자인 감각 부족. 컴포넌트 분리, CSS Grid vs Flexbox 판단에 시간 소모.
- **Pain Point**: "이걸 어떤 구조로 컴포넌트를 나눠야 하지?"에서 막힌다.
- **기대 행동**: 디자인 시안 업로드 → 생성된 코드의 컴포넌트 구조를 참고 + 학습.
- **성공 기준**: 생성된 코드를 복사-붙여넣기 후 30분 이내에 커스터마이징 가능.

### C. 1인 창업자/인디해커 (이준혁, 29세)
- **상황**: 풀스택 역량은 있지만 시간이 절대적으로 부족. UI 작업을 최소화하고 비즈니스 로직에 집중하고 싶다.
- **Pain Point**: '있어 보이는 UI'를 빠르게 찍어내야 한다. 직접 만들면 2일, 템플릿 커스터마이징에 1일.
- **기대 행동**: 경쟁사 스크린샷 + "이것과 비슷하되 우리 브랜드 색상으로" → 바로 Vercel 배포.
- **성공 기준**: 레퍼런스 이미지에서 배포 가능한 랜딩 페이지까지 1시간 이내.

---

## 3. 주요 기능 (Core Features)

### 3-1. 시각적 요소 추출 (Vision Analysis)
- **Color Palette**: 주요 배경색, 폰트 컬러, 포인트 컬러(HEX) 자동 추출
- **Typography**: 폰트 크기, 굵기, 행간을 근사치로 계산
- **Layout Analysis**: Grid/Flexbox 구조를 파악하여 정렬 방식 결정

### 3-2. 실시간 코드 생성 (Code Generation)
- **React + Tailwind CSS** 기반 코드 생성 (MVP)
- **Interactive Components**: 버튼 클릭, 입력 폼 등 실제 동작하는 컴포넌트
- **Clean Code**: 시맨틱 태그(header, nav, main 등) 사용, Tailwind 표준 토큰 매핑

### 3-3. 인터랙티브 편집 (Real-time Preview)
- **Live Preview**: 생성된 코드를 즉시 렌더링 (Sandboxed iframe)
- **Iterative Refinement**: 채팅 + 클릭-투-에딧 하이브리드 수정
- **Version History**: 수정 히스토리에서 원하는 버전으로 롤백

### 3-4. 투명한 AI 분석 과정 (핵심 차별화)
- 이미지 → **JSON IR** → 코드의 3단계를 사용자에게 시각적으로 노출
- 컴포넌트 바운딩 박스, 색상 팔레트, 그리드 구조를 시각화
- 사용자가 IR 단계에서 레이아웃/컴포넌트를 직접 수정 가능

---

## 4. 이미지 인식 한계 극복 전략

### [1] 중간 매개체 (Intermediate Representation)
이미지에서 바로 코드로 가지 않고, JSON IR을 먼저 생성하여 검증 가능한 구조 데이터를 확보.

```json
{
  "layout": "header-main-footer",
  "theme": { "primary": "#FF9900", "font": "Inter" },
  "components": ["Navbar", "HeroSection", "PricingTable"]
}
```

### [2] 가이드라인 제공 (Guided Input)
- 웹 서비스 종류 (쇼핑몰, 블로그, 대시보드 등) — AI 자동 감지 + 사용자 수정 가능
- 선호하는 UI 라이브러리 (Shadcn UI, DaisyUI 등)

### [3] 디자인 시스템 매핑
모호한 px 값을 Tailwind 표준 수치(`p-4`, `rounded-lg`)로 강제 매핑하여 정갈한 코드 출력.

---

## 4-1. AI 모델 비용 분석 및 추천 조합

### 모델별 1회 비용 (이미지 1장 기준, 환율 1,380원/$)

| 모델 | 입력 단가 (/1M) | 출력 단가 (/1M) | 1회 비용 (원) | 비고 |
|------|---------------|---------------|-------------|------|
| gpt-4o-mini | $0.15 | $0.60 | **1.7원** | 현재 사용 중, 비용 최저 |
| gpt-4.1-nano | $0.10 | $0.40 | **1.1원** | 최저가, 품질 미검증 |
| gpt-4.1-mini | $0.40 | $1.60 | **4.4원** | mini 대비 2.5배, 품질↑ |
| gpt-4o | $2.50 | $10.00 | **28원** | Vision 최고 품질 |
| gpt-4.1 | $2.00 | $8.00 | **22원** | 최신 모델, 4o 대비 저렴 |

※ 기준: 입력 ~2,000 토큰 (이미지+프롬프트), 출력 ~1,500 토큰 (IR 또는 코드)

### 파이프라인 조합별 비용 비교

| 조합 | 분석 (Vision) | 코드 생성 | 합계/건 | 100회 비용 | 품질 |
|------|-------------|----------|---------|----------|------|
| **현재: mini+mini** | 1.7원 | 1.7원 | **3.4원** | 340원 | ★★☆☆☆ 낮음 |
| 4.1-mini + mini | 4.4원 | 1.7원 | **6.1원** | 610원 | ★★★☆☆ |
| **추천: 4o + mini** | 28원 | 1.7원 | **30원** | 3,000원 | ★★★★☆ 높음 |
| 4.1 + mini | 22원 | 1.7원 | **24원** | 2,400원 | ★★★★☆ |
| 4o + 4o | 28원 | 28원 | **56원** | 5,600원 | ★★★★★ 최고 |

### 추천 전략

**분석(Vision)만 gpt-4o, 생성은 gpt-4o-mini 유지**

```
[이미지] → gpt-4o (분석: 28원) → JSON IR → gpt-4o-mini (생성: 1.7원) → HTML+CSS+JS
                                                              합계: ~30원/건
```

**이유:**
- 분석 단계가 품질의 80%를 결정함 (색상, 레이아웃, 텍스트 추출 정확도)
- 생성 단계는 구조화된 JSON을 받으므로 mini로도 충분
- 건당 30원이면 100번 테스트해도 3,000원
- 4o-mini로 분석하면 GNB, 슬라이더, 검색폼 같은 복잡한 UI를 놓침

### 비용 시뮬레이션 (월간)

| 사용량 | 현재 (mini+mini) | 추천 (4o+mini) | 풀 (4o+4o) |
|--------|-----------------|---------------|-----------|
| 일 10회 | 월 1,020원 | 월 9,000원 | 월 16,800원 |
| 일 50회 | 월 5,100원 | 월 45,000원 | 월 84,000원 |
| 일 100회 | 월 10,200원 | 월 90,000원 | 월 168,000원 |

---

## 5. 시스템 아키텍처

### 5-1. 전체 데이터 플로우

```
[사용자 브라우저]
  │  이미지 업로드 (drag & drop / clipboard paste)
  ▼
[Vite + React SPA]
  │  Canvas API로 리사이즈·WebP 변환 (max 2048px)
  │  base64 인코딩 후 API 요청
  ▼
[API 서버 (Hono on Cloudflare Workers)]
  │  ① 이미지 유효성 검증 (MIME, 크기, 해상도)
  │  ② Claude Opus 4.6 — 이미지 분석 → JSON IR 생성
  │  ③ Claude Sonnet 4.6 — JSON IR → 코드 생성
  ▼
[JSON IR (Intermediate Representation)]
  │  프레임워크 독립적 구조 데이터
  ▼
[코드 생성 엔진]
  │  JSON IR + 사용자 설정 → 최종 코드
  ▼
[Sandpack 샌드박스]
  │  브라우저 내 실시간 렌더링 + 편집
  ▼
[사용자에게 라이브 프리뷰 제공]
```

**핵심 설계 원칙**: AI 호출을 **분석(Analysis)** 과 **생성(Generation)** 2단계로 분리. 이미지에서 바로 코드를 생성하면 할루시네이션이 심해지므로, JSON IR로 검증 가능한 중간 레이어를 확보.

### 5-2. 기술 스택

| 영역 | 선택 | 근거 |
|------|------|------|
| **프론트엔드** | Vite + React 19 | SPA 도구이므로 SSR 불필요. Vite의 빠른 HMR이 개발에 유리 |
| **상태 관리** | Zustand | 단일 "프로젝트" 객체를 통째로 관리하는 슬라이스 패턴이 직관적 |
| **스타일링** | Tailwind CSS v4 + shadcn/ui | 도구 자체 UI도 깔끔하게 빠르게 구축 |
| **샌드박스** | Sandpack (by CodeSandbox) | 다중 파일, npm import, 실시간 편집, CSP 격리 내장 |
| **이미지 전처리** | 브라우저 Canvas API | 서버 의존성 최소화. sharp는 필요 시 대비용 |
| **API 서버** | Hono (Cloudflare Workers) | 엣지 실행, 콜드 스타트 없음. 레이턴시 최소화 |
| **AI 모델** | Opus 4.6 (분석) / Sonnet 4.6 (생성) | 분석은 복잡 추론 → Opus, 생성은 구조화 입력 기반 → Sonnet이 속도/비용 효율적 |
| **DB (후기)** | Supabase (PostgreSQL) | MVP는 로컬 스토리지, 이후 사용자 프로젝트 저장 시 도입 |

---

## 6. API 설계

### `POST /api/analyze` — 이미지 분석 (JSON IR 생성)

```typescript
// Request
{
  image: string;           // base64 인코딩
  context: {
    siteType: "landing" | "dashboard" | "ecommerce" | "blog";
    uiLibrary?: "shadcn" | "daisyui" | "material";
  };
}

// Response
{
  id: string;              // 분석 세션 ID
  ir: DesignIR;            // JSON IR
  confidence: number;      // 0-1 분석 신뢰도
  suggestions: string[];   // 경고 메시지
}
```

### `POST /api/generate` — 코드 생성 (SSE 스트리밍)

```typescript
// Request
{
  sessionId: string;
  ir: DesignIR;            // 사용자가 수정한 IR
  framework: "react";
  options: { darkMode: boolean; responsive: boolean; };
}

// Response (SSE)
{
  files: { [filename: string]: string };
  dependencies: string[];
}
```

### `POST /api/refine` — 채팅 기반 수정 (SSE 스트리밍)

```typescript
// Request
{
  sessionId: string;
  message: string;         // "버튼을 더 둥글게 해줘"
  currentFiles: Record<string, string>;
}

// Response (SSE)
{
  updatedFiles: Record<string, string>;
  changeDescription: string;
}
```

---

## 7. AI 프롬프트 엔지니어링 전략

### 2단계 프롬프트 파이프라인

**1단계 — 이미지 분석 (Opus 4.6)**
- 역할: "시니어 UI/UX 분석가"
- 반드시 JSON IR 스키마에 맞는 구조화 출력만 생성
- `temperature: 0`으로 일관성 확보

**2단계 — 코드 생성 (Sonnet 4.6)**
- JSON IR을 입력으로 받아 React + Tailwind 코드 생성
- Tailwind 디자인 토큰 매핑 테이블 포함 → 표준 클래스 사용 유도
- `temperature: 0.2`로 약간의 창의성 허용

### JSON IR 스키마 (DesignIR)

```typescript
interface DesignIR {
  meta: {
    pageType: string;
    viewport: { width: number; height: number };
    confidence: number;
  };
  theme: {
    colors: {
      primary: string; secondary: string;
      background: string; surface: string;
      text: { primary: string; secondary: string };
      accent: string;
    };
    typography: {
      headingFont: string; bodyFont: string;
      scale: { h1: string; h2: string; body: string };
    };
    spacing: "compact" | "normal" | "relaxed";
    borderRadius: "none" | "sm" | "md" | "lg" | "full";
  };
  layout: {
    type: "stack" | "sidebar" | "grid" | "hero-sections";
    sections: Section[];
  };
  components: ComponentNode[];
}

interface Section {
  id: string;
  tag: "header" | "nav" | "main" | "aside" | "footer";
  layout: "flex-row" | "flex-col" | "grid-2" | "grid-3" | "grid-4";
  children: string[];  // component ID 참조
}

interface ComponentNode {
  id: string;
  type: "navbar" | "hero" | "card" | "form" | "button" | "table"
        | "image" | "text-block" | "pricing" | "footer" | "custom";
  props: Record<string, unknown>;
  content: { text?: string; placeholder?: string; items?: Array<{ label: string; icon?: string }> };
  style: { variant?: string; size?: "sm" | "md" | "lg" };
}
```

---

## 8. 프로젝트 구조

```
mini-xd/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # 랜딩 (이미지 업로드)
│   │   ├── editor/page.tsx         # 코드 에디터 + 프리뷰
│   │   └── api/
│   │       ├── analyze/route.ts    # 이미지 → JSON IR
│   │       ├── generate/route.ts   # JSON IR → 코드
│   │       └── refine/route.ts     # 채팅 수정
│   ├── components/
│   │   ├── ImageUploader.tsx       # 드래그앤드롭 업로드
│   │   ├── IRViewer.tsx            # JSON IR 시각화
│   │   ├── CodeEditor.tsx          # Monaco Editor
│   │   ├── PreviewSandbox.tsx      # iframe 샌드박스
│   │   ├── ChatRefinement.tsx      # 수정 채팅
│   │   └── FrameworkSelector.tsx   # 프레임워크 선택
│   ├── lib/
│   │   ├── claude.ts               # Claude API 클라이언트
│   │   ├── prompts/
│   │   │   ├── analyze.ts          # Vision 분석 프롬프트
│   │   │   ├── generate.ts         # 코드 생성 프롬프트
│   │   │   └── refine.ts           # 반복 수정 프롬프트
│   │   ├── ir-schema.ts            # Zod 기반 IR 타입/검증
│   │   └── sandbox.ts              # 샌드박스 유틸리티
│   └── styles/globals.css
├── tests/
│   ├── unit/                       # IR 파싱, 프롬프트 빌더
│   ├── e2e/                        # Playwright E2E
│   └── fixtures/                   # 테스트용 이미지 + 기대 IR
├── .env.local                      # ANTHROPIC_API_KEY
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 9. 사용자 여정 맵 (User Journey)

| Phase | 시간 | 행동 | 마찰점 | 해결책 |
|-------|------|------|--------|--------|
| **1. 온보딩** | 0~2분 | 랜딩 도착 → 서비스 이해 | 기존 도구와 차별점 불명확 | 로그인 없이 데모 이미지로 즉시 체험. Before/After 비교 |
| **2. 업로드** | 2~3분 | 이미지 드래그&드롭 → 설정 | 입력 항목 많으면 이탈 | 2단계로 축소: (1) 이미지 (2) 프레임워크. 사이트 유형은 AI 자동 감지 |
| **3. 생성** | 3~5분 | 로딩 → 코드/프리뷰 확인 | 10초 이상 시 불안감 | SSE 스트리밍, 원본-결과 오버레이 비교, IR 시각화로 신뢰감 |
| **4. 수정** | 5~15분 | 채팅 수정 → 확인 → 반복 | 모호한 지시 시 엉뚱한 결과 | 클릭-투-에딧, diff 뷰, 롤백 기능 |
| **5. 내보내기** | 15분~ | 코드 복사/다운로드 | 단일 HTML로는 실제 프로젝트에 부족 | Copy Code, ZIP 다운로드, CodeSandbox 원클릭 오픈 |

---

## 10. MVP 스프린트 계획 (6주)

### Sprint 1 (1~2주): 셋업 + 이미지 업로드 + Claude 연동

| 일차 | 작업 | 산출물 |
|------|------|--------|
| D1-2 | Next.js + TypeScript + Tailwind 초기화 | 빌드 가능한 프로젝트 |
| D3-4 | ImageUploader (드래그앤드롭, 미리보기, base64) | 이미지 업로드 UI |
| D5-7 | `/api/analyze` + Claude Vision API + 프롬프트 v1 | JSON IR 반환 |
| D8-10 | IRViewer로 분석 결과 시각화 + 에러 핸들링 | 이미지 → IR 파이프라인 완성 |

**완료 기준**: 이미지 업로드 → JSON IR 화면 표시

### Sprint 2 (3~4주): 코드 생성 + 프리뷰

| 일차 | 작업 | 산출물 |
|------|------|--------|
| D1-3 | `/api/generate` + 코드 생성 프롬프트 | 코드 생성 API |
| D4-5 | CodeEditor (Monaco) + 구문 하이라이팅 | 코드 편집 |
| D6-8 | PreviewSandbox (sandboxed iframe + srcDoc) | 실시간 프리뷰 |
| D9-10 | 에디터-프리뷰 동기화 | 통합 에디터 화면 |

**완료 기준**: 이미지 → IR → 코드 → 프리뷰 전체 플로우 작동

### Sprint 3 (5~6주): 채팅 수정 + 다운로드 + 폴리시

| 일차 | 작업 | 산출물 |
|------|------|--------|
| D1-3 | ChatRefinement + `/api/refine` | 반복 수정 기능 |
| D4-5 | 가이드라인 입력 (사이트 유형 선택) | 분석 정확도 향상 |
| D6-7 | 코드 다운로드 (단일 HTML, ZIP) | 파일 내보내기 |
| D8-10 | 반응형 레이아웃, 에러 바운더리, 성능 최적화 | **MVP 릴리즈** |

---

## 11. 핵심 구현 가이드

### 11-1. 이미지 분석 → JSON IR

```typescript
// lib/prompts/analyze.ts
export function buildAnalyzePrompt(context: { siteType?: string; uiLibrary?: string }) {
  return `You are a UI analysis engine. Analyze this design image and output ONLY valid JSON.

Site type hint: ${context.siteType || "general website"}
UI library: ${context.uiLibrary || "Tailwind CSS only"}

Rules:
- Map approximate pixel values to Tailwind spacing (16px → p-4)
- Infer grid columns from visual alignment
- Use semantic HTML tags
- Output ONLY the JSON, no markdown fences, no explanation`;
}
```

**검증**: Zod 스키마로 파싱 → 실패 시 에러 메시지 포함하여 자동 2회 재시도.

### 11-2. 코드 생성 품질 보장 (3중 방어선)

1. **프롬프트 가드레일**: 시맨틱 HTML, Tailwind only, 반응형, 접근성, self-contained 제약
2. **후처리 검증**: 닫히지 않은 태그, 빈 출력 등 정규식 기본 검증
3. **디자인 시스템 매핑**: Tailwind spacing/color 매핑 테이블을 프롬프트에 포함

### 11-3. 실시간 프리뷰 샌드박스

```tsx
// components/PreviewSandbox.tsx
<iframe
  ref={iframeRef}
  sandbox="allow-scripts allow-same-origin"
  className="w-full h-full border rounded-lg"
  title="Preview"
/>
```

- `allow-forms`, `allow-popups`, `allow-top-navigation` 의도적 제외
- 반응형 프리뷰: 375px(모바일) / 768px(태블릿) / 100%(데스크탑) 토글

---

## 12. 성능 및 보안

### 성능

| 항목 | 전략 |
|------|------|
| 이미지 크기 | 클라이언트에서 2048x2048px, 5MB 제한 후 전송 |
| AI 응답 속도 | SSE 스트리밍으로 점진적 렌더링 |
| Rate Limiting | Sliding window: 미인증 5회/시간, 인증 50회/시간 |
| 캐싱 | 동일 이미지 해시 → 24시간 분석 결과 캐싱 |

### 보안

| 위협 | 대응 |
|------|------|
| 샌드박스 탈출 | Sandpack iframe 격리 + CSP 헤더 + origin 검증 |
| 코드 인젝션 | `eval()`, 외부 fetch 등 AST 파싱으로 위험 패턴 탐지 |
| 이미지 업로드 공격 | MIME + 매직 바이트 이중 검증. SVG 차단 (XSS 벡터) |
| API 키 보호 | 서버 사이드 전용, 환경 변수 관리 |
| 프롬프트 인젝션 | 사용자 입력을 `<user_input>` 태그로 분리 |

---

## 13. 테스트 전략

- **단위 테스트 (Vitest)**: IR 파싱/Zod 검증, 프롬프트 빌더 스냅샷, 후처리 로직
- **시각적 회귀 (Playwright)**: 동일 IR → 프리뷰 스크린샷 비교. 5~10개 대표 디자인 fixture
- **E2E (Playwright + MSW)**: 업로드 → IR → 코드 → 프리뷰 → 채팅 수정 → 다운로드 전체 플로우

---

## 14. 배포 및 인프라

```
Vercel (단일 배포)
├── Next.js Frontend        — Edge Runtime
├── /api/analyze            — Serverless Function (maxDuration: 60s)
├── /api/generate           — Serverless Function (maxDuration: 60s)
└── /api/refine             — Serverless Function (maxDuration: 60s)
```

**CI/CD**: GitHub Actions → lint + type-check + test + e2e → main push 시 자동 배포

---

## 15. 리스크 관리

| # | 리스크 | 영향 | 완화 전략 |
|---|--------|------|-----------|
| 1 | Vision 분석 부정확 | 높음 | 사용자 가이드라인 입력 + IR 편집 UI + Zod 검증 + 2회 재시도 |
| 2 | API 비용 급증 | 높음 | 1024px 리사이즈 + 일일 요청 한도 + IR 캐싱 |
| 3 | 생성 코드 보안 취약점 | 중간 | iframe sandbox + CSP + AST 기반 코드 필터링 |
| 4 | API 응답 지연 (10~30초) | 중간 | SSE 스트리밍 + 스켈레톤 UI + 진행 상태 메시지 |
| 5 | Vercel 타임아웃 | 낮음 | 분석/생성 2단계 분리 + Pro 플랜(300초) 대비 |

---

## 16. 수익화 전략

### Freemium 모델

| 구분 | Free | Pro ($12/월) | Team ($29/월/인) |
|------|------|-------------|-----------------|
| 일일 생성 | 5회 | 100회 | 무제한 |
| 채팅 수정 | 3회/생성 | 20회/생성 | 무제한 |
| 프레임워크 | React만 | React, Vue, Svelte | 전체 |
| 내보내기 | 복사만 | ZIP 다운로드 | GitHub 연동 |
| 프로젝트 저장 | 불가 | 50개 | 무제한 |
| 배포 | 불가 | Vercel 원클릭 | 커스텀 도메인 |

**원칙**: 무료 사용자도 "와, 이게 되네" 경험 필수. 첫 생성은 제한 없이, 두 번째부터 가입 유도. 품질 차등 없이 횟수/내보내기로 게이팅.

**타이밍**: MVP 출시 후 1개월 완전 무료 → 2개월차 Free/Pro 도입 → 유료 전환율 목표 3~5%

---

## 17. 경쟁 분석

| 도구 | 강점 | 약점 | Mini XD 대비 |
|------|------|------|-------------|
| **v0.dev** | Vercel 생태계, shadcn/ui 최적화 | 이미지 입력 미지원 (텍스트 프롬프트 중심) | Mini XD는 이미지 기반 → 비개발자 접근성 우위 |
| **bolt.new** | 풀스택 앱 생성, 즉시 배포 | 디자인 정밀도 낮음 | Mini XD는 디자인 충실도에 집중 |
| **Screenshot-to-Code** | 오픈소스, 스크린샷 직접 변환 | UI 조잡, 수정 루프 미흡 | Mini XD는 반복 수정 + 프리뷰가 핵심 차별점 |
| **Galileo AI** | 디자인 생성 품질 높음 | 코드 출력 없음, 높은 가격 | Mini XD는 코드 출력까지 E2E 제공 |

### 핵심 경쟁 전략
1. **v0.dev가 못 하는 것**: 이미지 입력. 기획자가 이미지를 던지면 코드가 나오는 경험.
2. **Screenshot-to-Code보다 나은 것**: 대화형 정교화 수정 루프 품질.
3. **bolt.new와 다른 것**: UI 변환에 집중. 풀스택 욕심 없이 "디자인 → UI 코드" 최고가 되는 것.
4. **진입 장벽 구축**: 수정 패턴 데이터 축적 → 프롬프트 자동 최적화 → 품질 격차 심화.

---

## 18. 기대 효과

- **개발 속도**: UI 마크업 소요 시간 80% 이상 단축
- **소통 비용**: 기획자-개발자 간 시각적 간극을 즉각적 코드로 해소
- **학습 효과**: 주니어 개발자의 컴포넌트 구조화 역량 향상
- **빠른 검증**: 아이디어 → 동작하는 프로토타입까지 최단 경로 제공

---

## 19. Image-to-Code 품질 문제 심층 분석 및 개선 전략

### 19-1. 현재 문제 진단

**현재 품질: 약 30~40% (디자인 재현도)**

| 실패 항목 | 원인 | 심각도 |
|----------|------|--------|
| 네비 레이아웃 깨짐 | LLM의 공간 추론 한계, flex-direction 미지정 | 치명 |
| 색상 부정확 | AI가 "파란색" 수준으로 추측, 정확한 HEX 불가 | 높음 |
| 간격/패딩 틀림 | 이미지에서 px 단위 측정 불가능 | 높음 |
| 캐러셀이 정적 이미지 | 스크린샷에서 동적 동작 감지 불가 | 높음 |
| 폰트 불일치 | 이미지에서 폰트 패밀리 판별 불가 | 중간 |
| 이미지 에셋 없음 | 스크린샷 내 이미지 추출 불가 | 중간 |

**근본 원인: 정보 손실의 연쇄**

```
현재 파이프라인:
[이미지] → [GPT-4o-mini 분석] → [JSON IR] → [코드 생성] → [결과]
              ▲ 정보 50% 손실      ▲ 20% 추가 손실      ▲ 피드백 없음
```

### 19-2. 업계 벤치마크

```
품질 순위:
1. Figma → Code (Anima/Locofy)     ━━━━━━━━━━━━━━━━━━ 90%+  (디자인 파일 필요)
2. v0 + 컴포넌트 라이브러리         ━━━━━━━━━━━━━━━ 75~85% (프롬프트 기반)
3. Screenshot-to-Code + GPT-4o     ━━━━━━━━━━━ 50~65%    (이미지 기반)
4. 우리 현재 (GPT-4o-mini)          ━━━━━━ 30~40%         (이미지 기반)

이미지 입력의 물리적 상한선: 약 75~80%
```

### 19-3. 개선 아키텍처 (3단계 파이프라인)

```
[Phase 1: CV 전처리]
  이미지 → OpenCV 영역분할 → 색상 K-Means 추출 → OCR 텍스트 추출
  결과: 정확한 바운딩박스, HEX 색상, 텍스트+크기 (px 단위)

[Phase 2: 섹션별 AI 생성]
  각 섹션(header, hero, search, carousel, footer)을 독립 생성
  컴포넌트 타입 분류 → 매칭 템플릿 선택 → CV 데이터로 커스터마이즈

[Phase 3: 시각적 검증]
  생성 코드 → Puppeteer 스크린샷 → 원본과 SSIM 비교 → 차이점 자동 수정 (최대 3회)
```

### 19-4. 개선 방안별 ROI

| 순위 | 방안 | 투자 | 비용 증가 | 품질 향상 | 도달 수준 |
|------|------|------|----------|----------|----------|
| **1** | GPT-4o 교체 + IR 제거 | 1주 | 건당 +26원 | +15~20% | **50~55%** |
| **2** | CV 색상추출 + OCR | 2주 | 미미 | +10~15% | **65%** |
| **3** | 섹션별 분할 생성 | 1~2주 | API 3~5배 | +5~10% | **70%** |
| **4** | 컴포넌트 템플릿 (50개) | 4~6주 | 없음 | +10~15% | **75%** |
| **5** | 시각적 검증 루프 | 2주 | API 2~4배 | +5~10% | **78%** |

### 19-5. 권장 실행 순서

**Phase 1 (1주) — 즉시 적용, 효과 최대**
1. 분석: GPT-4o 교체 (건당 28원 → 퀄리티 즉시 상승)
2. JSON IR 제거 → 이미지+프롬프트로 직접 HTML 생성
3. 원본 이미지를 코드 생성 시에도 함께 전달 (reference-guided)

**Phase 2 (2~3주) — CV 전처리**
4. OpenCV K-Means로 정확한 색상 팔레트 추출 → 프롬프트에 HEX값 전달
5. EasyOCR로 텍스트 추출 → placeholder 대신 실제 텍스트 사용
6. Edge detection으로 주요 섹션 분리 → 섹션별 크롭 이미지 전달

**Phase 3 (1~2개월) — 템플릿 + 검증**
7. 자주 쓰는 컴포넌트 20개 템플릿 제작 (navbar, hero, carousel 등)
8. Puppeteer 시각적 비교 → 자동 재생성

### 19-6. 달성 가능/불가능 구분

```
달성 가능한 것 (75~80%):
  ✓ 레이아웃 구조 (header-body-footer, 그리드)
  ✓ 정확한 색상 (CV 전처리로)
  ✓ 텍스트 내용 (OCR로)
  ✓ 기본 간격/패딩 (CV 측정)
  ✓ 기본 인터랙션 (템플릿 기반 캐러셀, 탭)

달성 불가능한 것:
  ✗ 1~2px 단위 미세 디테일
  ✗ 커스텀 애니메이션/트랜지션
  ✗ 정확한 폰트 매칭
  ✗ 실제 이미지 에셋
  ✗ 반응형 동작
  ✗ 복잡한 인터랙션 (drag & drop, 무한스크롤)
```

### 19-7. 사용자 기대치 설정

> **Mini XD는 "70% 완성된 코드 초안"을 생성합니다.**
> 레이아웃, 색상, 텍스트를 재현하며, 개발 시작점으로 활용하는 도구입니다.
> 나머지 30%는 채팅 수정 또는 직접 코딩으로 마무리합니다.
