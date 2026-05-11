"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const USER_STEPS = [
  { href: "/", label: "홈피드", step: 1 },
  { href: "/catch", label: "조황", step: 2 },
  { href: "/catch/cr1", label: "조황상세", step: 3 },
  { href: "/catch/upload", label: "사진등록", step: 4 },
  { href: "/jwaedae", label: "좌대목록", step: 5 },
  { href: "/jwaedae/jw1", label: "좌대상세", step: 6 },
  { href: "/jwaedae/jw1/checkout", label: "결제", step: 7 },
  { href: "/jwaedae/jw1/checkout/complete", label: "완료", step: 8 },
  { href: "/mypage", label: "내예약", step: 9 },
  { href: "/carshare", label: "카풀", step: 10 },
  { href: "/carshare/cs1", label: "카풀상세", step: 11 },
  { href: "/stay", label: "숙소", step: 12 },
  { href: "/stay/st1", label: "숙소상세", step: 13 },
  { href: "/stay/share", label: "방쉐어", step: 14 },
  { href: "/tide", label: "물때", step: 15 },
  { href: "/ranking", label: "랭킹", step: 16 },
  { href: "/market", label: "중고마켓", step: 17 },
  { href: "/market/mk1", label: "마켓상세", step: 18 },
  { href: "/logbook", label: "낚시일지", step: 19 },
  { href: "/coupon", label: "쿠폰", step: 20 },
  { href: "/community", label: "커뮤니티", step: 21 },
  { href: "/gathering", label: "모임", step: 22 },
  { href: "/map", label: "포인트지도", step: 23 },
  { href: "/market/sell", label: "판매등록", step: 24 },
  { href: "/community/write", label: "글쓰기", step: 25 },
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

  useEffect(() => {
    setSearch(window.location.search);
  }, []);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;
    if (isMobile) {
      main.style.maxWidth = "375px";
      main.style.margin = "0 auto";
      main.style.boxShadow = "0 0 0 9999px rgba(0,0,0,0.5)";
      main.style.position = "relative";
    } else {
      main.style.maxWidth = "";
      main.style.margin = "";
      main.style.boxShadow = "";
      main.style.position = "";
    }
  }, [isMobile]);

  const currentUrl = pathname + search;
  const activeUserIdx = USER_STEPS.findIndex((s) => currentUrl === s.href);
  const activeBizIdx = BIZ_STEPS.findIndex((s) => currentUrl === s.href);

  return (
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
}
