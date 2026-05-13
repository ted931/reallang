"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NewsItem } from "@/app/api/news/route";

const CAT_LABELS: Record<string, string> = {
  all: "전체",
  catch: "조황",
  gear: "채비·장비",
  point: "포인트",
  weather: "날씨·조류",
  tip: "팁",
};

const CAT_COLORS: Record<string, string> = {
  catch: "#f59e0b",
  gear: "#5fa3cf",
  point: "#86efac",
  weather: "#a78bfa",
  tip: "#fbbf24",
};

const CATS = ["all", "catch", "gear", "point", "weather", "tip"];

function FishingIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"/>
      <path d="M2 12c2.5 1 4 2.5 4 2.5L2 17"/>
      <path d="M2 12c2.5-1 4-2.5 4-2.5L2 7"/>
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
      <path d="M8 16H3v5"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function formatDate(str: string): string {
  if (!str) return "";
  // ISO-like
  const m = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;
  // RFC date: "Sun, 11 May 2026 00:00:00 +0000"
  try {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
    }
  } catch { /* ignore */ }
  return str.slice(0, 10);
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const [activeCat, setActiveCat] = useState("all");

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setItems(data.items ?? []);
      setFetchedAt(data.fetchedAt ?? "");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered =
    activeCat === "all" ? items : items.filter((it) => it.cat === activeCat);

  const lastUpdated = fetchedAt
    ? (() => {
        const d = new Date(fetchedAt);
        return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} 업데이트`;
      })()
    : "";

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", paddingBottom: 100 }}>
      {/* 히어로 */}
      <div className="fl-news-hero">
        <p className="fl-kicker">FISHING NEWS</p>
        <h1 className="fl-page-title">낚시 뉴스</h1>
        {lastUpdated && (
          <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 2 }}>{lastUpdated}</p>
        )}
      </div>

      {/* 탭 + 새로고침 */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="fl-cm-tabs" style={{ flex: 1 }}>
          {CATS.map((cat) => (
            <button
              key={cat}
              className={`fl-cm-tab${activeCat === cat ? " on" : ""}`}
              onClick={() => setActiveCat(cat)}
            >
              {CAT_LABELS[cat]}
            </button>
          ))}
        </div>
        <button
          onClick={load}
          disabled={loading}
          aria-label="새로고침"
          style={{
            flexShrink: 0,
            marginRight: 20,
            marginBottom: 14,
            width: 32,
            height: 32,
            border: "none",
            background: "var(--ocean-800)",
            borderRadius: 8,
            color: "var(--text-dim)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: loading ? 0.5 : 1,
            transition: "opacity 0.15s",
          }}
        >
          <RefreshIcon />
        </button>
      </div>

      {/* 로딩 스켈레톤 */}
      {loading && (
        <div style={{ padding: "0 20px 24px" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="fl-news-skeleton" />
          ))}
        </div>
      )}

      {/* 에러 */}
      {!loading && error && (
        <div
          style={{
            padding: "48px 20px",
            textAlign: "center",
            color: "var(--text-dim)",
          }}
        >
          <div style={{ marginBottom: 12, opacity: 0.5 }}>
            <AlertIcon />
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>
            뉴스를 불러오지 못했습니다
          </p>
          <button
            onClick={load}
            style={{
              padding: "10px 20px",
              background: "var(--ocean-800)",
              border: "1px solid var(--ocean-700)",
              borderRadius: 10,
              color: "var(--text-strong)",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 뉴스 목록 */}
      {!loading && !error && (
        <div className="fl-news-list">
          <div className="fl-news-list-grid">
            {filtered.length === 0 ? (
              <p
                style={{
                  padding: "32px 0",
                  color: "var(--text-dim)",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                해당 카테고리 뉴스가 없습니다
              </p>
            ) : (
              filtered.map((item) => {
                const catColor = CAT_COLORS[item.cat] ?? "#5fa3cf";
                return (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="fl-news-card"
                  >
                    {/* 썸네일 */}
                    <div
                      className="fl-news-thumb"
                      style={{ background: `${item.imageColor}22` }}
                      aria-hidden="true"
                    >
                      <FishingIcon color={item.imageColor} />
                    </div>

                    {/* 본문 */}
                    <div className="fl-news-body">
                      <p
                        className="fl-news-cat"
                        style={{ color: catColor }}
                      >
                        {CAT_LABELS[item.cat] ?? item.cat}
                      </p>
                      <p className="fl-news-card-title">{item.title}</p>
                      <p className="fl-news-meta">
                        {item.source}
                        {item.publishedAt && (
                          <> · {formatDate(item.publishedAt)}</>
                        )}
                      </p>
                      {item.summary && (
                        <p className="fl-news-summary">{item.summary}</p>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
