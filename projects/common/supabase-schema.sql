-- ============================================
-- 제주패스 공통 데이터 레이어 — Supabase Schema
-- 실행: Supabase Dashboard > SQL Editor
-- ============================================

-- 1. 날씨 캐시 (10분마다 갱신, 모든 프로젝트 공유)
CREATE TABLE IF NOT EXISTS weather_cache (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  location_name TEXT NOT NULL,
  nx INT NOT NULL,
  ny INT NOT NULL,
  temperature NUMERIC(4,1),
  humidity NUMERIC(4,1),
  rainfall NUMERIC(5,1) DEFAULT 0,
  wind_speed NUMERIC(4,1),
  wind_direction NUMERIC(5,1),
  sky TEXT,               -- "맑음", "흐림", "비" 등
  sky_emoji TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (location_name, fetched_at)
);

CREATE INDEX idx_weather_cache_location ON weather_cache (location_name, fetched_at DESC);

-- 최신 날씨만 빠르게 조회하는 뷰
CREATE OR REPLACE VIEW weather_latest AS
SELECT DISTINCT ON (location_name)
  location_name, temperature, humidity, rainfall,
  wind_speed, wind_direction, sky, sky_emoji, fetched_at
FROM weather_cache
ORDER BY location_name, fetched_at DESC;

-- 오래된 캐시 자동 삭제 (24시간 이상)
-- Supabase cron 또는 pg_cron으로 매시간 실행
-- SELECT cron.schedule('cleanup-weather', '0 * * * *', $$DELETE FROM weather_cache WHERE fetched_at < NOW() - INTERVAL '24 hours'$$);


-- 2. POI 장소 데이터 (지도/코스/플래너 공유)
CREATE TABLE IF NOT EXISTS pois (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,       -- cafe, restaurant, attraction, beach, trail, etc.
  lat NUMERIC(8,5) NOT NULL,
  lng NUMERIC(9,5) NOT NULL,
  address TEXT,
  phone TEXT,
  description TEXT,
  image_url TEXT,
  region TEXT,                   -- 제주시, 서귀포, 애월, 성산, 중문 등
  tags TEXT[] DEFAULT '{}',
  is_indoor BOOLEAN DEFAULT FALSE,
  avg_cost INT DEFAULT 0,        -- 1인 평균 비용 (원)
  source TEXT DEFAULT 'manual',  -- manual, tour_api, crawl
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pois_category ON pois (category);
CREATE INDEX idx_pois_region ON pois (region);
CREATE INDEX idx_pois_location ON pois USING gist (
  ST_SetSRID(ST_MakePoint(lng::float, lat::float), 4326)
);


-- 3. 생성된 코스/일정 (AI 결과 저장)
CREATE TABLE IF NOT EXISTS generated_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('course', 'travel_plan')),
  title TEXT NOT NULL,
  summary TEXT,
  input_prompt TEXT,             -- 사용자 원문 입력
  input_params JSONB,            -- nights, travelers, budget, style 등
  result JSONB NOT NULL,         -- AI 생성 결과 전체 JSON
  total_cost INT DEFAULT 0,
  days INT DEFAULT 1,
  view_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  session_id TEXT,               -- 익명 세션 추적용
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plans_type ON generated_plans (type, created_at DESC);
CREATE INDEX idx_plans_popular ON generated_plans (view_count DESC);


-- 4. 사용자 행동 로그 (전환 추적)
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type TEXT NOT NULL,      -- page_view, cta_click, plan_create, course_create, etc.
  event_data JSONB DEFAULT '{}', -- 이벤트별 상세 데이터
  page TEXT,                     -- /weather, /course, /travel 등
  referrer TEXT,                 -- 어디서 왔는지
  session_id TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_type ON analytics_events (event_type, created_at DESC);
CREATE INDEX idx_events_page ON analytics_events (page, created_at DESC);

-- 일별 요약 뷰
CREATE OR REPLACE VIEW analytics_daily AS
SELECT
  date_trunc('day', created_at)::date AS day,
  event_type,
  page,
  COUNT(*) AS count
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY 1, 2, 3
ORDER BY 1 DESC, 4 DESC;


-- 5. 인기 코스 랭킹 뷰
CREATE OR REPLACE VIEW popular_courses AS
SELECT
  id, title, summary, input_params, total_cost, days,
  view_count, share_count, created_at
FROM generated_plans
WHERE type = 'course'
ORDER BY view_count DESC
LIMIT 20;

CREATE OR REPLACE VIEW popular_plans AS
SELECT
  id, title, summary, input_params, total_cost, days,
  view_count, share_count, created_at
FROM generated_plans
WHERE type = 'travel_plan'
ORDER BY view_count DESC
LIMIT 20;
