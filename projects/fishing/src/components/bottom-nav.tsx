"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  {
    href: "/", key: "home", label: "홈",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2V9Z"/></svg>,
  },
  {
    href: "/feed", key: "feed", label: "조황피드",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/><path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/><path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/></svg>,
  },
  {
    href: "/booking", key: "booking", label: "예약",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    href: "/coupon", key: "coupon", label: "쿠폰",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  },
  {
    href: "/map", key: "map", label: "지도",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3Z"/><path d="M9 3v15M15 6v15"/></svg>,
  },
];

const DRAWER_GROUPS = [
  {
    group: "🎣 낚시 정보",
    items: [
      { href: "/catch", label: "조황", icon: "🐟" },
      { href: "/tide", label: "물때", icon: "🌊" },
      { href: "/fish-guide", label: "어종 도감", icon: "📖" },
      { href: "/eoshin", label: "어신 AI", icon: "🤖", badge: "AI" },
      { href: "/news", label: "낚시 뉴스", icon: "📰" },
    ],
  },
  {
    group: "🏝️ 예약·쇼핑",
    items: [
      { href: "/jwaedae", label: "좌대 예약", icon: "🪑" },
      { href: "/stay", label: "낚시 숙소", icon: "🏠" },
      { href: "/rentcar", label: "땡처리 렌트", icon: "🚗" },
      { href: "/shop", label: "채비·미끼 주문", icon: "🛒" },
      { href: "/market", label: "중고마켓", icon: "🏪" },
    ],
  },
  {
    group: "✨ 특별 서비스",
    items: [
      { href: "/match", label: "합동출조 매칭", icon: "🤝" },
      { href: "/hookup", label: "훅업", icon: "🎯" },
      { href: "/seongsang", label: "선상 파티", icon: "🚢" },
      { href: "/mulban", label: "물반고기반", icon: "🐠" },
      { href: "/ranking", label: "랭킹", icon: "🏆" },
    ],
  },
  {
    group: "👤 내 활동",
    items: [
      { href: "/logbook", label: "낚시 일지", icon: "📒" },
      { href: "/planner", label: "출조 플래너", icon: "📅" },
      { href: "/analytics", label: "내 어종 분석", icon: "📊" },
      { href: "/challenges", label: "챌린지", icon: "🎖️" },
      { href: "/gathering", label: "동아리", icon: "👥" },
      { href: "/community", label: "커뮤니티", icon: "💬" },
      { href: "/mypage", label: "내 예약", icon: "👤" },
    ],
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <nav className="fl-bnav">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={`fl-bnav-item${active ? " active" : ""}`}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
        {/* 더보기 버튼 */}
        <button
          className={`fl-bnav-item${drawerOpen ? " active" : ""}`}
          onClick={() => setDrawerOpen(v => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
          <span>더보기</span>
        </button>
      </nav>

      {/* 드로어 오버레이 */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 49, background: "rgba(0,0,0,0.5)" }}
        />
      )}

      {/* 전체 메뉴 드로어 */}
      <div style={{
        position: "fixed",
        bottom: drawerOpen ? 60 : "-100%",
        left: 0, right: 0,
        zIndex: 50,
        maxHeight: "75vh",
        overflowY: "auto",
        background: "var(--ocean-950, #fff)",
        borderRadius: "20px 20px 0 0",
        borderTop: "1px solid var(--line)",
        transition: "bottom 0.3s cubic-bezier(0.32,0.72,0,1)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {/* 드래그 핸들 */}
        <div style={{ padding: "12px 0 4px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--tint-15)" }} />
        </div>

        {/* 헤더 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 20px 16px" }}>
          <div style={{ fontWeight: 900, fontSize: 16, color: "var(--text-strong)" }}>전체 메뉴</div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{ background: "var(--tint-06)", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "var(--text-dim)", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}
          >닫기</button>
        </div>

        {/* 그룹별 메뉴 */}
        <div style={{ padding: "0 16px 24px" }}>
          {DRAWER_GROUPS.map(group => (
            <div key={group.group} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-mute)", letterSpacing: 0.5, marginBottom: 8, paddingLeft: 4 }}>
                {group.group}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                {group.items.map(item => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        padding: "12px 4px",
                        background: active ? "rgba(233,78,59,0.08)" : "var(--tint-04)",
                        border: `1px solid ${active ? "rgba(233,78,59,0.25)" : "var(--line)"}`,
                        borderRadius: 12,
                        textDecoration: "none",
                        position: "relative",
                      }}
                    >
                      <span style={{ fontSize: 22 }}>{item.icon}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: active ? "var(--hook)" : "var(--text-dim)", textAlign: "center", lineHeight: 1.3 }}>
                        {item.label}
                      </span>
                      {"badge" in item && item.badge && (
                        <span style={{
                          position: "absolute", top: 4, right: 4,
                          fontSize: 8, fontWeight: 800, padding: "1px 4px",
                          background: "rgba(233,78,59,0.15)", color: "var(--hook)",
                          border: "1px solid rgba(233,78,59,0.3)", borderRadius: 4,
                        }}>{item.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
