/**
 * 공유 날씨 캐시 레이어
 * 기상청 API → Supabase weather_cache 테이블에 10분 캐시
 * 모든 프로젝트가 이 함수를 통해 날씨 데이터에 접근
 */

const CACHE_TTL_MS = 10 * 60 * 1000; // 10분

export interface CachedWeather {
  locations: {
    name: string;
    emoji: string;
    lat: number;
    lng: number;
    temperature: string;
    humidity: string;
    rainfall: string;
    windSpeed: string;
    windDirection: string;
    sky: string;
  }[];
  updatedAt: string;
}

// 인메모리 캐시 (같은 프로세스 내 중복 호출 방지)
let memoryCache: CachedWeather | null = null;
let memoryCacheTime = 0;

/**
 * Supabase에서 캐시된 날씨 데이터 조회
 * 캐시 miss 시 null 반환
 */
async function getFromSupabase(): Promise<CachedWeather | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/weather_cache?key=eq.jeju_current&select=data,updated_at&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      }
    );
    const rows = await res.json();
    if (!rows?.[0]) return null;

    const row = rows[0];
    const age = Date.now() - new Date(row.updated_at).getTime();
    if (age > CACHE_TTL_MS) return null; // 캐시 만료

    return row.data as CachedWeather;
  } catch {
    return null;
  }
}

/**
 * Supabase에 날씨 데이터 저장 (upsert)
 */
async function saveToSupabase(data: CachedWeather): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;

  try {
    await fetch(`${url}/rest/v1/weather_cache`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        key: "jeju_current",
        data,
        updated_at: new Date().toISOString(),
      }),
    });
  } catch {
    // 저장 실패는 무시 (다음에 다시 시도)
  }
}

/**
 * 캐시된 날씨 데이터 반환.
 * 캐시 없으면 fetchFn을 호출하고 결과를 캐시에 저장.
 */
export async function getCachedWeather(
  fetchFn: () => Promise<CachedWeather>
): Promise<CachedWeather> {
  // 1. 인메모리 캐시 확인
  if (memoryCache && Date.now() - memoryCacheTime < CACHE_TTL_MS) {
    return memoryCache;
  }

  // 2. Supabase 캐시 확인
  const cached = await getFromSupabase();
  if (cached) {
    memoryCache = cached;
    memoryCacheTime = Date.now();
    return cached;
  }

  // 3. 캐시 miss → 기상청 API 호출
  const fresh = await fetchFn();

  // 4. 캐시에 저장
  memoryCache = fresh;
  memoryCacheTime = Date.now();
  saveToSupabase(fresh); // fire-and-forget

  return fresh;
}
