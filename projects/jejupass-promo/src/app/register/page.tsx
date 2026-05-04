'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, REGIONS, BRAND } from '@/lib/constants';
import type { ShopCategory, ShopRegion } from '@/lib/types';

type Step = 'info' | 'menu' | 'complete';

interface MenuItem {
  name: string;
  price: string;
  isPopular: boolean;
}

interface LocalUser {
  id: string;
  name: string;
  email: string;
  shopIds: string[];
}

export default function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState<LocalUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [step, setStep] = useState<Step>('info');
  const [saving, setSaving] = useState(false);
  const [createdSlug, setCreatedSlug] = useState('');
  const [createdId, setCreatedId] = useState('');

  // Form (테스트용 더미 데이터 미리 채움)
  const [name, setName] = useState('올레길 감성카페');
  const [category, setCategory] = useState<ShopCategory | ''>('cafe');
  const [region, setRegion] = useState<ShopRegion | ''>('seogwipo');
  const [address, setAddress] = useState('서귀포시 올레길 7코스 입구 12-3');
  const [phone, setPhone] = useState('064-733-8899');
  const [description, setDescription] = useState('올레길 7코스 시작점에 위치한 감성 카페. 제주 감귤을 활용한 수제 음료와 직접 구운 스콘이 인기입니다.');
  const [menus, setMenus] = useState<MenuItem[]>([
    { name: '감귤 에이드', price: '7000', isPopular: true },
    { name: '아메리카노', price: '5000', isPopular: false },
    { name: '제주 말차 라떼', price: '6500', isPopular: true },
    { name: '수제 스콘 세트', price: '9000', isPopular: false },
  ]);

  useEffect(() => {
    const raw = localStorage.getItem('jejupass_user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setAuthChecked(true);
  }, []);

  const addMenu = () => setMenus([...menus, { name: '', price: '', isPopular: false }]);
  const updateMenu = (idx: number, field: keyof MenuItem, value: string | boolean) => {
    setMenus(menus.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };
  const removeMenu = (idx: number) => setMenus(menus.filter((_, i) => i !== idx));

  const handleSubmit = async () => {
    if (!name || !category || !region || !address) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/shops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, category, region, address, phone, description,
          menus: menus.filter((m) => m.name.trim()).map((m, i) => ({
            id: `menu-${Date.now()}-${i}`,
            name: m.name,
            price: parseInt(m.price) || 0,
            isPopular: m.isPopular,
          })),
          photos: [],
          businessHours: {},
          isPublished: true, // 회원가입 시 인증 완료 → 바로 공개
        }),
      });
      const data = await res.json();
      setCreatedSlug(data.shop.slug);
      setCreatedId(data.shop.id);
      setStep('complete');
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    { key: 'info', label: '기본 정보' },
    { key: 'menu', label: '메뉴' },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  // ─── 인증 없이 접근 차단 ───
  if (!authChecked) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full text-center space-y-4">
            <div className="text-4xl">🔒</div>
            <h2 className="text-lg font-bold text-gray-900">가게 등록은 사업자 인증 후 가능합니다</h2>
            <p className="text-sm text-gray-500">회원가입 시 사업자 인증을 완료하면<br />바로 가게를 등록할 수 있어요.</p>
            <div className="space-y-2 pt-2">
              <Link
                href="/signup"
                className="block w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{ backgroundColor: BRAND.color }}
              >
                회원가입 (사업자 인증 포함)
              </Link>
              <Link
                href="/login"
                className="block w-full py-3 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                이미 계정이 있어요 → 로그인
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <span className="text-xs text-gray-400">{currentIdx + 1} / {steps.length}</span>
        </div>
      </header>

      {/* Step 탭 */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key as Step)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                step === s.key ? 'text-white' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
              style={step === s.key ? { backgroundColor: BRAND.color } : {}}
            >
              {i + 1}. {s.label}
            </button>
          ))}
          <button
            onClick={() => setStep('complete')}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              step === 'complete' ? 'text-white bg-green-600' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            3. 완료
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* ─── Step 1: 기본 정보 ─── */}
        {step === 'info' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">가게 정보를 알려주세요</h1>
              <p className="text-sm text-gray-500 mt-1">기본 정보만 입력하면 바로 시작할 수 있어요.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가게 이름 *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="예: 한림 망고카페"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-200" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c.value} type="button" onClick={() => setCategory(c.value)}
                    className={`p-3 rounded-xl text-center transition-all ${category === c.value ? 'bg-orange-50 shadow-sm' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
                    style={category === c.value ? { border: `2px solid ${BRAND.color}` } : {}}>
                    <div className="text-xl">{c.emoji}</div>
                    <div className="text-xs mt-1 font-medium text-gray-700">{c.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">지역 *</label>
              <div className="flex flex-wrap gap-2">
                {REGIONS.map((r) => (
                  <button key={r.value} type="button" onClick={() => setRegion(r.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${region === r.value ? 'text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    style={region === r.value ? { backgroundColor: BRAND.color } : {}}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="예: 제주시 한림읍 협재리 789-10"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-300" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                placeholder="064-000-0000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-300" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가게 소개</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="가게를 한 줄로 소개해주세요" rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-300 resize-none" />
            </div>

            <button onClick={() => setStep('menu')} disabled={!name || !category || !region || !address}
              className="w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50"
              style={{ backgroundColor: BRAND.color }}>
              다음 →
            </button>
          </div>
        )}

        {/* ─── Step 2: 메뉴 ─── */}
        {step === 'menu' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">대표 메뉴를 알려주세요</h1>
              <p className="text-sm text-gray-500 mt-1">나중에 추가/수정할 수 있어요. 건너뛰어도 됩니다.</p>
            </div>

            <div className="space-y-2">
              {menus.map((menu, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input type="text" value={menu.name} onChange={(e) => updateMenu(idx, 'name', e.target.value)}
                    placeholder="메뉴명" className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-300" />
                  <input type="number" value={menu.price} onChange={(e) => updateMenu(idx, 'price', e.target.value)}
                    placeholder="가격" className="w-24 px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-orange-300" />
                  <button type="button" onClick={() => updateMenu(idx, 'isPopular', !menu.isPopular)}
                    className={`px-2 py-2.5 rounded-lg text-xs font-medium ${menu.isPopular ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                    인기
                  </button>
                  {menus.length > 1 && (
                    <button type="button" onClick={() => removeMenu(idx)} className="text-gray-300 hover:text-red-400">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addMenu} className="text-sm text-gray-500 hover:text-gray-700">+ 메뉴 추가</button>

            <div className="flex gap-3">
              <button onClick={() => setStep('info')} className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600">← 이전</button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                style={{ backgroundColor: BRAND.color }}>
                {saving ? '등록 중...' : '등록 완료 🎉'}
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: 완료 ─── */}
        {step === 'complete' && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-gray-900">등록 완료!</h1>
              <p className="text-gray-500 mt-2">가게 페이지가 공개되었어요.</p>
              <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                ✓ 인증된 사업자
              </span>
              <div className="mt-6 space-y-3">
                <Link
                  href={`/shop/${createdSlug || 'sunset-cafe-a1b2c3'}`}
                  className="block w-full py-3 rounded-xl text-white font-semibold text-center"
                  style={{ backgroundColor: BRAND.color }}
                >
                  내 가게 페이지 보기
                </Link>
                <Link
                  href={`/dashboard/shop/${createdId || 'shop-001'}/edit`}
                  className="block w-full py-3 rounded-xl font-semibold border-2 text-center"
                  style={{ borderColor: BRAND.color, color: BRAND.color }}
                >
                  가게 관리 (영업시간·사진 등록)
                </Link>
                <Link
                  href={`/dashboard/sns${createdId ? `?shopId=${createdId}` : ''}`}
                  className="block text-sm text-gray-400 hover:text-gray-600 mt-2"
                >
                  SNS 콘텐츠 만들기 →
                </Link>
              </div>

              {/* 다음 단계 — 수익 퍼널 */}
              <div className="mt-6 pt-6 border-t border-gray-100 text-left space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide text-center mb-4">다음 단계로 더 많은 고객을</p>

                {/* 카페패스 등록 */}
                <a
                  href="http://localhost:3001/cafepass"
                  className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                >
                  <span className="text-2xl">☕</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">카페패스에 가게 추가</p>
                    <p className="text-xs text-gray-500 mt-0.5">패스 구매자에게 자동 노출 · 결제 수수료 0%</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 shrink-0">등록 →</span>
                </a>

                {/* 렌터카 연계 */}
                <a
                  href="http://localhost:3001/rentcar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <span className="text-2xl">🚗</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">렌터카 고객 유입 연계</p>
                    <p className="text-xs text-gray-500 mt-0.5">제주패스 렌터카 예약자에게 가게 추천 노출</p>
                  </div>
                  <span className="text-xs font-bold text-blue-600 shrink-0">신청 →</span>
                </a>

                {/* 제주 파티 연계 */}
                <a
                  href="http://localhost:3010"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100 transition-colors"
                >
                  <span className="text-2xl">🎉</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">제주 파티 경유지로 등록</p>
                    <p className="text-xs text-gray-500 mt-0.5">여행 파티가 내 가게를 코스에 포함</p>
                  </div>
                  <span className="text-xs font-bold text-purple-600 shrink-0">보기 →</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
