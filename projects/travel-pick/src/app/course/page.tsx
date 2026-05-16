"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Place } from "@/lib/types";
import { DUMMY_PLACES, CATEGORY_EMOJI, CATEGORY_LABEL } from "@/lib/dummy-places";
import { recommend } from "@/lib/recommendation";

export default function CoursePage() {
  const [picks, setPicks] = useState<Place[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const prefStr = localStorage.getItem("tp_pref");
      if (prefStr) {
        const pref = JSON.parse(prefStr);
        const result = recommend(pref);
        const auto = [
          result.restaurants[0]?.place,
          result.cafes[0]?.place,
          result.attractions[0]?.place,
          result.viewpoints[0]?.place,
        ].filter(Boolean) as Place[];
        setPicks(auto);
      }
    } catch {}
  }, []);

  const remove = (id: string) => setPicks((p) => p.filter((x) => x.id !== id));
  const moveUp = (i: number) => {
    if (i === 0) return;
    const arr = [...picks];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    setPicks(arr);
  };

  const saveCourse = () => {
    const token = Math.random().toString(36).slice(2, 9);
    localStorage.setItem("tp_course_" + token, JSON.stringify(picks.map((p) => p.id)));
    setSaved(true);
  };

  const totalDuration = picks.reduce((sum, p) => sum + (p.avgWaitMinutes + 60), 0);
  const hours = Math.floor(totalDuration / 60);

  return (
    <div className="page" style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 100px" }}>
      <div style={{ paddingTop: 28 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>내 코스</h1>
          <span style={{ fontSize: 13, color: "var(--text-dim)", fontWeight: 600 }}>
            총 {picks.length}곳 · 예상 {hours}시간
          </span>
        </div>

        {picks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗺</div>
            <p style={{ color: "var(--text-dim)", fontSize: 14 }}>추천 결과에서 장소를 추가해주세요.</p>
            <Link href="/recommend">
              <button className="btn-primary" style={{ marginTop: 16 }}>추천 보러가기</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {picks.map((place, i) => (
              <div key={place.id}>
                {/* Stop card */}
                <div className="card" style={{ display: "flex", gap: 12, padding: "14px 14px" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "var(--jeju-500)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, fontWeight: 800, flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{place.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>
                      {CATEGORY_EMOJI[place.category]} {CATEGORY_LABEL[place.category]}
                      {place.avgWaitMinutes > 0 && ` · 대기 약 ${place.avgWaitMinutes}분`}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    {i > 0 && (
                      <button onClick={() => moveUp(i)} style={{
                        background: "var(--line)", border: "none", borderRadius: 8,
                        padding: "6px 10px", cursor: "pointer", fontSize: 13,
                      }}>↑</button>
                    )}
                    <button onClick={() => remove(place.id)} style={{
                      background: "none", border: "1.5px solid var(--line)", borderRadius: 8,
                      padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "var(--text-mute)",
                    }}>✕</button>
                  </div>
                </div>
                {i < picks.length - 1 && (
                  <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                    <div style={{ width: 2, height: 20, background: "var(--line)", borderRadius: 1 }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {picks.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          padding: "12px 20px 20px", background: "#fff",
          borderTop: "1px solid var(--line)", display: "flex", gap: 10,
        }}>
          <Link href="/recommend" style={{ flex: 1 }}>
            <button className="btn-ghost" style={{ width: "100%" }}>+ 장소 추가</button>
          </Link>
          <button
            className="btn-primary"
            style={{ flex: 2, background: saved ? "var(--jeju-600)" : undefined }}
            onClick={saveCourse}
          >
            {saved ? "✓ 저장됨" : "코스 저장하기"}
          </button>
        </div>
      )}
    </div>
  );
}
