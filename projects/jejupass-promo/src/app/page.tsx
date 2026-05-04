'use client';

import Link from 'next/link';
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

export default function Home() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/explore" className="text-gray-600 hover:text-gray-900">가게 탐색</Link>
            <Link href="/signup" className="px-3 py-1.5 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: BRAND.color }}>
              무료 등록
            </Link>
          </nav>
        </div>
      </header>


      {/* Main content */}
      <main>
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: BRAND.colorLight, color: BRAND.color }}>
            완전 무료 · 가입비 없음 · 수수료 없음
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            마케팅 할 시간도, 돈도 없는<br />
            제주 사장님을 위해 만들었어요
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            사진만 올리면 인스타그램 콘텐츠가 자동으로 만들어지고,<br />
            제주패스를 찾는 여행객에게 가게가 노출됩니다.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-xl text-white font-semibold text-base shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: BRAND.color }}
            >
              3분 만에 무료 등록하기
            </Link>
            <Link
              href="/explore"
              className="px-8 py-3 rounded-xl text-gray-700 font-semibold text-base border border-gray-200 hover:bg-gray-50"
            >
              등록된 가게 보기
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">이미 제주패스에는 매월 수만 명의 여행객이 방문합니다</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">이렇게 도와드려요</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                emoji: '📸',
                title: 'SNS 콘텐츠 자동 생성',
                desc: '사진만 올리면 인스타 카드, 스토리, 카카오톡 공유 카드를 AI가 자동으로 만들어드려요.',
              },
              {
                emoji: '🔍',
                title: '제주 여행객에게 노출',
                desc: '렌트카 예약하러 온 여행객이 가게를 발견합니다. 별도 광고비 없이 자연스럽게.',
              },
              {
                emoji: '☕',
                title: '카페패스 입점으로 성장',
                desc: '반응이 좋은 가게에는 카페패스 입점을 제안해드려요. 구독 고객의 안정적인 방문이 시작됩니다.',
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 text-center">
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 여행객 유입 퍼널 섹션 */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid sm:grid-cols-2">
              <div className="p-8">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">제주패스 생태계</span>
                <h2 className="text-xl font-bold text-gray-900 mt-2 leading-snug">
                  렌트카 예약객이<br />자연스럽게 가게를 찾아옵니다
                </h2>
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">
                  제주패스는 렌트카 비교 서비스입니다. 여행 준비 중인 고객이 근처 카페·맛집을 탐색하고, 가게를 발견합니다.
                </p>
                <div className="mt-5 space-y-2">
                  {['렌트카 예약', '근처 카페·맛집 탐색', '내 가게 발견 & 방문'].map((step, i) => (
                    <div key={step} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: BRAND.color }}>
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center items-center text-center" style={{ backgroundColor: BRAND.colorLight }}>
                <div className="text-4xl mb-3">🚗 → ☕</div>
                <p className="text-sm font-semibold text-gray-800">렌트카 여행객의 자연스러운 동선</p>
                <p className="text-xs text-gray-500 mt-1">광고 없이도 유입되는 구조</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">3분이면 충분해요</h2>
          <div className="space-y-6">
            {[
              { step: '1', title: '가게 정보 입력', desc: '상호명, 카테고리, 주소만 입력하세요.' },
              { step: '2', title: '사진 올리기', desc: '매장 사진, 메뉴 사진을 올려주세요.' },
              { step: '3', title: 'SNS 콘텐츠 받기', desc: '인스타 카드가 자동으로 만들어집니다. 다운로드해서 바로 올리세요.' },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: BRAND.color }}
                >
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ backgroundColor: BRAND.colorLight }}>
        <h2 className="text-2xl font-bold text-gray-900">지금 바로 시작하세요</h2>
        <p className="text-gray-500 mt-2">완전 무료, 가입비도 수수료도 없습니다.</p>
        <Link
          href="/signup"
          className="inline-block mt-6 px-8 py-3 rounded-xl text-white font-semibold shadow-lg"
          style={{ backgroundColor: BRAND.color }}
        >
          무료로 가게 등록하기
        </Link>
      </section>

      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-xs text-gray-400 border-t border-gray-100">
        <p>(주)캐플릭스 · {BRAND.url}</p>
      </footer>
    </div>
  );
}
