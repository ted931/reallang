"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/", label: "날씨 지도", emoji: "🌤️", step: "1" },
  { href: "/forecast", label: "날씨 예보", emoji: "📊", step: "2" },
];

export function DevNav() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-900 text-white sticky top-0 z-[9999]">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-500 mr-1 whitespace-nowrap">제주날씨</span>
        {PAGES.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                isActive ? "bg-cyan-500 text-white" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <span className="text-[9px] text-gray-400 mr-1">{item.step}</span>{item.emoji} {item.label}
            </Link>
          );
        })}
        <span className="text-[10px] text-gray-600 ml-auto whitespace-nowrap"><a href="/" class="text-[10px] text-gray-400 hover:text-white">🏠 홈</a> · 테스트 네비</span>
      </div>
    </div>
  );
}
