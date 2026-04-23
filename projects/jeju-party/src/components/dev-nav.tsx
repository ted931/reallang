"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = [
  // 호스트 플로우
  { href: "/", label: "피드", step: 1, flow: "host" as const },
  { href: "/create", label: "만들기", step: 2, flow: "host" as const },
  { href: "/create?step=done", label: "생성됨", step: 3, flow: "host" as const },
  // 참여자 플로우
  { href: "/party/p1", label: "렌터카", step: 4, flow: "user" as const },
  { href: "/party/p3", label: "상세", step: 5, flow: "user" as const },
  { href: "/party/p3?modal=join&step=info", label: "신청", step: 6, flow: "user" as const },
  { href: "/party/p9?modal=join&step=paying", label: "결제", step: 7, flow: "user" as const },
  { href: "/party/p3?modal=join&step=pass-offer", label: "업셀", step: 8, flow: "user" as const },
  { href: "/party/p3?modal=pass&step=paying", label: "패스", step: 9, flow: "user" as const },
  { href: "/party/p3?modal=join&step=done", label: "완료", step: 10, flow: "user" as const },
];

export default function DevNav() {
  const pathname = usePathname();
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch(window.location.search);
  }, []);

  const currentUrl = pathname.replace(base, "") + search;
  const baseStripped = currentUrl;

  const activeIdx = STEPS.findIndex((s) => {
    const stepUrl = s.href;
    return baseStripped === stepUrl;
  });

  const colors = {
    host: { active: "bg-violet-500", past: "text-violet-400", pastBg: "bg-violet-400/20", dot: "text-violet-500" },
    user: { active: "bg-orange-500", past: "text-orange-400", pastBg: "bg-orange-400/20", dot: "text-orange-500" },
  };

  return (
    <nav className="sticky top-0 z-[9999] bg-gray-900 overflow-x-auto">
      <div className="flex items-center px-2 py-1.5 min-w-max">
        {STEPS.map((page, idx) => {
          const full = base + page.href;
          const isActive = idx === activeIdx;
          const isPast = activeIdx >= 0 && idx < activeIdx;
          const c = colors[page.flow];
          const showDivider = idx === 3; // 호스트/참여자 구분 (after step 3 "생성됨")

          return (
            <div key={page.href} className="flex items-center">
              {showDivider && (
                <div className="mx-1.5 h-4 w-px bg-gray-700" />
              )}
              <a
                href={full}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? `${c.active} text-white`
                    : isPast
                    ? `${c.past} hover:bg-gray-700`
                    : "text-gray-500 hover:text-white hover:bg-gray-700"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 ${
                  isActive ? `bg-white ${c.dot}` : isPast ? `${c.pastBg} ${c.past}` : "bg-gray-700 text-gray-500"
                }`}>
                  {page.step}
                </span>
                {page.label}
              </a>
              {idx < STEPS.length - 1 && !showDivider && idx !== 2 && (
                <span className={`mx-0.5 text-[10px] ${isPast ? `${c.past} opacity-40` : "text-gray-700"}`}>›</span>
              )}
            </div>
          );
        })}
        <span className="ml-auto text-[10px] text-gray-600 pl-3 flex-shrink-0">테스트 네비 (v2 안전)</span>
      </div>
    </nav>
  );
}
