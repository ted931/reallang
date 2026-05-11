"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = [
  { href: "/", label: "홈피드", step: 1 },
  { href: "/catch", label: "조황", step: 2 },
  { href: "/catch/cr1", label: "조황상세", step: 3 },
  { href: "/jwaedae", label: "좌대목록", step: 4 },
  { href: "/jwaedae/jw1", label: "좌대상세", step: 5 },
  { href: "/community", label: "커뮤니티", step: 6 },
  { href: "/community/pt7", label: "게시글", step: 7 },
  { href: "/gathering", label: "모임", step: 8 },
  { href: "/gathering/g1", label: "모임상세", step: 9 },
  { href: "/map", label: "포인트지도", step: 10 },
];

export default function DevNav() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
  }, []);

  const currentUrl = pathname + search;

  const activeIdx = STEPS.findIndex((s) => currentUrl === s.href);

  return (
    <nav className="sticky top-0 z-[9999] bg-gray-900 overflow-x-auto border-b border-gray-800">
      <div className="flex items-center px-2 py-1.5 min-w-max">
        {STEPS.map((page, idx) => {
          const isActive = idx === activeIdx;
          const isPast = activeIdx >= 0 && idx < activeIdx;

          return (
            <div key={page.href} className="flex items-center">
              <a
                href={page.href}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-cyan-600 text-white"
                    : isPast
                    ? "text-cyan-400 hover:bg-gray-700"
                    : "text-gray-500 hover:text-white hover:bg-gray-700"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${
                  isActive ? "bg-white text-cyan-600" : isPast ? "bg-cyan-400/20 text-cyan-400" : "bg-gray-700 text-gray-500"
                }`}>
                  {page.step}
                </span>
                {page.label}
              </a>
              {idx < STEPS.length - 1 && (
                <span className={`mx-0.5 text-[10px] ${isPast ? "text-cyan-400 opacity-40" : "text-gray-700"}`}>›</span>
              )}
            </div>
          );
        })}
        <span className="ml-auto text-[10px] text-gray-600 pl-3 flex-shrink-0">🎣 피싱로그 dev</span>
      </div>
    </nav>
  );
}
