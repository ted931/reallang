"use client";

export default function Header() {
  return (
    <div className="fl-header">
      <div className="fl-logo">
        <div className="fl-logo-mark">
          <svg width="32" height="29" viewBox="0 0 46 42" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="13" cy="32" rx="11" ry="3.5" fill="#5fa3cf" opacity="0.4"/>
            <circle cx="13" cy="14" r="10" fill="#fbbf24"/>
            <circle cx="10" cy="11" r="2.4" fill="#fff" opacity="0.85"/>
            <path d="M28 18 Q 36 10 42 18 Q 38 22 32 22 Q 28 22 28 18 Z" fill="#1e6595"/>
            <path d="M42 18 L 46 14 L 46 22 Z" fill="#1e6595"/>
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
