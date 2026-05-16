"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PreferenceProfile, Place } from "@/lib/types";
import { recommend, getPersona } from "@/lib/recommendation";
import { CATEGORY_EMOJI } from "@/lib/dummy-places";
import PlaceCard from "@/components/place-card";

const DEFAULT_PREF: PreferenceProfile = {
  waitTolerance: 50, crowdTolerance: 50, sceneryVsFood: 50,
  activityLevel: 40, transportMode: "car", companion: "couple",
};

const PERSONA_BG: Record<string, string> = {
  미식가:    "linear-gradient(135deg, #2a1208 0%, #7a2e10 100%)",
  관광객:    "linear-gradient(135deg, #0f2035 0%, #1a4a6e 100%)",
  힐링러:    "linear-gradient(135deg, #0b1f1a 0%, #196457 100%)",
  가족여행자: "linear-gradient(135deg, #1f1a0b 0%, #6b4e10 100%)",
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
  const heroBg = PERSONA_BG[persona.type] ?? PERSONA_BG["힐링러"];

  const addToCourse = (place: Place) => {
    setCourse((prev) => prev.find((p) => p.id === place.id) ? prev : [...prev, place]);
  };

  const matchReason = (place: Place, score: number) => {
    const parts: string[] = [];
    if (place.avgWaitMinutes <= 15) parts.push("대기 짧음");
    if (place.avgWaitMinutes >= 30 && pref.waitTolerance >= 50) parts.push("줄 서도 가치");
    if (place.sceneryScore >= 4 && pref.sceneryVsFood < 50) parts.push("경치 최상");
    if (place.foodScore >= 4 && pref.sceneryVsFood >= 50) parts.push("맛 최상");
    if (place.crowdScore <= 2 && pref.crowdTolerance < 40) parts.push("한적함");
    return parts.slice(0, 2).join(" · ");
  };

  const sections = [
    { label: "맛집", emoji: "🍖", items: result.restaurants },
    { label: "카페·빵집", emoji: "☕", items: result.cafes },
    { label: "관광지", emoji: "🏔", items: result.attractions },
    { label: "뷰포인트", emoji: "🌅", items: result.viewpoints },
  ];

  return (
    <div style={{ minHeight: "100dvh", background: "var(--bg)", paddingBottom: 100 }}>

      {/* ── 페르소나 헤더 ── */}
      <div style={{ position: "relative", overflow: "hidden", padding: "40px 24px 44px", background: heroBg }}>
        {/* 배경 노이즈 텍스처 */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "200px",
        }} />

        <div style={{ position: "relative", maxWidth: 520, margin: "0 auto" }}>
          <p className="t-label anim-up" style={{ color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>나의 여행 성향</p>
          <div className="anim-up d-100" style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12 }}>
            <h1 style={{
              fontFamily: "'Noto Serif KR', serif",
              fontSize: "clamp(30px, 8vw, 42px)",
              fontWeight: 900, color: "#fff", margin: 0, lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}>
              {persona.label}
            </h1>
          </div>
          <p className="anim-up d-200" style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 320, margin: "0 0 24px" }}>
            {persona.description}
          </p>

          {/* 성향 태그 */}
          <div className="anim-up d-300" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {[
              pref.waitTolerance > 60 ? "대기 감수" : "빠른 입장",
              pref.crowdTolerance > 60 ? "인파 OK" : "조용한 곳",
              pref.sceneryVsFood < 40 ? "경치 우선" : pref.sceneryVsFood > 60 ? "맛 우선" : "경치·맛 균형",
            ].map((tag) => (
              <span key={tag} style={{
                padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>{tag}</span>
            ))}
          </div>

          <div className="anim-up d-400" style={{ display: "flex", gap: 8 }}>
            <Link href="/onboarding">
              <button className="btn btn-ghost" style={{ color: "rgba(255,255,255,0.8)", borderColor: "rgba(255,255,255,0.25)", padding: "10px 18px", fontSize: 12 }}>
                다시 설정
              </button>
            </Link>
            {course.length > 0 && (
              <Link href="/course">
                <button className="btn btn-white" style={{ padding: "10px 18px", fontSize: 12 }}>
                  코스 보기 ({course.length})
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── 추천 섹션들 ── */}
      <div style={{ paddingTop: 40 }}>
        {sections.map((sec, si) => (
          <div key={sec.label} style={{ marginBottom: 44 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0 24px", marginBottom: 16,
            }}>
              <span style={{ fontSize: 20 }}>{sec.emoji}</span>
              <h2 style={{
                fontFamily: "'Noto Serif KR', serif",
                fontSize: 20, fontWeight: 900, margin: 0, color: "var(--ink)",
                letterSpacing: "-0.01em",
              }}>
                {sec.label}
              </h2>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, color: "var(--green-main)",
                  letterSpacing: "0.05em",
                }}>TOP {sec.items.length}</span>
              </div>
            </div>

            <div className="no-scroll" style={{
              display: "flex", gap: 14, overflowX: "auto",
              padding: "4px 24px 4px",
            }}>
              {sec.items.map(({ place, score }, i) => (
                <div key={place.id} className={`anim-up d-${(i + 1) * 100}`}>
                  <PlaceCard
                    place={place} score={score}
                    matchReason={matchReason(place, score)}
                    onAdd={addToCourse}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── 플로팅 코스 CTA ── */}
      {course.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          padding: "14px 20px 24px",
          background: "rgba(247,252,250,0.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--ink-06)",
        }}>
          <Link href="/course" style={{ display: "block" }}>
            <button className="btn btn-primary" style={{ width: "100%", fontSize: 15 }}>
              코스 만들기 — {course.length}곳 선택됨 →
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
