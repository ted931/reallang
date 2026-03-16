# RealLang - 영어 패턴 학습 플랫폼

> 기초부터 시작하여 외국인과 자유롭게 대화하는 것을 목표로 하는 개인 영어 학습 사이트
> 추후 다국어(일본어, 중국어 등) 학습 플랫폼으로 확장 예정

---

## 1. 프로젝트 개요

### 핵심 컨셉: Pattern Drill & Show Me
- **Pattern Drill**: 문장을 통째로 외우는 것이 아니라 '말의 설계도(Pattern)'를 익힘
- **Show Me**: 시각적 구조화로 패턴을 직관적으로 이해
- **SRS (Spaced Repetition System)**: 에빙하우스 망각곡선 기반 간격 반복 학습
- **AI 대화**: Claude API를 통한 실시간 대화 연습 & 교정

### 학습 흐름
```
상황 카드(Scene) → 핵심 패턴(Pattern) → 슬롯 채우기(Drill) → 실전 시뮬레이션(Chat)
                                                                    ↓
                                            SRS 복습 ← 학습 기록 저장
```

---

## 2. 기술 스택

| 영역 | 기술 | 선정 이유 |
|------|------|-----------|
| Frontend | Vue 3 (Composition API) | 반응형 UI, 초보자 친화적 |
| Styling | Tailwind CSS | 유틸리티 기반, 빠른 UI 구현 |
| Backend | FastAPI (Python) | 경량, 빠른 JSON API, 자동 Swagger |
| Database | Supabase (PostgreSQL) | 무료 티어, 인증 내장, 실시간 |
| AI | Claude API (Anthropic) | 대화형 학습, 실시간 교정 |
| Deployment | Vercel (FE) + Railway/Render (BE) | 무료 티어 활용 |
| Crawler | BeautifulSoup4 + Playwright | 정적/동적 사이트 대응 |
| 패키지 관리 | pnpm (FE) + poetry (BE) | 속도, 의존성 분리 |

---

## 3. 프로젝트 구조

```
reallang/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 앱 엔트리
│   │   ├── config.py            # 환경변수, 설정
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          # 인증 (Supabase Auth)
│   │   │   ├── lessons.py       # 레슨/패턴 CRUD
│   │   │   ├── progress.py      # 학습 진도/SRS
│   │   │   └── chat.py          # Claude API 대화
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── pattern.py       # 패턴 스키마
│   │   │   ├── example.py       # 예문 스키마
│   │   │   └── progress.py      # 학습 기록 스키마
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── srs.py           # SM-2 간격 반복 알고리즘
│   │   │   └── pattern.py       # 패턴 매칭/추출
│   │   └── db.py                # Supabase 연결
│   ├── crawler/
│   │   ├── __init__.py
│   │   ├── tatoeba.py           # Tatoeba 문장쌍 수집
│   │   ├── voa.py               # VOA Learning English
│   │   ├── dictionary.py        # Free Dictionary API
│   │   └── pipeline.py          # 데이터 정제 파이프라인
│   ├── scripts/
│   │   └── seed_patterns.py     # Claude API로 초기 데이터 생성
│   ├── pyproject.toml
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PatternCard.vue      # 패턴 시각화 카드
│   │   │   ├── SlotDrill.vue        # 빈칸 채우기 퀴즈
│   │   │   ├── ChatWindow.vue       # AI 대화 창
│   │   │   ├── ProgressMap.vue      # 학습 진도 지도
│   │   │   ├── ReviewCard.vue       # SRS 복습 카드
│   │   │   └── SceneCard.vue        # 상황 카드
│   │   ├── views/
│   │   │   ├── HomeView.vue         # 메인 대시보드
│   │   │   ├── LearnView.vue        # 학습 메인
│   │   │   ├── ReviewView.vue       # SRS 복습
│   │   │   ├── ChatView.vue         # AI 대화 연습
│   │   │   └── StatsView.vue        # 학습 통계
│   │   ├── stores/                  # Pinia 상태 관리
│   │   │   ├── auth.js
│   │   │   ├── lessons.js
│   │   │   └── progress.js
│   │   ├── composables/             # 재사용 로직
│   │   │   ├── useSRS.js
│   │   │   └── usePattern.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── tailwind.config.js
└── docs/
    ├── reallang.md                  # 이 기획 문서
    └── DATABASE.md                  # DB 스키마 문서
```

---

## 4. 데이터베이스 스키마

### patterns (핵심 패턴)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| category | text | 대분류 (Greeting, Ordering, Travel...) |
| subcategory | text | 소분류 (Cafe, Restaurant...) |
| pattern_template | text | "I'd like to + [verb]" |
| explanation_ko | text | 한글 설명 |
| dev_analogy | text | 개발자 비유 (선택) |
| cefr_level | text | A1/A2/B1/B2/C1 |
| difficulty_order | int | 난이도 순서 |
| created_at | timestamp | 생성일 |

### examples (예문)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| pattern_id | uuid | FK → patterns |
| sentence_en | text | 영어 문장 |
| sentence_ko | text | 한글 해석 |
| native_tip | text | 원어민 팁 |
| audio_url | text | TTS URL (선택) |
| source | text | tatoeba/voa/claude/manual |
| difficulty | int | 1~5 |

### scenes (상황)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| name_ko | text | 한글 이름 |
| name_en | text | 영문 이름 |
| description | text | 상황 설명 |
| visual_layout | text | 시각화 레이아웃 |
| pattern_ids | uuid[] | 관련 패턴 목록 |
| cefr_level | text | 권장 레벨 |

### user_progress (학습 기록 - SRS)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| user_id | uuid | FK → auth.users |
| pattern_id | uuid | FK → patterns |
| ease_factor | float | SM-2 난이도 계수 (기본 2.5) |
| interval_days | int | 다음 복습까지 간격 |
| next_review_date | date | 다음 복습 날짜 |
| repetitions | int | 반복 횟수 |
| last_score | int | 최근 점수 (0~5) |
| updated_at | timestamp | 마지막 학습일 |

---

## 5. 크롤링 전략 & 데이터 소스

### Tier 1: 즉시 사용 가능 (API / Open Data)
| 소스 | 데이터 종류 | 방법 | 용도 |
|------|------------|------|------|
| **Tatoeba.org** | 영-한 병렬 문장 20만+ | CC 라이선스, TSV 다운로드 | 예문 DB 핵심 |
| **Free Dictionary API** | 단어 정의, 발음, 예문 | REST API (무료, 무제한) | 단어 카드, 발음 |
| **Datamuse API** | 유의어, 관련어, 빈도 | REST API (무료) | 어휘 확장 |
| **Wiktionary** | 단어 뜻, 어원, 활용 | API 또는 덤프 파일 | 상세 단어 정보 |

### Tier 2: 크롤링 필요 (보강용)
| 소스 | 데이터 종류 | 방법 | 용도 |
|------|------------|------|------|
| **VOA Learning English** | 레벨별 뉴스 기사 | BeautifulSoup | 읽기 학습, 실전 패턴 |
| **BBC Learning English** | 구조화된 레슨 | BeautifulSoup | 패턴/문법 설명 |
| **OpenSubtitles** | 영화/드라마 자막 | API + 파싱 | 일상 회화 패턴 추출 |

### Tier 3: AI 생성 (핵심 전략)
| 방법 | 설명 |
|------|------|
| **Claude API Batch** | 상황별 패턴+예문 JSON을 대량 생성 → DB 적재 |
| **Seed + 확장** | 핵심 100개 패턴 수동 작성 → Claude가 변형/확장 |

> **권장 전략**: Tier 1 (Tatoeba) + Tier 3 (Claude 생성) 조합으로 시작

---

## 6. 핵심 기능 상세

### A. 상황 카드 (Scene Card)
- 대화가 일어나는 장소/분위기 묘사
- Mermaid 또는 텍스트 레이아웃으로 시각화
- 예: `[Counter] <--> [Staff] <--> [Me]`

### B. 패턴 함수 (Pattern Function)
- 상황별 가장 범용적인 패턴 제시
- Structure: `I'd like to + [Action/Object]`
- Dev Analogy: `function request(target) { return target; }`

### C. 슬롯 채우기 (Variable Drill)
- 패턴의 변수 부분을 채우는 연습
- 난이도순 예문 5개 (영어/한글/원어민 팁)
- 빈칸 채우기, 드래그앤드롭 등 인터랙티브 UI

### D. 실전 시뮬레이션 (AI Chat)
- Claude API로 역할극 대화
- 실시간 문장 교정 & 자연스러운 표현 제안
- 학습한 패턴 사용 유도

### E. SRS 복습 (Spaced Repetition)
- SM-2 알고리즘 기반
- 매일 복습할 패턴 자동 선정
- 기억 강도에 따라 간격 조절

### F. 학습 통계
- 정복한 패턴 수, 연속 학습일
- CEFR 레벨 진척도
- 카테고리별 강점/약점

---

## 7. 개발 로드맵

### Phase 1: 기반 구축 (1~2주)
- [ ] 프로젝트 초기 세팅 (Vue 3 + FastAPI + Supabase)
- [ ] DB 스키마 생성 (Supabase)
- [ ] Tatoeba 데이터 다운로드 & 파싱 (영-한 문장쌍)
- [ ] Claude API로 핵심 패턴 50개 + 예문 seed 데이터 생성
- [ ] 기본 패턴 카드 UI

### Phase 2: 핵심 학습 기능 (2~3주)
- [ ] 패턴 목록 / 상세 페이지
- [ ] 슬롯 채우기 퀴즈 (빈칸 채우기)
- [ ] SRS 복습 시스템 (SM-2 알고리즘)
- [ ] VOA/BBC 크롤러로 데이터 확장
- [ ] 모바일 반응형 UI

### Phase 3: AI 대화 & 인터랙션 (2~3주)
- [ ] Claude API 연동 ChatWindow
- [ ] 실시간 문장 교정
- [ ] 상황 시뮬레이션 (카페, 공항 등)
- [ ] TTS 발음 재생 (Web Speech API)

### Phase 4: 고도화 (지속)
- [ ] 학습 통계 대시보드
- [ ] ProgressMap 시각화
- [ ] 드래그앤드롭 PatternBlock
- [ ] 다국어 확장 (일본어, 중국어 등)
- [ ] PWA 변환 (오프라인 학습)

---

## 8. JSON 데이터 포맷 (API 응답 표준)

```json
{
  "scene": {
    "name_ko": "카페에서 주문하기",
    "name_en": "Ordering at a Cafe",
    "visual": "[Counter] <--> [Barista] <--> [You]"
  },
  "pattern": {
    "template": "I'd like to + [verb/noun]",
    "explanation_ko": "정중하게 원하는 것을 요청할 때 사용",
    "dev_analogy": "function request(target) { return `I'd like to ${target}`; }",
    "cefr_level": "A2"
  },
  "examples": [
    {
      "en": "I'd like to order a coffee.",
      "ko": "커피 한 잔 주문하고 싶어요.",
      "tip": "'I want'보다 훨씬 정중한 표현이에요.",
      "difficulty": 1
    }
  ]
}
```
