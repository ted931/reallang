"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

const FEED_POSTS = [
  {
    id: '1',
    bizName: '한림 황금좌대',
    region: '한림',
    fish: '갈치',
    date: '2026-05-12',
    imageColor: '#1e4080',
    weather: '맑음',
    tide: '8물',
    count: '20마리+',
    sizeMax: '80cm',
    content: '야간 갈치 조황 폭발! 발광체 필수, 꽁치 토막 최고. 22시~새벽 1시 입질 집중. 날씨 완벽, 파도 잔잔.',
  },
  {
    id: '2',
    bizName: '서귀포 황우지선상',
    region: '서귀포',
    fish: '감성돔',
    date: '2026-05-12',
    imageColor: '#1a6b3e',
    weather: '구름조금',
    tide: '7물',
    count: '5~8마리',
    sizeMax: '42cm',
    content: '새벽 5시~8시 피크. 반유동 찌낚시, 크릴 밑밥 타이밍이 핵심. 최대 42cm 씩씩한 놈도 나왔습니다.',
  },
  {
    id: '3',
    bizName: '성산 일출낚시',
    region: '성산',
    fish: '참돔',
    date: '2026-05-12',
    imageColor: '#6b1a1a',
    weather: '맑음',
    tide: '6물',
    count: '3~5마리',
    sizeMax: '55cm',
    content: '참돔 씨알이 예년보다 굵습니다. 봉돌 채비 40m 이상 내리면 입질. 오전 출조 권장.',
  },
  {
    id: '4',
    bizName: '모슬포 방어떼선상',
    region: '모슬포',
    fish: '방어',
    date: '2026-05-11',
    imageColor: '#4a1a6b',
    weather: '바람약',
    tide: '5물',
    count: '1~3마리',
    sizeMax: '75cm',
    content: '이른 아침 방어 무리 탐지. 루어 메탈지그 60~80g 반응 최고. 체력 안배 필수, 강한 파이터!',
  },
  {
    id: '5',
    bizName: '애월 광어좌대',
    region: '애월',
    fish: '광어',
    date: '2026-05-11',
    imageColor: '#1a5a6b',
    weather: '흐림',
    tide: '4물',
    count: '10마리+',
    sizeMax: '68cm',
    content: '광어 고수온 적응 완료. 산오징어 미끼 선호, 수심 25~35m 집중 공략. 흐린 날씨가 오히려 활어 활성화.',
  },
  {
    id: '6',
    bizName: '구좌 벵에돔클럽',
    region: '구좌',
    fish: '감성돔',
    date: '2026-05-11',
    imageColor: '#6b4a1a',
    weather: '맑음',
    tide: '3물',
    count: '8~12마리',
    sizeMax: '38cm',
    content: '갯바위 붙박이 감성돔 시즌 돌입. 구멍찌 0.5호, 크릴 통통한 것으로. 간조 전후 2시간이 황금시간대.',
  },
  {
    id: '7',
    bizName: '한림항 갈치야',
    region: '한림',
    fish: '갈치',
    date: '2026-05-10',
    imageColor: '#1e4080',
    weather: '달밤맑음',
    tide: '9물',
    count: '30마리+',
    sizeMax: '85cm',
    content: '이번 시즌 최대 조황! 세 손가락 넘는 씨알 다수. 발광케미 필수, 밑채비 1m 이상. 만선 기록 경신 중.',
  },
  {
    id: '8',
    bizName: '서귀포 참돔여객선',
    region: '서귀포',
    fish: '참돔',
    date: '2026-05-10',
    imageColor: '#6b1a3e',
    weather: '맑음',
    tide: '8물',
    count: '4~6마리',
    sizeMax: '62cm',
    content: '마라도 인근 참돔 명당 공략. 전유동 채비 추천, 밑밥은 크릴+집어제 혼합. 씨알 굵고 맛도 최고.',
  },
  {
    id: '9',
    bizName: '성산 부시리낚시',
    region: '성산',
    fish: '방어',
    date: '2026-05-10',
    imageColor: '#2d6b1a',
    weather: '구름많음',
    tide: '7물',
    count: '2~4마리',
    sizeMax: '90cm',
    content: '부시리 대물 시즌 개막. 우도 남단 포인트 강추. 포퍼&지깅 복합 전술. 90cm급 대물 출현 확인.',
  },
  {
    id: '10',
    bizName: '모슬포 마라도낚시',
    region: '모슬포',
    fish: '광어',
    date: '2026-05-09',
    imageColor: '#1a4d6b',
    weather: '맑음',
    tide: '6물',
    count: '15마리+',
    sizeMax: '72cm',
    content: '마라도 최남단 포인트 광어 대박. 살아있는 미끼 효과 탁월. 수심 변화 구간 집중 공략 성공.',
  },
];

const FISH_TABS = ['전체', '갈치', '감성돔', '참돔', '방어', '광어'];
const REGION_CHIPS = ['전체', '한림', '애월', '서귀포', '성산', '모슬포'];

function FishSvg({ color }: { color: string }) {
  return (
    <svg
      className="fl-feed-fish"
      viewBox="0 0 160 80"
      style={{
        position: 'absolute',
        right: 20,
        bottom: 16,
        width: 100,
        height: 60,
        opacity: 0.18,
        pointerEvents: 'none',
      }}
    >
      <path
        d="M10 40 Q 50 10, 100 40 T 150 40 L 158 28 L 158 52 Z"
        fill="rgba(255,255,255,0.9)"
      />
      <circle cx="95" cy="37" r="4" fill="rgba(0,0,0,0.5)" />
    </svg>
  );
}

type FeedPost = typeof FEED_POSTS[0];

function FeedCard({ post }: { post: FeedPost }) {
  return (
    <article
      style={{
        background: 'var(--tint-04)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--r-card)',
        overflow: 'hidden',
      }}
    >
      {/* 카드 상단: 업체명 + 지역 배지 + 날짜 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '12px 16px 10px',
        }}
      >
        <span style={{ fontWeight: 700, color: 'var(--text-strong)', fontSize: '0.92rem' }}>
          {post.bizName}
        </span>
        <span
          style={{
            fontSize: '0.68rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 99,
            background: `${post.imageColor}33`,
            color: post.imageColor === '#1e4080' || post.imageColor === '#4a1a6b' || post.imageColor === '#1a5a6b' || post.imageColor === '#1a4d6b'
              ? '#7ab4f5'
              : post.imageColor === '#1a6b3e' || post.imageColor === '#2d6b1a'
                ? '#6bcf8a'
                : '#f09090',
            border: `1px solid ${post.imageColor}55`,
          }}
        >
          📍 {post.region}
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.72rem',
            color: 'var(--text-mute)',
          }}
        >
          {post.date}
        </span>
      </div>

      {/* 컬러 배너 */}
      <div
        style={{
          position: 'relative',
          background: `linear-gradient(135deg, ${post.imageColor}, ${post.imageColor}bb)`,
          padding: '18px 20px',
          minHeight: 90,
          overflow: 'hidden',
        }}
      >
        <FishSvg color={post.imageColor} />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600, letterSpacing: '0.05em' }}>
            {post.fish.toUpperCase()}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
              {post.count}
            </span>
            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
              최대 {post.sizeMax}
            </span>
          </div>
        </div>
      </div>

      {/* 조황 텍스트 */}
      <div
        style={{
          padding: '12px 16px',
          fontSize: '0.85rem',
          color: 'var(--text)',
          lineHeight: 1.65,
          borderBottom: '1px solid var(--line)',
        }}
      >
        {post.content}
      </div>

      {/* 하단: 날씨/물때 배지 + 버튼들 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 6,
          padding: '10px 16px',
        }}
      >
        <span
          style={{
            fontSize: '0.7rem',
            padding: '3px 9px',
            borderRadius: 99,
            background: 'var(--tint-06)',
            color: 'var(--text-dim)',
            border: '1px solid var(--line)',
          }}
        >
          ☀️ {post.weather}
        </span>
        <span
          style={{
            fontSize: '0.7rem',
            padding: '3px 9px',
            borderRadius: 99,
            background: 'var(--tint-06)',
            color: 'var(--text-dim)',
            border: '1px solid var(--line)',
          }}
        >
          🌊 {post.tide}
        </span>
        <button
          style={{
            marginLeft: 'auto',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--hook)',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: '0 4px',
            minHeight: 44,
            fontFamily: 'inherit',
          }}
        >
          자세히 →
        </button>
        <Link
          href="/booking"
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            padding: '0 16px',
            minHeight: 44,
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: 'var(--r-sm)',
            background: 'var(--hook)',
            color: 'var(--ocean-950, #0a1628)',
            textDecoration: 'none',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          예약하기
        </Link>
      </div>
    </article>
  );
}

export default function FeedPage() {
  const [fishTab, setFishTab] = useState('전체');
  const [regionChip, setRegionChip] = useState('전체');

  const filtered = useMemo(() => {
    return FEED_POSTS.filter((p) => {
      const fishOk = fishTab === '전체' || p.fish === fishTab;
      const regionOk = regionChip === '전체' || p.region === regionChip;
      return fishOk && regionOk;
    });
  }, [fishTab, regionChip]);

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .fl-feed-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
      {/* 히어로 */}
      <section className="fl-hero">
        <div className="fl-catch-hero-glow" />
        <div className="fl-tide-hero-inner">
          <div className="fl-catch-hero-kicker">CATCH FEED</div>
          <h1 className="fl-catch-hero-title">
            오늘의 조황 피드
          </h1>
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '0.875rem',
              marginTop: 6,
              lineHeight: 1.6,
            }}
          >
            출조 전날 밤, 업체 실시간 조황으로<br />
            내일 포인트를 정하세요
          </p>
          <div className="fl-catch-hero-meta" style={{ marginTop: 14 }}>
            <span>🐟 {FEED_POSTS.length}건 조황</span>
            <span className="fl-cond-sep" />
            <span>📍 6개 지역</span>
          </div>
        </div>
        <svg className="fl-wave fl-wave-2" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,50 C80,30 160,70 240,50 C320,30 360,60 400,50 L400,80 L0,80 Z" />
        </svg>
        <svg className="fl-wave fl-wave-1" viewBox="0 0 400 80" preserveAspectRatio="none">
          <path d="M0,60 C70,50 140,75 210,62 C280,48 340,68 400,58 L400,80 L0,80 Z" />
        </svg>
      </section>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px' }}>
        {/* 어종 탭 */}
        <div className="fl-cm-tabs" style={{ marginTop: 20 }}>
          {FISH_TABS.map((tab) => (
            <button
              key={tab}
              className={`fl-tab ${fishTab === tab ? 'on' : ''}`}
              onClick={() => setFishTab(tab)}
              style={{ fontFamily: 'inherit' }}
            >
              {tab}
              {fishTab === tab && <span className="fl-tab-underline" />}
            </button>
          ))}
        </div>

        {/* 지역 칩 */}
        <div className="fl-chips" style={{ marginTop: 10, marginBottom: 20 }}>
          {REGION_CHIPS.map((chip) => (
            <button
              key={chip}
              className={`fl-chip ${regionChip === chip ? 'on' : ''}`}
              onClick={() => setRegionChip(chip)}
              style={{ fontFamily: 'inherit' }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* 결과 수 */}
        <div className="fl-feed-result" style={{ marginBottom: 12 }}>
          <span>
            <strong>{filtered.length}</strong>건의 조황 포스팅
          </span>
        </div>

        {/* 피드 카드 리스트 */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 0',
              color: 'var(--text-mute)',
              fontSize: '0.9rem',
            }}
          >
            해당 조건의 조황이 없습니다
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: 16,
            }}
            className="fl-feed-grid"
          >
            {filtered.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* 업체 CTA 배너 */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--tint-06), var(--tint-05))',
            border: '1px solid var(--line-2)',
            borderRadius: 'var(--r-card)',
            padding: '20px 24px',
            marginTop: 12,
            marginBottom: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 700,
                color: 'var(--text-strong)',
                fontSize: '0.95rem',
                marginBottom: 4,
              }}
            >
              업체라면? 조황 올리고 예약 받기
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              매일 조황 포스팅으로 단골 낚시객을 늘려보세요
            </div>
          </div>
          <Link
            href="/biz"
            style={{
              padding: '10px 22px',
              borderRadius: 'var(--r-sm)',
              background: 'var(--hook)',
              color: 'var(--ocean-950, #0a1628)',
              fontWeight: 800,
              fontSize: '0.85rem',
              textDecoration: 'none',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            사장님 등록 →
          </Link>
        </div>
      </div>
    </>
  );
}
