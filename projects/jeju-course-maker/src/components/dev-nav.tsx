"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/", label: "AI 코스 메이커", emoji: "🗺️", step: "1" },
];

const RELATED = [
  { href: "/travel", label: "여행플래너", emoji: "✈️" },
  { href: "/weather", label: "날씨", emoji: "🌤️" },
  { href: "/map", label: "지도", emoji: "📍" },
];

export function DevNav() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-900 text-white sticky top-0 z-[9999]">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-500 mr-1 whitespace-nowrap">제주코스</span>
        {PAGES.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                isActive ? "bg-violet-500 text-white" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <span className="text-[9px] text-gray-400 mr-1">{item.step}</span>{item.emoji} {item.label}
            </Link>
          );
        })}
        <span className="w-px h-6 bg-gray-700 self-center flex-shrink-0" />
        {RELATED.map((item) => (
          <a key={item.href} href={item.href}
            className="px-2 py-1 rounded text-[10px] text-gray-400 hover:text-gray-200 whitespace-nowrap flex-shrink-0">
            {item.emoji} {item.label}
          </a>
        ))}
        <span className="text-[10px] text-gray-600 ml-auto whitespace-nowrap"><a href="/" class="text-[10px] text-gray-400 hover:text-white">🏠 홈</a> · 테스트 네비</span>
      </div>
    </div>
  );
}
