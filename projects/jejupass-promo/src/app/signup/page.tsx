'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/lib/constants';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // 사업자 인증
  const [businessNumber, setBusinessNumber] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrData, setOcrData] = useState<{ businessName?: string; representative?: string; address?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleOCR(file: File) {
    setOcrLoading(true);
    setVerifyError('');
    setOcrData(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/verify-business/ocr', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.valid) {
        setBusinessNumber(data.data.businessNumber);
        setVerified(true);
        setOcrData({ businessName: data.data.businessName, representative: data.data.representative, address: data.data.address });
        if (data.data.businessName && !form.name) {
          setForm((prev) => ({ ...prev, name: data.data.representative || prev.name }));
        }
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
  }

  async function handleVerify() {
    if (!businessNumber.replace(/[-\s]/g, '')) return;
    setVerifying(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/verify-business', {
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
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = '이름을 입력해주세요.';
    if (!form.email.trim()) errs.email = '이메일을 입력해주세요.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '올바른 이메일 형식이 아닙니다.';
    if (!form.password) errs.password = '비밀번호를 입력해주세요.';
    else if (form.password.length < 8) errs.password = '비밀번호는 8자 이상이어야 합니다.';
    if (form.password !== form.passwordConfirm) errs.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    if (!form.phone.trim()) errs.phone = '휴대폰 번호를 입력해주세요.';
    if (!verified) errs.business = '사업자 인증이 필요합니다.';
    if (!agreed) errs.agreed = '약관에 동의해주세요.';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    setTimeout(() => router.push('/register'), 800);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <Link href="/login" className="text-sm text-gray-500">로그인</Link>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">사장님 회원가입</h1>
            <p className="text-sm text-gray-500 mt-1">무료로 가게를 등록하고 SNS 마케팅을 시작하세요.</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">

            {/* 이름 */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                id="name" name="name" type="text"
                value={form.name} onChange={handleChange}
                placeholder="홍길동"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="example@email.com"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                id="password" name="password" type="password"
                value={form.password} onChange={handleChange}
                placeholder="8자 이상"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input
                id="passwordConfirm" name="passwordConfirm" type="password"
                value={form.passwordConfirm} onChange={handleChange}
                placeholder="비밀번호 재입력"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.passwordConfirm ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.passwordConfirm && <p className="mt-1 text-xs text-red-500">{errors.passwordConfirm}</p>}
            </div>

            {/* 휴대폰 */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">휴대폰 번호</label>
              <input
                id="phone" name="phone" type="tel"
                value={form.phone} onChange={handleChange}
                placeholder="010-0000-0000"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100 pt-1" />

            {/* 사업자 인증 */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">사업자 인증 <span className="text-red-400">*</span></label>
                <p className="text-xs text-gray-400 mt-0.5">사업자등록증으로 인증한 사업자만 가입할 수 있습니다.</p>
              </div>

              {verified ? (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-emerald-500 text-lg shrink-0">✅</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-emerald-700">인증 완료</p>
                    <p className="text-xs text-emerald-600 mt-0.5">{businessNumber}</p>
                    {ocrData && (
                      <div className="mt-1.5 space-y-0.5 text-xs text-emerald-600">
                        {ocrData.businessName && <p>상호: {ocrData.businessName}</p>}
                        {ocrData.representative && <p>대표: {ocrData.representative}</p>}
                        {ocrData.address && <p>주소: {ocrData.address}</p>}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => { setVerified(false); setBusinessNumber(''); setOcrData(null); setVerifyError(''); }}
                      className="mt-2 text-xs text-emerald-500 underline"
                    >
                      다시 인증
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* OCR 업로드 */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 p-5 border-2 border-dashed border-orange-200 rounded-xl bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors"
                  >
                    {ocrLoading ? (
                      <>
                        <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs text-orange-600 font-medium">사업자등록증 인식 중...</p>
                      </>
                    ) : (
                      <>
                        <span className="text-2xl">📄</span>
                        <p className="text-sm font-medium text-orange-700">사업자등록증 사진 업로드</p>
                        <p className="text-xs text-orange-500">JPG, PNG · 자동으로 번호를 인식합니다</p>
                      </>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleOCR(f); }}
                  />

                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400">또는 직접 입력</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={businessNumber}
                      onChange={(e) => { setBusinessNumber(e.target.value); setVerifyError(''); setErrors((p) => ({ ...p, business: '' })); }}
                      placeholder="000-00-00000"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                    <button
                      type="button"
                      onClick={handleVerify}
                      disabled={verifying || !businessNumber.trim()}
                      className="shrink-0 px-4 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-50 transition-opacity hover:opacity-90"
                      style={{ backgroundColor: BRAND.color }}
                    >
                      {verifying ? '확인 중...' : '인증'}
                    </button>
                  </div>

                  {verifyError && <p className="text-xs text-red-500">{verifyError}</p>}
                  {errors.business && <p className="text-xs text-red-500">{errors.business}</p>}
                </div>
              )}
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-100 pt-1" />

            {/* 약관 동의 */}
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, agreed: '' })); }}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                  <Link href="/terms" target="_blank" className="underline text-orange-500">이용약관</Link> 및{' '}
                  <Link href="/privacy" target="_blank" className="underline text-orange-500">개인정보처리방침</Link>에 동의합니다 (필수)
                </span>
              </label>
              {errors.agreed && <p className="mt-1 text-xs text-red-500">{errors.agreed}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRAND.color }}
            >
              {loading ? '처리 중...' : '가입하고 가게 등록하기'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="font-semibold" style={{ color: BRAND.color }}>로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
