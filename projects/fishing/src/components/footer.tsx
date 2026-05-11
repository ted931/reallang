export default function Footer() {
  return (
    <footer className="bg-ocean-950 border-t border-ocean-800 py-8 px-4 mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎣</span>
            <span className="font-black text-slate-100">피싱로그</span>
            <span className="text-slate-500 text-sm">— 제주 낚시 커뮤니티</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>© 2026 피싱로그</span>
            <span>·</span>
            <a href="/biz" className="text-hook hover:text-hook-light font-bold transition-colors">🏪 사장님 업체 등록</a>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-slate-600">
          낚시 정보는 참고용입니다. 출조 전 해상 기상 및 안전 장비를 반드시 확인하세요.
        </div>
      </div>
    </footer>
  );
}
