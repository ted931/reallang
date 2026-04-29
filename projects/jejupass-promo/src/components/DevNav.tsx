'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PAGES = [
  { href: '/', label: '랜딩', emoji: '🏠', step: '1' },
  { href: '/explore', label: '가게 탐색', emoji: '🔍', step: '2' },
  { href: '/register', label: '가게 등록', emoji: '📝', step: '3' },
  { href: '/shop/sunset-cafe-a1b2c3', label: '가게 상세', emoji: '🏪', step: '3-1' },
  { href: '/dashboard', label: '대시보드', emoji: '📊', step: '4' },
  { href: '/dashboard/sns', label: 'SNS 관리', emoji: '📸', step: '4-1' },
  { href: '/dashboard/cafepass', label: '카페패스 신청', emoji: '☕', step: '4-2' },
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
              <span className="text-[9px] text-gray-400 mr-1">{item.step}</span>{item.emoji} {item.label}
            </Link>
          );
        })}
        <span className="px-2 py-1.5 text-[10px] text-gray-500 whitespace-nowrap">← 테스트용 네비</span>
      </div>
    </div>
  );
}
