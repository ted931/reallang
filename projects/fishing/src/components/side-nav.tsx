"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_GROUPS = [
  {
    group: '🔥 핵심',
    items: [
      { href: "/", key: "home", label: "홈", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2V9Z"/></svg> },
      { href: "/feed", key: "feed", label: "조황 피드", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/><path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/></svg>, badge: 'NEW' },
      { href: "/booking", key: "booking", label: "간편 예약", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, badge: 'NEW' },
      { href: "/match", key: "match", label: "합동출조 매칭", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, badge: 'NEW' },
      { href: "/coupon", key: "coupon", label: "쿠폰 허브", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>, badge: 'HOT' },
      { href: "/ranking", key: "ranking", label: "랭킹", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> },
      { href: "/analytics", key: "analytics", label: "내 어종 분석", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>, badge: 'NEW' },
    ]
  },
  {
    group: '🎣 낚시 정보',
    items: [
      { href: "/catch", key: "catch", label: "조황", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/><path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/></svg> },
      { href: "/tide", key: "tide", label: "물때", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/></svg> },
      { href: "/map", key: "map", label: "포인트 지도", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></svg> },
      { href: "/fish-guide", key: "fish-guide", label: "어종 도감", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/><path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/><circle cx="15" cy="12" r="1"/></svg> },
      { href: "/news", key: "news", label: "낚시 뉴스", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg> },
      { href: "/eoshin", key: "eoshin", label: "어신 AI", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12 2 12"/><path d="m15 9 3-3 3 3"/><path d="M18 6v8"/></svg>, badge: 'AI' },
    ]
  },
  {
    group: '🏝️ 예약·쇼핑',
    items: [
      { href: "/jwaedae", key: "seat", label: "좌대 예약", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"/><path d="M3 14a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3v-3Z"/><path d="M5 17v3"/><path d="M19 17v3"/></svg> },
      { href: "/stay", key: "stay", label: "낚시 숙소", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z"/></svg> },
      { href: "/rentcar", key: "rentcar", label: "땡처리 렌트", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/><circle cx="9" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M14 3v4a1 1 0 0 0 1 1h4"/></svg> },
      { href: "/shop", key: "shop", label: "채비·미끼 주문", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>, badge: 'NEW' },
      { href: "/market", key: "market", label: "중고마켓", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
    ]
  },
  {
    group: '👥 커뮤니티',
    items: [
      { href: "/gathering", key: "gathering", label: "동아리", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
      { href: "/community", key: "community", label: "커뮤니티", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
      { href: "/challenges", key: "challenges", label: "챌린지", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg> },
    ]
  },
  {
    group: '📋 내 활동',
    items: [
      { href: "/logbook", key: "logbook", label: "낚시 일지", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
      { href: "/planner", key: "planner", label: "출조 플래너", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg> },
      { href: "/mypage", key: "mypage", label: "내 예약", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg> },
      { href: "/blog", key: "blog", label: "블로그 초안", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
      { href: "/cost", key: "cost", label: "비용 계산기", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
    ]
  },
  {
    group: '🏢 업체',
    items: [
      { href: "/biz", key: "biz", label: "업체 대시보드", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
    ]
  },
];

export default function SideNav() {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("fl-theme");
    const dark = saved === "deep";
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "deep" : "coastal");
  }, []);

  function toggleTheme() {
    const next = isDark ? "coastal" : "deep";
    setIsDark(!isDark);
    localStorage.setItem("fl-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <aside className="fl-side-nav">
      <Link href="/" className="fl-side-brand">
        <div className="fl-logo-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/><path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/></svg>
        </div>
        <div>
          <div className="fl-logo-1">퐁당</div>
          <div className="fl-logo-2">제주 · 애월</div>
        </div>
      </Link>
      <nav className="fl-side-list">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--text-mute)', letterSpacing: '0.6px', padding: '10px 12px 4px', textTransform: 'uppercase' }}>{group.group}</div>
            {group.items.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} className={`fl-side-item${active ? " active" : ""}`} style={{ position: 'relative' }}>
                  {item.icon}
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, padding: '2px 5px', borderRadius: 4,
                      background: item.badge === 'HOT' ? 'rgba(239,68,68,0.15)' : 'rgba(233,78,59,0.15)',
                      color: item.badge === 'HOT' ? '#ef4444' : 'var(--hook-300)',
                      border: item.badge === 'HOT' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(233,78,59,0.3)',
                    }}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="fl-side-foot">
        <button onClick={toggleTheme} className="fl-side-theme-btn">
          <span>{isDark ? "☀️" : "🌙"}</span>
          <span>{isDark ? "라이트 모드" : "다크 모드"}</span>
        </button>
        <div className="fl-side-profile">
          <div className="fl-avatar fl-side-avatar">T</div>
          <div>
            <div className="fl-side-name">낚시인</div>
            <div className="fl-side-lvl">조사 Lv.12</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
