'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';

const BENEFITS = [
  { icon: '👥', label: '월 평균 200~500명 방문' },
  { icon: '💳', label: '결제 보장' },
  { icon: '📱', label: '제주패스 앱 메인 노출' },
];

const CRITERIA = [
  { icon: '📷', label: '사진 품질' },
  { icon: '🍽️', label: '메뉴 다양성' },
  { icon: '🧹', label: '위생 등급' },
  { icon: '⭐', label: '리뷰 평점' },
];

export default function CafepassPage() {
  const [form, setForm] = useState({
    cafeName: '우리 카페',
    menu1: '',
    menu2: '',
    menu3: '',
    vibe: '',
    instagram: '',
  });
  const [submitted, setSubmitted] = useState(false);

function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 border border-gray-200 max-w-sm w-full text-center shadow-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">신청이 접수되었습니다.</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            7일 내 검토 결과를 안내드립니다.<br />카페패스 담당자가 직접 연락드릴 예정입니다.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block w-full text-center text-sm font-semibold text-white py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND.color }}
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm text-gray-500">← 대시보드</Link>
          <span className="font-bold text-base" style={{ color: BRAND.color }}>제주패스</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">☕ 카페패스 입점 신청</h1>
          <p className="text-sm text-gray-500 mt-1">선별된 제주 카페만 입점 가능합니다. 검토 후 7일 내 결과를 안내드립니다.</p>
        </div>

        {/* 섹션 1: 카페패스란? */}
        <section className="bg-white rounded-2xl p-6 border border-gray-200 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">카페패스란?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            제주패스 앱 내 카페 전용 패스 상품입니다. 관광객이 카페패스를 구매하면 입점된 카페를 자유롭게 방문할 수 있으며, 가게는 안정적인 고객 유입과 결제 보장을 누립니다.
          </p>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">입점 시 혜택</p>
            <div className="grid grid-cols-3 gap-3">
              {BENEFITS.map((b) => (
                <div key={b.label} className="rounded-xl p-3 text-center border border-orange-100" style={{ backgroundColor: BRAND.colorLight }}>
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <p className="text-xs font-medium text-orange-800">{b.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">선정 기준</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CRITERIA.map((c) => (
                <div key={c.label} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-xs text-gray-700 font-medium">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 섹션 2: 입점 신청 폼 */}
        <section className="bg-white rounded-2xl p-6 border border-gray-200">
          <h2 className="font-bold text-gray-900 text-lg mb-5">입점 신청 폼</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 카페명 */}
            <div>
              <label htmlFor="cafeName" className="block text-sm font-medium text-gray-700 mb-1">
                카페명
              </label>
              <input
                id="cafeName"
                name="cafeName"
                type="text"
                value={form.cafeName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            {/* 대표 메뉴 3가지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">대표 메뉴 3가지</label>
              <div className="space-y-2">
                {(['menu1', 'menu2', 'menu3'] as const).map((key, i) => (
                  <input
                    key={key}
                    id={key}
                    name={key}
                    type="text"
                    placeholder={`메뉴 ${i + 1} (예: 감귤 에이드)`}
                    value={form[key]}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    required
                  />
                ))}
              </div>
            </div>

            {/* 카페 특징/분위기 */}
            <div>
              <label htmlFor="vibe" className="block text-sm font-medium text-gray-700 mb-1">
                카페 특징 / 분위기
              </label>
              <textarea
                id="vibe"
                name="vibe"
                rows={4}
                placeholder="예: 오션뷰, 원목 인테리어, 조용한 분위기, 반려동물 동반 가능 등"
                value={form.vibe}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                required
              />
            </div>

            {/* 인스타그램 */}
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                인스타그램 계정 <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <input
                id="instagram"
                name="instagram"
                type="text"
                placeholder="@your_cafe"
                value={form.instagram}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>

            {/* 대표 사진 안내 */}
            <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50 p-4 space-y-2">
              <p className="text-sm font-medium text-orange-800">📷 대표 사진 안내</p>
              <p className="text-xs text-orange-700 leading-relaxed">
                고품질 사진 3장 이상 필요합니다. SNS 콘텐츠 생성 도구로 만든 사진을 추천드려요.
              </p>
              <Link
                href="/dashboard/sns"
                className="inline-block text-xs font-semibold text-white px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90"
                style={{ backgroundColor: BRAND.color }}
              >
                SNS 사진 만들러 가기
              </Link>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full text-sm font-semibold text-white py-3.5 rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRAND.color }}
            >
              입점 신청하기
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
