"use client";

import { useState } from "react";

const MIGRATION_SQL = `-- 제주패스 공통 데이터 레이어
-- Supabase Dashboard > SQL Editor에서 실행

-- 1. 생성된 코스/일정 (AI 결과 저장)
CREATE TABLE IF NOT EXISTS generated_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('course', 'travel_plan')),
  title TEXT NOT NULL,
  summary TEXT,
  input_prompt TEXT,
  input_params JSONB,
  result JSONB NOT NULL,
  total_cost INT DEFAULT 0,
  days INT DEFAULT 1,
  view_count INT DEFAULT 0,
  share_count INT DEFAULT 0,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plans_type ON generated_plans (type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plans_popular ON generated_plans (view_count DESC);

-- 2. 취미 파티
CREATE TABLE IF NOT EXISTS parties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  custom_category TEXT,
  description TEXT,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  region TEXT NOT NULL,
  location TEXT,
  max_members INT DEFAULT 4,
  current_members INT DEFAULT 1,
  cost_type TEXT DEFAULT 'split',
  cost_amount INT DEFAULT 0,
  has_rental_car BOOLEAN DEFAULT FALSE,
  car_info TEXT,
  equipment_needed TEXT,
  host_name TEXT NOT NULL,
  host_bio TEXT,
  host_rating NUMERIC(2,1) DEFAULT 0,
  host_party_count INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  schedule JSONB DEFAULT '[]',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parties_date ON parties (date, status);
CREATE INDEX IF NOT EXISTS idx_parties_category ON parties (category, status);

-- 3. 파티 참여 신청
CREATE TABLE IF NOT EXISTS party_joins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 날씨 캐시
CREATE TABLE IF NOT EXISTS weather_cache (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  location_name TEXT NOT NULL,
  temperature NUMERIC(4,1),
  humidity NUMERIC(4,1),
  rainfall NUMERIC(5,1) DEFAULT 0,
  wind_speed NUMERIC(4,1),
  sky TEXT,
  sky_emoji TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weather_location ON weather_cache (location_name, fetched_at DESC);

-- 5. 사용자 행동 로그
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_type ON analytics_events (event_type, created_at DESC);

-- 6. POI 장소
CREATE TABLE IF NOT EXISTS pois (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  lat NUMERIC(8,5) NOT NULL,
  lng NUMERIC(9,5) NOT NULL,
  address TEXT,
  phone TEXT,
  description TEXT,
  region TEXT,
  is_indoor BOOLEAN DEFAULT FALSE,
  avg_cost INT DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pois_category ON pois (category);
CREATE INDEX IF NOT EXISTS idx_pois_region ON pois (region);

-- 완료!
SELECT 'All tables created successfully' AS result;`;

export default function SetupPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MIGRATION_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Supabase 테이블 셋업</h1>
        <p className="text-sm text-gray-500 mb-6">
          아래 SQL을 복사해서{" "}
          <a href="https://supabase.com/dashboard/project/nempccsvgmrkwexqgmvo/sql/new"
            target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Supabase SQL Editor
          </a>
          에 붙여넣고 실행하세요. (1회만)
        </p>

        <div className="relative">
          <button
            onClick={handleCopy}
            className={`absolute top-3 right-3 px-4 py-2 rounded-lg text-sm font-bold z-10 transition-colors ${
              copied ? "bg-emerald-500 text-white" : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {copied ? "복사됨!" : "SQL 복사"}
          </button>
          <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 text-xs overflow-x-auto max-h-[600px] overflow-y-auto leading-relaxed">
            {MIGRATION_SQL}
          </pre>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-bold text-blue-900 text-sm mb-2">생성되는 테이블 (6개)</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>- <strong>generated_plans</strong>: AI 여행 플래너/코스 메이커 결과 저장</li>
            <li>- <strong>parties</strong>: 취미 파티 데이터</li>
            <li>- <strong>party_joins</strong>: 파티 참여 신청</li>
            <li>- <strong>weather_cache</strong>: 날씨 캐시 (API 호출 절감)</li>
            <li>- <strong>analytics_events</strong>: 사용자 행동 로그</li>
            <li>- <strong>pois</strong>: 장소(POI) 데이터</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
