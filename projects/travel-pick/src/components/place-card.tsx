"use client";
import { useState } from "react";
import Link from "next/link";
import { Place } from "@/lib/types";
import { CATEGORY_LABEL, CATEGORY_EMOJI } from "@/lib/dummy-places";

interface Props {
  place: Place;
  score?: number;
  matchReason?: string;
  onAdd?: (place: Place) => void;
}

export default function PlaceCard({ place, score, matchReason, onAdd }: Props) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    onAdd?.(place);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{
      flexShrink: 0, width: 200, borderRadius: "var(--r-lg)",
      overflow: "hidden", background: "var(--surface)",
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      transition: "transform 0.18s, box-shadow 0.18s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.14)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.08)"; }}
    >
      {/* 이미지 */}
      <div style={{ position: "relative", height: 148, overflow: "hidden" }}>
        <img src={place.image} alt={place.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)" }} />

        {/* 카테고리 */}
        <span className="chip chip-dark" style={{ position: "absolute", top: 10, left: 10, fontSize: 10 }}>
          {CATEGORY_EMOJI[place.category]} {CATEGORY_LABEL[place.category]}
        </span>

        {/* 일치율 */}
        {score !== undefined && (
          <div style={{
            position: "absolute", bottom: 10, right: 10,
            background: "var(--green-main)", color: "#fff",
            borderRadius: 100, padding: "3px 9px", fontSize: 10, fontWeight: 800,
          }}>
            {Math.round(score)}%
          </div>
        )}
      </div>

      {/* 내용 */}
      <div style={{ padding: "14px 14px 16px" }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)", marginBottom: 4, lineHeight: 1.3 }}>
          {place.name}
        </div>
        {matchReason && (
          <div style={{ fontSize: 11, color: "var(--green-mid)", fontWeight: 700, marginBottom: 6 }}>
            {matchReason}
          </div>
        )}
        <div style={{ fontSize: 12, color: "var(--ink-70)", lineHeight: 1.55, marginBottom: 12 }}>
          {place.description.slice(0, 42)}…
        </div>

        {/* 메타 */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          {place.avgWaitMinutes > 0 && (
            <span style={{ fontSize: 10, color: "var(--ink-40)", fontWeight: 600 }}>
              ⏱ {place.avgWaitMinutes}분
            </span>
          )}
          <span style={{ fontSize: 10, color: "var(--ink-40)", fontWeight: 600 }}>
            {place.priceRange}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <Link href={`/place/${place.id}`} style={{ flex: 1, textDecoration: "none" }}>
            <button style={{
              width: "100%", padding: "8px 0", borderRadius: "var(--r-sm)",
              border: "1.5px solid var(--ink-12)", background: "transparent",
              fontSize: 12, fontWeight: 700, color: "var(--ink-70)", cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.15s",
            }}>상세</button>
          </Link>
          {onAdd && (
            <button onClick={handleAdd} style={{
              flex: 2, padding: "8px 0", borderRadius: "var(--r-sm)",
              border: "none", background: added ? "var(--green-mid)" : "var(--green-main)",
              color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {added ? "✓ 추가됨" : "+ 코스 추가"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
