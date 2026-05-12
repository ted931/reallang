"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { NewsItem } from "@/app/api/news/route";

const CAT_LABELS: Record<string, string> = {
  catch: "조황", gear: "채비·장비", point: "포인트", weather: "날씨·조류", tip: "팁",
};
const CAT_COLORS: Record<string, string> = {
  catch: "#f59e0b", gear: "#5fa3cf", point: "#86efac", weather: "#a78bfa", tip: "#fbbf24",
};

function formatDate(str: string): string {
  const m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime()))
      return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  } catch { /* ignore */ }
  return str.slice(0, 10);
}

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [detailRes, allRes] = await Promise.all([
          fetch(`/api/news?id=${id}`),
          fetch('/api/news'),
        ]);
        const detail = await detailRes.json();
        const all = await allRes.json();
        if (detail.item) {
          setItem(detail.item);
          setRelated(
            (all.items as NewsItem[])
              .filter((it) => it.id !== id && it.cat === detail.item.cat)
              .slice(0, 3)
          );
        }
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "40px 20px" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ height: 20, background: "var(--ocean-900)", borderRadius: 6, marginBottom: 12, opacity: 0.6, animation: "fl-pulse 1.5s ease-in-out infinite" }} />
        ))}
      </div>
    );
  }

  if (!item) {
    return (
      <div style={{ padding: "60px 20px", textAlign: "center" }}>
        <p style={{ color: "var(--text-dim)", marginBottom: 16 }}>기사를 찾을 수 없습니다.</p>
        <Link href="/news" style={{ color: "var(--ocean-300)", fontWeight: 700 }}>← 뉴스 목록으로</Link>
      </div>
    );
  }

  const catColor = CAT_COLORS[item.cat] ?? "#5fa3cf";

  return (
    <div className="fl-content" style={{ maxWidth: 720 }}>
      {/* 뒤로가기 */}
      <div style={{ padding: "16px 20px 0" }}>
        <Link href="/news" style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
          ← 낚시 뉴스
        </Link>
      </div>

      {/* 헤더 */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: catColor, background: `${catColor}18`, padding: "3px 10px", borderRadius: 20, border: `1px solid ${catColor}44` }}>
            {CAT_LABELS[item.cat] ?? item.cat}
          </span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-strong)", lineHeight: 1.35, margin: "0 0 14px" }}>
          {item.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "var(--text-dim)", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, color: "var(--text)" }}>{item.source}</span>
          <span>·</span>
          <span>{formatDate(item.publishedAt)}</span>
        </div>

        {/* 썸네일 배너 */}
        <div style={{
          height: 180, borderRadius: 16, marginBottom: 24,
          background: `linear-gradient(135deg, ${item.imageColor}33, ${item.imageColor}11)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${item.imageColor}22`,
        }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={item.imageColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
            <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>
            <path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/>
            <path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/>
          </svg>
        </div>
      </div>

      {/* 본문 */}
      <div style={{ padding: "0 20px 32px", fontSize: 15, lineHeight: 1.85, color: "var(--text)", whiteSpace: "pre-wrap" }}>
        {item.content ?? item.summary}
      </div>

      {/* 외부 링크 (RSS 실제 기사) */}
      {item.url && item.url !== "#" && (
        <div style={{ padding: "0 20px 24px" }}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block", textAlign: "center", padding: "12px",
              background: "var(--ocean-800)", border: "1px solid var(--ocean-700)",
              borderRadius: 12, fontSize: 13, fontWeight: 800,
              color: "var(--text-strong)", textDecoration: "none",
            }}
          >
            원문 기사 보기 →
          </a>
        </div>
      )}

      {/* 블로그 초안으로 보내기 */}
      <div style={{ padding: "0 20px 32px" }}>
        <Link
          href={`/blog?from=news&title=${encodeURIComponent(item.title)}&cat=${item.cat}`}
          style={{
            display: "block", textAlign: "center", padding: "12px",
            background: `${catColor}18`, border: `1px solid ${catColor}44`,
            borderRadius: 12, fontSize: 13, fontWeight: 800,
            color: catColor, textDecoration: "none",
          }}
        >
          ✍️ 이 기사로 블로그 초안 만들기
        </Link>
      </div>

      {/* 관련 기사 */}
      {related.length > 0 && (
        <div style={{ padding: "0 20px 40px" }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.5px", color: "var(--text-dim)", marginBottom: 12 }}>
            관련 기사
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {related.map((r) => (
              <Link key={r.id} href={`/news/${r.id}`} style={{ display: "flex", gap: 10, padding: "12px 0", borderBottom: "1px solid var(--ocean-800)", textDecoration: "none", color: "inherit" }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: `${r.imageColor}22`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={r.imageColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>
                    <path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/><path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-strong)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 3 }}>{r.source} · {formatDate(r.publishedAt)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
