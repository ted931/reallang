"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STEPS = [
  { href: "/", label: "홈", step: 1 },
  { href: "/onboarding", label: "성향입력", step: 2 },
  { href: "/recommend", label: "추천결과", step: 3 },
  { href: "/course", label: "코스편집", step: 4 },
  { href: "/place/r1", label: "장소상세", step: 5 },
  { href: "/mypage", label: "마이페이지", step: 6 },
];

export default function DevNav() {
  const pathname = usePathname();
  const [isInIframe, setIsInIframe] = useState(false);
  useEffect(() => {
    try { setIsInIframe(window.self !== window.top); } catch { setIsInIframe(true); }
  }, []);
  if (isInIframe) return null;

  const activeIdx = STEPS.findIndex((s) => pathname === s.href || pathname.startsWith(s.href + "/"));

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999, background: "#111827", borderBottom: "1px solid #1f2937", overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "6px 12px", minWidth: "max-content", gap: 2 }}>
        <span style={{ fontSize: 11, color: "#6b7280", marginRight: 8, flexShrink: 0 }}>🌿 Travel Pick</span>
        {STEPS.map((s, idx) => {
          const isActive = idx === activeIdx;
          const isPast = activeIdx >= 0 && idx < activeIdx;
          return (
            <div key={s.href} style={{ display: "flex", alignItems: "center" }}>
              <Link href={s.href} scroll={false} style={{
                display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6,
                fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", textDecoration: "none",
                background: isActive ? "#2a9a82" : "transparent",
                color: isActive ? "#fff" : isPast ? "#4db39b" : "#6b7280",
                transition: "all 0.15s",
              }}>
                <span style={{
                  width: 14, height: 14, borderRadius: "50%", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 8, fontWeight: 800, flexShrink: 0,
                  background: isActive ? "#fff" : isPast ? "rgba(77,179,155,0.2)" : "#1f2937",
                  color: isActive ? "#2a9a82" : isPast ? "#4db39b" : "#6b7280",
                }}>{s.step}</span>
                {s.label}
              </Link>
              {idx < STEPS.length - 1 && <span style={{ color: "#374151", fontSize: 10, margin: "0 2px" }}>›</span>}
            </div>
          );
        })}
        <span style={{ marginLeft: "auto", paddingLeft: 16, fontSize: 10, color: "#4b5563", flexShrink: 0 }}>dev</span>
      </div>
    </nav>
  );
}
