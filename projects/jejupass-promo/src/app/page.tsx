'use client';

import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</span>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/explore" className="text-gray-600 hover:text-gray-900">가게 탐색</Link>
            <Link href="/register" className="px-3 py-1.5 rounded-lg text-white text-sm font-medium" style={{ backgroundColor: BRAND.color }}>
              무료 등록
            </Link>
          </nav>
        </div>
      </header>


      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            제주 사장님,<br />
            <span style={{ color: BRAND.color }}>무료</span>로 가게를 홍보하세요
          </h1>
          <p className="mt-4 text-gray-500 text-lg">
            사진만 올리면 인스타그램 콘텐츠를 자동으로 만들어드립니다.
            <br />
            SNS 마케팅, 더 이상 어렵지 않아요.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 rounded-xl text-white font-semibold text-base shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: BRAND.color }}
            >
              무료로 시작하기
            </Link>
            <Link
              href="/explore"
              className="px-8 py-3 rounded-xl text-gray-700 font-semibold text-base border border-gray-200 hover:bg-gray-50"
            >
              가게 둘러보기
            </Link>
          </div>
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
                desc: '사진만 올리면 인스타 카드, 스토리, 카카오톡 공유 카드를 자동으로 만들어드려요.',
              },
              {
                emoji: '🔍',
                title: '검색에 자동 노출',
                desc: '가게 페이지가 구글/네이버 검색에 최적화되어 여행객이 쉽게 찾을 수 있어요.',
              },
              {
                emoji: '☕',
                title: '카페패스 입점 기회',
                desc: '인기 가게에는 카페패스 입점을 제안해드려요. 안정적인 고객 유입이 가능해요.',
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
          href="/register"
          className="inline-block mt-6 px-8 py-3 rounded-xl text-white font-semibold shadow-lg"
          style={{ backgroundColor: BRAND.color }}
        >
          무료로 가게 등록하기
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-xs text-gray-400 border-t border-gray-100">
        <p>(주)캐플릭스 · {BRAND.url}</p>
      </footer>
    </div>
  );
}
