"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const USER_STEPS = [
  { href: "/", label: "홈", step: 1 },
  { href: "/catch", label: "조황", step: 2 },
  { href: "/catch/upload", label: "조황등록", step: 3 },
  { href: "/jwaedae", label: "좌대예약", step: 4 },
  { href: "/jwaedae/jw1/checkout", label: "결제", step: 5 },
  { href: "/mypage", label: "마이페이지", step: 6 },
  { href: "/rentcar", label: "렌터카", step: 7 },
  { href: "/stay", label: "숙소", step: 8 },
  { href: "/stay/share", label: "방쉐어", step: 9 },
  { href: "/tide", label: "물때", step: 10 },
  { href: "/ranking", label: "랭킹", step: 11 },
  { href: "/market", label: "중고마켓", step: 12 },
  { href: "/market/sell", label: "판매등록", step: 13 },
  { href: "/logbook", label: "낚시일지", step: 14 },
  { href: "/coupon", label: "쿠폰", step: 15 },
  { href: "/community", label: "커뮤니티", step: 16 },
  { href: "/community/write", label: "글쓰기", step: 17 },
  { href: "/gathering", label: "동아리", step: 18 },
  { href: "/map", label: "포인트지도", step: 19 },
  { href: "/planner", label: "출조플래너", step: 20 },
  { href: "/fish-guide", label: "어종도감", step: 21 },
  { href: "/challenges", label: "챌린지", step: 22 },
  { href: "/cost", label: "비용계산기", step: 23 },
  { href: "/news", label: "뉴스", step: 24 },
  { href: "/blog", label: "블로그초안", step: 25 },
];

const BIZ_STEPS = [
  { href: "/biz", label: "사장님홈", step: 1 },
  { href: "/biz/register", label: "업체등록", step: 2 },
  { href: "/biz/dashboard", label: "대시보드", step: 3 },
];

export default function DevNav() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    try { setIsInIframe(window.self !== window.top); } catch { setIsInIframe(true); }
  }, []);

  useEffect(() => {
    setSearch(window.location.search);
  }, []);

  const currentUrl = pathname + search;
  const activeUserIdx = USER_STEPS.findIndex((s) => currentUrl === s.href);
  const activeBizIdx = BIZ_STEPS.findIndex((s) => currentUrl === s.href);

  if (isInIframe) return null;

  const navContent = (
    <nav className="sticky top-0 z-[9999] bg-gray-900 border-b border-gray-800 overflow-x-auto">
      <div className="flex items-center px-2 py-1.5 min-w-max">

        {/* PC / MO 토글 */}
        <div className="flex items-center bg-gray-800 rounded-md p-0.5 mr-3 shrink-0">
          <button
            onClick={() => setIsMobile(false)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              !isMobile ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            🖥 PC
          </button>
          <button
            onClick={() => setIsMobile(true)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
              isMobile ? "bg-orange-500 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            📱 MO
          </button>
        </div>

        <div className="w-px h-4 bg-gray-700 mr-3 shrink-0" />

        {/* 낚시꾼 플로우 */}
        <span className="text-[10px] text-gray-600 mr-1 shrink-0">🎣 유저</span>
        {USER_STEPS.map((page, idx) => {
          const isActive = idx === activeUserIdx;
          const isPast = activeUserIdx >= 0 && idx < activeUserIdx;
          return (
            <div key={page.href} className="flex items-center">
              <Link href={page.href} scroll={false} className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-all ${isActive ? "bg-cyan-600 text-white" : isPast ? "text-cyan-400 hover:bg-gray-700" : "text-gray-500 hover:text-white hover:bg-gray-700"}`}>
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${isActive ? "bg-white text-cyan-600" : isPast ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-700 text-gray-500"}`}>{page.step}</span>
                {page.label}
              </Link>
              {idx < USER_STEPS.length - 1 && <span className={`mx-0.5 text-[10px] ${isPast ? "text-cyan-400 opacity-40" : "text-gray-700"}`}>›</span>}
            </div>
          );
        })}

        {/* 구분선 */}
        <div className="mx-2 h-4 w-px bg-gray-700 shrink-0" />

        {/* 사장님 플로우 */}
        <span className="text-[10px] text-amber-600 mr-1 shrink-0">🏪 사장님</span>
        {BIZ_STEPS.map((page, idx) => {
          const isActive = idx === activeBizIdx;
          const isPast = activeBizIdx >= 0 && idx < activeBizIdx;
          return (
            <div key={page.href} className="flex items-center">
              <Link href={page.href} scroll={false} className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-all ${isActive ? "bg-amber-600 text-white" : isPast ? "text-amber-400 hover:bg-gray-700" : "text-gray-500 hover:text-white hover:bg-gray-700"}`}>
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${isActive ? "bg-white text-amber-600" : isPast ? "bg-amber-400/20 text-amber-400" : "bg-gray-700 text-gray-500"}`}>{page.step}</span>
                {page.label}
              </Link>
              {idx < BIZ_STEPS.length - 1 && <span className={`mx-0.5 text-[10px] ${isPast ? "text-amber-400 opacity-40" : "text-gray-700"}`}>›</span>}
            </div>
          );
        })}

        <span className="ml-auto text-[10px] text-gray-600 pl-3 flex-shrink-0">🎣 피싱로그 dev</span>
      </div>
    </nav>
  );

  if (isMobile) {
    return (
      <>
        {navContent}
        {/* Mobile iframe preview overlay */}
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          zIndex: 9998, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <div style={{ color: '#9ca3af', fontSize: 12, fontWeight: 700 }}>
            📱 MOBILE PREVIEW — 375px · {pathname}
          </div>
          <div style={{
            position: 'relative', width: 375, height: 667,
            borderRadius: 36, overflow: 'hidden',
            boxShadow: '0 0 0 12px #1f2937, 0 0 0 14px #374151, 0 40px 80px rgba(0,0,0,0.8)',
            background: '#0a1628',
          }}>
            <iframe
              src={pathname + search}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              title="Mobile Preview"
            />
          </div>
          <button
            onClick={() => setIsMobile(false)}
            style={{
              padding: '8px 20px', background: '#f59e0b', color: '#0a1628',
              border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer',
            }}
          >
            ✕ 닫기
          </button>
        </div>
      </>
    );
  }

  return navContent;
}
