"use client";
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
  return (
    <div className="card overflow-hidden flex-shrink-0 w-56" style={{ minWidth: 220 }}>
      <div style={{ position: "relative", height: 128, overflow: "hidden" }}>
        <img
          src={place.image}
          alt={place.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <span className="chip" style={{
          position: "absolute", top: 8, left: 8,
          background: "rgba(0,0,0,0.55)", color: "#fff",
        }}>
          {CATEGORY_EMOJI[place.category]} {CATEGORY_LABEL[place.category]}
        </span>
        {score !== undefined && (
          <span style={{
            position: "absolute", top: 8, right: 8,
            background: "var(--jeju-500)", color: "#fff",
            borderRadius: 100, padding: "2px 8px", fontSize: 11, fontWeight: 700,
          }}>
            {Math.round(score)}% 일치
          </span>
        )}
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: "var(--text)" }}>
          {place.name}
        </div>
        {matchReason && (
          <div style={{ fontSize: 11, color: "var(--jeju-600)", marginBottom: 6, fontWeight: 600 }}>
            {matchReason}
          </div>
        )}
        <div style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 10 }}>
          {place.description.slice(0, 45)}…
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Link
            href={`/place/${place.id}`}
            style={{ flex: 1, textAlign: "center", padding: "6px 0", borderRadius: 8,
              border: "1.5px solid var(--line)", fontSize: 12, fontWeight: 600,
              color: "var(--text-dim)", textDecoration: "none" }}
          >
            상세보기
          </Link>
          {onAdd && (
            <button
              onClick={() => onAdd(place)}
              style={{ flex: 1, padding: "6px 0", borderRadius: 8, border: "none",
                background: "var(--jeju-500)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
            >
              + 코스추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
