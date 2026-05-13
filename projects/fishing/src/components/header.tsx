"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const NOTIFICATIONS = [
  { id: 1, icon: "🎣", text: "갈치왕김씨님이 합동출조 신청을 수락했습니다", time: "5분 전", unread: true },
  { id: 2, icon: "❤️", text: "내 조황 글에 좋아요 12개가 달렸습니다", time: "23분 전", unread: true },
  { id: 3, icon: "💬", text: "서귀포바다님이 댓글을 남겼습니다: \"포인트 어디예요?\"", time: "1시간 전", unread: true },
  { id: 4, icon: "📅", text: "내일 한림항 물때: 간조 06:42 · 만조 13:18", time: "3시간 전", unread: false },
  { id: 5, icon: "🏆", text: "이번 주 갈치 랭킹 3위에 올랐습니다!", time: "어제", unread: false },
];

const SEARCH_SUGGESTIONS = ["갈치 조황", "한림 포인트", "감성돔 채비", "야간 갈치", "제주 배낚시"];

export default function Header() {
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [query, setQuery] = useState("");
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (q: string) => {
    if (!q.trim()) return;
    setShowSearch(false);
    setQuery("");
    router.push(`/catch?q=${encodeURIComponent(q.trim())}`);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <>
      <div className="fl-header">
        <div className="fl-header-actions">
          <button className="fl-icon-btn" aria-label="검색" onClick={() => { setShowSearch(true); setShowNotif(false); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          </button>
          <button className="fl-icon-btn" aria-label="알림" onClick={() => { setShowNotif(v => !v); setShowSearch(false); }} style={{ position: "relative" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            {unreadCount > 0 && <span className="fl-dot" />}
          </button>
        </div>
      </div>

      {/* 검색 모달 */}
      {showSearch && (
        <>
          <div onClick={() => setShowSearch(false)} style={{ position: "fixed", inset: 0, zIndex: 98, background: "rgba(0,0,0,0.4)" }} />
          <div style={{
            position: "fixed", top: 48, right: 12, zIndex: 99,
            background: "var(--ocean-950, #fff)", border: "1px solid var(--line)",
            borderRadius: 16, padding: 16, width: 300,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          }}>
            <form onSubmit={e => { e.preventDefault(); handleSearch(query); }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="조황, 어종, 포인트 검색..."
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    fontSize: 14, color: "var(--text)", fontFamily: "inherit",
                  }}
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-mute)", fontSize: 14, padding: 0 }}>✕</button>
                )}
              </div>
            </form>
            <div style={{ height: 1, background: "var(--line)", margin: "12px 0" }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-mute)", marginBottom: 8 }}>추천 검색어</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {SEARCH_SUGGESTIONS.map(s => (
                <button key={s} onClick={() => handleSearch(s)} style={{
                  background: "var(--tint-06)", border: "1px solid var(--line)",
                  borderRadius: 99, padding: "4px 12px", fontSize: 12,
                  color: "var(--text-dim)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 알림 패널 */}
      {showNotif && (
        <>
          <div onClick={() => setShowNotif(false)} style={{ position: "fixed", inset: 0, zIndex: 98, background: "rgba(0,0,0,0.4)" }} />
          <div style={{
            position: "fixed", top: 48, right: 12, zIndex: 99,
            background: "var(--ocean-950, #fff)", border: "1px solid var(--line)",
            borderRadius: 16, width: 320,
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            overflow: "hidden",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid var(--line)" }}>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text-strong)" }}>
                알림 {unreadCount > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "var(--hook)", marginLeft: 4 }}>{unreadCount}개 미읽음</span>}
              </div>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ fontSize: 11, fontWeight: 700, color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  모두 읽음
                </button>
              )}
            </div>
            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {notifications.map(n => (
                <div key={n.id} onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread: false } : x))} style={{
                  display: "flex", gap: 12, padding: "12px 16px",
                  borderBottom: "1px solid var(--line)",
                  background: n.unread ? "var(--tint-04)" : "transparent",
                  cursor: "pointer",
                }}>
                  <div style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.4 }}>{n.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 3 }}>{n.time}</div>
                  </div>
                  {n.unread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--hook)", flexShrink: 0, marginTop: 6 }} />}
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 16px", textAlign: "center" }}>
              <button onClick={() => setShowNotif(false)} style={{ fontSize: 12, color: "var(--text-mute)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>닫기</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
