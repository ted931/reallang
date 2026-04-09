'use client';

import Link from 'next/link';
import { BRAND } from '@/lib/constants';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <Link href="/explore" className="text-sm text-gray-500">탐색</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">사장님 대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">내 가게를 관리하고 SNS 콘텐츠를 만들어보세요.</p>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Link href="/dashboard/sns" className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all">
            <div className="text-3xl mb-3">📸</div>
            <h2 className="font-bold text-gray-900">SNS 콘텐츠 만들기</h2>
            <p className="text-sm text-gray-500 mt-1">인스타그램 카드, 스토리, 카카오톡 공유 카드를 자동 생성</p>
          </Link>

          <Link href="/register" className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all">
            <div className="text-3xl mb-3">🏪</div>
            <h2 className="font-bold text-gray-900">새 가게 등록</h2>
            <p className="text-sm text-gray-500 mt-1">새로운 가게를 등록하고 홍보를 시작하세요</p>
          </Link>

          <Link href="/explore" className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all">
            <div className="text-3xl mb-3">🔍</div>
            <h2 className="font-bold text-gray-900">가게 탐색</h2>
            <p className="text-sm text-gray-500 mt-1">등록된 제주 가게들을 둘러보세요</p>
          </Link>

          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
            <div className="text-3xl mb-3">💡</div>
            <h2 className="font-bold text-gray-900">팁</h2>
            <p className="text-sm text-gray-500 mt-1">사진이 예쁠수록 SNS 콘텐츠 효과가 좋아요. 밝은 자연광에서 찍어보세요!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
