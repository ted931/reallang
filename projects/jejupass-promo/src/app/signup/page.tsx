'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/lib/constants';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/* ─── 비밀번호 강도 계산 ─── */
function calcStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw) && /[^a-zA-Z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  const labels = ['', '약함', '보통', '강함', '매우 강함'];
  const colors = ['', 'text-red-500', 'text-amber-500', 'text-emerald-600', 'text-emerald-700'];
  return { score, label: labels[score] || '', color: colors[score] || '' };
}
function barColor(i: number, score: number) {
  if (i > score) return 'bg-slate-200';
  if (score === 1) return 'bg-red-400';
  if (score === 2) return 'bg-amber-400';
  return 'bg-emerald-500';
}

/* ─── 스텝 레이블 ─── */
const STEP_LABELS = ['약관 동의', '계정 정보', '사업자 인증', '완료'];

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          businessNumber,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.error || '회원가입에 실패했습니다.' });
        return;
      }
      localStorage.setItem('jejupass_user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        shopIds: data.user.shopIds,
      }));
      router.push('/register');
    } catch {
      setErrors({ general: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  }

  const pwStrength = calcStrength(form.password);

  /* ─── 스텝별 컨텐츠 ─── */
  function StepContent() {
    // Step 1: 약관 동의
    if (step === 1) {
      return (
        <div className="space-y-5">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">서비스 이용 약관</h3>
            <p className="text-sm text-slate-500 mt-1">제주패스 서비스 이용을 위해 약관에 동의해주세요</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 h-36 overflow-y-auto text-xs text-slate-500 leading-relaxed bg-slate-50">
            <p className="font-bold text-slate-700 mb-2">이용약관 (요약)</p>
            <p>본 약관은 제주패스(이하 &quot;회사&quot;)가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정합니다. 사업자 회원은 본 플랫폼을 통해 가게를 등록하고 고객과 연결될 수 있습니다.</p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 h-28 overflow-y-auto text-xs text-slate-500 leading-relaxed bg-slate-50">
            <p className="font-bold text-slate-700 mb-2">개인정보처리방침 (요약)</p>
            <p>수집 항목: 이름, 이메일, 휴대폰 번호, 사업자등록번호. 수집 목적: 서비스 제공 및 가게 운영 지원. 보유 기간: 회원 탈퇴 후 30일.</p>
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => { setAgreed(e.target.checked); setErrors((p) => ({ ...p, agreed: '' })); }}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-orange-500"
            />
            <span className="text-sm text-slate-600 leading-relaxed">
              <Link href="/terms" target="_blank" className="underline text-orange-500">이용약관</Link> 및{' '}
              <Link href="/privacy" target="_blank" className="underline text-orange-500">개인정보처리방침</Link>에 동의합니다 (필수)
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-red-500">{errors.agreed}</p>}

          <button
            type="button"
            onClick={() => {
              if (!agreed) { setErrors((p) => ({ ...p, agreed: '약관에 동의해주세요.' })); return; }
              setErrors({});
              setStep(2);
            }}
            className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold rounded-xl transition-colors"
          >
            동의하고 계속하기 →
          </button>
        </div>
      );
    }

    // Step 2: 계정 정보
    if (step === 2) {
      return (
        <div className="space-y-3">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">계정 정보 입력</h3>
            <p className="text-sm text-slate-500 mt-1 mb-2">로그인에 사용할 정보를 입력해주세요</p>
          </div>

          {/* 이름 */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">이름 *</label>
            <input
              id="name" name="name" type="text"
              value={form.name} onChange={handleChange}
              placeholder="홍길동"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-shadow ${errors.name ? 'border-red-400' : 'border-slate-200 focus:border-orange-400'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">이메일 *</label>
            <input
              id="email" name="email" type="email"
              value={form.email} onChange={handleChange}
              placeholder="example@email.com"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-shadow ${errors.email ? 'border-red-400' : 'border-slate-200 focus:border-orange-400'}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">비밀번호 *</label>
            <input
              id="password" name="password" type="password"
              value={form.password} onChange={handleChange}
              placeholder="8자 이상"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-shadow ${errors.password ? 'border-red-400' : 'border-slate-200 focus:border-orange-400'}`}
            />
            {/* 비밀번호 강도 */}
            {form.password && (
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all ${barColor(i, pwStrength.score)}`} />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">비밀번호 강도</span>
                  <span className={`font-bold ${pwStrength.color}`}>{pwStrength.label}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 mt-1 text-[11px]">
                  {[
                    { ok: form.password.length >= 8, t: '8자 이상' },
                    { ok: /[^a-zA-Z0-9]/.test(form.password), t: '특수문자 포함' },
                    { ok: /[a-z]/.test(form.password) && /[A-Z]/.test(form.password), t: '대소문자 구분' },
                    { ok: form.password.length >= 12, t: '12자 이상 권장' },
                  ].map((x, i) => (
                    <div key={i} className={`flex items-center gap-1 ${x.ok ? 'text-slate-600' : 'text-slate-300'}`}>
                      <span className="text-[9px]">{x.ok ? '✓' : '○'}</span> {x.t}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">비밀번호 확인 *</label>
            <input
              id="passwordConfirm" name="passwordConfirm" type="password"
              value={form.passwordConfirm} onChange={handleChange}
              placeholder="비밀번호 재입력"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-shadow ${errors.passwordConfirm ? 'border-red-400' : 'border-slate-200 focus:border-orange-400'}`}
            />
            {errors.passwordConfirm && <p className="mt-1 text-xs text-red-500">{errors.passwordConfirm}</p>}
          </div>

          {/* 휴대폰 */}
          <div>
            <label htmlFor="phone" className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">휴대폰 번호 *</label>
            <input
              id="phone" name="phone" type="tel"
              value={form.phone} onChange={handleChange}
              placeholder="010-0000-0000"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-shadow ${errors.phone ? 'border-red-400' : 'border-slate-200 focus:border-orange-400'}`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3.5 border border-slate-200 bg-white text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >← 이전</button>
            <button
              type="button"
              onClick={() => {
                const errs: Record<string, string> = {};
                if (!form.name.trim()) errs.name = '이름을 입력해주세요.';
                if (!form.email.trim()) errs.email = '이메일을 입력해주세요.';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = '올바른 이메일 형식이 아닙니다.';
                if (!form.password) errs.password = '비밀번호를 입력해주세요.';
                else if (form.password.length < 8) errs.password = '비밀번호는 8자 이상이어야 합니다.';
                if (form.password !== form.passwordConfirm) errs.passwordConfirm = '비밀번호가 일치하지 않습니다.';
                if (!form.phone.trim()) errs.phone = '휴대폰 번호를 입력해주세요.';
                if (Object.keys(errs).length > 0) { setErrors(errs); return; }
                setErrors({});
                setStep(3);
              }}
              className="flex-[2] py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold rounded-xl transition-colors"
            >다음 →</button>
          </div>
        </div>
      );
    }

    // Step 3: 사업자 인증
    if (step === 3) {
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-900">사업자 인증</h3>
            <p className="text-sm text-slate-500 mt-1 mb-2">사업자등록증으로 인증한 사업자만 가입할 수 있습니다</p>
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
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400">또는 직접 입력</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={businessNumber}
                  onChange={(e) => { setBusinessNumber(e.target.value); setVerifyError(''); setErrors((p) => ({ ...p, business: '' })); }}
                  placeholder="000-00-00000"
                  className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-shadow"
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

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3.5 border border-slate-200 bg-white text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
            >← 이전</button>
            <button
              type="button"
              onClick={() => {
                if (!verified) { setErrors((p) => ({ ...p, business: '사업자 인증이 필요합니다.' })); return; }
                setErrors({});
                setStep(4);
              }}
              className="flex-[2] py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-extrabold rounded-xl transition-colors"
            >다음 →</button>
          </div>
        </div>
      );
    }

    // Step 4: 최종 제출
    return (
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">가입 완료</h3>
          <p className="text-sm text-slate-500 mt-1 mb-2">입력하신 정보를 확인하고 가입을 완료해주세요</p>
        </div>

        {(errors as Record<string, string>).general && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
            {(errors as Record<string, string>).general}
          </div>
        )}

        {/* 정보 요약 */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">이름</span>
            <span className="font-medium text-slate-900">{form.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">이메일</span>
            <span className="font-medium text-slate-900">{form.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">휴대폰</span>
            <span className="font-medium text-slate-900">{form.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">사업자번호</span>
            <span className="font-medium text-emerald-700">{businessNumber} ✓</span>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="flex-1 py-3.5 border border-slate-200 bg-white text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >← 이전</button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-extrabold rounded-xl transition-colors"
          >
            {loading ? '처리 중...' : '가입하고 가게 등록하기 →'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[Noto_Sans_KR,system-ui,sans-serif]">

      {/* ── 모바일 헤더 ── */}
      <header className="lg:hidden bg-white border-b border-slate-100 shrink-0">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg text-orange-500">제주패스</Link>
          <Link href="/login" className="text-sm text-slate-500 hover:text-slate-700">로그인</Link>
        </div>
      </header>

      {/* ── split-screen ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">

        {/* 좌: 히어로 (데스크톱만) */}
        <div className="hidden lg:flex flex-col justify-between p-14 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">JEJU PASS</p>
            <p className="text-3xl font-extrabold mt-2">제주에 오신 걸 환영해요</p>
          </div>
          <div>
            <h2 className="text-5xl font-black leading-[1.1] mb-4">
              하나의 계정,<br />
              <span className="opacity-80">다섯 개의 서비스</span>
            </h2>
            <ul className="mt-2 space-y-2 text-base">
              {[
                '지도 · 길찾기 (jeju-map)',
                '파티 모집 (jeju-party)',
                '가게 운영 (jejupass-promo)',
                '사업자 대시보드 (jeju-biz)',
                'AI 일정 추천',
              ].map((s) => (
                <li key={s} className="flex items-center gap-3 opacity-90">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 max-w-sm">
            {([
              ['3분', '가입 완료'],
              ['무료', '가게 등록'],
              ['350+', '등록된 파트너'],
            ] as [string, string][]).map(([n, l]) => (
              <div key={n} className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl px-4 py-2.5">
                <span className="text-2xl font-extrabold tabular-nums">{n}</span>
                <span className="text-sm opacity-80">{l}</span>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute top-32 right-12 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* 우: 폼 */}
        <div className="flex items-start justify-center bg-white px-6 py-14 lg:px-10 overflow-y-auto">
          <div className="w-full max-w-sm">

            {/* 데스크톱 브랜드 */}
            <p className="hidden lg:block text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">JEJU PASS</p>

            {/* 진행 바 */}
            <div className="mb-7">
              <div className="flex items-center justify-between mb-2 text-[11px]">
                <span className="text-slate-500 font-mono">STEP {step}/4</span>
                <span className="font-bold text-orange-700">{STEP_LABELS[step - 1]}</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-orange-500' : 'bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            <StepContent />

            <p className="text-center text-sm text-slate-500 mt-6">
              이미 계정이 있으신가요?{' '}
              <Link href="/login" className="font-bold text-orange-700 hover:underline ml-1">로그인</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
