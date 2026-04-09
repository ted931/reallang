'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES, REGIONS, BRAND } from '@/lib/constants';
import type { ShopCategory, ShopRegion } from '@/lib/types';

type Step = 'info' | 'menu' | 'verify' | 'complete';

interface MenuItem {
  name: string;
  price: string;
  isPopular: boolean;
}

export default function RegisterPage() {
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

  // 사업자 인증
  const [businessNumber, setBusinessNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrData, setOcrData] = useState<{ businessName?: string; representative?: string; address?: string } | null>(null);

  const addMenu = () => setMenus([...menus, { name: '', price: '', isPopular: false }]);
  const updateMenu = (idx: number, field: keyof MenuItem, value: string | boolean) => {
    setMenus(menus.map((m, i) => (i === idx ? { ...m, [field]: value } : m)));
  };
  const removeMenu = (idx: number) => setMenus(menus.filter((_, i) => i !== idx));

  const handleVerify = async () => {
    if (!businessNumber.replace(/[-\s]/g, '')) return;
    setVerifying(true);
    setVerifyError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/verify-business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessNumber }),
      });
      const data = await res.json();
      if (data.valid) {
        setVerified(true);
        setBusinessNumber(data.businessNumber);
      } else {
        setVerifyError(data.message);
      }
    } catch {
      setVerifyError('인증 중 오류가 발생했습니다.');
    } finally {
      setVerifying(false);
    }
  };

  const handleOCR = async (file: File) => {
    setOcrLoading(true);
    setVerifyError('');
    setOcrData(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/verify-business/ocr`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.valid) {
        setBusinessNumber(data.data.businessNumber);
        setVerified(true);
        setOcrData({
          businessName: data.data.businessName,
          representative: data.data.representative,
          address: data.data.address,
        });
        // 추출된 정보로 폼 자동 채우기
        if (data.data.businessName && !name) setName(data.data.businessName);
        if (data.data.address && !address) setAddress(data.data.address);
      } else if (data.success && !data.valid) {
        setBusinessNumber(data.data?.businessNumber || '');
        setVerifyError(data.message);
      } else {
        setVerifyError(data.error || '인식에 실패했습니다.');
      }
    } catch {
      setVerifyError('OCR 처리 중 오류가 발생했습니다.');
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!name || !category || !region || !address) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/api/shops`, {
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
          isPublished: verified, // 인증된 경우만 공개
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

  // Step indicator
  const steps = [
    { key: 'info', label: '기본 정보' },
    { key: 'menu', label: '메뉴' },
    { key: 'verify', label: '사업자 인증' },
  ];
  const currentIdx = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <span className="text-xs text-gray-400">{currentIdx + 1} / {steps.length}</span>
        </div>
      </header>

      {/* Step buttons (테스트용) */}
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
            4. 완료
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
              <button onClick={() => setStep('verify')} className="flex-1 py-3 rounded-xl text-white font-semibold" style={{ backgroundColor: BRAND.color }}>다음 →</button>
            </div>
          </div>
        )}

        {/* ─── Step 3: 사업자 인증 ─── */}
        {step === 'verify' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-xl font-bold text-gray-900">사업자 인증</h1>
              <p className="text-sm text-gray-500 mt-1">
                인증하면 가게 페이지가 바로 공개됩니다.<br />
                건너뛰어도 SNS 콘텐츠는 만들 수 있어요.
              </p>
            </div>

            {/* OCR 업로드 — 가장 쉬운 방법 */}
            {!verified && (
              <label className={`block bg-white rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${ocrLoading ? 'border-orange-300 bg-orange-50' : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'}`}>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleOCR(file);
                  }}
                  disabled={ocrLoading}
                />
                {ocrLoading ? (
                  <div>
                    <div className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm font-medium text-orange-600 mt-3">사업자등록증 인식 중...</p>
                    <p className="text-xs text-gray-400 mt-1">AI가 사업자번호를 자동으로 읽고 있어요</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-sm font-medium text-gray-700">사업자등록증 사진 촬영 / 업로드</p>
                    <p className="text-xs text-gray-400 mt-1">사진을 찍으면 AI가 자동으로 사업자번호를 인식합니다</p>
                  </div>
                )}
              </label>
            )}

            {/* OCR 결과 — 인식된 정보 표시 */}
            {ocrData && verified && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-lg">✓</span>
                  <span className="text-sm font-bold text-green-700">사업자 인증 완료</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">사업자번호</span>
                    <p className="font-medium text-gray-800">{businessNumber}</p>
                  </div>
                  {ocrData.businessName && (
                    <div>
                      <span className="text-gray-500">상호</span>
                      <p className="font-medium text-gray-800">{ocrData.businessName}</p>
                    </div>
                  )}
                  {ocrData.representative && (
                    <div>
                      <span className="text-gray-500">대표자</span>
                      <p className="font-medium text-gray-800">{ocrData.representative}</p>
                    </div>
                  )}
                  {ocrData.address && (
                    <div className="col-span-2">
                      <span className="text-gray-500">소재지</span>
                      <p className="font-medium text-gray-800">{ocrData.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 직접 입력 (OCR 실패 시 대안) */}
            {!verified && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                <p className="text-xs text-gray-400">또는 직접 입력</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={businessNumber}
                    onChange={(e) => { setBusinessNumber(e.target.value); setVerified(false); setVerifyError(''); }}
                    placeholder="000-00-00000"
                    maxLength={12}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-orange-300"
                  />
                  <button
                    onClick={handleVerify}
                    disabled={verifying || !businessNumber.replace(/[-\s]/g, '')}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: BRAND.color }}
                  >
                    {verifying ? '확인중...' : '인증'}
                  </button>
                </div>
                {verifyError && <p className="text-xs text-red-500 mt-1">{verifyError}</p>}
              </div>
            )}

            {/* 인증 없이 진행 안내 */}
            {!verified && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500">
                <p className="font-medium text-gray-600 mb-1">인증 없이도 시작할 수 있어요</p>
                <ul className="space-y-1 text-xs">
                  <li>• SNS 콘텐츠 생성은 바로 가능</li>
                  <li>• 가게 페이지 공개는 인증 후 활성화</li>
                  <li>• 나중에 언제든 인증할 수 있어요</li>
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep('menu')} className="flex-1 py-3 rounded-xl font-semibold border border-gray-200 text-gray-600">← 이전</button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                style={{ backgroundColor: BRAND.color }}>
                {saving ? '등록 중...' : verified ? '등록 완료' : '인증 없이 등록'}
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 4: 완료 ─── */}
        {step === 'complete' && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-gray-900">등록 완료!</h1>
              <p className="text-gray-500 mt-2">
                {verified
                  ? '가게 페이지가 공개되었어요.'
                  : '사업자 인증 후 가게 페이지가 공개됩니다.'}
              </p>
              {verified && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                  ✓ 인증된 사업자
                </span>
              )}
              <div className="mt-6 space-y-3">
                <Link
                  href={`/shop/${createdSlug || 'sunset-cafe-a1b2c3'}`}
                  className="block w-full py-3 rounded-xl text-white font-semibold text-center"
                  style={{ backgroundColor: BRAND.color }}
                >
                  내 가게 페이지 보기
                </Link>
                <Link
                  href={`/dashboard/sns${createdId ? `?shopId=${createdId}` : ''}`}
                  className="block w-full py-3 rounded-xl font-semibold border-2 text-center"
                  style={{ borderColor: BRAND.color, color: BRAND.color }}
                >
                  SNS 콘텐츠 만들기
                </Link>
                <Link href="/explore" className="block text-sm text-gray-400 hover:text-gray-600 mt-2">
                  다른 가게 둘러보기
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
