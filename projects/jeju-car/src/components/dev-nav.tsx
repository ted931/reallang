"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/", label: "차종 추천", emoji: "🚗", step: "1" },
  { href: "/fuel", label: "주유 가이드", emoji: "⛽", step: "2" },
  { href: "/cost", label: "비용 계산", emoji: "💰", step: "3" },
];

export function DevNav() {
  const pathname = usePathname();
  return (
    <div className="bg-gray-900 text-white sticky top-0 z-[9999]">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-500 mr-1 whitespace-nowrap">렌터카</span>
        {PAGES.map((item) => (
          <Link key={item.href} href={item.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
              pathname === item.href ? "bg-emerald-500 text-white" : "bg-gray-700 hover:bg-gray-600"
            }`}>
            <span className="text-[9px] text-gray-400 mr-1">{item.step}</span>{item.emoji} {item.label}
          </Link>
        ))}
        <a href="/" className="text-[10px] text-gray-400 hover:text-white ml-auto whitespace-nowrap">🏠 홈</a>
      </div>
    </div>
  );
}
