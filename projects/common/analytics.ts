// 공통 analytics 이벤트 유틸
// 각 프로젝트에서 import하여 사용자 행동 이벤트를 기록
// 현재: 콘솔 로그 → 추후: Supabase analytics_events 테이블

interface AnalyticsEvent {
  project: string;
  event: string;
  properties?: Record<string, unknown>;
  timestamp: string;
}

const events: AnalyticsEvent[] = [];

export function trackEvent(project: string, event: string, properties?: Record<string, unknown>) {
  const entry: AnalyticsEvent = {
    project,
    event,
    properties,
    timestamp: new Date().toISOString(),
  };

  events.push(entry);

  // 개발 모드에서 콘솔 출력
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${project}:${event}`, properties || "");
  }

  // TODO: Supabase에 저장
  // const supabase = createClient(url, key);
  // supabase.from('analytics_events').insert(entry);
}

export function getEvents(): AnalyticsEvent[] {
  return events;
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
  carPick: (event: string, props?: Record<string, unknown>) => trackEvent("car-pick", event, props),
  weatherDrive: (event: string, props?: Record<string, unknown>) => trackEvent("weather-drive", event, props),
  smartFuel: (event: string, props?: Record<string, unknown>) => trackEvent("smart-fuel", event, props),
};
