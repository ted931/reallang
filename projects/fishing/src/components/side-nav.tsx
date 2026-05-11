"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", key: "home", label: "홈", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2V9Z"/></svg> },
  { href: "/catch", key: "catch", label: "조황", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/><path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/></svg> },
  { href: "/jwaedae", key: "seat", label: "좌대 예약", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"/><path d="M3 14a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3v-3Z"/><path d="M5 17v3"/><path d="M19 17v3"/></svg> },
  { href: "/gathering", key: "gathering", label: "낚시 모임", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { href: "/tide", key: "tide", label: "물때", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/></svg> },
  { href: "/ranking", key: "ranking", label: "랭킹", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg> },
  { href: "/market", key: "market", label: "중고마켓", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
  { href: "/map", key: "map", label: "포인트 지도", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></svg> },
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
          <div className="fl-logo-1">피싱로그</div>
          <div className="fl-logo-2">제주 · 애월</div>
        </div>
      </Link>
      <nav className="fl-side-list">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`fl-side-item${active ? " active" : ""}`}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
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
