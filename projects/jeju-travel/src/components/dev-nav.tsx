"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/", label: "홈", emoji: "🏠", step: "1" },
  { href: "/weather", label: "날씨", emoji: "🌤️", step: "2" },
  { href: "/course", label: "코스 메이커", emoji: "🧭", step: "3" },
  { href: "/planner", label: "여행 일정", emoji: "✈️", step: "4" },
  { href: "/map", label: "여행 지도", emoji: "🗺️", step: "5" },
  { href: "/drive", label: "드라이브 코스", emoji: "🛣️", step: "6" },
];

export function DevNav() {
  const pathname = usePathname();
  return (
    <div className="bg-gray-900 text-white sticky top-0 z-[9999]">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-500 mr-1 whitespace-nowrap">제주여행</span>
        {PAGES.map((item) => (
          <Link key={item.href} href={item.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
              pathname === item.href ? "bg-sky-500 text-white" : "bg-gray-700 hover:bg-gray-600"
            }`}>
            <span className="text-[9px] text-gray-400 mr-1">{item.step}</span>{item.emoji} {item.label}
          </Link>
        ))}
        <a href="/" className="text-[10px] text-gray-400 hover:text-white ml-auto whitespace-nowrap">🏠 홈</a>
      </div>
    </div>
  );
}
