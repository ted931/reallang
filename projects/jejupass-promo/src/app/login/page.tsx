'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/lib/constants';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

/* ── SNS 아이콘 ── */
function IcoKakao(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="currentColor" d="M12 4C7 4 3 7.3 3 11.4c0 2.6 1.7 4.9 4.3 6.2L6.5 21l4-2.6c.5.1 1 .1 1.5.1 5 0 9-3.3 9-7.4S17 4 12 4z" />
    </svg>
  );
}
function IcoNaver(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="currentColor" d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z" />
    </svg>
  );
}
function IcoApple(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...p}>
      <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'member' | 'biz'>('biz');
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [keepLogin, setKeepLogin] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '', general: '' }));
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.email.trim()) errs.email = '이메일을 입력해주세요.';
    if (!form.password) errs.password = '비밀번호를 입력해주세요.';
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.error || '로그인에 실패했습니다.' });
        return;
      }
      localStorage.setItem('jejupass_user', JSON.stringify({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        shopIds: data.user.shopIds,
      }));
      router.push('/dashboard');
    } catch {
      setErrors({ general: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-[Noto_Sans_KR,system-ui,sans-serif]">

      {/* ── 모바일 헤더 (lg 이하만 표시) ── */}
      <header className="lg:hidden bg-white border-b border-slate-100 shrink-0">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-extrabold text-lg text-orange-500">제주패스</Link>
          <Link href="/signup" className="text-sm text-slate-500 hover:text-slate-700">회원가입</Link>
        </div>
      </header>

      {/* ── split-screen ── */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">

        {/* 좌: 히어로 (데스크톱만) */}
        <div className="hidden lg:flex flex-col justify-between p-14 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)' }}>
          {/* 브랜드 */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">JEJU PASS</p>
            <p className="text-3xl font-extrabold mt-2">제주가 더 가까워진다</p>
          </div>
          {/* 중앙 카피 */}
          <div>
            <h2 className="text-5xl font-black leading-[1.1] mb-4">
              제주에서 만나는<br />
              <span className="opacity-80">새로운 친구들</span>
            </h2>
            <p className="text-lg leading-relaxed opacity-90 max-w-md">
              서핑, 트래킹, 미식 투어까지.<br />
              현지인이 제안하는 진짜 제주를 함께해요.
            </p>
          </div>
          {/* 통계 배지 */}
          <div className="space-y-3 max-w-sm">
            {([
              ['12,000+', '지금까지 만들어진 파티'],
              ['98%', '참가자 만족도'],
              ['350+', '등록된 가게 / 호스트'],
            ] as [string, string][]).map(([n, l]) => (
              <div key={n} className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-xl px-4 py-2.5">
                <span className="text-2xl font-extrabold tabular-nums">{n}</span>
                <span className="text-sm opacity-80">{l}</span>
              </div>
            ))}
          </div>
          {/* 장식 */}
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute top-32 right-12 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* 우: 폼 */}
        <div className="flex items-center justify-center bg-white px-6 py-14 lg:px-10">
          <div className="w-full max-w-sm">

            {/* 데스크톱 브랜드 */}
            <p className="hidden lg:block text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">JEJU PASS</p>
            <h1 className="text-3xl font-black text-slate-900 mb-1">다시 만나서 반가워요</h1>
            <p className="text-slate-500 text-sm mb-7">계정에 로그인해주세요</p>

            {/* 회원 유형 탭 */}
            <div className="flex bg-slate-100 rounded-xl p-1 mb-6 text-sm font-bold">
              {([
                { id: 'member', label: '일반 회원' },
                { id: 'biz', label: '사업자' },
              ] as { id: 'member' | 'biz'; label: string }[]).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 rounded-lg transition-all ${tab === t.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* 테스트 계정 안내 */}
            <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
              <span className="font-semibold">테스트 계정:</span> test@jejupass.com / password123
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              {errors.general && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  {errors.general}
                </div>
              )}

              {/* 이메일 */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  이메일
                </label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  placeholder="example@email.com"
                  autoComplete="email"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-shadow ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-orange-400'}`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* 비밀번호 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                    비밀번호
                  </label>
                  <button type="button" className="text-xs text-orange-600 hover:underline">비밀번호 찾기</button>
                </div>
                <input
                  id="password" name="password" type="password"
                  value={form.password} onChange={handleChange}
                  placeholder="비밀번호 입력"
                  autoComplete="current-password"
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-100 transition-shadow ${errors.password ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-orange-400'}`}
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* 로그인 상태 유지 */}
              <label className="flex items-center gap-2 text-sm text-slate-600 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepLogin}
                  onChange={(e) => setKeepLogin(e.target.checked)}
                  className="w-4 h-4 rounded accent-orange-500"
                />
                로그인 상태 유지
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-extrabold rounded-xl mt-2 shadow-sm transition-colors"
              >
                {loading ? '로그인 중...' : '로그인 →'}
              </button>
            </form>

            {/* SNS 구분선 */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 tracking-wider">또는 SNS 로그인</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* SNS 버튼 */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-extrabold hover:brightness-95 transition-all"
                style={{ backgroundColor: '#fee500', color: '#3c1e1e' }}
              >
                <IcoKakao className="w-4 h-4" /> 카카오
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-white text-sm font-extrabold hover:brightness-95 transition-all"
                style={{ backgroundColor: '#03c75a' }}
              >
                <IcoNaver className="w-3.5 h-3.5" /> 네이버
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold transition-colors"
              >
                <IcoApple className="w-4 h-4" /> Apple
              </button>
            </div>

            <p className="text-center text-sm text-slate-500 mt-6">
              아직 회원이 아니신가요?{' '}
              <Link href="/signup" className="font-bold text-orange-700 hover:underline ml-1">회원가입</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
