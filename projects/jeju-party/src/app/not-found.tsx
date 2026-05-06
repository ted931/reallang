import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
      {/* 큰 404 */}
      <p className="font-black tracking-tighter leading-none text-slate-200 select-none"
        style={{ fontSize: "clamp(80px, 25vw, 160px)" }}>
        404
      </p>
      <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400 -mt-2 mb-6">
        PAGE_NOT_FOUND
      </p>

      <h1 className="text-2xl font-black text-slate-900">
        페이지를 찾을 수 없어요
      </h1>
      <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-xs">
        찾으시는 페이지가 사라졌거나 이동했어요.
        <br />
        홈에서 다시 시작해 주세요.
      </p>

      <div className="flex gap-2 mt-8">
        <Link
          href="/"
          className="px-6 py-3 bg-orange-500 text-white text-sm font-extrabold rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-200/60"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
