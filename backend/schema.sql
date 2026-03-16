-- ============================================================
-- RealLang Database Schema for Supabase (PostgreSQL)
-- ============================================================

-- 0. updated_at 자동 업데이트 트리거 함수
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 1. patterns 테이블 -- 영어 패턴 템플릿
-- ============================================================
CREATE TABLE patterns (
    id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    category        text        NOT NULL,                   -- Greeting, Ordering, Travel, Shopping 등
    subcategory     text,
    pattern_template text       NOT NULL,                   -- 예: "I'd like to + [verb]"
    explanation_ko  text        NOT NULL,                   -- 한글 설명
    dev_analogy     text,                                   -- 개발자 비유 (nullable)
    cefr_level      text        NOT NULL DEFAULT 'A1'
                                CHECK (cefr_level IN ('A1','A2','B1','B2','C1','C2')),
    difficulty_order integer    NOT NULL DEFAULT 1,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

COMMENT ON TABLE  patterns IS '영어 회화 패턴 템플릿';
COMMENT ON COLUMN patterns.category IS '대분류: Greeting, Ordering, Travel, Shopping 등';
COMMENT ON COLUMN patterns.pattern_template IS '패턴 틀, 예: "I''d like to + [verb]"';
COMMENT ON COLUMN patterns.dev_analogy IS '개발자 친화적 비유 설명';

CREATE TRIGGER trg_patterns_updated_at
    BEFORE UPDATE ON patterns
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- 2. examples 테이블 -- 패턴별 예문
-- ============================================================
CREATE TABLE examples (
    id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    pattern_id  uuid        REFERENCES patterns(id) ON DELETE CASCADE,
    sentence_en text        NOT NULL,
    sentence_ko text        NOT NULL,
    native_tip  text,                                       -- 원어민 팁
    audio_url   text,
    source      text        DEFAULT 'manual'
                            CHECK (source IN ('tatoeba','voa','claude','manual','bbc')),
    difficulty  integer     DEFAULT 1
                            CHECK (difficulty BETWEEN 1 AND 5),
    created_at  timestamptz DEFAULT now()
);

COMMENT ON TABLE  examples IS '패턴별 영어-한국어 예문';
COMMENT ON COLUMN examples.source IS '예문 출처: tatoeba, voa, claude, manual, bbc';


-- 3. scenes 테이블 -- 장면/상황
-- ============================================================
CREATE TABLE scenes (
    id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ko       text        NOT NULL,
    name_en       text        NOT NULL,
    description   text,
    visual_layout text,                                     -- 시각 레이아웃 정보
    cefr_level    text        DEFAULT 'A1',
    created_at    timestamptz DEFAULT now()
);

COMMENT ON TABLE scenes IS '회화 장면/상황 (예: 카페, 공항, 회의실)';


-- 4. scene_patterns 테이블 -- scenes <-> patterns 다대다
-- ============================================================
CREATE TABLE scene_patterns (
    scene_id   uuid REFERENCES scenes(id)   ON DELETE CASCADE,
    pattern_id uuid REFERENCES patterns(id) ON DELETE CASCADE,
    PRIMARY KEY (scene_id, pattern_id)
);

COMMENT ON TABLE scene_patterns IS 'scenes-patterns 다대다 연결 테이블';


-- 5. user_progress 테이블 -- 사용자별 학습 진행 (SM-2 기반)
-- ============================================================
CREATE TABLE user_progress (
    id               uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id          uuid    REFERENCES auth.users(id) ON DELETE CASCADE,
    pattern_id       uuid    REFERENCES patterns(id)   ON DELETE CASCADE,
    ease_factor      float   DEFAULT 2.5,
    interval_days    integer DEFAULT 1,
    next_review_date date    DEFAULT CURRENT_DATE,
    repetitions      integer DEFAULT 0,
    last_score       integer DEFAULT 0
                             CHECK (last_score BETWEEN 0 AND 5),
    created_at       timestamptz DEFAULT now(),
    updated_at       timestamptz DEFAULT now(),
    UNIQUE (user_id, pattern_id)
);

COMMENT ON TABLE  user_progress IS '사용자별 패턴 학습 진행도 (SM-2 간격 반복)';
COMMENT ON COLUMN user_progress.ease_factor IS 'SM-2 난이도 계수 (기본 2.5)';
COMMENT ON COLUMN user_progress.interval_days IS '다음 복습까지 간격(일)';
COMMENT ON COLUMN user_progress.last_score IS '마지막 평가 점수 (0-5)';

CREATE TRIGGER trg_user_progress_updated_at
    BEFORE UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- ============================================================
-- 6. 인덱스
-- ============================================================
CREATE INDEX idx_patterns_category   ON patterns (category);
CREATE INDEX idx_patterns_cefr_level ON patterns (cefr_level);

CREATE INDEX idx_examples_pattern_id ON examples (pattern_id);

CREATE INDEX idx_user_progress_user_id          ON user_progress (user_id);
CREATE INDEX idx_user_progress_next_review_date ON user_progress (next_review_date);

-- 오늘 복습할 패턴을 빠르게 조회하기 위한 부분 인덱스
CREATE INDEX idx_user_progress_due_reviews
    ON user_progress (user_id, next_review_date)
    WHERE next_review_date <= CURRENT_DATE;


-- ============================================================
-- 7. Row Level Security (RLS)
-- ============================================================

-- patterns: 누구나 읽기 가능
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patterns_select_all"
    ON patterns FOR SELECT
    USING (true);

-- examples: 누구나 읽기 가능
ALTER TABLE examples ENABLE ROW LEVEL SECURITY;

CREATE POLICY "examples_select_all"
    ON examples FOR SELECT
    USING (true);

-- scenes: 누구나 읽기 가능
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scenes_select_all"
    ON scenes FOR SELECT
    USING (true);

-- scene_patterns: 누구나 읽기 가능
ALTER TABLE scene_patterns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scene_patterns_select_all"
    ON scene_patterns FOR SELECT
    USING (true);

-- user_progress: 자기 데이터만 CRUD
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_progress_select_own"
    ON user_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "user_progress_insert_own"
    ON user_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_update_own"
    ON user_progress FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_progress_delete_own"
    ON user_progress FOR DELETE
    USING (auth.uid() = user_id);
