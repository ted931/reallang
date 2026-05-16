"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PreferenceProfile, Place } from "@/lib/types";
import { recommend, getPersona } from "@/lib/recommendation";
import { CATEGORY_LABEL, CATEGORY_EMOJI } from "@/lib/dummy-places";
import PlaceCard from "@/components/place-card";

const DEFAULT_PREF: PreferenceProfile = {
  waitTolerance: 50, crowdTolerance: 50, sceneryVsFood: 50,
  activityLevel: 40, transportMode: "car", companion: "couple",
};

export default function RecommendPage() {
  const [pref, setPref] = useState<PreferenceProfile>(DEFAULT_PREF);
  const [course, setCourse] = useState<Place[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tp_pref");
      if (saved) setPref({ ...DEFAULT_PREF, ...JSON.parse(saved) });
    } catch {}
  }, []);

  const result = recommend(pref);
  const persona = getPersona(pref);

  const addToCourse = (place: Place) => {
    setCourse((prev) => prev.find((p) => p.id === place.id) ? prev : [...prev, place]);
  };

  const sections = [
    { label: "맛집", items: result.restaurants },
    { label: "카페·빵집", items: result.cafes },
    { label: "관광지·액티비티", items: result.attractions },
    { label: "뷰포인트", items: result.viewpoints },
  ];

  const matchReason = (place: Place, score: number) => {
    const parts: string[] = [];
    if (place.avgWaitMinutes <= 15) parts.push("대기 짧음");
    if (place.avgWaitMinutes >= 30 && pref.waitTolerance >= 50) parts.push("줄 서도 가치 있음");
    if (place.sceneryScore >= 4 && pref.sceneryVsFood < 50) parts.push("경치 최상");
    if (place.foodScore >= 4 && pref.sceneryVsFood >= 50) parts.push("맛 최상");
    if (place.crowdScore <= 2 && pref.crowdTolerance < 40) parts.push("한적함");
    if (score >= 80) parts.push("성향 최적");
    return parts.slice(0, 2).join(" · ");
  };

  return (
    <div className="page" style={{ maxWidth: 520, margin: "0 auto", padding: "0 0 80px" }}>
      {/* Persona header */}
      <div style={{
        background: `linear-gradient(135deg, var(--jeju-500), var(--jeju-700))`,
        padding: "32px 24px 28px", color: "#fff",
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{persona.emoji}</div>
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8, letterSpacing: "0.08em", marginBottom: 6 }}>
          나의 여행 성향
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>{persona.label}</h1>
        <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, margin: 0 }}>{persona.description}</p>
        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <Link href="/onboarding">
            <button style={{
              background: "rgba(255,255,255,0.2)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)",
              borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              성향 다시 설정
            </button>
          </Link>
          {course.length > 0 && (
            <Link href="/course">
              <button style={{
                background: "#fff", color: "var(--jeju-700)", border: "none",
                borderRadius: 10, padding: "8px 16px", fontSize: 12, fontWeight: 800, cursor: "pointer",
              }}>
                코스 보기 ({course.length})
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: "24px 0" }}>
        {sections.map((sec) => (
          <div key={sec.label} style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 20px", marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>
                {CATEGORY_EMOJI[sec.items[0]?.place.category ?? "restaurant"]}
              </span>
              <h2 style={{ fontSize: 16, fontWeight: 800, margin: 0, color: "var(--text)" }}>
                {sec.label}
              </h2>
              <span className="chip" style={{ marginLeft: "auto" }}>TOP {sec.items.length}</span>
            </div>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "4px 20px", scrollbarWidth: "none" }}>
              {sec.items.map(({ place, score }) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  score={score}
                  matchReason={matchReason(place, score)}
                  onAdd={addToCourse}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Float CTA */}
      {course.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "12px 20px 20px", background: "#fff",
          borderTop: "1px solid var(--line)", zIndex: 100,
        }}>
          <Link href="/course" style={{ display: "block" }}>
            <button className="btn-primary" style={{ width: "100%", fontSize: 15 }}>
              코스 만들기 ({course.length}곳 선택됨) →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
