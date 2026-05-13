"use client";

export default function Header() {
  return (
    <div className="fl-header">
      <div className="fl-logo">
        <div className="fl-logo-mark">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>
            <path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/>
            <path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/>
          </svg>
        </div>
        <div className="fl-logo-text">
          <div className="fl-logo-1">퐁당</div>
          <div className="fl-logo-2">제주 · 애월</div>
        </div>
      </div>
      <div className="fl-header-actions">
        <button className="fl-icon-btn" aria-label="검색">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        </button>
        <button className="fl-icon-btn" aria-label="알림">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span className="fl-dot" />
        </button>
      </div>
    </div>
  );
}
