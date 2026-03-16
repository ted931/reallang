# RealLang Database Schema

Supabase (PostgreSQL) 기반 DB 스키마 문서입니다.

스키마 SQL 파일: `backend/schema.sql`

---

## ER Diagram (텍스트)

```
scenes ──< scene_patterns >── patterns ──< examples
                                  │
                                  │
                           user_progress >── auth.users
```

---

## 테이블 상세

### 1. patterns

영어 회화 패턴 템플릿을 저장합니다.

| Column           | Type        | Nullable | Default              | Description                          |
|------------------|-------------|----------|----------------------|--------------------------------------|
| id               | uuid        | NO       | gen_random_uuid()    | PK                                   |
| category         | text        | NO       |                      | 대분류 (Greeting, Ordering, Travel 등) |
| subcategory      | text        | YES      |                      | 소분류                                |
| pattern_template | text        | NO       |                      | 패턴 틀 (예: "I'd like to + [verb]")  |
| explanation_ko   | text        | NO       |                      | 한글 설명                             |
| dev_analogy      | text        | YES      |                      | 개발자 비유 설명                       |
| cefr_level       | text        | NO       | 'A1'                 | CEFR 등급 (A1~C2)                    |
| difficulty_order | integer     | NO       | 1                    | 난이도 순서                            |
| created_at       | timestamptz | NO       | now()                | 생성 시각                             |
| updated_at       | timestamptz | NO       | now()                | 수정 시각 (트리거 자동 갱신)            |

**CHECK**: `cefr_level IN ('A1','A2','B1','B2','C1','C2')`

**인덱스**: `category`, `cefr_level`

---

### 2. examples

패턴별 영어-한국어 예문을 저장합니다.

| Column      | Type        | Nullable | Default           | Description                          |
|-------------|-------------|----------|-------------------|--------------------------------------|
| id          | uuid        | NO       | gen_random_uuid() | PK                                   |
| pattern_id  | uuid        | YES      |                   | FK -> patterns(id) ON DELETE CASCADE |
| sentence_en | text        | NO       |                   | 영어 예문                             |
| sentence_ko | text        | NO       |                   | 한국어 번역                           |
| native_tip  | text        | YES      |                   | 원어민 팁                             |
| audio_url   | text        | YES      |                   | 음성 파일 URL                         |
| source      | text        | YES      | 'manual'          | 출처 (tatoeba/voa/claude/manual/bbc) |
| difficulty  | integer     | YES      | 1                 | 난이도 (1~5)                          |
| created_at  | timestamptz | NO       | now()             | 생성 시각                             |

**CHECK**: `source IN ('tatoeba','voa','claude','manual','bbc')`, `difficulty BETWEEN 1 AND 5`

**인덱스**: `pattern_id`

---

### 3. scenes

회화 장면/상황(카페, 공항, 회의실 등)을 저장합니다.

| Column        | Type        | Nullable | Default           | Description      |
|---------------|-------------|----------|-------------------|------------------|
| id            | uuid        | NO       | gen_random_uuid() | PK               |
| name_ko       | text        | NO       |                   | 장면 이름 (한글)  |
| name_en       | text        | NO       |                   | 장면 이름 (영문)  |
| description   | text        | YES      |                   | 장면 설명         |
| visual_layout | text        | YES      |                   | 시각 레이아웃 정보 |
| cefr_level    | text        | YES      | 'A1'              | CEFR 등급        |
| created_at    | timestamptz | NO       | now()             | 생성 시각         |

---

### 4. scene_patterns (다대다 연결)

scenes와 patterns의 다대다 관계를 연결합니다.

| Column     | Type | Nullable | Description                          |
|------------|------|----------|--------------------------------------|
| scene_id   | uuid | NO       | FK -> scenes(id) ON DELETE CASCADE   |
| pattern_id | uuid | NO       | FK -> patterns(id) ON DELETE CASCADE |

**PK**: `(scene_id, pattern_id)`

---

### 5. user_progress

SM-2 간격 반복 알고리즘 기반 사용자 학습 진행도를 저장합니다.

| Column           | Type        | Nullable | Default           | Description                         |
|------------------|-------------|----------|-------------------|-------------------------------------|
| id               | uuid        | NO       | gen_random_uuid() | PK                                  |
| user_id          | uuid        | NO       |                   | FK -> auth.users(id) ON DELETE CASCADE |
| pattern_id       | uuid        | NO       |                   | FK -> patterns(id) ON DELETE CASCADE   |
| ease_factor      | float       | NO       | 2.5               | SM-2 난이도 계수                      |
| interval_days    | integer     | NO       | 1                 | 다음 복습까지 간격(일)                 |
| next_review_date | date        | NO       | CURRENT_DATE      | 다음 복습 예정일                      |
| repetitions      | integer     | NO       | 0                 | 반복 횟수                             |
| last_score       | integer     | NO       | 0                 | 마지막 평가 점수 (0~5)               |
| created_at       | timestamptz | NO       | now()             | 생성 시각                             |
| updated_at       | timestamptz | NO       | now()             | 수정 시각 (트리거 자동 갱신)           |

**CHECK**: `last_score BETWEEN 0 AND 5`

**UNIQUE**: `(user_id, pattern_id)`

**인덱스**:
- `user_id`
- `next_review_date`
- `(user_id, next_review_date) WHERE next_review_date <= CURRENT_DATE` -- 오늘 복습 대상 부분 인덱스

---

## 인덱스 요약

| 테이블         | 인덱스 이름                             | 컬럼                            | 비고                      |
|----------------|----------------------------------------|---------------------------------|---------------------------|
| patterns       | idx_patterns_category                  | category                        |                           |
| patterns       | idx_patterns_cefr_level                | cefr_level                      |                           |
| examples       | idx_examples_pattern_id                | pattern_id                      |                           |
| user_progress  | idx_user_progress_user_id              | user_id                         |                           |
| user_progress  | idx_user_progress_next_review_date     | next_review_date                |                           |
| user_progress  | idx_user_progress_due_reviews          | (user_id, next_review_date)     | 부분 인덱스 (WHERE <= today) |

---

## Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있습니다.

| 테이블          | 정책                           | 동작       | 조건                    |
|----------------|-------------------------------|-----------|-------------------------|
| patterns       | patterns_select_all           | SELECT    | 누구나                   |
| examples       | examples_select_all           | SELECT    | 누구나                   |
| scenes         | scenes_select_all             | SELECT    | 누구나                   |
| scene_patterns | scene_patterns_select_all     | SELECT    | 누구나                   |
| user_progress  | user_progress_select_own      | SELECT    | auth.uid() = user_id    |
| user_progress  | user_progress_insert_own      | INSERT    | auth.uid() = user_id    |
| user_progress  | user_progress_update_own      | UPDATE    | auth.uid() = user_id    |
| user_progress  | user_progress_delete_own      | DELETE    | auth.uid() = user_id    |

> patterns, examples, scenes, scene_patterns는 공개 데이터이므로 누구나 읽을 수 있습니다.
> user_progress는 자기 자신의 데이터만 CRUD 할 수 있습니다.
> 관리자가 patterns/examples/scenes 데이터를 INSERT/UPDATE/DELETE 하려면 service_role 키를 사용하거나 별도 admin 정책을 추가해야 합니다.

---

## 트리거

| 트리거 이름                       | 테이블         | 이벤트          | 함수                        |
|----------------------------------|----------------|----------------|-----------------------------|
| trg_patterns_updated_at          | patterns       | BEFORE UPDATE  | update_updated_at_column()  |
| trg_user_progress_updated_at     | user_progress  | BEFORE UPDATE  | update_updated_at_column()  |

`update_updated_at_column()` 함수는 해당 row의 `updated_at` 컬럼을 `now()`로 자동 갱신합니다.

---

## 적용 방법

Supabase Dashboard의 SQL Editor에서 `backend/schema.sql` 파일 내용을 실행하거나, CLI로 적용합니다:

```bash
# Supabase CLI
supabase db reset          # 로컬 DB 초기화 후 마이그레이션 적용
# 또는
supabase migration new init_schema
# 위 명령으로 생성된 마이그레이션 파일에 schema.sql 내용 복사 후:
supabase db push
```
