'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GROUPS = [
  {
    label: '공개',
    color: '#3B82F6',
    pages: [
      { href: '/', label: '홈', emoji: '🏠' },
      { href: '/explore', label: '탐색', emoji: '🔍' },
      { href: '/shop/sunset-cafe-a1b2c3', label: '가게 상세', emoji: '🏪' },
    ],
  },
  {
    label: '가입/등록',
    color: '#8B5CF6',
    pages: [
      { href: '/signup', label: '회원가입', emoji: '✍️' },
      { href: '/login', label: '로그인', emoji: '🔑' },
      { href: '/register', label: '가게 등록', emoji: '📝' },
    ],
  },
  {
    label: '대시보드',
    color: '#F97316',
    pages: [
      { href: '/dashboard', label: '대시보드', emoji: '📊' },
      { href: '/dashboard/shop/shop-001/edit', label: '가게 관리', emoji: '🛠️' },
      { href: '/dashboard/sns', label: 'SNS', emoji: '📸' },
      { href: '/dashboard/cafepass', label: '카페패스', emoji: '☕' },
    ],
  },
];

export default function DevNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 border-b border-white/10"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="px-3 py-1.5 flex items-center gap-3 overflow-x-auto scrollbar-hide">
        {/* 뱃지 */}
        <span className="flex-shrink-0 text-[10px] font-bold tracking-widest text-gray-500 uppercase select-none pr-1 border-r border-gray-700">
          DEV
        </span>

        {GROUPS.map((group, gi) => (
          <div key={gi} className="flex items-center gap-1 flex-shrink-0">
            {/* 그룹 라벨 */}
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full mr-0.5"
              style={{ color: group.color, backgroundColor: `${group.color}20` }}>
              {group.label}
            </span>

            {group.pages.map((page) => {
              const isActive = pathname === page.href;
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all"
                  style={isActive
                    ? { backgroundColor: group.color, color: '#fff' }
                    : { color: '#94a3b8' }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <span className="text-[12px]">{page.emoji}</span>
                  {page.label}
                </Link>
              );
            })}

            {gi < GROUPS.length - 1 && (
              <span className="w-px h-4 bg-gray-700 mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
