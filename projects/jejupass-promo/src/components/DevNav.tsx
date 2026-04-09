'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PAGES = [
  { href: '/', label: '랜딩', emoji: '🏠' },
  { href: '/register', label: '가게등록', emoji: '📝' },
  { href: '/explore', label: '가게탐색', emoji: '🔍' },
  { href: '/shop/sunset-cafe-a1b2c3', label: '가게상세', emoji: '🏪' },
  { href: '/dashboard', label: '대시보드', emoji: '📊' },
  { href: '/dashboard/sns', label: 'SNS생성', emoji: '📸' },
];

export default function DevNav() {
  const pathname = usePathname();

  return (
    <div className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
        {PAGES.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                isActive ? 'bg-orange-500 text-white' : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {item.emoji} {item.label}
            </Link>
          );
        })}
        <span className="px-2 py-1.5 text-[10px] text-gray-500 whitespace-nowrap">← 테스트용 네비</span>
      </div>
    </div>
  );
}
