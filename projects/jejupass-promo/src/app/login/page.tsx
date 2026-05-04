'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/lib/constants';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">

      <header className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg" style={{ color: BRAND.color }}>제주패스</Link>
          <Link href="/signup" className="text-sm text-gray-500">회원가입</Link>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">사장님 로그인</h1>
            <p className="text-sm text-gray-500 mt-1">계정에 로그인하여 내 가게를 관리하세요.</p>
          </div>

          {/* 테스트 계정 안내 */}
          <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
            <span className="font-semibold">테스트 계정:</span> test@jejupass.com / password123
          </div>

          <form onSubmit={handleSubmit} noValidate className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            {errors.general && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                id="email" name="email" type="email"
                value={form.email} onChange={handleChange}
                placeholder="example@email.com"
                autoComplete="email"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                id="password" name="password" type="password"
                value={form.password} onChange={handleChange}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ backgroundColor: BRAND.color }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            아직 계정이 없으신가요?{' '}
            <Link href="/signup" className="font-semibold" style={{ color: BRAND.color }}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
