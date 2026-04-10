// 공통 analytics 이벤트 유틸
// 각 프로젝트에서 import하여 사용자 행동 이벤트를 기록
// Supabase analytics_events 테이블에 배치 저장

interface AnalyticsEvent {
  project: string;
  event: string;
  properties?: Record<string, unknown>;
  timestamp: string;
  user_agent?: string;
  path?: string;
}

const buffer: AnalyticsEvent[] = [];
const FLUSH_INTERVAL = 30_000; // 30초마다 flush
const FLUSH_SIZE = 50; // 50개 모이면 즉시 flush
let flushTimer: ReturnType<typeof setTimeout> | null = null;

// Supabase에 배치 저장
async function flushToSupabase() {
  if (buffer.length === 0) return;

  const batch = buffer.splice(0, buffer.length);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return; // Supabase 미설정 시 무시

  try {
    await fetch(`${url}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify(batch),
    });
  } catch {
    // 실패 시 버퍼에 복원 (최대 500개)
    buffer.unshift(...batch.slice(0, 500 - buffer.length));
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushToSupabase();
  }, FLUSH_INTERVAL);
}

export function trackEvent(project: string, event: string, properties?: Record<string, unknown>) {
  const entry: AnalyticsEvent = {
    project,
    event,
    properties,
    timestamp: new Date().toISOString(),
    user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    path: typeof window !== "undefined" ? window.location.pathname : undefined,
  };

  buffer.push(entry);

  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${project}:${event}`, properties || "");
  }

  if (buffer.length >= FLUSH_SIZE) {
    flushToSupabase();
  } else {
    scheduleFlush();
  }
}

// 페이지 언로드 시 남은 이벤트 전송
if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushToSupabase();
  });
}

export function getBufferSize(): number {
  return buffer.length;
}

// 프로젝트별 프리셋
export const analytics = {
  jejupass: (event: string, props?: Record<string, unknown>) => trackEvent("jejupass", event, props),
  miniXd: (event: string, props?: Record<string, unknown>) => trackEvent("mini-xd", event, props),
  weather: (event: string, props?: Record<string, unknown>) => trackEvent("weather", event, props),
  map: (event: string, props?: Record<string, unknown>) => trackEvent("map", event, props),
  travel: (event: string, props?: Record<string, unknown>) => trackEvent("travel", event, props),
  course: (event: string, props?: Record<string, unknown>) => trackEvent("course", event, props),
  chatbot: (event: string, props?: Record<string, unknown>) => trackEvent("chatbot", event, props),
  party: (event: string, props?: Record<string, unknown>) => trackEvent("party", event, props),
  carPick: (event: string, props?: Record<string, unknown>) => trackEvent("car-pick", event, props),
  weatherDrive: (event: string, props?: Record<string, unknown>) => trackEvent("weather-drive", event, props),
  smartFuel: (event: string, props?: Record<string, unknown>) => trackEvent("smart-fuel", event, props),
  biz: (event: string, props?: Record<string, unknown>) => trackEvent("biz", event, props),
};
