"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PAGES = [
  { href: "/", label: "대시보드", emoji: "📊" },
  { href: "/promo", label: "홍보", emoji: "🏪" },
  { href: "/cs", label: "CS챗봇", emoji: "💬" },
];

export function DevNav() {
  const pathname = usePathname();
  return (
    <div className="bg-gray-900 text-white sticky top-0 z-[9999]">
      <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-500 mr-1 whitespace-nowrap">비즈니스</span>
        {PAGES.map((item) => (
          <Link key={item.href} href={item.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
              pathname === item.href ? "bg-amber-500 text-white" : "bg-gray-700 hover:bg-gray-600"
            }`}>
            {item.emoji} {item.label}
          </Link>
        ))}
        <a href="/" className="text-[10px] text-gray-400 hover:text-white ml-auto whitespace-nowrap">🏠 홈</a>
      </div>
    </div>
  );
}
