"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", icon: "🏠", label: "홈" },
  { href: "/map", icon: "🗺️", label: "지도" },
  { href: "/jwaedae", icon: "🛖", label: "좌대" },
  { href: "/community", icon: "💬", label: "커뮤니티" },
  { href: "/gathering", icon: "🤝", label: "모임" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden z-50 bg-ocean-950/95 backdrop-blur border-t border-ocean-800">
      <div className="flex">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${active ? "text-hook" : "text-slate-500 hover:text-slate-300"}`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
