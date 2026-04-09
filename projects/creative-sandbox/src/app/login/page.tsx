"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Creative <span className="text-indigo-600">Sandbox</span>
          </h1>
          <p className="text-gray-500 mt-2">사내 AI 아이디어 놀이터</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="text-4xl">📧</div>
              <h2 className="text-lg font-semibold">이메일을 확인하세요</h2>
              <p className="text-sm text-gray-500">
                <strong>{email}</strong>로 로그인 링크를 보냈습니다.
                <br />
                메일함에서 링크를 클릭하면 로그인됩니다.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-indigo-600 hover:underline"
              >
                다른 이메일로 시도
              </button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? "전송 중..." : "로그인 링크 받기"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
