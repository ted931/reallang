"use client";
import { useState } from "react";
import Link from "next/link";
import { DUMMY_POSTS } from "@/lib/dummy-posts";
import type { PostCategory } from "@/lib/types";

const CAT_COLOR: Record<string, { bg: string; color: string; border: string }> = {
  "조황": { bg: "rgba(20,184,166,0.12)", color: "#5eead4", border: "rgba(20,184,166,0.3)" },
  "자유": { bg: "var(--tint-06)", color: "var(--text-dim)", border: "var(--line)" },
  "질문": { bg: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "rgba(59,130,246,0.3)" },
  "장터": { bg: "rgba(249,115,22,0.12)", color: "#fdba74", border: "rgba(249,115,22,0.3)" },
  "후기": { bg: "rgba(168,85,247,0.12)", color: "#d8b4fe", border: "rgba(168,85,247,0.3)" },
};

const CATEGORIES: Array<PostCategory | "전체"> = ["전체", "조황", "자유", "질문", "장터", "후기"];
const REGIONS = ["전체", "서귀포", "성산", "모슬포", "한림", "애월", "구좌", "제주시"];
const SORT = ["최신순", "인기순", "댓글순"] as const;

export default function CommunityPage() {
  const [category, setCategory] = useState<PostCategory | "전체">("전체");
  const [region, setRegion] = useState("전체");
  const [sort, setSort] = useState<typeof SORT[number]>("최신순");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  let posts = DUMMY_POSTS.filter((p) => {
    if (category !== "전체" && p.category !== category) return false;
    if (region !== "전체" && p.region !== region) return false;
    if (search && !p.title.includes(search) && !p.content.includes(search)) return false;
    return true;
  });

  if (sort === "인기순") posts = [...posts].sort((a, b) => b.likeCount - a.likeCount);
  else if (sort === "댓글순") posts = [...posts].sort((a, b) => b.commentCount - a.commentCount);
  else posts = [...posts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      {/* 섹션 헤더 */}
      <div className="fl-sec-head" style={{ padding: "20px 20px 0" }}>
        <div className="fl-sec-bar" style={{ background: "linear-gradient(180deg, #5fa3cf, #1e6595)" }} />
        <div className="fl-sec-text">
          <div className="fl-sec-kicker" style={{ color: "#5fa3cf" }}>COMMUNITY</div>
          <div className="fl-sec-title">커뮤니티</div>
          <div className="fl-sec-sub">조황 · 자유 · 질문 · 장터 · 후기</div>
        </div>
        <Link
          href="/community/write"
          className="fl-jw-book"
          style={{ fontSize: 12, padding: "8px 14px" }}
        >
          ✏️ 글쓰기
        </Link>
      </div>

      {/* 검색 */}
      <div style={{ display: "flex", gap: 8, padding: "16px 20px 0" }}>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") setSearch(searchInput); }}
          placeholder="제목·내용 검색"
          style={{
            flex: 1, height: 40,
            background: "var(--ocean-900)", border: "1px solid var(--line)",
            borderRadius: 12, padding: "0 16px",
            fontSize: 14, color: "var(--text)",
            outline: "none", fontFamily: "inherit",
          }}
        />
        <button
          onClick={() => setSearch(searchInput)}
          className="fl-sort-btn"
          style={{ height: 40, padding: "0 16px" }}
        >
          검색
        </button>
        {search && (
          <button
            onClick={() => { setSearch(""); setSearchInput(""); }}
            className="fl-sort-btn"
            style={{ height: 40, padding: "0 12px" }}
          >
            ✕
          </button>
        )}
      </div>

      {/* 카테고리 탭 */}
      <div className="fl-tabs" style={{ marginTop: 12 }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`fl-tab ${category === cat ? "on" : ""}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
            {category === cat && <span className="fl-tab-underline" />}
          </button>
        ))}
      </div>

      {/* 지역 + 정렬 */}
      <div className="fl-filters" style={{ paddingTop: 0 }}>
        <div className="fl-filter-row">
          <div className="fl-filter-label">지역</div>
          <div className="fl-chips">
            {REGIONS.map((r) => (
              <button
                key={r}
                className={`fl-chip ${region === r ? "on" : ""}`}
                onClick={() => setRegion(r)}
                style={{ fontSize: 11, padding: "4px 10px" }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <div className="fl-filter-row">
          <div className="fl-filter-label">정렬</div>
          <div className="fl-sort">
            {SORT.map((s) => (
              <button
                key={s}
                className={`fl-sort-btn ${sort === s ? "on" : ""}`}
                onClick={() => setSort(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 공지 */}
      <div style={{
        margin: "0 20px 12px",
        padding: "10px 14px",
        borderRadius: 12,
        border: "1px solid rgba(245,158,11,0.3)",
        background: "rgba(245,158,11,0.05)",
        display: "flex", alignItems: "center", gap: 10,
        fontSize: 12,
      }}>
        <span>📌</span>
        <span style={{ color: "var(--hook-300)", fontWeight: 700 }}>공지</span>
        <span style={{ color: "var(--text-dim)" }}>낚시 안전 수칙 — 출조 전 해상 기상 꼭 확인하세요</span>
      </div>

      {/* 결과 수 */}
      {search && (
        <div className="fl-feed-result">
          &ldquo;{search}&rdquo; 검색 결과 {posts.length}건
        </div>
      )}
      {!search && (
        <div className="fl-feed-result">
          <strong>{posts.length}</strong>개 게시글
        </div>
      )}

      {/* 글 목록 */}
      {posts.length === 0 ? (
        <div className="fl-empty">
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div className="fl-empty-title">게시글이 없습니다</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 20px" }}>
          {posts.map((post) => {
            const cat = CAT_COLOR[post.category];
            return (
              <Link key={post.id} href={`/community/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "14px 16px",
                  background: "var(--ocean-900)",
                  border: "1px solid var(--line)",
                  borderRadius: 14,
                  transition: "border-color 0.15s",
                }}>
                  <span style={{
                    flexShrink: 0, marginTop: 2,
                    fontSize: 10, fontWeight: 700,
                    padding: "3px 7px", borderRadius: 6,
                    background: cat?.bg ?? "var(--tint-06)",
                    color: cat?.color ?? "var(--text-dim)",
                    border: `1px solid ${cat?.border ?? "var(--line)"}`,
                    whiteSpace: "nowrap",
                  }}>
                    {post.category}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 14, fontWeight: 600, color: "var(--text-strong)",
                      overflow: "hidden", display: "-webkit-box",
                      WebkitLineClamp: 1, WebkitBoxOrient: "vertical",
                      margin: "0 0 4px",
                    }}>
                      {post.title}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-dim)", flexWrap: "wrap" }}>
                      <span>{post.authorName}</span>
                      <span>·</span>
                      <span>{post.authorLevel}</span>
                      {post.region && (
                        <>
                          <span>·</span>
                          <span style={{ color: "var(--ocean-300)" }}>{post.region}</span>
                        </>
                      )}
                      <span style={{ marginLeft: "auto", display: "flex", gap: 8, flexShrink: 0, color: "var(--text-mute)" }}>
                        <span>♥{post.likeCount}</span>
                        <span>💬{post.commentCount}</span>
                        <span>👁{post.viewCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
