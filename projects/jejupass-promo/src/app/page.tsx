'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BRAND } from '@/lib/constants';

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "제주패스",
  url: "https://jejupass.com/web",
  description: "제주 소상공인을 위한 무료 마케팅 플랫폼",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://jejupass.com/web/explore?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// ── 히어로 인스타 Mockup ─────────────────────────────────
function InstaMockup() {
  return (
    <div className="relative">
      {/* 메인 폰 */}
      <div className="relative mx-auto" style={{ width: 280 }}>
        <div className="rounded-[36px] bg-slate-900 p-2 shadow-2xl">
          <div className="rounded-[28px] bg-white overflow-hidden">
            {/* 상태바 */}
            <div className="bg-slate-900 text-white text-[10px] font-mono flex justify-between px-5 py-1.5">
              <span>9:41</span>
              <span>●●●● 5G</span>
            </div>
            {/* 인스타 헤더 */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full p-[3px]"
                  style={{ background: 'linear-gradient(45deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)' }}
                >
                  <div className="w-7 h-7 rounded-full bg-orange-100 grid place-items-center text-orange-700 text-[10px] font-extrabold">제</div>
                </div>
                <div>
                  <p className="text-xs font-extrabold leading-none">jeju_cafe_seogwipo</p>
                  <p className="text-[9px] text-slate-400 leading-none mt-0.5">서귀포 · 카페</p>
                </div>
              </div>
              <span className="text-slate-400">⋯</span>
            </div>
            {/* 인스타 이미지 */}
            <div
              className="relative aspect-square grid place-items-center"
              style={{ background: 'repeating-linear-gradient(45deg, #fef3e8, #fef3e8 8px, #fed7aa 8px, #fed7aa 16px)' }}
            >
              <div className="absolute inset-3 rounded-2xl bg-white/90 backdrop-blur grid place-items-center text-center px-3">
                <div>
                  <p className="text-[9px] font-mono text-orange-500 uppercase tracking-widest">신메뉴 · NEW</p>
                  <p className="font-black text-lg text-slate-900 mt-1 leading-tight">한라봉 라떼<br />출시</p>
                  <p className="text-[10px] text-slate-500 mt-1">오직 봄에만</p>
                </div>
              </div>
              <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-white/90 font-mono text-orange-600 font-bold">
                AI 자동생성
              </span>
            </div>
            {/* 액션 바 */}
            <div className="px-3 py-2.5 flex items-center gap-3 text-slate-700 text-sm">
              <span>♡</span><span>💬</span><span>↗</span>
              <span className="ml-auto">⌳</span>
            </div>
            {/* 캡션 */}
            <div className="px-3 pb-3 text-[11px]">
              <p className="font-extrabold">좋아요 247개</p>
              <p className="mt-0.5">
                <span className="font-extrabold">jeju_cafe_seogwipo</span>{' '}
                봄에만 만나는 한라봉 라떼 🍊 #서귀포카페 #한라봉
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 플로팅 배지들 */}
      <div className="hidden lg:block absolute -left-14 top-16 bg-white rounded-2xl shadow-xl p-3 border border-slate-100 -rotate-6">
        <p className="text-[9px] font-mono text-slate-400 uppercase">생성 시간</p>
        <p className="font-black text-2xl tabular-nums text-slate-900">
          8<span className="text-sm text-slate-500 font-bold">초</span>
        </p>
      </div>
      <div className="hidden lg:block absolute -right-10 top-32 bg-white rounded-2xl shadow-xl p-3 border border-slate-100 rotate-[5deg]">
        <p className="text-[9px] font-mono text-slate-400 uppercase">월 노출</p>
        <p className="font-black text-2xl tabular-nums text-orange-600">+12K</p>
      </div>
      <div className="hidden lg:block absolute -left-6 -bottom-4 bg-slate-900 text-white rounded-2xl shadow-xl p-3 -rotate-3">
        <p className="text-[9px] font-mono text-orange-300 uppercase">렌터카 동선</p>
        <p className="font-black text-lg leading-tight">자연스러운<br />유입 ↗</p>
      </div>
    </div>
  );
}

// ── 스텝 미니 Mockup ─────────────────────────────────────
function StepMockup({ kind }: { kind: 'info' | 'photo' | 'sns' }) {
  if (kind === 'info') return (
    <div className="rounded-xl bg-white border border-slate-200 p-2.5 space-y-1.5">
      <div className="h-1.5 rounded bg-slate-200 w-1/3"></div>
      <div className="h-5 rounded bg-orange-50 border border-orange-200 px-1.5 flex items-center">
        <span className="text-[8px] font-mono text-orange-600">제주카페로컬</span>
      </div>
      <div className="h-1.5 rounded bg-slate-200 w-1/4"></div>
      <div className="grid grid-cols-3 gap-1">
        <div className="h-4 rounded bg-orange-100 border border-orange-200"></div>
        <div className="h-4 rounded bg-slate-100"></div>
        <div className="h-4 rounded bg-slate-100"></div>
      </div>
    </div>
  );
  if (kind === 'photo') return (
    <div className="rounded-xl bg-white border border-slate-200 p-2.5">
      <div className="grid grid-cols-3 gap-1">
        {[0,1,2,3,4].map(i => (
          <div
            key={i}
            className="aspect-square rounded"
            style={{ background: 'repeating-linear-gradient(45deg, #fef3e8, #fef3e8 8px, #fed7aa 8px, #fed7aa 16px)' }}
          />
        ))}
        <div className="aspect-square rounded border-2 border-dashed border-orange-300 grid place-items-center text-orange-400 text-xs">+</div>
      </div>
    </div>
  );
  return (
    <div className="rounded-xl bg-slate-900 p-2.5 grid grid-cols-2 gap-1">
      <div
        className="aspect-square rounded p-1.5 text-white"
        style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
      >
        <p className="text-[7px] font-mono opacity-60 uppercase">메인</p>
        <p className="text-[10px] font-black mt-1 leading-tight">한라봉<br />라떼</p>
      </div>
      <div className="aspect-square rounded bg-white p-1.5">
        <div className="h-1 rounded bg-slate-200 w-2/3"></div>
        <div className="h-1 rounded bg-slate-200 mt-1 w-1/2"></div>
        <div
          className="mt-1.5 h-6 rounded"
          style={{ background: 'repeating-linear-gradient(45deg, #fef3e8, #fef3e8 8px, #fed7aa 8px, #fed7aa 16px)' }}
        />
        <div className="mt-1 h-1 rounded bg-orange-300"></div>
      </div>
    </div>
  );
}

// ── FAQ 아이템 (상태 필요) ────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(0);
  const items = [
    {
      q: '정말로 무료인가요? 숨은 비용이 있나요?',
      a: '네, 가입비·월 사용료·수수료 모두 0원입니다. 카페패스 입점 같은 추가 옵션은 별도로 안내해드립니다.',
    },
    {
      q: '사진만 올리면 정말 콘텐츠가 만들어지나요?',
      a: 'AI가 가게 정보와 사진을 분석해 인스타 피드/스토리/카카오 공유 카드를 자동으로 생성합니다. 다운로드 후 바로 사용 가능합니다.',
    },
    {
      q: '렌터카 손님이 정말 우리 가게로 오나요?',
      a: 'jeju-map에서 차량 검색 후 근처 카페/맛집을 함께 보여줍니다. 동선 위에 자연스럽게 노출되는 구조입니다.',
    },
    {
      q: '예약 관리는 어떻게 하나요?',
      a: '사장님 대시보드에서 예약/정산/리뷰를 한 화면에서 관리합니다. 별도 시스템 필요 없습니다.',
    },
    {
      q: '언제든 그만둘 수 있나요?',
      a: '네, 언제든 등록 해지 가능하며 별도 위약금이 없습니다.',
    },
  ];
  return (
    <section className="px-6 lg:px-10 py-20 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange-500 font-bold">FAQ</p>
          <h2 className="text-4xl lg:text-5xl font-extrabold mt-3 tracking-tight text-slate-900">자주 묻는 질문</h2>
        </div>
        <div className="border-t border-slate-200">
          {items.map((it, i) => (
            <div key={i} className="border-b border-slate-200">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between py-5 text-left hover:bg-slate-50 px-2 -mx-2 rounded-lg"
              >
                <span className="font-extrabold text-base text-slate-900 pr-6">{it.q}</span>
                <span
                  className={`w-6 h-6 rounded-full grid place-items-center text-orange-600 font-extrabold transition-transform flex-shrink-0 ${
                    open === i ? 'bg-orange-100 rotate-45' : 'bg-slate-100'
                  }`}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="pb-5 text-slate-600 leading-relaxed pr-10">{it.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafaf7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      {/* ── 네비게이션 ── */}
      <nav className="px-6 lg:px-10 h-14 border-b border-slate-200 bg-white sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 grid place-items-center text-white font-black text-sm">제</div>
          <span className="font-extrabold text-slate-900">제주패스</span>
          <span className="font-mono text-[10px] text-slate-400 ml-1">promo</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-700">
          <Link href="/explore" className="hover:text-orange-600">가게 탐색</Link>
          <Link href="/signup" className="hover:text-orange-600">사업자 안내</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-orange-600">로그인</Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold rounded-xl transition-colors"
          >
            무료 등록
          </Link>
        </div>
      </nav>

      <main>
        {/* ── 히어로 ── */}
        <section className="px-6 lg:px-10 py-16 lg:py-24 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center max-w-6xl mx-auto">
            {/* 텍스트 */}
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-orange-100 text-orange-700">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                완전 무료 · 가입비 없음 · 수수료 없음
              </span>
              <h1 className="text-4xl lg:text-[56px] font-extrabold leading-[1.1] tracking-tight mt-5 text-slate-900">
                마케팅 할 시간도,<br />
                <span className="relative inline-block">
                  돈도 없는
                  <span className="absolute -bottom-1 left-0 right-0 h-3 bg-orange-200/70 -z-10"></span>
                </span><br />
                제주 사장님께
              </h1>
              <p className="text-lg text-slate-600 mt-6 leading-relaxed">
                <strong>사진만 올리면</strong> 인스타그램 콘텐츠가 자동으로 만들어지고,<br />
                제주패스를 찾는 <strong>월 12만 여행객</strong>에게 가게가 노출됩니다.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-8">
                <Link
                  href="/signup"
                  className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-base font-extrabold rounded-2xl shadow-lg shadow-orange-200 transition-colors"
                >
                  3분 만에 무료 등록하기 →
                </Link>
                <Link
                  href="/explore"
                  className="px-6 py-3.5 border border-slate-300 bg-white text-slate-800 text-base font-bold rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  등록된 가게 둘러보기
                </Link>
              </div>

              {/* 소셜 프루프 */}
              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-2">
                  {(['카', '맛', '펜', '책'] as const).map((label, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-white grid place-items-center text-orange-700 text-xs font-extrabold"
                      style={{ background: 'repeating-linear-gradient(45deg, #fef3e8, #fef3e8 8px, #fed7aa 8px, #fed7aa 16px)' }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-900">350+ 사장님</strong>이 함께하고 있어요
                </p>
              </div>
            </div>

            {/* 우측 비주얼 */}
            <div className="relative flex justify-center lg:justify-end">
              <InstaMockup />
            </div>
          </div>
        </section>

        {/* ── PAIN → SOLUTION ── */}
        <section className="px-6 lg:px-10 py-20 bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange-500 font-bold">PAIN → SOLUTION</p>
              <h2 className="text-4xl lg:text-5xl font-extrabold mt-3 tracking-tight text-slate-900">사장님의 고민, 다 압니다</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  n: '01',
                  q: '인스타 매일 올리기 부담돼요',
                  a: '사진만 주세요. AI가 카드/스토리/공유 이미지를 만들어요.',
                },
                {
                  n: '02',
                  q: '광고비 쓰자니 효과가 의심돼요',
                  a: '렌터카 여행객 동선을 따라 자연 유입되는 구조입니다.',
                },
                {
                  n: '03',
                  q: '예약 관리, 정산이 너무 복잡해요',
                  a: '한 화면에서 예약/정산/리뷰까지 모두 봅니다.',
                },
              ].map((p) => (
                <div key={p.n} className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 p-6 border-b border-slate-200">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">PROBLEM {p.n}</span>
                    <p className="text-xl font-extrabold text-slate-900 mt-2 leading-snug">"{p.q}"</p>
                  </div>
                  <div className="bg-white p-6">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-orange-600 uppercase tracking-widest mb-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500 grid place-items-center text-white text-[8px]">✓</span>
                      SOLUTION
                    </span>
                    <p className="text-base text-slate-700 leading-relaxed">{p.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 동선 다이어그램 (Flow) ── */}
        <section className="px-6 lg:px-10 py-20 bg-slate-900 text-white relative overflow-hidden">
          {/* 그레인 텍스처 */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,0,0,0.025) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-14">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange-400 font-bold">PRODUCT FLOW</p>
              <h2 className="text-4xl lg:text-5xl font-extrabold mt-3 tracking-tight">
                렌터카 → 가게,<br />자연스러운 동선
              </h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base leading-relaxed">
                제주패스는 렌터카 비교 서비스입니다. 여행 준비 중인 고객이 근처 카페·맛집을 탐색하다 가게를 발견합니다. 광고 없이 유입되는 구조.
              </p>
            </div>

            {/* 4단계 카드 */}
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { n: '1', t: '렌터카 검색', s: 'jeju-map에서 가격 비교' },
                { n: '2', t: '근처 가게 탐색', s: '지도 위 카페·맛집 마커' },
                { n: '3', t: '사장님 페이지 진입', s: 'AI가 만든 인스타 카드 발견' },
                { n: '4', t: '방문 / 예약', s: '카페패스로 단골 전환' },
              ].map((s, i) => (
                <div key={i} className="relative">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5">
                    <div className="w-9 h-9 rounded-xl bg-orange-500 grid place-items-center font-extrabold text-white">
                      {s.n}
                    </div>
                    <p className="text-base font-extrabold mt-3">{s.t}</p>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.s}</p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-orange-400 text-2xl z-10">
                      →
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 입점 통계 바 */}
            <div className="mt-10 grid grid-cols-3 gap-3 text-center">
              {[
                ['12만+', '월 활성 여행객'],
                ['350+', '등록 가게'],
                ['98%', '사장님 만족도'],
              ].map(([n, l]) => (
                <div key={n} className="bg-white/5 rounded-xl py-5 border border-white/10">
                  <p className="text-3xl lg:text-4xl font-extrabold text-orange-400 tabular-nums">{n}</p>
                  <p className="text-xs text-slate-400 mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 STEPS ── */}
        <section className="px-6 lg:px-10 py-20 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange-500 font-bold">3 STEPS</p>
              <h2 className="text-4xl lg:text-5xl font-extrabold mt-3 tracking-tight text-slate-900">3분이면 충분해요</h2>
              <p className="text-slate-500 mt-4">시간 없는 사장님을 위해, 정말 필요한 것만 받아요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  n: '01',
                  t: '가게 정보 입력',
                  s: '상호·카테고리·주소만 입력하세요. 1분이면 끝.',
                  kind: 'info' as const,
                  time: '≈ 1분',
                },
                {
                  n: '02',
                  t: '사진 올리기',
                  s: '매장·메뉴 사진 5장 이상 업로드. 일반 휴대폰으로 찍어도 OK.',
                  kind: 'photo' as const,
                  time: '≈ 1분',
                },
                {
                  n: '03',
                  t: 'SNS 콘텐츠 받기',
                  s: 'AI가 인스타·스토리·카카오 카드를 자동 생성. 다운로드해서 바로 업로드.',
                  kind: 'sns' as const,
                  time: '≈ 30초',
                },
              ].map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl bg-slate-50 border border-slate-200 p-6 hover:border-orange-300 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-5xl font-extrabold text-orange-500/30 font-mono">{step.n}</span>
                    <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-bold">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-900">{step.t}</p>
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{step.s}</p>
                  <div className="mt-5">
                    <StepMockup kind={step.kind} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 사장님 후기 ── */}
        <section className="px-6 lg:px-10 py-20 bg-orange-50/40">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-orange-500 font-bold">TESTIMONIALS</p>
                <h2 className="text-4xl lg:text-5xl font-extrabold mt-3 tracking-tight text-slate-900">
                  사장님들의 진짜 후기
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex">
                  {[0,1,2,3,4].map(i => (
                    <span key={i} className="text-orange-500">★</span>
                  ))}
                </div>
                <span className="font-extrabold text-slate-900">4.9</span>
                <span className="text-slate-500">/ 264 후기</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  name: '김민지 사장님',
                  shop: '서귀포 한라봉카페',
                  t: '매일 인스타 올리는 게 너무 부담이었는데, 사진만 올리면 카드를 만들어줘서 너무 편해요.',
                  metric: '+340%',
                  metricLabel: '월 방문 증가',
                },
                {
                  name: '박정훈 사장님',
                  shop: '협재 흑돼지식당',
                  t: '렌터카 빌리러 온 손님들이 점심 먹으러 자주 와요. 광고 안 했는데 신기했어요.',
                  metric: '+85명',
                  metricLabel: '월 신규 방문',
                },
                {
                  name: '이수영 사장님',
                  shop: '함덕 게스트하우스',
                  t: '예약·정산이 한 화면이라 직접 엑셀 안 써도 돼서 시간이 확 줄었어요.',
                  metric: '2시간',
                  metricLabel: '주간 절약',
                },
              ].map((x, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex">
                    {[0,1,2,3,4].map(j => (
                      <span key={j} className="text-orange-500">★</span>
                    ))}
                  </div>
                  <p className="text-base text-slate-800 mt-3 leading-relaxed">"{x.t}"</p>
                  <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-full"
                        style={{ background: 'repeating-linear-gradient(45deg, #fef3e8, #fef3e8 8px, #fed7aa 8px, #fed7aa 16px)' }}
                      />
                      <div>
                        <p className="text-sm font-extrabold text-slate-900">{x.name}</p>
                        <p className="text-[11px] text-slate-500">{x.shop}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-extrabold text-orange-600 tabular-nums">{x.metric}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{x.metricLabel}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQSection />

        {/* ── CTA split ── */}
        <section className="px-6 lg:px-10 py-20">
          <div
            className="max-w-6xl mx-auto rounded-[32px] overflow-hidden grid grid-cols-1 lg:grid-cols-2 text-white"
            style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}
          >
            {/* 좌: 등록 CTA */}
            <div className="p-10 lg:p-14">
              <p className="font-mono text-xs uppercase tracking-widest opacity-80">JOIN US</p>
              <h2 className="text-4xl lg:text-5xl font-extrabold mt-3 leading-[1.1]">
                지금 시작하면<br />오늘 저녁부터<br />인스타가 채워져요
              </h2>
              <p className="opacity-90 mt-5 text-lg">완전 무료, 가입비도 수수료도 없습니다.</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  href="/signup"
                  className="px-6 py-3.5 bg-white text-orange-600 font-extrabold rounded-2xl shadow-xl hover:shadow-2xl transition-shadow"
                >
                  무료로 가게 등록하기 →
                </Link>
              </div>
            </div>
            {/* 우: 연락처 */}
            <div className="bg-white/10 backdrop-blur p-10 lg:p-14 border-t lg:border-t-0 lg:border-l border-white/20">
              <p className="font-mono text-xs uppercase tracking-widest opacity-80">CONTACT</p>
              <p className="text-2xl font-extrabold mt-3">대화로 진행하고 싶으세요?</p>
              <div className="space-y-4 mt-6">
                {[
                  ['📞', '전화 상담', '평일 10:00–18:00', '064-XXX-XXXX'],
                  ['💬', '카카오톡 상담', '24시간 접수', '@제주패스'],
                  ['📧', '이메일', '24시간 내 회신', 'help@jejupass.com'],
                ].map(([emoji, t, sub, val]) => (
                  <div key={t} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 grid place-items-center text-lg flex-shrink-0">
                      {emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold">{t}</p>
                      <p className="text-xs opacity-70">{sub}</p>
                    </div>
                    <span className="font-mono text-sm font-bold opacity-90">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="px-6 lg:px-10 py-10 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500 grid place-items-center text-white font-extrabold text-xs">제</div>
            <span className="font-extrabold text-slate-900">제주패스</span>
            <span className="font-mono text-[10px] text-slate-400 ml-1">(주)캐플릭스 · {BRAND.url}</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-xs">
            <a href="#" className="hover:text-orange-600">이용약관</a>
            <a href="#" className="hover:text-orange-600">개인정보처리방침</a>
            <a href="#" className="hover:text-orange-600">사업자 정보</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
