'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND } from '@/lib/constants';

// ─── 데이터 ───────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: '1day',
    name: '1일권',
    days: 1,
    price: 12000,
    original: 18000,
    perks: ['음료 1잔 무료', '디저트 20% 할인'],
  },
  {
    id: '3day',
    name: '3일권',
    days: 3,
    price: 29000,
    original: 48000,
    perks: ['음료 1잔 무료', '디저트 20% 할인', '와이파이 무료', '픽업 우선'],
    best: true,
  },
  {
    id: '7day',
    name: '7일권',
    days: 7,
    price: 55000,
    original: 98000,
    perks: ['모든 혜택', '동반 1인 50% 할인', '한정 메뉴', '전용 라운지'],
  },
];

const CAFES = [
  { name: '봄날 — 애월', region: '애월', tag: '오션뷰', icon: '☕', dist: '2.1km' },
  { name: '슬로우 — 협재', region: '협재', tag: '노을맛집', icon: '🌅', dist: '5.4km' },
  { name: '무무 비건', region: '표선', tag: '비건·브런치', icon: '🥗', dist: '8.0km' },
  { name: '책방 베니스', region: '표선', tag: '책방+커피', icon: '📚', dist: '7.6km' },
  { name: '온더록 — 한림', region: '한림', tag: '베이커리', icon: '🥐', dist: '3.2km' },
  { name: '아일랜드 코너', region: '성산', tag: '프렌치', icon: '🥖', dist: '12km' },
];

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

// ─── 카페 신청 폼 ─────────────────────────────────────────────────────────────

function ApplyForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState({
    cafeName: '우리 카페',
    menu1: '',
    menu2: '',
    menu3: '',
    vibe: '',
    instagram: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmitted();
  }

  return (
    <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <h2 className="font-extrabold text-slate-900 text-lg mb-5">입점 신청 폼</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 카페명 */}
        <div>
          <label htmlFor="cafeName" className="block text-sm font-bold text-slate-700 mb-1">
            카페명
          </label>
          <input
            id="cafeName"
            name="cafeName"
            type="text"
            value={form.cafeName}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            required
          />
        </div>

        {/* 대표 메뉴 3가지 */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">대표 메뉴 3가지</label>
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
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                required
              />
            ))}
          </div>
        </div>

        {/* 카페 특징/분위기 */}
        <div>
          <label htmlFor="vibe" className="block text-sm font-bold text-slate-700 mb-1">
            카페 특징 / 분위기
          </label>
          <textarea
            id="vibe"
            name="vibe"
            rows={4}
            placeholder="예: 오션뷰, 원목 인테리어, 조용한 분위기, 반려동물 동반 가능 등"
            value={form.vibe}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
            required
          />
        </div>

        {/* 인스타그램 */}
        <div>
          <label htmlFor="instagram" className="block text-sm font-bold text-slate-700 mb-1">
            인스타그램 계정 <span className="text-slate-400 font-normal">(선택)</span>
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            placeholder="@your_cafe"
            value={form.instagram}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>

        {/* 대표 사진 안내 */}
        <div className="rounded-xl border border-dashed border-amber-200 bg-amber-50 p-4 space-y-2">
          <p className="text-sm font-extrabold text-amber-800">📷 대표 사진 안내</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            고품질 사진 3장 이상 필요합니다. SNS 콘텐츠 생성 도구로 만든 사진을 추천드려요.
          </p>
          <Link
            href="/dashboard/sns"
            className="inline-block text-xs font-extrabold text-white px-4 py-1.5 rounded-lg transition-opacity hover:opacity-90 bg-amber-500"
          >
            SNS 사진 만들러 가기
          </Link>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="w-full text-sm font-extrabold text-white py-3.5 rounded-xl transition-opacity hover:opacity-90 bg-orange-500"
        >
          입점 신청하기
        </button>
      </form>
    </section>
  );
}

// ─── 메인 페이지 ──────────────────────────────────────────────────────────────

export default function CafepassPage() {
  const [selectedPlan, setSelectedPlan] = useState('3day');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 border border-slate-200 max-w-sm w-full text-center shadow-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">신청이 접수되었습니다.</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            7일 내 검토 결과를 안내드립니다.<br />카페패스 담당자가 직접 연락드릴 예정입니다.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block w-full text-center text-sm font-extrabold text-white py-3 rounded-xl transition-opacity hover:opacity-90 bg-orange-500"
          >
            대시보드로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const activePlan = PLANS.find((p) => p.id === selectedPlan)!;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero — 시안 17: amber→orange→rose 그라디언트 */}
      <section className="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 text-white px-6 md:px-10 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest opacity-80">
                CAFE-PASS · 제휴 카페 84곳
              </span>
              <h1 className="text-3xl md:text-4xl font-black mt-2 leading-[1.1]">
                제주 카페투어,<br />
                <span className="text-slate-900">한 장으로 끝</span>
              </h1>
              <p className="opacity-95 text-sm md:text-base mt-4 max-w-md">
                감성 카페부터 노을 맛집까지 — 매장에서 QR 한 번이면 음료 1잔 무료 + 디저트 할인.
              </p>
              <div className="mt-5 flex gap-2 flex-wrap">
                <button className="px-5 py-2.5 bg-white text-orange-600 font-extrabold rounded-xl text-sm hover:shadow-lg transition-shadow">
                  패스 구매하기 →
                </button>
                <button className="px-5 py-2.5 bg-white/20 backdrop-blur border border-white/30 rounded-xl text-sm font-bold hover:bg-white/30 transition-colors">
                  제휴 카페 보기
                </button>
              </div>
            </div>

            {/* 목업 패스 카드 */}
            <div className="relative h-[200px] hidden md:block">
              <div className="absolute right-0 top-0 w-[260px] bg-slate-900 rounded-2xl shadow-2xl p-5 -rotate-3">
                <div className="flex items-center justify-between text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">CAFE-PASS</span>
                  <span className="text-2xl">☕</span>
                </div>
                <p className="text-3xl font-black text-amber-300 mt-3">3-DAY</p>
                <p className="text-xs text-slate-300 mt-1">5/12 — 5/14 · 민지님</p>
                <div
                  className="mt-3 h-10 rounded-md grid place-items-center text-xs font-bold text-slate-700"
                  style={{
                    background: 'repeating-linear-gradient(45deg, #fef3c7, #fef3c7 8px, #fde68a 8px, #fde68a 16px)',
                  }}
                >
                  QR 코드
                </div>
              </div>
              <div className="absolute right-28 top-20 w-[200px] bg-white rounded-2xl shadow-xl p-3 rotate-6">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-full"
                    style={{
                      background: 'repeating-linear-gradient(45deg, #fef3c7, #fef3c7 6px, #fde68a 6px, #fde68a 12px)',
                    }}
                  />
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs">봄날 — 애월</p>
                    <p className="text-[9px] text-slate-500">방금 사용 · ₩6,500 절약</p>
                  </div>
                </div>
                <p className="text-[10px] text-amber-600 font-extrabold mt-1.5">✓ 음료 1잔 무료 적용</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* 패스 선택 — 시안 17 핵심 */}
        <section>
          <h2 className="text-2xl font-black text-slate-900">패스 선택</h2>
          <p className="text-sm text-slate-500 mt-1">필요한 일수만큼만. 출국 전 환불 가능.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((p) => {
              const isOn = selectedPlan === p.id;
              const dc = Math.round((1 - p.price / p.original) * 100);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`text-left bg-white rounded-3xl p-6 border-2 transition-all relative ${
                    isOn
                      ? 'border-orange-500 shadow-xl shadow-orange-500/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {p.best && (
                    <span className="absolute -top-3 left-6 text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-400 text-slate-900">
                      ★ BEST · 95%가 선택
                    </span>
                  )}
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xl font-black text-slate-900">{p.name}</h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500 text-white">
                      -{dc}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-through tabular-nums mt-1">
                    ₩{p.original.toLocaleString()}
                  </p>
                  <p className="text-3xl font-black tabular-nums text-slate-900">
                    ₩{p.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">/ {p.days}일</p>

                  <ul className="mt-4 space-y-1.5 text-xs text-slate-700">
                    {p.perks.map((x) => (
                      <li key={x} className="flex gap-1.5">
                        <span className="text-emerald-500">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>

                  <div
                    className={`mt-5 py-2.5 text-center rounded-xl text-sm font-extrabold ${
                      isOn ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isOn ? '선택됨 ✓' : '선택하기'}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 제휴 카페 — 시안 17 그리드 */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-2xl font-black text-slate-900">제휴 카페 84곳</h2>
              <p className="text-sm text-slate-500 mt-1">매주 새로운 카페가 추가돼요.</p>
            </div>
            <a className="text-sm font-extrabold text-amber-600 hover:underline cursor-pointer">전체 보기 →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CAFES.map((c, i) => (
              <article
                key={i}
                className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-400 transition-colors cursor-pointer"
              >
                <div
                  className="relative h-24 grid place-items-center"
                  style={{
                    background:
                      'repeating-linear-gradient(45deg, #fef3c7, #fef3c7 8px, #fde68a 8px, #fde68a 16px)',
                  }}
                >
                  <span className="text-3xl opacity-50">{c.icon}</span>
                  <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/90 text-slate-700">
                    {c.dist}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[10px] font-bold text-slate-500">{c.region}</p>
                  <h3 className="font-extrabold text-slate-900 text-xs mt-0.5 leading-snug line-clamp-1">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-amber-600 font-extrabold mt-1">#{c.tag}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 사용 방법 3-step — 시안 17 */}
        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-5">사용 방법</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {([
              ['01', '패스 구매', '원하는 일수 선택, 즉시 결제'],
              ['02', 'QR 발급', '앱에서 QR 자동 생성, 출발일에 활성화'],
              ['03', '매장에서 사용', '카운터에서 QR 보여주기, 끝'],
            ] as const).map(([n, title, desc]) => (
              <div key={n} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600">STEP {n}</p>
                <h3 className="text-lg font-extrabold text-slate-900 mt-2">{title}</h3>
                <p className="text-xs text-slate-500 mt-1.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 카페패스란? + 입점 혜택 */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="font-extrabold text-slate-900 text-lg">카페패스란?</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            제주패스 앱 내 카페 전용 패스 상품입니다. 관광객이 카페패스를 구매하면 입점된 카페를 자유롭게 방문할 수 있으며, 가게는 안정적인 고객 유입과 결제 보장을 누립니다.
          </p>

          <div>
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-3">입점 시 혜택</p>
            <div className="grid grid-cols-3 gap-3">
              {BENEFITS.map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl p-3 text-center border border-amber-100 bg-amber-50"
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <p className="text-xs font-bold text-amber-800">{b.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-3">선정 기준</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CRITERIA.map((c) => (
                <div key={c.label} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-xs text-slate-700 font-bold">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 입점 신청 폼 */}
        <ApplyForm onSubmitted={() => setSubmitted(true)} />

        {/* CTA 하단 바 — 시안 17 */}
        <section className="bg-slate-900 text-white rounded-2xl px-6 py-8 text-center">
          <h2 className="text-2xl font-black">
            지금 사면 ₩{(activePlan.original - activePlan.price).toLocaleString()} 절약
          </h2>
          <p className="text-sm opacity-80 mt-2">
            {activePlan.name} 정가 ₩{activePlan.original.toLocaleString()} → ₩{activePlan.price.toLocaleString()}
          </p>
          <button className="mt-5 px-6 py-3 bg-amber-400 text-slate-900 font-extrabold rounded-xl text-sm hover:bg-amber-300 transition-colors">
            {activePlan.name} 구매하기 →
          </button>
        </section>

      </div>
    </div>
  );
}
