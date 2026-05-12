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
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ height: i === 1 ? 200 : 20, background: 'var(--tint-06)', borderRadius: 10, marginBottom: 16, animation: 'fl-pulse 1.5s ease-in-out infinite' }} />
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
    <div style={{ maxWidth: 720, margin: '0 auto', paddingBottom: 60 }}>

      {/* 뒤로 */}
      <div style={{ padding: '16px 20px 0' }}>
        <Link href="/news" style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}>
          ← 낚시 뉴스
        </Link>
      </div>

      {/* 히어로 배너 */}
      <div style={{
        margin: '16px 20px 0',
        borderRadius: 20,
        background: `linear-gradient(160deg, ${item.imageColor}cc 0%, ${item.imageColor}55 40%, #0a1628 100%)`,
        padding: '32px 28px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* BG decoration */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: `${item.imageColor}22`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        {/* Fish SVG watermark */}
        <div style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', opacity: 0.12 }}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>
            <path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/>
            <path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/>
          </svg>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 800,
            color: catColor, background: `${catColor}22`,
            padding: '4px 12px', borderRadius: 999,
            border: `1px solid ${catColor}55`, marginBottom: 14,
            letterSpacing: '-0.2px',
          }}>
            {CAT_LABELS[item.cat] ?? item.cat}
          </span>
          <h1 style={{
            margin: '0 0 16px', fontSize: 22, fontWeight: 900,
            color: '#fff', lineHeight: 1.35, letterSpacing: '-0.6px',
            paddingRight: 60,
          }}>
            {item.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
            <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{item.source}</span>
            <span>·</span>
            <span>{formatDate(item.publishedAt)}</span>
          </div>
        </div>
      </div>

      {/* 요약 */}
      {item.summary && (
        <div style={{
          margin: '16px 20px 0',
          background: 'var(--tint-05)', border: '1px solid var(--line)',
          borderRadius: 14, padding: '16px 18px',
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>📋</span>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--text)', letterSpacing: '-0.3px', fontWeight: 500 }}>
            {item.summary}
          </p>
        </div>
      )}

      {/* 본문 */}
      {item.content && item.content !== item.summary && (
        <div style={{ padding: '24px 20px 0' }}>
          <div style={{
            fontSize: 15, lineHeight: 1.9, color: 'var(--text-strong)',
            letterSpacing: '-0.3px', whiteSpace: 'pre-wrap',
          }}>
            {item.content}
          </div>
        </div>
      )}

      {/* 원문 링크 */}
      {item.url && item.url !== '#' && (
        <div style={{ padding: '24px 20px 0' }}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'var(--tint-04)', border: '1px solid var(--line)',
            borderRadius: 14, textDecoration: 'none',
            color: 'var(--text-strong)', fontSize: 14, fontWeight: 700,
          }}>
            <span>🔗 원문 기사 보기</span>
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{item.source} →</span>
          </a>
        </div>
      )}

      {/* 블로그 초안 CTA */}
      <div style={{ padding: '12px 20px 0' }}>
        <Link
          href={`/blog?from=news&title=${encodeURIComponent(item.title)}&cat=${item.cat}`}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 18px',
            background: `${catColor}12`, border: `1px solid ${catColor}33`,
            borderRadius: 14, textDecoration: 'none',
            fontSize: 14, fontWeight: 700, color: catColor,
          }}
        >
          <span>✍️ 이 기사로 블로그 초안 만들기</span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>→</span>
        </Link>
      </div>

      {/* 관련 기사 */}
      {related.length > 0 && (
        <div style={{ padding: '28px 20px 0' }}>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.5px', color: 'var(--text-dim)', marginBottom: 14 }}>
            관련 기사
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {related.map((r) => {
              const rColor = CAT_COLORS[r.cat] ?? '#5fa3cf';
              return (
                <Link key={r.id} href={`/news/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    display: 'flex', gap: 14, padding: '14px 16px',
                    background: 'var(--tint-04)', border: '1px solid var(--line)',
                    borderRadius: 14, transition: 'border-color 0.15s',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = rColor)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line)')}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                      background: `${rColor}22`, border: `1px solid ${rColor}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={rColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>
                        <path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/>
                        <path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/>
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: rColor }}>{CAT_LABELS[r.cat] ?? r.cat}</span>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-strong)', marginTop: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {r.title}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{r.source} · {formatDate(r.publishedAt)}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
