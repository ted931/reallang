'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { CATEGORIES, REGIONS, BRAND } from '@/lib/constants';
import type { ShopCategory, ShopRegion } from '@/lib/types';

type Step = 'info' | 'menu' | 'complete';

interface MenuItem {
  name: string;
  price: string;
  isPopular: boolean;
  photoUrl?: string;
}

interface LocalUser {
  id: string;
  name: string;
  email: string;
  shopIds: string[];
}

// ── 스텝 정의 ────────────────────────────────────────────
const STEPS: { key: Step | 'complete'; label: string; n: number }[] = [
  { key: 'info', label: '기본 정보', n: 1 },
  { key: 'menu', label: '메뉴', n: 2 },
  { key: 'complete', label: '완료', n: 3 },
];

// ── NumberedStepper ──────────────────────────────────────
function NumberedStepper({ current }: { current: Step }) {
  const currentN = STEPS.find((s) => s.key === current)?.n ?? 1;
  return (
    <div className="flex items-center gap-1">
      {STEPS.map((s, i) => {
        const done = currentN > s.n;
        const on = currentN === s.n;
        return (
          <span key={s.key} className="contents">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold transition-all ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : on
                    ? 'bg-orange-500 text-white ring-4 ring-orange-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {done ? '✓' : s.n}
              </div>
              <span
                className={`text-[9px] font-mono ${
                  on
                    ? 'text-orange-600 font-bold'
                    : done
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 -mt-3 ${done ? 'bg-emerald-500' : 'bg-slate-200'}`}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}

// ── Field 래퍼 ───────────────────────────────────────────
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700 flex items-center gap-1">
        {label}
        {required && <span className="text-orange-500">*</span>}
      </label>
      {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}

const inputCls =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all bg-white focus:outline-none';

// ── 미인증 게이트 ────────────────────────────────────────
function AuthGate() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="font-extrabold text-lg" style={{ color: BRAND.color }}>
            제주패스
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-sm w-full text-center space-y-4">
          <div className="text-4xl">🔒</div>
          <h2 className="text-lg font-extrabold text-slate-900">
            가게 등록은 사업자 인증 후 가능합니다
          </h2>
          <p className="text-sm text-slate-500">
            회원가입 시 사업자 인증을 완료하면
            <br />
            바로 가게를 등록할 수 있어요.
          </p>
          <div className="space-y-2 pt-2">
            <Link
              href="/signup"
              className="block w-full py-3 rounded-xl text-white font-bold text-sm"
              style={{ backgroundColor: BRAND.color }}
            >
              회원가입 (사업자 인증 포함)
            </Link>
            <Link
              href="/login"
              className="block w-full py-3 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              이미 계정이 있어요 → 로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 완료 화면 ────────────────────────────────────────────
function CompleteScreen({
  createdSlug,
  createdId,
}: {
  createdSlug: string;
  createdId: string;
}) {
  return (
    <div className="space-y-4">
      {/* 완료 배너 */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-2xl mt-0.5">✓</span>
        <div>
          <p className="font-bold text-slate-900 text-sm">등록 완료!</p>
          <p className="text-xs text-slate-600 mt-0.5">
            가게 페이지가 공개되었어요.
          </p>
          <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">
            ✓ 인증된 사업자
          </span>
        </div>
      </div>

      {/* 가게 이동 버튼 */}
      <div className="space-y-2">
        <Link
          href={`/shop/${createdSlug || 'sunset-cafe-a1b2c3'}`}
          className="block w-full py-3 rounded-xl text-white font-extrabold text-sm text-center shadow shadow-orange-200/60"
          style={{ backgroundColor: BRAND.color }}
        >
          내 가게 페이지 보기
        </Link>
        <Link
          href={`/dashboard/shop/${createdId || 'shop-001'}/edit`}
          className="block w-full py-3 rounded-xl text-sm font-bold border-2 text-center"
          style={{ borderColor: BRAND.color, color: BRAND.color }}
        >
          가게 관리 (영업시간·사진 등록)
        </Link>
        <Link
          href={`/dashboard/sns${createdId ? `?shopId=${createdId}` : ''}`}
          className="block text-sm text-slate-400 hover:text-slate-600 text-center mt-1"
        >
          SNS 콘텐츠 만들기 →
        </Link>
      </div>

      {/* 수익 퍼널 upsell */}
      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-3">
          다음 단계로 더 많은 고객을
        </p>
        <div className="space-y-2">
          <a
            href="http://localhost:3001/cafepass"
            className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <span className="text-2xl">☕</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">카페패스에 가게 추가</p>
              <p className="text-xs text-slate-500 mt-0.5">패스 구매자에게 자동 노출 · 결제 수수료 0%</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 shrink-0">등록 →</span>
          </a>
          <a
            href="http://localhost:3001/rentcar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl">🚗</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">렌터카 고객 유입 연계</p>
              <p className="text-xs text-slate-500 mt-0.5">제주패스 렌터카 예약자에게 가게 추천 노출</p>
            </div>
            <span className="text-xs font-bold text-blue-600 shrink-0">신청 →</span>
          </a>
          <a
            href="http://localhost:3010"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl border border-purple-100 bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <span className="text-2xl">🎉</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">제주 파티 경유지로 등록</p>
              <p className="text-xs text-slate-500 mt-0.5">여행 파티가 내 가게를 코스에 포함</p>
            </div>
            <span className="text-xs font-bold text-purple-600 shrink-0">보기 →</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────
export default function RegisterPage() {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const [step, setStep] = useState<Step>('info');
  const [saving, setSaving] = useState(false);
  const [createdSlug, setCreatedSlug] = useState('');
  const [createdId, setCreatedId] = useState('');

  // Form (테스트용 더미 데이터 미리 채움)
  const [name, setName] = useState('올레길 감성카페');
  const [category, setCategory] = useState<ShopCategory | ''>('cafe');
  const [customCategory, setCustomCategory] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [region, setRegion] = useState<ShopRegion | ''>('seogwipo');
  const [regionSearch, setRegionSearch] = useState('');
  const [customRegion, setCustomRegion] = useState('');
  const [showCustomRegion, setShowCustomRegion] = useState(false);
  const [address, setAddress] = useState('서귀포시 올레길 7코스 입구 12-3');
  const [phone, setPhone] = useState('064-733-8899');
  const [description, setDescription] = useState(
    '올레길 7코스 시작점에 위치한 감성 카페. 제주 감귤을 활용한 수제 음료와 직접 구운 스콘이 인기입니다.'
  );
  const [menus, setMenus] = useState<MenuItem[]>([
    { name: '감귤 에이드', price: '7000', isPopular: true },
    { name: '아메리카노', price: '5000', isPopular: false },
    { name: '제주 말차 라떼', price: '6500', isPopular: true },
    { name: '수제 스콘 세트', price: '9000', isPopular: false },
  ]);

  // 메뉴 사진용 hidden file input refs
  const menuPhotoRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('jejupass_user');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { /* ignore */ }
    }
    setAuthChecked(true);
  }, []);

  const handleTempSave = () => {
    const draft = { name, category, customCategory, region, customRegion, address, phone, description, menus };
    localStorage.setItem('jejupass_register_draft', JSON.stringify(draft));
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const addMenu = () =>
    setMenus([...menus, { name: '', price: '', isPopular: false }]);
  const updateMenu = (idx: number, field: keyof MenuItem, value: string | boolean) =>
    setMenus(menus.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  const removeMenu = (idx: number) =>
    setMenus(menus.filter((_, i) => i !== idx));

  const handleMenuPhoto = (idx: number, file: File) => {
    const url = URL.createObjectURL(file);
    setMenus(menus.map((m, i) => (i === idx ? { ...m, photoUrl: url } : m)));
  };

  const handleSubmit = async () => {
    if (!name || !category || !region || !address) return;
    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/shops`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            category,
            region,
            address,
            phone,
            description,
            menus: menus
              .filter((m) => m.name.trim())
              .map((m, i) => ({
                id: `menu-${Date.now()}-${i}`,
                name: m.name,
                price: parseInt(m.price) || 0,
                isPopular: m.isPopular,
                photoUrl: m.photoUrl,
              })),
            photos: [],
            businessHours: {},
            isPublished: true,
          }),
        }
      );
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

  // 카테고리 필터
  const filteredCategories = categorySearch.trim()
    ? CATEGORIES.filter(c =>
        c.label.includes(categorySearch) || c.group.includes(categorySearch)
      )
    : CATEGORIES;

  // 지역 필터
  const filteredRegions = regionSearch.trim()
    ? REGIONS.filter(r => r.label.includes(regionSearch))
    : REGIONS;

  const currentN = step === 'complete' ? 3 : step === 'menu' ? 2 : 1;

  if (!authChecked) return null;
  if (!user) return <AuthGate />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 임시저장 토스트 */}
      {savedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
          임시저장 완료
        </div>
      )}

      {/* ── 헤더 ── */}
      <header className="bg-white/95 backdrop-blur border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-slate-100 grid place-items-center text-slate-600 text-sm shrink-0"
          >
            ←
          </Link>
          <p className="font-extrabold text-slate-900 text-sm flex-1">가게 등록</p>
          <button
            type="button"
            onClick={handleTempSave}
            className="text-xs text-slate-400 hover:text-orange-500 transition-colors font-medium"
          >
            임시저장
          </button>
        </div>
      </header>

      {/* ── Stepper ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-3">
          <NumberedStepper current={step} />
        </div>
      </div>

      {/* ── 콘텐츠 ── */}
      <div className="max-w-lg mx-auto px-4 py-6 pb-32">
        {step !== 'complete' && (
          <div className="mb-5">
            <p className="text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold">
              Step {currentN} of {STEPS.length}
            </p>
            <h2 className="text-xl font-extrabold text-slate-900">
              {STEPS.find((s) => s.key === step)?.label}
            </h2>
          </div>
        )}

        {/* ─── Step 1: 기본 정보 ─── */}
        {step === 'info' && (
          <div className="space-y-5">
            <Field label="가게 이름" required hint="제주패스 사용자에게 노출되는 이름이에요">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 한림 망고카페"
                className={inputCls}
              />
            </Field>

            {/* 카테고리 — 검색 + 그리드 */}
            <Field label="카테고리" required>
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="카테고리 검색... (예: 카페, 서핑, 펜션)"
                className={inputCls + ' mb-3'}
              />
              {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
                  {filteredCategories.map((c) => {
                    const on = category === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => { setCategory(c.value); setCategorySearch(''); }}
                        className={`p-3 rounded-xl text-center transition-all border-2 ${
                          on
                            ? 'bg-orange-50 border-orange-500'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xl">{c.emoji}</div>
                        <div className="text-[10px] mt-1 font-bold text-slate-700 leading-tight">
                          {c.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-400 mb-2">'{categorySearch}'에 맞는 카테고리가 없어요</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('etc');
                      setCustomCategory(categorySearch);
                      setCategorySearch('');
                    }}
                    className="text-sm font-bold text-orange-500 hover:underline"
                  >
                    '{categorySearch}' 직접 입력하기
                  </button>
                </div>
              )}
              {/* 기타 직접입력 */}
              {category === 'etc' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="카테고리 직접 입력"
                  className={inputCls + ' mt-2'}
                />
              )}
              {/* 선택된 카테고리 표시 */}
              {category && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">선택:</span>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                    {CATEGORIES.find(c => c.value === category)?.emoji}{' '}
                    {category === 'etc' && customCategory
                      ? customCategory
                      : CATEGORIES.find(c => c.value === category)?.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => { setCategory(''); setCustomCategory(''); }}
                    className="text-xs text-slate-300 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              )}
            </Field>

            {/* 지역 — 검색 + 칩 + 직접입력 */}
            <Field label="지역" required>
              <input
                type="text"
                value={regionSearch}
                onChange={(e) => setRegionSearch(e.target.value)}
                placeholder="지역 검색... (예: 애월, 성산)"
                className={inputCls + ' mb-3'}
              />
              <div className="flex flex-wrap gap-2">
                {filteredRegions.map((r) => {
                  const on = region === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => { setRegion(r.value); setRegionSearch(''); setShowCustomRegion(false); }}
                      className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
                        on
                          ? 'bg-orange-500 border-orange-500 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-orange-300'
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => { setShowCustomRegion(true); setRegion('' as ShopRegion); setRegionSearch(''); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
                    showCustomRegion
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-white border-dashed border-slate-300 text-slate-400 hover:border-orange-300 hover:text-orange-500'
                  }`}
                >
                  + 직접 입력
                </button>
              </div>
              {showCustomRegion && (
                <input
                  type="text"
                  value={customRegion}
                  onChange={(e) => setCustomRegion(e.target.value)}
                  placeholder="지역 직접 입력 (예: 협재, 김녕, 표선)"
                  className={inputCls + ' mt-2'}
                  autoFocus
                />
              )}
              {filteredRegions.length === 0 && regionSearch && !showCustomRegion && (
                <button
                  type="button"
                  onClick={() => { setShowCustomRegion(true); setRegion('' as ShopRegion); }}
                  className="mt-2 text-sm font-bold text-orange-500 hover:underline"
                >
                  '{regionSearch}' 직접 입력하기
                </button>
              )}
            </Field>

            <Field label="주소" required>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="예: 제주시 한림읍 협재리 789-10"
                className={inputCls}
              />
            </Field>

            <Field label="연락처">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="064-000-0000"
                className={inputCls}
              />
            </Field>

            <Field label="가게 소개" hint="최대 500자">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="가게를 한 줄로 소개해주세요"
                rows={4}
                className={inputCls + ' resize-none'}
              />
            </Field>
          </div>
        )}

        {/* ─── Step 2: 메뉴 ─── */}
        {step === 'menu' && (
          <div className="space-y-5">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <p className="text-sm font-bold text-slate-900">대표 메뉴를 알려주세요</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                메뉴 사진을 추가하면 손님에게 더 잘 보여요. 나중에 추가/수정할 수 있어요.
              </p>
            </div>

            <Field label="메뉴 목록">
              <div className="space-y-3">
                {menus.map((menu, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-white p-3">
                    {/* 상단: 사진 + 메뉴명 + 가격 */}
                    <div className="flex gap-2 items-start">
                      {/* 사진 업로드 버튼 */}
                      <button
                        type="button"
                        onClick={() => menuPhotoRefs.current[idx]?.click()}
                        className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex-shrink-0 overflow-hidden hover:border-orange-300 transition-colors relative"
                      >
                        {menu.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={menu.photoUrl} alt="메뉴 사진" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-0.5">
                            <span className="text-lg">📷</span>
                            <span className="text-[9px] text-slate-400 font-medium">사진</span>
                          </div>
                        )}
                      </button>
                      <input
                        ref={el => { menuPhotoRefs.current[idx] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleMenuPhoto(idx, file);
                        }}
                      />
                      {/* 메뉴명 + 가격 */}
                      <div className="flex-1 flex flex-col gap-1.5">
                        <input
                          type="text"
                          value={menu.name}
                          onChange={(e) => updateMenu(idx, 'name', e.target.value)}
                          placeholder="메뉴명"
                          className={inputCls}
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={menu.price}
                            onChange={(e) => updateMenu(idx, 'price', e.target.value)}
                            placeholder="가격 (원)"
                            className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all bg-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateMenu(idx, 'isPopular', !menu.isPopular)}
                            className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                              menu.isPopular
                                ? 'bg-orange-50 border-orange-300 text-orange-600'
                                : 'bg-white border-slate-200 text-slate-400'
                            }`}
                          >
                            인기
                          </button>
                          {menus.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMenu(idx)}
                              className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* 사진 삭제 */}
                    {menu.photoUrl && (
                      <button
                        type="button"
                        onClick={() => updateMenu(idx, 'photoUrl', '')}
                        className="mt-2 text-xs text-slate-400 hover:text-red-400 transition-colors"
                      >
                        사진 삭제
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Field>

            <button
              type="button"
              onClick={addMenu}
              className="text-sm font-bold text-slate-500 hover:text-orange-500 transition-colors"
            >
              + 메뉴 추가
            </button>

            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-3 text-xs text-amber-900">
              <p className="font-bold">⚠️ 등록 전 확인</p>
              <p className="mt-1">
                사업자등록증과 운영 정보가 일치하는지 확인해 주세요.
                허위 정보 등록 시 노출 중지될 수 있습니다.
              </p>
            </div>
          </div>
        )}

        {/* ─── Step 3: 완료 ─── */}
        {step === 'complete' && (
          <CompleteScreen createdSlug={createdSlug} createdId={createdId} />
        )}
      </div>

      {/* ── 하단 고정 CTA ── */}
      {step !== 'complete' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-slate-200 p-3 flex gap-2 z-10">
          {step === 'menu' && (
            <button
              onClick={() => setStep('info')}
              className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-colors"
            >
              ← 이전
            </button>
          )}
          {step === 'info' && (
            <button
              onClick={() => setStep('menu')}
              disabled={!name || !category || !region || !address}
              className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-extrabold text-sm shadow shadow-orange-200/60 disabled:opacity-40 transition-opacity"
            >
              다음 →
            </button>
          )}
          {step === 'menu' && (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-extrabold text-sm shadow shadow-orange-200/60 disabled:opacity-40 transition-opacity"
            >
              {saving ? '등록 중...' : '등록 완료 🎉'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
