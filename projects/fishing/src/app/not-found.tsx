import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-6xl mb-4">🎣</div>
      <h1 className="text-2xl font-black text-slate-100 mb-2">낚시 포인트를 못 찾았어요</h1>
      <p className="text-slate-400 mb-6">요청하신 페이지가 없거나 이동되었습니다.</p>
      <Link href="/" className="px-6 py-3 bg-ocean-700 hover:bg-ocean-600 text-white rounded-2xl font-bold transition-colors">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
