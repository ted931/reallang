"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 에러 로깅 (필요 시 Sentry 등으로 교체)
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      {/* 에러 아이콘 */}
      <p className="text-7xl mb-3" role="img" aria-label="에러">
        😵‍💫
      </p>
      <p className="text-[11px] font-mono uppercase tracking-widest text-orange-500 mb-3">
        SERVER_ERROR
      </p>

      <h1 className="text-2xl font-black text-slate-900">
        문제가 발생했어요
      </h1>
      <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-xs">
        서버에서 오류가 발생했습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>

      {/* 에러 digest */}
      {error.digest && (
        <p className="font-mono text-[10px] text-slate-400 mt-4 bg-slate-100 inline-block px-3 py-1.5 rounded">
          REQ_ID: {error.digest}
        </p>
      )}

      <div className="flex gap-2 mt-8">
        <button
          onClick={reset}
          className="px-6 py-3 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-200/60"
        >
          ↻ 다시 시도
        </button>
        <a
          href="/"
          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors"
        >
          홈으로
        </a>
      </div>
    </div>
  );
}
