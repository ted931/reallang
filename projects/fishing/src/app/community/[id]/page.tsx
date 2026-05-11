"use client";
import { useState, use } from "react";
import Link from "next/link";

const CMD_POSTS = [
  {
    id: "1",
    cat: "catch",
    catLabel: "조황",
    catColor: "#f59e0b",
    hot: true,
    title: "오늘 한림 갯바위에서 갈치 40마리 쓸어담음",
    body: `새벽 4시에 한림 갯바위 도착해서 6시 반까지 미친듯이 올라왔습니다.\n\n미끼는 꽁치 토막에 형광 발광체 조합이었고, 채비는 자작 갈치 6단 채비 사용했어요. 수심은 약 12m 지점에서 가장 잘 나왔습니다.\n\n조황 정리:\n• 갈치 40마리 (평균 45cm, 최대 62cm)\n• 고등어 8마리 (덤)\n• 볼락 3마리\n\n물때가 좋은 날이라 그런지 거의 쉴 틈이 없었네요.`,
    author: { name: "갈치킬러", avatar: "🐟", level: "Lv.22", followers: 487 },
    time: "12분 전",
    views: 1842,
    comments: 47,
    likes: 213,
    tags: ["갈치", "한림", "갯바위", "대물"],
    location: "한림 갯바위 P-12",
    catchInfo: { fish: "갈치", count: 40, maxSize: 62, time: "04:00~06:30" },
  },
];

const CMD_COMMENTS = [
  { id: 1, author: "낚시선생", avatar: "👨‍🏫", time: "5분 전", body: "와 40마리... 부럽네요. 다음 주말 저도 같이 갈 수 있을까요?", likes: 12, isHost: false },
  { id: 2, author: "갈치킬러", avatar: "🐟", time: "3분 전", body: "@낚시선생 네 좋습니다! 카톡 오픈채팅 dm 드릴게요", likes: 4, isHost: true },
  { id: 3, author: "벵돔장인", avatar: "🎣", time: "8분 전", body: "발광체 조합 좋네요. 어떤 색 쓰셨어요?", likes: 8, isHost: false },
];

const CMD_RELATED = [
  { id: "7", title: "서귀포 방파제 광어 65cm 잡았네요", cat: "조황", color: "#f59e0b", views: 1456, comments: 41 },
  { id: "4", title: "한림 좌대 \"푸른바다\" 솔직후기", cat: "후기", color: "#f0abfc", views: 1203, comments: 34 },
  { id: "8", title: "갈치 채비 묶는 법 (사진 단계별)", cat: "팁/노하우", color: "#86efac", views: 2341, comments: 56 },
];

export default function CommunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const post = CMD_POSTS.find((p) => p.id === id);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes ?? 0);
  const [likePop, setLikePop] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentLikes, setCommentLikes] = useState<Record<number, boolean>>({});
  const [commentInput, setCommentInput] = useState("");

  if (!post) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-dim)" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>게시글을 찾을 수 없습니다</div>
        <Link href="/community" style={{ display: "inline-block", marginTop: 16, color: "var(--ocean-300)", fontSize: 14 }}>
          ← 커뮤니티로 돌아가기
        </Link>
      </div>
    );
  }

  function handleLike() {
    if (liked) {
      setLiked(false);
      setLikeCount((n) => n - 1);
    } else {
      setLiked(true);
      setLikeCount((n) => n + 1);
      setLikePop(true);
      setTimeout(() => setLikePop(false), 700);
    }
  }

  function toggleCommentLike(cid: number) {
    setCommentLikes((prev) => ({ ...prev, [cid]: !prev[cid] }));
  }

  return (
    <article className="fl-cmd-article">
      {/* Back link */}
      <div style={{ padding: "16px 0 0" }}>
        <Link href="/community" style={{ fontSize: 13, color: "var(--ocean-300)", textDecoration: "none", fontWeight: 700 }}>
          ← 커뮤니티
        </Link>
      </div>

      {/* Header */}
      <header className="fl-cmd-header">
        <div className="fl-cmd-cat-row">
          <span
            className="fl-cmd-cat-badge"
            style={{ background: post.catColor + "22", color: post.catColor, borderColor: post.catColor + "55" }}
          >
            {post.catLabel}
          </span>
          {post.hot && <span className="fl-cmd-hot">🔥 HOT</span>}
        </div>
        <h1 className="fl-cmd-title">{post.title}</h1>

        {/* Author row */}
        <div className="fl-cmd-author-row">
          <div className="fl-cmd-author">
            <div className="fl-cmd-author-avatar">{post.author.avatar}</div>
            <div>
              <div>
                <span className="fl-cmd-author-name">{post.author.name}</span>
                <span className="fl-cmd-author-lvl">{post.author.level}</span>
              </div>
              <div className="fl-cmd-author-sub">팔로워 {post.author.followers} · {post.time}</div>
            </div>
          </div>
          <button className="fl-cmd-follow">팔로우</button>
        </div>

        {/* Meta */}
        <div className="fl-cmd-meta">
          <span>👁 {post.views.toLocaleString()}</span>
          <span>💬 {post.comments}</span>
          <span>❤ {likeCount}</span>
        </div>
      </header>

      {/* Catch banner */}
      <div
        className="fl-cmd-catch-banner"
        style={{ borderColor: post.catColor + "55", background: post.catColor + "11" }}
      >
        {/* Wave SVG bg */}
        <div className="fl-cmd-catch-banner-bg">
          <svg viewBox="0 0 400 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,40 C60,20 120,60 180,40 C240,20 300,60 360,40 C390,30 400,35 400,35 L400,80 L0,80 Z"
              fill={post.catColor}
              fillOpacity="0.08"
            />
          </svg>
        </div>
        <div className="fl-cmd-catch-col">
          <div className="fl-cmd-catch-k">어종</div>
          <div className="fl-cmd-catch-v">{post.catchInfo.fish}</div>
        </div>
        <div className="fl-cmd-catch-div" />
        <div className="fl-cmd-catch-col">
          <div className="fl-cmd-catch-k">마릿수</div>
          <div className="fl-cmd-catch-v hook">{post.catchInfo.count}<span>마리</span></div>
        </div>
        <div className="fl-cmd-catch-div" />
        <div className="fl-cmd-catch-col">
          <div className="fl-cmd-catch-k">최대 사이즈</div>
          <div className="fl-cmd-catch-v">{post.catchInfo.maxSize}<span>cm</span></div>
        </div>
        <div className="fl-cmd-catch-div" />
        <div className="fl-cmd-catch-col">
          <div className="fl-cmd-catch-k">조황 시간</div>
          <div className="fl-cmd-catch-v" style={{ fontSize: 14 }}>{post.catchInfo.time}</div>
        </div>
      </div>

      {/* Image placeholder */}
      <div className="fl-cmd-img">
        <div
          className="fl-cmd-img-placeholder"
          style={{ background: `linear-gradient(135deg, ${post.catColor}44, ${post.catColor}11)` }}
        >
          <div className="fl-cmd-img-overlay">
            <div className="fl-cmd-img-fish" style={{ fontSize: 60, textAlign: "center" }}>🐟</div>
            <div className="fl-cmd-img-label">갈치 40마리 조황</div>
          </div>
          <div className="fl-cmd-img-count">1 / 4</div>
        </div>
      </div>

      {/* Body text */}
      <div className="fl-cmd-body">{post.body}</div>

      {/* Tags */}
      <div className="fl-cmd-tags">
        {post.tags.map((tag) => (
          <span key={tag} className="fl-cmd-tag">#{tag}</span>
        ))}
      </div>

      {/* Location */}
      <div className="fl-cmd-location">
        <span>📍</span>
        <span>{post.location}</span>
        <Link href="#" className="fl-cmd-location-link">지도에서 보기 →</Link>
      </div>

      {/* Actions */}
      <div className="fl-cmd-actions">
        <button
          className={`fl-cmd-action fl-cmd-like${liked ? " on" : ""}${likePop ? " pop" : ""}`}
          onClick={handleLike}
        >
          <span className="fl-cmd-action-icon">{liked ? "❤️" : "🤍"}</span>
          <span>{likeCount}</span>
        </button>
        <button className="fl-cmd-action">
          <span className="fl-cmd-action-icon">💬</span>
          <span>{post.comments}</span>
        </button>
        <button
          className={`fl-cmd-action${saved ? " on" : ""}`}
          onClick={() => setSaved((s) => !s)}
        >
          <span className="fl-cmd-action-icon">{saved ? "🔖" : "📑"}</span>
          <span>저장</span>
        </button>
        <button className="fl-cmd-action">
          <span className="fl-cmd-action-icon">↗</span>
          <span>공유</span>
        </button>
      </div>

      {/* CTA */}
      <div className="fl-cmd-cta">
        <Link href="/catch/upload" className="fl-cmd-cta-btn">
          나도 비슷한 포인트에서 잡았어요 →
        </Link>
      </div>

      {/* Comments */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-strong)", marginBottom: 12 }}>
          댓글 {post.comments}개
        </div>
        <div className="fl-cmd-comments">
          {CMD_COMMENTS.map((c) => (
            <div key={c.id} className="fl-cmd-comment">
              <div className="fl-cmd-comment-avatar">{c.avatar}</div>
              <div className="fl-cmd-comment-body">
                <div className="fl-cmd-comment-top">
                  <span className="fl-cmd-comment-name">{c.author}</span>
                  {c.isHost && <span className="fl-cmd-comment-host-badge">작성자</span>}
                  <span className="fl-cmd-comment-time">{c.time}</span>
                </div>
                <div className="fl-cmd-comment-text">{c.body}</div>
                <div className="fl-cmd-comment-actions">
                  <button
                    className={`fl-cmd-comment-like${commentLikes[c.id] ? " on" : ""}`}
                    onClick={() => toggleCommentLike(c.id)}
                  >
                    {commentLikes[c.id] ? "❤️" : "🤍"} {c.likes + (commentLikes[c.id] ? 1 : 0)}
                  </button>
                  <button className="fl-cmd-comment-reply">답글</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-strong)", marginBottom: 10 }}>
          관련 게시글
        </div>
        <div className="fl-cmd-related">
          {CMD_RELATED.map((r) => (
            <Link key={r.id} href={`/community/${r.id}`} className="fl-cmd-related-card">
              <span className="fl-cmd-related-cat" style={{ background: r.color }}>{r.cat}</span>
              <span className="fl-cmd-related-title">{r.title}</span>
              <span className="fl-cmd-related-meta">👁 {r.views.toLocaleString()} · 💬 {r.comments}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Fixed bottom comment bar */}
      <div className="fl-cmd-bottom">
        <div className="fl-cmd-bottom-avatar">🎣</div>
        <input
          className="fl-cmd-bottom-input"
          placeholder="댓글을 입력하세요..."
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
        />
        <button
          className={`fl-cmd-bottom-submit${commentInput.trim() ? " on" : ""}`}
          onClick={() => setCommentInput("")}
        >
          등록
        </button>
      </div>
    </article>
  );
}
