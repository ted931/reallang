import { NextResponse } from 'next/server';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  source: string;
  cat: 'catch' | 'gear' | 'point' | 'weather' | 'tip';
  imageColor: string;
}

const DUMMY_ITEMS: NewsItem[] = [
  {
    id: 'd1',
    title: '제주 한림 갯바위 갈치 폭발 조황 — 마릿수 압도적',
    url: '#',
    summary: '한림 북서쪽 갯바위에서 야간 갈치 조황이 연일 폭발하고 있다. 입질 타임은 밤 9시~12시로 크릴 미끼에 반응이 가장 좋았다.',
    publishedAt: '2026-05-11',
    source: '낚시춘추',
    cat: 'catch',
    imageColor: '#f59e0b',
  },
  {
    id: 'd2',
    title: '겨울 벵에돔 채비 완전 정리 — 찌 호수 선택부터 목줄까지',
    url: '#',
    summary: '벵에돔 시즌에 맞춰 찌 0.5호~1호 선택법, 목줄 1.5호 이하 세팅, 채비 흘림 요령을 총정리했다.',
    publishedAt: '2026-05-11',
    source: '피싱앤아웃도어',
    cat: 'gear',
    imageColor: '#5fa3cf',
  },
  {
    id: 'd3',
    title: '서귀포 황우지해안 포인트 분석 — 수중 지형 완전 공개',
    url: '#',
    summary: '황우지해안 A~D 포인트별 수심·저질·어종 분포를 현지 가이드와 함께 현장 취재했다. 감성돔·벵에돔 모두 노릴 수 있는 1급지.',
    publishedAt: '2026-05-10',
    source: '루어낚시',
    cat: 'point',
    imageColor: '#86efac',
  },
  {
    id: 'd4',
    title: '이번 주 제주 낚시 물때 — 대조기 주의, 10~11물 최적',
    url: '#',
    summary: '5월 12~14일 대조기 구간. 조류가 빠른 여밭보다 잔잔한 내항 쪽이 유리하다. 물때 10물 전후 갈치 입질 최고.',
    publishedAt: '2026-05-10',
    source: '피싱투데이',
    cat: 'weather',
    imageColor: '#a78bfa',
  },
  {
    id: 'd5',
    title: '루어 낚시 초보 탈출 — 에기 색상 고르는 3가지 법칙',
    url: '#',
    summary: '날씨·수심·계절별로 에기 색상을 고르는 실전 팁. 맑은 날엔 핑크·오렌지, 흐린 날엔 자주·야광이 정답이다.',
    publishedAt: '2026-05-10',
    source: '낚시춘추',
    cat: 'tip',
    imageColor: '#fbbf24',
  },
  {
    id: 'd6',
    title: '성산 일출봉 앞 참돔 선상 조황 — 5월 들어 최고 마릿수',
    url: '#',
    summary: '성산 인근 수심 35m 여밭에서 참돔 조황이 이어지고 있다. 새우 생미끼에 3~5kg 급 연속 히트.',
    publishedAt: '2026-05-09',
    source: '피싱앤아웃도어',
    cat: 'catch',
    imageColor: '#f59e0b',
  },
  {
    id: 'd7',
    title: '갈치 야간 낚시 필수 장비 리스트 — 헤드랜턴부터 쿨러까지',
    url: '#',
    summary: '야간 갈치 출조 시 반드시 챙겨야 할 장비 10가지. 루미코트 부착 채비, 갈치전용 후크, 방한장갑 꼭 챙기자.',
    publishedAt: '2026-05-09',
    source: '피싱투데이',
    cat: 'gear',
    imageColor: '#5fa3cf',
  },
  {
    id: 'd8',
    title: '애월 곽지 방파제 볼락 포인트 — 가을~봄 시즌 공략법',
    url: '#',
    summary: '곽지리 방파제 내측 테트라포드 주변 볼락 포인트. 수심 2~4m 지그헤드 0.5~1g에 웜이 최고 효율.',
    publishedAt: '2026-05-09',
    source: '루어낚시',
    cat: 'point',
    imageColor: '#86efac',
  },
  {
    id: 'd9',
    title: '5월 제주 해상 날씨 전망 — 남서풍 주의, 조류 세짐',
    url: '#',
    summary: '기상청 발표에 따르면 5월 중순 남서풍 강화로 제주 서쪽 출조 어려울 전망. 동쪽 성산·표선 포인트 추천.',
    publishedAt: '2026-05-08',
    source: '피싱투데이',
    cat: 'weather',
    imageColor: '#a78bfa',
  },
  {
    id: 'd10',
    title: '찌낚시 감성돔 — 밑밥 배합 황금비율 공개',
    url: '#',
    summary: '현지 베테랑 조사가 공개한 감성돔 밑밥 황금비율. 크릴 3:집어제 1:빵가루 1 배합에 갯지렁이 소량 추가.',
    publishedAt: '2026-05-08',
    source: '낚시춘추',
    cat: 'tip',
    imageColor: '#fbbf24',
  },
  {
    id: 'd11',
    title: '모슬포 송악산 앞 참치 지깅 — 100kg급 3연타',
    url: '#',
    summary: '모슬포 출항 60해리 외해에서 참치 지깅 대박 조황. 100kg급 포함 하루 3마리 히트. 200g 슬로우 지그 효과적.',
    publishedAt: '2026-05-08',
    source: '피싱앤아웃도어',
    cat: 'catch',
    imageColor: '#f59e0b',
  },
  {
    id: 'd12',
    title: '다이와 2026 신제품 릴 리뷰 — 실전 갈치 테스트',
    url: '#',
    summary: '다이와 프리엠스 LT4000-CXH 갈치 야간 실전 사용기. 드래그 감도·라인 방출감 모두 전작 대비 향상.',
    publishedAt: '2026-05-07',
    source: '루어낚시',
    cat: 'gear',
    imageColor: '#5fa3cf',
  },
  {
    id: 'd13',
    title: '표선 해비치 앞 감성돔 포인트 시즌 돌입',
    url: '#',
    summary: '표선 앞 여밭에서 감성돔 포인트 시즌이 시작됐다. 수심 8~12m 구간 찌낚시, 물때 6~8물이 유리.',
    publishedAt: '2026-05-07',
    source: '낚시춘추',
    cat: 'point',
    imageColor: '#86efac',
  },
  {
    id: 'd14',
    title: '너울파도 예보 — 이번 주말 제주 전역 출조 자제 권고',
    url: '#',
    summary: '해양경찰청은 5월 17~18일 제주 전역에 너울파도 주의보를 발령했다. 갯바위 출조는 자제하고 방파제도 안전에 각별히 주의.',
    publishedAt: '2026-05-07',
    source: '피싱투데이',
    cat: 'weather',
    imageColor: '#a78bfa',
  },
  {
    id: 'd15',
    title: '선상낚시 멀미 예방 3가지 꿀팁 — 출조 전날부터 준비',
    url: '#',
    summary: '경험 많은 선장이 알려주는 멀미 예방법. 전날 과식 금지, 스코폴라민 패치 귀 뒤 부착, 선미보다 선수 위치 선택.',
    publishedAt: '2026-05-06',
    source: '피싱앤아웃도어',
    cat: 'tip',
    imageColor: '#fbbf24',
  },
  {
    id: 'd16',
    title: '제주 방어 시즌 개막 — 한치 집어등 주변 대형급 주목',
    url: '#',
    summary: '5월 초 제주 남쪽 해상에서 방어 조황 시작. 한치잡이 집어등 주변 수면 근처 지깅 패턴이 최고 효율.',
    publishedAt: '2026-05-06',
    source: '낚시춘추',
    cat: 'catch',
    imageColor: '#f59e0b',
  },
  {
    id: 'd17',
    title: '낚시대 가이드 교체 DIY — 재료비 2만원에 완성',
    url: '#',
    summary: '낚시대 가이드 파손 시 직접 교체하는 방법. 에폭시 수지, 가이드 키트, 실 바인딩으로 누구나 할 수 있다.',
    publishedAt: '2026-05-05',
    source: '루어낚시',
    cat: 'gear',
    imageColor: '#5fa3cf',
  },
  {
    id: 'd18',
    title: '한림 비양도 갯바위 포인트 가이드 — 접근 방법부터 어종까지',
    url: '#',
    summary: '비양도 남서쪽 갯바위는 제주 최고 벵에돔 포인트 중 하나. 배편 시간, 허가 필요 구역, 안전 주의사항 정리.',
    publishedAt: '2026-05-05',
    source: '피싱투데이',
    cat: 'point',
    imageColor: '#86efac',
  },
  {
    id: 'd19',
    title: '5월 제주 낚시 캘린더 — 어종별 베스트 시기 정리',
    url: '#',
    summary: '갈치·감성돔·참돔·벵에돔·방어까지 5월에 狙으면 좋은 어종과 포인트·채비를 한눈에 정리한 월간 낚시 캘린더.',
    publishedAt: '2026-05-04',
    source: '낚시춘추',
    cat: 'tip',
    imageColor: '#fbbf24',
  },
  {
    id: 'd20',
    title: '제주 조류 분석 — 5월 대조기 구간 유망 포인트',
    url: '#',
    summary: '5월 대조기(10~13물) 구간에 조류가 강한 외해 여밭에서 대형 어종 확률이 높다. 성산 앞 수도 해협이 최고 포인트.',
    publishedAt: '2026-05-03',
    source: '피싱앤아웃도어',
    cat: 'weather',
    imageColor: '#a78bfa',
  },
];

const RSS_FEEDS = [
  'https://www.fishi.co.kr/rss/allArticle.xml',
  'https://www.fishingnoutdoor.com/rss',
];

async function fetchRSS(url: string): Promise<NewsItem[]> {
  const res = await fetch(url, {
    next: { revalidate: 1800 },
    signal: AbortSignal.timeout(5000),
  });
  const xml = await res.text();
  const items: NewsItem[] = [];
  const itemBlocks = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const block of itemBlocks.slice(0, 10)) {
    const title =
      block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
      block.match(/<title>(.*?)<\/title>/)?.[1] ||
      '';
    const link =
      block.match(/<link>(.*?)<\/link>/)?.[1] || '#';
    const desc =
      block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] ||
      block.match(/<description>(.*?)<\/description>/)?.[1] ||
      '';
    const pubDate =
      block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    if (title) {
      items.push({
        id: `rss-${Math.random().toString(36).slice(2)}`,
        title,
        url: link,
        summary: desc.replace(/<[^>]+>/g, '').slice(0, 120),
        publishedAt: pubDate,
        source: new URL(url).hostname,
        cat: 'catch',
        imageColor: '#f59e0b',
      });
    }
  }
  return items;
}

export async function GET() {
  let items: NewsItem[] = [];
  let fromCache = true;

  try {
    const results = await Promise.allSettled(RSS_FEEDS.map(fetchRSS));
    const fetched = results
      .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    if (fetched.length > 0) {
      items = fetched;
      fromCache = false;
    } else {
      items = DUMMY_ITEMS;
    }
  } catch {
    items = DUMMY_ITEMS;
  }

  if (items.length === 0) {
    items = DUMMY_ITEMS;
  }

  return NextResponse.json({
    items,
    fromCache,
    fetchedAt: new Date().toISOString(),
  });
}
