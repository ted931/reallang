"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

const CM_CATS = [
  { k: "all", l: "전체", color: "#5fa3cf" },
  { k: "catch", l: "조황", color: "#f59e0b" },
  { k: "tip", l: "팁/노하우", color: "#86efac" },
  { k: "qna", l: "질문", color: "#a78bfa" },
  { k: "market", l: "장터", color: "#fbbf24" },
  { k: "review", l: "후기", color: "#f0abfc" },
  { k: "free", l: "자유", color: "#5fa3cf" },
];

const CM_POSTS = [
  { id: "1", cat: "catch", hot: true, title: "오늘 한림 갯바위에서 갈치 40마리 쓸어담음", preview: "새벽 4시에 도착해서 6시 반까지 미친듯이 올라왔어요. 미끼는 꽁치 토막에 형광 발광체...", author: "갈치킬러", avatar: "🐟", time: "12분 전", views: 1842, comments: 47, likes: 213, hasImage: true, tags: ["갈치", "한림", "갯바위"] },
  { id: "2", cat: "tip", title: "겨울철 벵에돔 미끼 배합 완전 정리", preview: "12월부터 2월까지 벵에돔 잡으려면 꼭 알아야 할 미끼 배합법 5가지를 정리해봤습니다.", author: "벵돔장인", avatar: "🎣", time: "1시간 전", views: 924, comments: 28, likes: 156, hasImage: false, tags: ["벵에돔", "겨울", "미끼"] },
  { id: "3", cat: "qna", title: "모슬포 선상낚시 처음인데 멀미약 추천 부탁드려요", preview: "내일 처음 가는데 너무 걱정됩니다. 평소 차멀미도 심한 편이라...", author: "낚린이", avatar: "🤔", time: "2시간 전", views: 312, comments: 19, likes: 8, hasImage: false, tags: ["모슬포", "선상", "초보"] },
  { id: "4", cat: "review", hot: true, title: "한림 좌대 \"푸른바다\" 솔직후기 (별 4.5/5)", preview: "주말에 다녀왔는데 시설은 깔끔하고 조황도 좋았어요. 다만 화장실이 좀...", author: "여행가김씨", avatar: "⭐", time: "3시간 전", views: 1203, comments: 34, likes: 89, hasImage: true, tags: ["좌대", "한림", "리뷰"] },
  { id: "5", cat: "market", title: "시마노 스텔라 SW 14000XG 거의 새거 팝니다", preview: "두 번 사용했고 박스/구성품 풀세트입니다. 직거래 우선. 제주시.", author: "장비왕", avatar: "🎁", time: "5시간 전", views: 489, comments: 12, likes: 23, hasImage: false, tags: ["릴", "시마노", "제주시"] },
  { id: "6", cat: "free", title: "낚시 가는 길 마라도 일출 사진 공유합니다", preview: "오늘 04:30 출발해서 찍은 일출. 마라도 가실 분들 참고하세요.", author: "바다사진가", avatar: "📷", time: "6시간 전", views: 678, comments: 22, likes: 134, hasImage: true, tags: ["마라도", "일출", "사진"] },
  { id: "7", cat: "catch", title: "서귀포 방파제 광어 65cm 잡았네요", preview: "아침 일찍 나갔는데 운이 좋았습니다. 영상도 찍어왔어요.", author: "광어사냥꾼", avatar: "🐠", time: "8시간 전", views: 1456, comments: 41, likes: 198, hasImage: true, tags: ["광어", "서귀포", "대물"] },
  { id: "8", cat: "tip", title: "갈치 채비 묶는 법 (사진 단계별)", preview: "입문자 분들 위해 갈치 채비 만드는 법을 사진으로 정리했습니다.", author: "낚시선생", avatar: "👨‍🏫", time: "12시간 전", views: 2341, comments: 56, likes: 412, hasImage: true, tags: ["갈치", "채비", "입문"] },
];

export default function CommunityPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);

  const catObj = CM_CATS.find((c) => c.k === activeCat) ?? CM_CATS[0];

  const filtered = useMemo(() => {
    return CM_POSTS.filter((p) => {
      if (activeCat !== "all" && p.cat !== activeCat) return false;
      if (search) {
        const q = search.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!inTitle && !inTags) return false;
      }
      return true;
    });
  }, [activeCat, search]);

  const hotPosts = CM_POSTS.filter((p) => p.hot);

  function getCatColor(catKey: string) {
    return CM_CATS.find((c) => c.k === catKey)?.color ?? "#5fa3cf";
  }

  function getCatLabel(catKey: string) {
    return CM_CATS.find((c) => c.k === catKey)?.l ?? catKey;
  }

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .fl-cm-pc-wrap {
            max-width: 960px;
            margin: 0 auto;
            padding: 0 24px;
          }
          .fl-cm-hero {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 24px;
            padding-right: 24px;
            padding-top: 40px;
            padding-bottom: 24px;
          }
          .fl-cm-search {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
          }
          .fl-cm-tabs {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
          }
          .fl-cm-list {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            padding: 0 24px 80px !important;
          }
          .fl-cm-hot {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
            display: grid !important;
            grid-template-columns: repeat(2, 1fr);
          }
          .fl-cm-hot-label {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 24px !important;
          }
        }
        @media (min-width: 1024px) {
          .fl-cm-list {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>

      {/* Hero */}
      <div className="fl-cm-hero">
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "1px", color: "#5fa3cf", marginBottom: 6 }}>COMMUNITY</div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", margin: 0, lineHeight: 1.25 }}>
          오늘의 낚시 이야기&nbsp;
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dim)" }}>{CM_POSTS.length}개</span>
        </h1>
      </div>

      {/* Search */}
      <div className={`fl-cm-search${focused ? " on" : ""}`}>
        <span style={{ fontSize: 16, color: "var(--text-dim)" }}>🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="제목 또는 태그 검색"
        />
        {search && (
          <button className="fl-cm-search-clear" onClick={() => setSearch("")}>×</button>
        )}
      </div>

      {/* Category tabs */}
      <div className="fl-cm-tabs">
        {CM_CATS.map((cat) => (
          <button
            key={cat.k}
            className={`fl-cm-tab${activeCat === cat.k ? " on" : ""}`}
            style={activeCat === cat.k ? { color: cat.color, borderBottomColor: cat.color } : undefined}
            onClick={() => setActiveCat(cat.k)}
          >
            {cat.l}
          </button>
        ))}
      </div>

      {/* HOT section — only when all */}
      {activeCat === "all" && !search && (
        <>
          <div className="fl-cm-hot-label" style={{ padding: "0 20px 10px", fontSize: 11, fontWeight: 800, color: "#f87171", letterSpacing: "0.5px" }}>
            🔥 HOT POSTS
          </div>
          <div className="fl-cm-hot">
            {hotPosts.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`} className="fl-cm-hot-card">
                <div
                  className="fl-cm-hot-rank"
                  style={{ background: getCatColor(post.cat) }}
                >
                  HOT
                </div>
                <div className="fl-cm-hot-body">
                  <div className="fl-cm-hot-cat" style={{ color: getCatColor(post.cat) }}>{getCatLabel(post.cat)}</div>
                  <div className="fl-cm-hot-title">{post.title}</div>
                  <div className="fl-cm-hot-meta">
                    <span>👁 {post.views.toLocaleString()}</span>
                    <span>💬 {post.comments}</span>
                    <span>❤ {post.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Post list */}
      <div className="fl-cm-list">
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-dim)", fontSize: 14, gridColumn: "1 / -1" }}>
            검색 결과가 없습니다
          </div>
        ) : (
          filtered.map((post) => {
            const color = getCatColor(post.cat);
            const catLabel = getCatLabel(post.cat);
            return (
              <Link key={post.id} href={`/community/${post.id}`} className="fl-cm-card">
                <div className="fl-cm-strip" style={{ background: color }} />
                <div className="fl-cm-card-body">
                  <div className="fl-cm-card-top">
                    <span className="fl-cm-card-cat" style={{ background: color + "22", color, border: `1px solid ${color}55` }}>
                      {catLabel}
                    </span>
                    {post.hot && <span className="fl-cm-card-hot">🔥 HOT</span>}
                    <span className="fl-cm-card-time">{post.time}</span>
                  </div>
                  <h2 className="fl-cm-card-title">{post.title}</h2>
                  <p className="fl-cm-card-preview">{post.preview}</p>
                  {post.hasImage && (
                    <div className="fl-cm-card-img" style={{ background: `linear-gradient(135deg, ${color}33, ${color}11)` }}>
                      🐟
                    </div>
                  )}
                  <div className="fl-cm-card-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="fl-cm-card-tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="fl-cm-card-foot">
                    <div className="fl-cm-card-author">
                      <div className="fl-cm-card-avatar">{post.avatar}</div>
                      <span className="fl-cm-card-name">{post.author}</span>
                    </div>
                    <div className="fl-cm-card-stats">
                      <span>👁 {post.views.toLocaleString()}</span>
                      <span>💬 {post.comments}</span>
                      <span>❤ {post.likes}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* FAB */}
      <Link href="/community/write" className="fl-cm-fab">
        ✏ 글쓰기
      </Link>
    </>
  );
}
